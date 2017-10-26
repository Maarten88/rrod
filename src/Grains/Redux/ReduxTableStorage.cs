using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using Orleans;
using Orleans.Runtime;
using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Reactive.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using GrainInterfaces;
using Microsoft.Extensions.DependencyModel;
using Microsoft.DotNet.PlatformAbstractions;
using Microsoft.Extensions.Logging;

namespace Grains.Redux
{
    public class TableStorableAction
    {
        public DateTimeOffset Timestamp { get; set; }
        public uint Serial { get; set; }
        public IAction Action { get; set; }

        public TableStorableAction()
        {
        }

        public TableStorableAction(DateTimeOffset timestamp, uint serial)
        {
            this.Timestamp = timestamp;
            this.Serial = serial;
        }

        public TableStorableAction(DateTimeOffset timestamp, uint serial, IAction action) : this(timestamp, serial)
        {
            this.Action = action;
        }
    }


    public class ReduxTableStorage<TState> where TState: class, new()
    {
        readonly string tableName = typeof(TState).Name;
        // const string SERVICE_ID = "00000000-0000-0000-0000-000000000000";
        static SemaphoreSlim _syncLock = new SemaphoreSlim(1);
        private static CloudTable table;
        private static IImmutableDictionary<string, TypeInfo> actionTypeLookup;
        private static JsonSerializerSettings jsonSettings = new JsonSerializerSettings { TypeNameHandling = TypeNameHandling.All };
        private string storageConnectionString;

        public ReduxTableStorage(string storageConnectionString)
        {
            this.storageConnectionString = storageConnectionString;
        }

        public async Task Initialize(ILogger logger)
        {
            if (table == null)
            {
                await _syncLock.WaitAsync();
                try
                {
                    if (table == null)
                    {
                        // Initialize the table
                        var storageConnectionString = this.storageConnectionString;
                        var storageAccount = CloudStorageAccount.Parse(storageConnectionString);
                        // var storageAccount = CloudStorageAccount.DevelopmentStorageAccount;
                        var tableClient = storageAccount.CreateCloudTableClient();
                        table = tableClient.GetTableReference(tableName);
                        try
                        {
                            await table.CreateIfNotExistsAsync();
                        }
                        catch (Exception e)
                        {
                            table = null;
                            throw new Exception("Error creating storage table: " + e.Message);
                        }

                        try
                        {
                            // And initialize a lock-free lookup for our action types, for deserialization
                            var runtimeId = RuntimeEnvironment.GetRuntimeIdentifier();
                            IEnumerable<TypeInfo> actionTypes =
                                DependencyContext.Default.GetRuntimeAssemblyNames(runtimeId)
                                .Where(a => !a.FullName.StartsWith("Microsoft") && !a.FullName.StartsWith("System") && !a.FullName.StartsWith("xunit"))
                                .Select(name => {
                                    try
                                    {
                                        return Assembly.Load(name);
                                    }
                                    catch(Exception e)
                                    {
                                        if (logger != null) logger.LogWarning(1004, $"Warn: error loading assembly '{name}'",null, e);
                                        return null;
                                    }
                                })
                                .Where(assembly => assembly != null)
                                .SelectMany(a =>
                                {
                                    try
                                    {
                                        return a.GetTypes();
                                    }
                                    catch (Exception e)
                                    {
                                        if (logger != null) logger.LogWarning(1004, $"Warn: error getting types from assembly '{a.FullName}'", null, e);
                                        return Enumerable.Empty<Type>();
                                    }

                                })
                                .Where(t => t.GetTypeInfo().IsPublic)
                                .Where(t => t.GetInterfaces().Contains(typeof(IAction)))
                                .Select(t => t.GetTypeInfo())
                                .GroupBy(ti => ti.Name)
                                .Select(g => g.First());

                            actionTypeLookup = actionTypes.ToDictionary(t => t.Name).ToImmutableDictionary();
                        }
                        catch (Exception)
                        {
                            throw new Exception("Reflection failed! ");
                        }
                        //var test = AppDomain.CurrentDomain.GetAssemblies()
                        //    .Where(a => !a.FullName.StartsWith("Microsoft") && !a.FullName.StartsWith("System") && !a.FullName.StartsWith("xunit"))
                        //    .SelectMany(a => a.GetTypes())
                        //    .Where(t => t.GetInterfaces().Contains(typeof(IAction)))
                        //    .Select(t => t.GetTypeInfo())
                        //    .OrderBy(ti => ti.Name)
                        //    .GroupBy(ti => ti.Assembly.FullName).ToList();
                    }
                }
                catch (Exception e)
                {
                    logger.LogError(104, e.Message, e);
                    throw new Exception($"{e.GetType().ToString()}: {e.Message}"); // StorageException may not be serializable
                }
                finally
                {
                    _syncLock.Release();
                }
            }
        }

        [Serializable]
        private class ActionEntity : TableEntity
        {
            public string SerializedAction { get; set; }
            public string Type { get; set; }
        }


