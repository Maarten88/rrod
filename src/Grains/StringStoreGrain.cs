using System;
using System.Threading.Tasks;
using GrainInterfaces;
using Grains.Redux;
using Orleans.Concurrency;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;

namespace Grains
{
    public class StringStoreState
    {
        public ImmutableList<string> StringList { get; set; }

        public static StringStoreState Reducer(StringStoreState previous, IAction action)
        {
            var next = previous ?? new StringStoreState { StringList = ImmutableList.Create<string>() };
            switch (action)
            {
                case StoreString storeString:
                    return new StringStoreState { StringList = next.StringList.Add(storeString.Data) };
            }
            return next;
        }
    }

    public class StoreString : IAction
    {
        public string Data { get; set; }
    }

    public class StringStoreGrain : ReduxGrain<StringStoreState>, IStringStoreGrain
    {
        readonly ILogger<StringStoreGrain> logger;

        public StringStoreGrain(ReduxTableStorage<StringStoreState> storage, ILoggerFactory loggerFactory) : base(StringStoreState.Reducer, storage, loggerFactory)
        {
            this.logger = loggerFactory.CreateLogger<StringStoreGrain>();
        }

        public Task<string[]> GetAllStrings()
        {
            return Task.FromResult(this.Store.State?.StringList?.ToArray() ?? new string[0]);
        }

        public async Task StoreString(string data)
        {
            this.Store.Dispatch(new StoreString { Data = data });
            await this.WriteStateAsync();
        }
    }
}