        public async Task WriteAsync(string partitionKey, IEnumerable<TableStorableAction> actionList, ILogger logger)
        {
            if (actionList == null)
                throw new ArgumentException("actionList");

            if (table == null)
                await Initialize(logger);

            var batch = new TableBatchOperation();
            var count = 0;
            foreach (var action in actionList)
            {
                batch.InsertOrReplace(new ActionEntity
                {
                    PartitionKey = partitionKey,
                    // RowKey = (DateTimeOffset.MaxValue.UtcTicks - action.Timestamp.UtcTicks).ToString("D19"),
                    RowKey = action.Timestamp.UtcTicks.ToString("D19") + "." + action.Serial.ToString(),
                    Timestamp = action.Timestamp,
                    Type = action.Action.GetType().Name,
                    SerializedAction =  JsonConvert.SerializeObject(action.Action)
                });
                count++;
            }

            logger.LogTrace("Writing {0} actions to table={1}, partition={2}", count, tableName, partitionKey);

            try
            {

                await table.ExecuteBatchAsync(batch);
            }
            catch (Exception e)
            {
                string error = string.Format("Error saving actions: {0}, Message: {1}. Table={2}, Partition={3}", e.GetType().Name, e.Message, tableName, partitionKey);
                logger.LogError(101, error);
                throw new Exception($"{e.GetType().ToString()}: {e.Message}"); // StorageException may not be serializable
            }
        }

        public async Task DeleteAllAsync(string partitionKey, ILogger logger)
        {
            try
            {
                // Define the query, and select only the Email property.
                TableQuery query = new TableQuery().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, partitionKey));

                TableContinuationToken token = null;
                do
                {
                    var queryResult = await table.ExecuteQuerySegmentedAsync(query, token);
                    if (queryResult.Count() <= 0)
                        return;

                    var batch = new TableBatchOperation();
                    foreach (var result in queryResult.Results)
                        batch.Delete(result);
                    await table.ExecuteBatchAsync(batch);
                    token = queryResult.ContinuationToken;
                } while (token != null);
            }
            catch (Exception e)
            {
                logger.LogError(101, string.Format("Error deleting partition {0} from Table {1}. Exception {2}, Message: '{3}'", partitionKey, this.tableName, e.GetType().Name, e.Message));
                throw new Exception($"{e.GetType().ToString()}: {e.Message}"); // StorageException may not be serializable
            }
        }




        public IObservable<TableStorableAction> ReadObservable(string partitionKey, ILogger logger)
        {
            var obs = Observable.Create<TableStorableAction>(async (observer, ct) =>
            {
                if (table == null)
                    await Initialize(logger); // throw new ArgumentException("Table not initialized");

                var query = new TableQuery<ActionEntity>()
                    .Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, partitionKey));

                // get activities between two dates. default is last two months
                TableContinuationToken token = null;
                do
                {
                    try
                    {
                        var segment = await table.ExecuteQuerySegmentedAsync<ActionEntity>(query, token);
                        foreach (var item in segment.Results)
                        {
                            if (ct.IsCancellationRequested) { return; }
                            var keyParts = item.RowKey.Split('.');
                            DateTimeOffset timestamp = new DateTimeOffset(long.Parse(keyParts[0]), TimeSpan.Zero);
                            uint serial = uint.Parse(keyParts[1]);
                            if (actionTypeLookup.TryGetValue(item.Type, out var action))
                            {
                                observer.OnNext(new TableStorableAction(timestamp, serial, (IAction)JsonConvert.DeserializeObject(item.SerializedAction, action.AsType(), jsonSettings)));
                            }
                            else
                            {
                                logger.LogError(103, String.Format("Error replaying actions: stored action type does not exist (anymore)!: Table={0}, PartitionKey={1}, Action Type={2}",
                                tableName, partitionKey, item.Type));
                            }
                        }
                    }
                    catch (Exception e)
                    {
                        logger.LogError(103, String.Format("Exception reading actions: Table={0}, PartitionKey={1}, Exception={2}: {3}",
                                tableName, partitionKey, e.GetType().Name, e.Message), e);
                        // no exception handling required.  If this method throws,
                        // Rx will catch it and call observer.OnError() for us.
                        throw new Exception($"{e.GetType().ToString()}: {e.Message}"); // StorageException may not be serializable
                    }
                }
                while (token != null);
                observer.OnCompleted();
            });
            return obs;
        }

        public async Task<IEnumerable<TableStorableAction>> ReadAsync(string partitionKey, ILogger logger) 
        {
            if (table == null)
                await Initialize(logger); // throw new ArgumentException("Table not initialized");

            var result = new List<TableStorableAction>();
            try
            {
                var query = new TableQuery<ActionEntity>()
                    .Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, partitionKey));

                // get activities between two dates. default is last two months
                TableContinuationToken token = null;
                do
                {
                    var segment = await table.ExecuteQuerySegmentedAsync<ActionEntity>(query, token);

                    result.AddRange(segment.Results
                        .Select(item => {
                            var keyParts = item.RowKey.Split('.');
                            DateTimeOffset timestamp = new DateTimeOffset(long.Parse(keyParts[0]), TimeSpan.Zero);
                            uint serial = uint.Parse(keyParts[1]);
                            return new TableStorableAction(timestamp, serial, (IAction)JsonConvert.DeserializeObject(item.SerializedAction, actionTypeLookup[item.Type].AsType(), jsonSettings));
                        }));

                }
                while (token != null);

                return result;
            }
            catch (Exception exc)
            {
                logger.LogError(103, String.Format("Exception reading actions: Table={0}, PartitionKey={1}, Exception={2}",
                        partitionKey, tableName, exc.GetType().Name), exc);
                // return Enumerable.Empty<TableStorableAction>();
                throw;
            }
        }

        public Task Close()
        {
            return Task.CompletedTask;
        }
    }
}
