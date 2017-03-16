#region Using directives
using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
// using System.Transactions;
// using Insight.Database.Schema.Properties;
using System.Data.Common;
using System.Dynamic;
#endregion

namespace Insight.Database.Schema
{
    #region SchemaInstaller Class
    /// <summary>
    /// Installs, upgrades, and uninstalls objects from a database
    /// </summary>
	[System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1001:TypesThatOwnDisposableFieldsShouldBeDisposable"), System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling")]
	public sealed class SchemaInstaller
    {
		#region Constructors
		/// <summary>
		/// Initialize the SchemaInstaller to work with a given SqlConnection.
		/// </summary>
		/// <param name="connection">The SqlConnection to work with.</param>
		public SchemaInstaller(DbConnection connection)
		{
			if (connection == null)
				throw new ArgumentNullException("connection");

			// require the connection to be open
			if (connection.State != ConnectionState.Open)
				throw new ArgumentException("connection must be in an Open state.", "connection");

			// MARS doesn't support the type of transactions we need to do
			if (connection is SqlConnection)
			{
				SqlConnectionStringBuilder connectionString = new SqlConnectionStringBuilder(connection.ConnectionString);
				if (connectionString.MultipleActiveResultSets)
					throw new ArgumentException("connection must not use MultipleActiveResultSets=True. Please update your connection string.", "connection");
			}

			// save the connection - make sure we are recording one way or another
			_connection = connection as RecordingDbConnection ?? new RecordingDbConnection (connection);
		}

		/// <summary>
		/// Set to true to ignore missing objects when trying to drop objects.
		/// NOTE: a missing object may indicate a bug in dependency handling or a corrupt schema table, so this is disabled by default.
		/// </summary>
		public bool AllowRepair { get; set; }

		/// <summary>
		/// Gets or sets the CommandTimeout to use for all of the commands in the installer.
		/// The default is 30 seconds, but your installs may take longer.
		/// </summary>
		public int? CommandTimeout
		{
			get { return _connection.CommandTimeout; }
			set { _connection.CommandTimeout = value; }
		}
		#endregion

        #region Database Utility Methods
		/// <summary>
		/// Check to see if the database exists
		/// </summary>
		/// <param name="connectionString">The connection string for the database to connect to.</param>
		/// <returns>True if the database already exists</returns>
		public static bool DatabaseExists(string connectionString)
		{
			if (connectionString == null)
				throw new ArgumentNullException("connectionString");

			SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder(connectionString);
			string databaseName = builder.InitialCatalog;

			using (var connection = OpenMasterConnection(connectionString))
			using (var command = new SqlCommand("SELECT COUNT (*) FROM master.sys.databases WHERE name = @DatabaseName", connection))
			{
				command.Parameters.AddWithValue("@DatabaseName", databaseName);

				return ((int)command.ExecuteScalar()) > 0;
			}
		}

        /// <summary>
        /// Create a database on the specified connection if it does not exist.
        /// </summary>
        /// <returns>True if the database was created, false if it already exists.</returns>
        /// <exception cref="SqlException">If the database name is invalid.</exception>
		public static bool CreateDatabase (string connectionString)
        {
			if (connectionString == null)
				throw new ArgumentNullException("connectionString");

			// see if the database already exists
			if (DatabaseExists(connectionString))
				return false;

			SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder(connectionString);
			string databaseName = builder.InitialCatalog;

			using (var connection = OpenMasterConnection(connectionString))
			using (var command = new SqlCommand(String.Format(CultureInfo.InvariantCulture, "CREATE DATABASE [{0}]", databaseName), connection))
			{
				command.ExecuteNonQuery();
            }

			return true;
		}

        /// <summary>
        /// Drop a database if it exists.
        /// </summary>
        /// <returns>True if the database was dropped, false if it did not exist.</returns>
        /// <exception cref="SqlException">If the database name is invalid or cannot be dropped.</exception>
		public static bool DropDatabase(string connectionString)
        {
			if (connectionString == null)
				throw new ArgumentNullException("connectionString");

			// see if the database was already dropped
			if (!DatabaseExists(connectionString))
				return false;

			SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder(connectionString);
			string databaseName = builder.InitialCatalog;

			using (var connection = OpenMasterConnection(connectionString))
			{
				// attempt to set the database to single user mode
                // set the database to single user mode, effectively dropping all connections except the current
                // connection.
				try
				{
					using (var command = new SqlCommand(String.Format(CultureInfo.InvariantCulture, "ALTER DATABASE [{0}] SET SINGLE_USER WITH ROLLBACK IMMEDIATE", databaseName), connection))
					{
						command.ExecuteNonQuery();
					}
				}
				catch (SqlException)
				{
					// eat any exception here
					// Azure will complain that this is a syntax error
					// SQL - The database may already be in single user mode
				}

				// attempt to drop the database
				using (var dropCommand = new SqlCommand(String.Format(CultureInfo.InvariantCulture, "DROP DATABASE [{0}]", databaseName), connection))
				{
					dropCommand.ExecuteNonQuery();
				}
            }

			return true;
		}

		/// <summary>
		/// Gets the connection string needed to connect to the master database.
		/// This is used when creating/dropping databases.
		/// </summary>
		/// <param name="connectionString">The target connectionString.</param>
		/// <returns>The connection string pointing at the master database.</returns>
		private static string GetMasterConnectionString(string connectionString)
		{
			SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder(connectionString);
			builder.InitialCatalog = "master";
			return builder.ConnectionString;
		}

		/// <summary>
		/// Opens a connection needed to connect to the master database.
		/// This is used when creating/dropping databases.
		/// </summary>
		/// <param name="connectionString">The target connectionString.</param>
		/// <returns>The connection string pointing at the master database.</returns>
		private static SqlConnection OpenMasterConnection(string connectionString)
		{
			var connection = new SqlConnection(GetMasterConnectionString(connectionString));
			var disposable = connection;
			try
			{
				connection.Open();
				disposable = null;
				return connection;
			}
			finally
			{
				if (disposable != null)
					disposable.Dispose();
			}
		}
    	#endregion  

		#region Schema Installation Methods
		/// <summary>
		/// Script the changes that would be applied to the database.
		/// </summary>
		/// <param name="schemaGroup">The name of the schemaGroup.</param>
		/// <param name="schema">The schema to install.</param>
		/// <returns>The script representing the changes to the database.</returns>
		public string ScriptChanges(string schemaGroup, SchemaObjectCollection schema)
		{
			// create a transaction around the installation
			// NOTE: don't commit the changes to the database
			// WARNING: due to the way we script autoprocs (and maybe others), this has to modify the database, then roll back the changes
			//	so you might not want to try this on a live production database. Go get a copy of your database, then do the scripting on a staging environment.

			// TODO: use a database transaction?
			// using (TransactionScope transaction = new TransactionScope(TransactionScopeOption.Required, new TimeSpan(1, 0, 0, 0, 0)))
			{
				_connection.OnlyRecord(() => Install(schemaGroup, schema));
			}

			return _connection.ScriptLog.ToString();
		}

		/// <summary>
		/// Install a schema into a database.
		/// </summary>
		/// <param name="schemaGroup">The name of the schemaGroup.</param>
		/// <param name="schema">The schema to install.</param>
		[System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1502:AvoidExcessiveComplexity")]
		public void Install(string schemaGroup, SchemaObjectCollection schema)
		{
			_connection.ResetLog();

			// validate the arguments
			if (schemaGroup == null) throw new ArgumentNullException("schemaGroup");
			if (schema == null) throw new ArgumentNullException("schema");

			// make sure the schema objects are valid
			schema.Validate();

			// number the objects so when we compare them we have a final comparison
			List<SchemaObject> schemaObjects = schema.Where(o => o.SchemaObjectType != SchemaObjectType.Unused).ToList();
			for (int i = 0; i < schemaObjects.Count; i++)
				schemaObjects[i].OriginalOrder = i;
			// order the changes by reverse install order
			schemaObjects.Sort((o1, o2) => -CompareByInstallOrder(o1, o2));

			// get the list of objects to install, filtering out the extra crud
			InstallContext context = new InstallContext();
			context.SchemaObjects = schemaObjects;

			// azure doesn't support filegroups or partitions, so we need to know if we are on azure
			context.IsAzure = _connection.ExecuteScalarSql<bool>("SELECT CONVERT(bit, CASE WHEN SERVERPROPERTY('edition') = 'SQL Azure' THEN 1 ELSE 0 END)", null);

			// NOTE: we can't use System.Transactions.TransactionScope here, because certain operations cause SQL server to commit internal data structures
			// and then if an exception is thrown, our registry changes wouldn't be in sync with the database.
			try
			{
				_connection.ExecuteSql("BEGIN TRANSACTION");

				// load the schema registry from the database
				context.SchemaRegistry = new SchemaRegistry(_connection, schemaGroup);

				// find all of the objects that we need to drop
				// sort to drop in reverse dependency order 
				context.DropObjects = context.SchemaRegistry.Entries
					.Where(e => !context.SchemaObjects.Any(o => String.Compare(e.ObjectName, o.Name, StringComparison.OrdinalIgnoreCase) == 0))
					.ToList();
				context.DropObjects.Sort((e1, e2) => -CompareByInstallOrder(e1, e2));

				// find all of the objects that are not in the registry and don't exist
				context.AddObjects = context.SchemaObjects.Where(o => !context.SchemaRegistry.Contains(o) && !o.Exists(_connection)).ToList();

				// find all of the objects that have changed
				_connection.DoNotLog(() =>
				{
					// for anything that's not entirely new
					foreach (var change in context.SchemaObjects.Except(context.AddObjects))
					{
						// if the object is in the registry and the signature matches, then there is no change
						var registryEntry = context.SchemaRegistry.Find(change);
						if (registryEntry != null && context.SchemaRegistry.Find(change).Signature == change.GetSignature(_connection, schema))
							continue;

						// if the object is NOT in the registry, but already exists (we know because it's not in the add list already)
						// then we assume it has changed
						// UNLESS this is not a type we can drop, and we are in repair mode, we will skip it
						if (registryEntry == null && !change.CanModify(context, _connection) && AllowRepair)
						{
							Console.WriteLine("WARNING: {0} {1} already exists in the database and cannot be modified. Assuming that it has not changed.", change.SchemaObjectType, change.Name);
							continue;
						}

						ScriptUpdate(context, change);
					}
				});

				// sort the objects in install order
				context.AddObjects.Sort(CompareByInstallOrder);

				// make the changes
				DropObjects(context.DropObjects);
				AddObjects(context);
				VerifyObjects(context.SchemaObjects);

				// update the schema registry
				context.SchemaRegistry.Update(context.SchemaObjects);

				// complete the changes
				_connection.ExecuteSql("COMMIT");
			}
			catch (Exception)
			{
				// rollback the transaction
				// this shouldn't fail
				// if it does, then the outer application may need to roll it back
				try { _connection.ExecuteSql("ROLLBACK"); }
				catch (SqlException) { }

				throw;
			}
		}

		/// <summary>
		/// Uninstall a schema group from the database.
		/// </summary>
		/// <remarks>This is a transactional operation</remarks>
		/// <param name="schemaGroup">The group to uninstall</param>
		/// <exception cref="ArgumentNullException">If schemaGroup is null</exception>
		/// <exception cref="SqlException">If any object fails to uninstall</exception>
		public void Uninstall(string schemaGroup)
		{
			// validate the arguments
			if (schemaGroup == null) throw new ArgumentNullException("schemaGroup");

			// create an empty collection and install that
			SchemaObjectCollection objects = new SchemaObjectCollection();
			Install(schemaGroup, objects);
		}

		/// <summary>
		/// Determine if the given schema has differences with the current schema.
		/// </summary>
		/// <param name="schemaGroup">The schema group to compare.</param>
		/// <param name="schema">The schema to compare with.</param>
		/// <returns>True if there are any differences.</returns>
		public bool Diff(string schemaGroup, SchemaObjectCollection schema)
		{
			// validate the arguments
			if (schemaGroup == null) throw new ArgumentNullException("schemaGroup");
			if (schema == null) throw new ArgumentNullException("schema");

			SchemaRegistry registry = new SchemaRegistry(_connection, schemaGroup);

			// if any objects are missing from the registry, then there is a difference
			if (schema.Any(o => registry.Find(o.Name) == null))
				return true;

			// if there are any registry entries missing from the new schema, there is a difference
			if (registry.Entries.Any(e => !schema.Any(o => String.Compare(e.ObjectName, o.Name, StringComparison.OrdinalIgnoreCase) == 0)))
				return true;

			// if there are any matches, but have different signatures, there is a difference
			if (schema.Any(o => registry.Find(o.Name).Signature != o.GetSignature(_connection, schema)))
				return true;

			// didn't detect differences
			return false;
		}
		#endregion

		#region Scripting Methods
        /// <summary>
        /// Schedule an update by adding the appropriate delete, update and add records
        /// </summary>
		/// <param name="context">The installation context.</param>
        /// <param name="schemaObject">The object to update.</param>
		private void ScriptUpdate(InstallContext context, SchemaObject schemaObject)
        {
			// if we are dropping and readding an object, then make sure we put the object in the drop list at the right time
			if (schemaObject.OriginalOrder == 0)
			{
				// if the object matches an existing schema object (probably), then find it and copy its installation order
				var originalObject = context.SchemaObjects.Find(o => schemaObject.SchemaObjectType == o.SchemaObjectType && String.Compare(schemaObject.Name, o.Name, StringComparison.OrdinalIgnoreCase) == 0);
				if (originalObject != null)
					schemaObject.OriginalOrder = originalObject.OriginalOrder;
				else if (context.AddObjects.Any())
					schemaObject.OriginalOrder = context.AddObjects.Max(o => o.OriginalOrder) + 1;
				else
					schemaObject.OriginalOrder = 1;
			}

			// if we have already scripted this object, then don't do it again
			if (context.AddObjects.Any(o => o.Name == schemaObject.Name))
				return;

			// if this is a table, then let's see if we can just modify the table
			if (schemaObject.SchemaObjectType == SchemaObjectType.Table)
			{
				ScriptStandardDependencies(context, schemaObject);
				ScriptTableUpdate(context, schemaObject);
				return;
			}

			// add the object to the add queue before anything that depends on it, as well as any permissions on the object
			context.AddObjects.Add(schemaObject);

			// don't log any of our scripting
			ScriptPermissions(context, schemaObject);
			ScriptStandardDependencies(context, schemaObject);

			// handle dependencies for different types of objects
			if (schemaObject.SchemaObjectType == SchemaObjectType.IndexedView)
			{
				ScriptIndexes(context, schemaObject);
			}
			else if (schemaObject.SchemaObjectType == SchemaObjectType.PrimaryKey)
			{
				ScriptForeignKeys(context, schemaObject);
				ScriptXmlIndexes(context, schemaObject);
			}
			else if (schemaObject.SchemaObjectType == SchemaObjectType.PrimaryXmlIndex)
			{
				ScriptXmlIndexes(context, schemaObject);
			}
			else if (schemaObject.SchemaObjectType == SchemaObjectType.Index)
			{
				ScriptIndexes(context, schemaObject);
			}

			// drop the object after any dependencies are dropped
			SchemaRegistryEntry dropEntry = context.SchemaRegistry.Find(schemaObject.Name);
			if (dropEntry == null)
			{
				dropEntry = new SchemaRegistryEntry()
				{
					Type = schemaObject.SchemaObjectType,
					ObjectName = schemaObject.Name
				};
			}

			context.DropObjects.Add(dropEntry);
        }

		private const string InsightTemp = "Insight__tmp_";

		#region Table Update Methods
		/// <summary>
		/// Script the update of a table.
		/// </summary>
		/// <param name="context">The installation context.</param>
		/// <param name="schemaObject">The object to update.</param>
		private void ScriptTableUpdate(InstallContext context, SchemaObject schemaObject)
		{
			string oldTableName = schemaObject.SqlName.FullName;
			string newTableName = InsightTemp + DateTime.Now.Ticks.ToString(CultureInfo.InvariantCulture);

			try
			{
				// make a temporary table so we can analyze the difference
				// note that we rename the table and its constraints so that we don't have conflicts when creating it
				string tempTable = schemaObject.Sql;
				tempTable = createTableRegex.Replace(tempTable, "CREATE TABLE " + newTableName);
				tempTable = constraintRegex.Replace(tempTable, match => "CONSTRAINT " + SqlParser.FormatSqlName(InsightTemp + SqlParser.UnformatSqlName(match.Groups[1].Value)));
				_connection.ExecuteSql(tempTable);

				// detect if the table was created on a different data space and throw
				var oldDataSpace = _connection.ExecuteScalarSql<int>("SELECT data_space_id FROM sys.indexes i WHERE i.object_id = OBJECT_ID(@Name) AND type <= 1", new Dictionary<string, object> { { "Name", oldTableName } });
				var newDataSpace = _connection.ExecuteScalarSql<int>("SELECT data_space_id FROM sys.indexes i WHERE i.object_id = OBJECT_ID(@Name) AND type <= 1", new Dictionary<string, object> { { "Name", newTableName } });
				if (oldDataSpace != newDataSpace)
					throw new SchemaException(String.Format(CultureInfo.InvariantCulture, "Cannot move table {0} to another filegroup or partition", oldTableName));

				// update the columns and constraints
				ScriptColumnsAndConstraints(context, schemaObject, oldTableName, newTableName);
			}
			finally
			{
				try
				{
					// clean up the temporary table
					_connection.ExecuteSql("DROP TABLE " + newTableName);
				}
				catch (SqlException)
				{
					// eat this and throw the original error
				}
			}
		}

		// detect the name of the table and replace it.
		private static Regex createTableRegex = new Regex(String.Format(CultureInfo.InvariantCulture, @"CREATE\s+TABLE\s+{0}", SqlParser.SqlNameExpression), RegexOptions.IgnoreCase | RegexOptions.Compiled);
		private static Regex constraintRegex = new Regex(String.Format(CultureInfo.InvariantCulture, @"CONSTRAINT\s+({0})", SqlParser.SqlNameExpression), RegexOptions.IgnoreCase | RegexOptions.Compiled);

		/// <summary>
		/// Script constraints on a table. This currently only handles defaults.
		/// </summary>
		/// <param name="context">The installation context.</param>
		/// <param name="oldTableName">The name of the old table.</param>
		/// <param name="newTableName">The name of the new table.</param>
		[System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling"), System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1505:AvoidUnmaintainableCode"), System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1502:AvoidExcessiveComplexity")]
		private void ScriptColumnsAndConstraints(InstallContext context, SchemaObject schemaObject, string oldTableName, string newTableName)
		{
			#region Detect Column Changes
			Func<dynamic, dynamic, bool> compareColumns = (dynamic c1, dynamic c2) => (string.Compare(c1.Name, c2.Name, StringComparison.OrdinalIgnoreCase) == 0);
			Func<dynamic, dynamic, bool> areColumnsEqual = (dynamic c1, dynamic c2) =>
				c1.TypeName == c2.TypeName &&
				c1.MaxLength == c2.MaxLength &&
				c1.Precision == c2.Precision &&
				c1.Scale == c2.Scale &&
				c1.IsNullable == c2.IsNullable &&
				c1.IsIdentity == c2.IsIdentity &&
				c1.IdentitySeed == c2.IdentitySeed &&
				c1.IdentityIncrement == c2.IdentityIncrement &&
				c1.Definition == c2.Definition &&
				c1.CollationName == c2.CollationName
				;
			Func<dynamic, dynamic, bool> areDefaultsEqual = (dynamic c1, dynamic c2) =>
				((String.Compare(c1.DefaultName, c2.DefaultName, StringComparison.OrdinalIgnoreCase) == 0) || (c1.DefaultIsSystemNamed == true && c2.DefaultIsSystemNamed == true)) &&
				c1.DefaultDefinition == c2.DefaultDefinition
				;
			Func<dynamic, string> getConstraintName = (dynamic c) => new SqlName(oldTableName, 2).Append(c.Name).FullName;

			// get the columns for each of the tables
			var oldColumns = GetColumnsForTable(oldTableName);
			var newColumns = GetColumnsForTable(newTableName);

			// if we are planning on dropping the constraint on a column, then clear it from the old column definition
			foreach (dynamic oldColumn in oldColumns.Where(c => context.DropObjects.Any(d => String.Compare(d.ObjectName, getConstraintName(c), StringComparison.OrdinalIgnoreCase) == 0)))
			{
				oldColumn.DefaultName = null;
				oldColumn.DefaultIsSystemNamed = false;
			}

			// calculate which columns added/dropped
			var missingColumns = oldColumns.Except(newColumns, compareColumns).ToList();
			var addColumns = newColumns.Except(oldColumns, compareColumns).ToList();
			#endregion

			#region Rename Columns
			// find all of the renames
			var renames = Regex.Matches(schemaObject.Sql, String.Format("(?<newname>{0}) WAS (?<oldname>{0})", SqlParser.SqlNameExpression));

			foreach (Match rename in renames)
			{
				var oldName = new SqlName(rename.Groups["oldname"].Value, 1);
				var newName = new SqlName(rename.Groups["newname"].Value, 1);

				if (missingColumns.Any(c => c.Name == oldName.Object) && addColumns.Any(c => c.Name == newName.Object))
				{
					var oldColumn = missingColumns.Single(c => c.Name == oldName.Object);

					// don't need to add/remove the column
					missingColumns.Remove(oldColumn);
					addColumns.RemoveAll(c => c.Name == newName.Object);

					// script the column rename
					StringBuilder sb = new StringBuilder();
					sb.AppendFormat("sp_rename '{0}.{1}' , '{2}', 'COLUMN'", oldTableName, oldName.ObjectFormatted, newName.Object);
					context.AddObjects.Add(new SchemaObject(SchemaObjectType.InternalPreScript, oldTableName, sb.ToString()));

					// rename the old column in memory
					oldColumn.Name = newName.Object;
				}
			}
			#endregion

			#region Change Columns
			// find the changed columns
			var changedColumns = newColumns.Where((dynamic cc) =>
			{
				dynamic oldColumn = oldColumns.FirstOrDefault(oc => compareColumns(cc, oc));

				return (oldColumn != null) && (!areColumnsEqual(oldColumn, cc) || !areDefaultsEqual(oldColumn, cc));
			}).ToList();

			// if we want to modify a computed column, we have to drop/add it
			var changedComputedColumns = changedColumns.Where(c => c.Definition != null).ToList();
			foreach (var cc in changedComputedColumns)
			{
				missingColumns.Add(cc);
				addColumns.Add(cc);
				changedColumns.Remove(cc);
			}

			// delete old columns - this should be pretty free
			if (missingColumns.Any())
			{
				// if the column has a default, drop it
				foreach (dynamic oldColumn in missingColumns.Where(c => c.DefaultName != null))
				{
					// script the default drop
					context.DropObjects.Add(new SchemaRegistryEntry() { Type = SchemaObjectType.Default, ObjectName = SqlParser.FormatSqlName(oldTableName, oldColumn.Name) });
				}

				// script the column drop
				StringBuilder sb = new StringBuilder();
				sb.AppendFormat("ALTER TABLE {0}", oldTableName);
				sb.Append(" DROP");
				sb.AppendLine(String.Join(",", missingColumns.Select((dynamic o) => String.Format(" COLUMN {0}", SqlParser.FormatSqlName(o.Name)))));
				context.AddObjects.Add(new SchemaObject(SchemaObjectType.Table, oldTableName, sb.ToString()));
			}

			// add new columns - this is free when the columns are nullable and possibly with a default
			if (addColumns.Any())
			{
				StringBuilder sb = new StringBuilder();
				sb.AppendFormat("ALTER TABLE {0}", oldTableName);
				sb.Append(" ADD ");
				sb.AppendLine(String.Join(", ", addColumns.Select((dynamic o) => GetColumnDefinition(o) + GetDefaultDefinition(o))));
				context.AddObjects.Add(new SchemaObject(SchemaObjectType.Table, oldTableName, sb.ToString()));
			}

			// alter columns - either the definition or the default
			foreach (dynamic column in changedColumns)
			{
				// find any indexes that are on that column
				ScriptIndexes(context, schemaObject, column.Name);

				// find the old column
				dynamic oldColumn = oldColumns.First(oc => compareColumns(column, oc));

				// if the columns aren't equal then alter the column
				if (!areColumnsEqual(column, oldColumn))
				{
					StringBuilder sb = new StringBuilder();

					// if the old column is nullable and the new one is not, and there is a default, then convert the data
					if (oldColumn.IsNullable && !column.IsNullable && column.DefaultName != null)
					{
						string defaultDefinition = column.DefaultDefinition.Substring(2, column.DefaultDefinition.Length - 4);
						sb.AppendFormat("UPDATE {0} SET {1} = 2 WHERE {1} IS NULL\n", oldTableName, column.Name, defaultDefinition);
					}

					// alter the column
					sb.AppendFormat("ALTER TABLE {0} ALTER COLUMN ", oldTableName);
					sb.AppendFormat(GetColumnDefinition(column));
					context.AddObjects.Add(new SchemaObject(SchemaObjectType.Table, oldTableName, sb.ToString()));
				}

				// modify the defaults
				if (!areDefaultsEqual(column, oldColumn))
				{
					StringBuilder sb = new StringBuilder();

					// delete the old default if it exists but it's not in the registry
					if (oldColumn.DefaultName != null && !context.SchemaRegistry.Contains(getConstraintName(oldColumn)))
					{
						// script the default drop
						sb.AppendFormat("ALTER TABLE {0} DROP CONSTRAINT {1}\nGO\n", oldTableName, SqlParser.FormatSqlName(oldColumn.DefaultName));
					}

					// add the new default if we want one
					if (column.DefaultName != null)
					{
						// script the add
						sb.AppendFormat("ALTER TABLE {0} ADD ", oldTableName);
						sb.AppendFormat(GetDefaultDefinition(column));
						sb.AppendFormat(" FOR {0}", SqlParser.FormatSqlName(column.Name));
					}

					context.AddObjects.Add(new SchemaObject(SchemaObjectType.Table, oldTableName, sb.ToString()));
				}
			}
			#endregion
		}

		/// <summary>
		/// Get the columns for a table.
		/// </summary>
		/// <param name="tableName">The name of the table.</param>
		/// <returns>The list of columns on the table.</returns>
		private IEnumerable<FastExpando> GetColumnsForTable(string tableName)
		{
			return _connection.QuerySql(String.Format(CultureInfo.InvariantCulture, @"
				SELECT Name=c.name, ObjectID=c.object_id, ColumnID=c.column_id, TypeName = t.name, MaxLength=c.max_length, Precision=c.precision, Scale=c.scale, IsNullable=c.is_nullable, IsIdentity=c.is_identity, CollationName=c.Collation_Name,IdentitySeed=i.seed_value, IdentityIncrement=i.increment_value, Definition=cc.definition,
				DefaultName=REPLACE(d.name, '{0}', ''), DefaultIsSystemNamed=d.is_system_named, DefaultDefinition=d.definition
					FROM sys.columns c
					JOIN sys.types t ON (c.system_type_id = t.system_type_id AND c.user_type_id = t.user_type_id)
					LEFT JOIN sys.default_constraints d ON (d.parent_object_id = c.object_id AND d.parent_column_id = c.column_id)
					LEFT JOIN sys.identity_columns i ON (c.object_id = i.object_id AND c.column_id = i.column_id)
					LEFT JOIN sys.computed_columns cc ON (cc.object_id = c.object_id AND cc.column_id = c.column_id)
					WHERE c.object_id = OBJECT_ID (@TableName)", InsightTemp),
				new Dictionary<string, object> () { { "TableName", tableName } });
		}

		/// <summary>
		/// Output the definition of a column.
		/// </summary>
		/// <param name="column">The column object.</param>
		/// <returns>The string definition of the column.</returns>
		[System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1502:AvoidExcessiveComplexity")]
		private static string GetColumnDefinition(dynamic column)
		{
			StringBuilder sb = new StringBuilder();
			sb.Append(SqlParser.FormatSqlName(column.Name));

			if (column.Definition == null)
			{
				// this is a regular column, add in the type of the column
				sb.AppendFormat(" {0}", SqlParser.FormatSqlName(column.TypeName));

				string typeName = column.TypeName;
				switch (typeName)
				{
					case "nchar":
					case "char":
					case "nvarchar":
					case "varchar":
					case "varbinary":
						sb.AppendFormat("({0})", SqlColumnDefinitionProvider.GetColumnLength(typeName, column.MaxLength));
						break;

					case "decimal":
					case "numeric":
						sb.AppendFormat("({0}, {1})", column.Precision, column.Scale);
						break;
				}

				if (column.IsIdentity)
					sb.AppendFormat(" IDENTITY ({0}, {1})", column.IdentitySeed, column.IdentityIncrement);

				if (column.CollationName != null)
					sb.AppendFormat(" COLLATE {0}", column.CollationName);

				if (column.IsNullable)
					sb.Append(" NULL");
				else
					sb.Append(" NOT NULL");
			}
			else
			{
				// add in computed columns
				sb.AppendFormat(" AS {0}", column.Definition);
			}

			return sb.ToString();
		}

		/// <summary>
		/// Output the definition of a default.
		/// </summary>
		/// <param name="def">The default object.</param>
		/// <returns>The string definition of the column.</returns>
		private static string GetDefaultDefinition(dynamic def)
		{
			StringBuilder sb = new StringBuilder();

			if (!String.IsNullOrWhiteSpace(def.DefaultName))
			{
				// if there is an actual name, then name it
				if (!def.DefaultIsSystemNamed)
					sb.AppendFormat(" CONSTRAINT {0}", def.DefaultName);

				// add the definition
				sb.Append(" DEFAULT ");
				sb.Append(def.DefaultDefinition);
			}

			return sb.ToString();
		}
		#endregion

		/// <summary>
		/// Script the permissions on an object and save the script to add the permissions back later
		/// </summary>
		/// <param name="context">The installation context.</param>
		/// <param name="schemaObject">The object to drop</param>
		private void ScriptPermissions(InstallContext context, SchemaObject schemaObject)
		{
			IList<FastExpando> permissions = null;

			if (schemaObject.SchemaObjectType == SchemaObjectType.Role)
			{
				// get the current permissions on the object
				permissions = _connection.QuerySql(@"SELECT UserName=u.name, Permission=p.permission_name, ClassType=p.class_desc, ObjectName=ISNULL(o.name, t.name)
								FROM sys.database_principals u
								JOIN sys.database_permissions p ON (u.principal_id = p.grantee_principal_id)
								LEFT JOIN sys.objects o ON (p.class_desc = 'OBJECT_OR_COLUMN' AND p.major_id = o.object_id)
								LEFT JOIN sys.types t ON (p.class_desc = 'TYPE' AND p.major_id = t.user_type_id)
								WHERE u.name = @ObjectName",
						new Dictionary<string, object>() { { "ObjectName", schemaObject.SqlName.Object } });
			}
			else if (schemaObject.SchemaObjectType == SchemaObjectType.AutoProc)
			{
				// handle permissions for autoprocs
				foreach (var proc in new AutoProc(schemaObject.Name, new SqlColumnDefinitionProvider(_connection), context.SchemaObjects).GetProcs())
				{
					ScriptPermissions(context, new SchemaObject(SchemaObjectType.StoredProcedure, proc.Item2, ""));
				}

				return;
			}
			else if (schemaObject.SchemaObjectType == SchemaObjectType.UserDefinedType)
			{
				// get the current permissions on the object
				permissions = _connection.QuerySql(@"SELECT UserName=u.name, Permission=p.permission_name, ClassType=p.class_desc, ObjectName=QUOTENAME(t.name)
								FROM sys.database_principals u
								JOIN sys.database_permissions p ON (u.principal_id = p.grantee_principal_id)
								JOIN sys.types t ON (p.class_desc = 'TYPE' AND p.major_id = t.user_type_id)
								WHERE t.name = @ObjectName",
						new Dictionary<string, object>() { { "ObjectName", schemaObject.SqlName.Object } });
			}
			else
			{
				// get the current permissions on the object
				permissions = _connection.QuerySql(@"SELECT UserName=u.name, Permission=p.permission_name, ClassType=p.class_desc, 
								ObjectName=QUOTENAME(OBJECT_SCHEMA_NAME(o.object_id)) + '.' + QUOTENAME(OBJECT_NAME(o.object_id))
								FROM sys.database_principals u
								JOIN sys.database_permissions p ON (u.principal_id = p.grantee_principal_id)
								JOIN sys.objects o ON (p.class_desc = 'OBJECT_OR_COLUMN' AND p.major_id = o.object_id)
								WHERE o.object_id = OBJECT_ID(@ObjectName)",
						new Dictionary<string, object>() { { "ObjectName", schemaObject.SqlName.FullName } });
			}

			// create a new permission schema object to install for each existing permission
			foreach (dynamic permission in permissions)
				context.AddObjects.Add(new SchemaObject(String.Format("GRANT {0} ON {1}{2} TO {3} -- DEPENDENCY", permission.Permission, permission.ClassType == "TYPE" ? "TYPE::" : "", SqlParser.FormatSqlName(permission.ObjectName), SqlParser.FormatSqlName(permission.UserName))));
		}

		/// <summary>
		/// Script the standard dependencies such as stored procs and triggers.
		/// </summary>
		/// <param name="context">The installation context.</param>
		/// <param name="schemaObject">The schemaObject to script.</param>
		private void ScriptStandardDependencies(InstallContext context, SchemaObject schemaObject)
		{
			// can only script dependencies for objects with names
			if (schemaObject.SqlName.SchemaQualifiedObject == null)
				return;

			// find all of the dependencies on the object
			// this will find things that use views or tables
			// note that there will be more than one dependency if more than one column is referenced
			// ignore USER_TABLE, since that is calculated columns
			// for CHECK_CONSTRAINTS, ignore system-named constraints, since they are part of the table and will be handled there
			var dependencies = _connection.QuerySql(@"
				SELECT DISTINCT
					Name = QUOTENAME(OBJECT_SCHEMA_NAME(o.object_id)) + '.' + QUOTENAME(OBJECT_NAME(o.object_id)),
					SqlType = o.type_desc, IsSchemaBound=d.is_schema_bound_reference
				FROM sys.sql_expression_dependencies d
				JOIN sys.objects o ON (d.referencing_id = o.object_id)
				LEFT JOIN sys.check_constraints c ON (o.object_id = c.object_id)
				WHERE ISNULL(c.is_system_named, 0) = 0 AND
					o.type_desc <> 'USER_TABLE' AND 
					(o.parent_object_id = OBJECT_ID(@QualifiedName) OR
					d.referenced_id =
						CASE WHEN d.referenced_class_desc = 'TYPE' THEN 
							(SELECT user_type_id 
							FROM sys.types t JOIN sys.schemas s ON (t.schema_id = s.schema_id)
							WHERE s.name = @SchemaName AND t.name = @ObjectName)
						ELSE OBJECT_ID(@QualifiedName)
					END)",
				new Dictionary<string, object>()
				{
					{ "QualifiedName", schemaObject.SqlName.SchemaQualifiedObject },
					{ "SchemaName", schemaObject.SqlName.Schema },
					{ "ObjectName", schemaObject.SqlName.Object },
				});

			foreach (dynamic dependency in dependencies)
			{
				// we only have to update schemabound dependencies
				if (schemaObject.SchemaObjectType == SchemaObjectType.Table && !dependency.IsSchemaBound)
					continue;

				// since the object isn't already being dropped, create a new SchemaObject for it and rebuild that
				SchemaObject dropObject = null;
				string dependencyType = dependency.SqlType;
				string dependencyName = dependency.Name;

				switch (dependencyType)
				{
					case "SQL_STORED_PROCEDURE":
					case "SQL_SCALAR_FUNCTION":
					case "SQL_TABLE_VALUED_FUNCTION":
					case "SQL_TRIGGER":
					case "VIEW":
						// these objects can be rebuilt from the definition of the object in the database
						dropObject = new SchemaObject(_connection.ExecuteScalarSql<string>("SELECT definition FROM sys.sql_modules WHERE object_id = OBJECT_ID(@Name)", new Dictionary<string, object>() { { "Name", dependencyName } }));
						break;

					case "CHECK_CONSTRAINT":
						// need to do a little work to re-create the check constraint
						dynamic checkConstraint = _connection.QuerySql(@"
							SELECT TableName=QUOTENAME(OBJECT_SCHEMA_NAME(o.object_id)) + '.' + QUOTENAME(OBJECT_NAME(o.object_id)),
							ConstraintName=c.name, Definition=c.definition
							FROM sys.check_constraints c
							JOIN sys.objects o ON (c.parent_object_id = o.object_id) WHERE c.object_id = OBJECT_ID(@Name)",
							new Dictionary<string, object>() { { "Name", dependencyName } }).First();

						dropObject = new SchemaObject(String.Format(
							"ALTER TABLE {0} ADD CONSTRAINT {1} CHECK {2}",
							SqlParser.FormatSqlName(checkConstraint.TableName),
							SqlParser.FormatSqlName(checkConstraint.ConstraintName),
							checkConstraint.Definition));
						break;

					default:
						throw new InvalidOperationException(String.Format(CultureInfo.InvariantCulture, "Cannot generate dependencies for object {0}.", dependencyName));
				}

				ScriptUpdate(context, dropObject);
			}
		}

		/// <summary>
		/// Script the foreign keys on a table or primary key.
		/// </summary>
		/// <param name="context">The installation context.</param>
		/// <param name="schemaObject">The schemaObject to script.</param>
		[System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1502:AvoidExcessiveComplexity")]
		private void ScriptForeignKeys(InstallContext context, SchemaObject schemaObject)
		{
			IList<FastExpando> foreignKeys = null;

			if (schemaObject.SchemaObjectType == SchemaObjectType.PrimaryKey)
			{
				foreignKeys = _connection.QuerySql(@"
					SELECT ObjectID=f.object_id, Name=f.name, 
					TableName=QUOTENAME(OBJECT_SCHEMA_NAME(o.object_id)) + '.' + QUOTENAME(OBJECT_NAME(o.object_id)),
					RefTableName=QUOTENAME(OBJECT_SCHEMA_NAME(ro.object_id)) + '.' + QUOTENAME(OBJECT_NAME(ro.object_id)),
					DeleteAction=delete_referential_action_desc, UpdateAction=update_referential_action_desc
					FROM sys.foreign_keys f
					JOIN sys.key_constraints k ON (f.referenced_object_id = k.parent_object_id)
					JOIN sys.objects o ON (f.parent_object_id = o.object_id)
					JOIN sys.objects ro ON (k.parent_object_id = ro.object_id)
					WHERE k.parent_object_id = OBJECT_ID(@ObjectID)",
				new Dictionary<string, object>() { { "ObjectID", schemaObject.SqlName.SchemaQualifiedTable } });
			}

			foreach (dynamic foreignKey in foreignKeys)
			{
				// get the columns in the key from the database
				var columns = _connection.QuerySql(@"
						SELECT FkColumnName=fc.name, PkColumnName=kc.name
						FROM sys.foreign_key_columns f
						JOIN sys.columns fc ON (f.parent_object_id = fc.object_id AND f.parent_column_id = fc.column_id)
						JOIN sys.columns kc ON (f.referenced_object_id = kc.object_id AND f.referenced_column_id = kc.column_id)
						WHERE f.constraint_object_id = @KeyID",
					new Dictionary<string, object>() { { "KeyID", foreignKey.ObjectID } });

				StringBuilder sb = new StringBuilder();
				sb.AppendFormat("ALTER TABLE {0} ADD CONSTRAINT {1} FOREIGN KEY (",
						SqlParser.FormatSqlName(foreignKey.TableName),
						SqlParser.FormatSqlName(foreignKey.Name));
				sb.Append(String.Join(",", columns.Select((dynamic c) => SqlParser.FormatSqlName(c.FkColumnName))));
				sb.AppendFormat(") REFERENCES {0} (", SqlParser.FormatSqlName(foreignKey.RefTableName));
				sb.Append(String.Join(",", columns.Select((dynamic c) => SqlParser.FormatSqlName(c.PkColumnName))));
				sb.AppendFormat(") ON DELETE {0} ON UPDATE {1}", foreignKey.DeleteAction.Replace("_", " "), foreignKey.UpdateAction.Replace("_", " "));

				var dropObject = new SchemaObject(sb.ToString());

				ScriptUpdate(context, dropObject);
			}
		}

		/// <summary>
		/// Script the indexes on a table, view, or clustered index.
		/// </summary>
		/// <param name="context">The installation context.</param>
		/// <param name="schemaObject">The schemaObject to script.</param>
		/// <param name="columnName">If specified, then this is the name of the column to filter on.</param>
		[System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1502:AvoidExcessiveComplexity")]
		private void ScriptIndexes(InstallContext context, SchemaObject schemaObject, string columnName = null)
		{
			// get the indexes and constraints on a table
			// NOTE: we don't script system named indexes because we assume they are specified as part of the table definition
			// NOTE: order by type: do the clustered indexes first because they also drop nonclustered indexes if the object is a view (not a table)

			// generate some sql to determine the proper index
			string sql = @"SELECT ObjectID=i.object_id, IndexID=i.index_id,
				Name=QUOTENAME(i.name), 
				TableName=QUOTENAME(OBJECT_SCHEMA_NAME(o.object_id)) + '.' + QUOTENAME(OBJECT_NAME(o.object_id)), 
				Type=i.type_desc, IsUnique=i.is_unique, IsConstraint=CONVERT(bit, CASE WHEN k.object_id IS NOT NULL THEN 1 ELSE 0 END), IsPrimaryKey=CONVERT(bit, CASE WHEN k.type_desc = 'PRIMARY_KEY_CONSTRAINT' THEN 1 ELSE 0 END), DataSpace=";
			sql += context.IsAzure ? "NULL" : "ISNULL(f.name, p.name)";

			// get the data for the dependent indexes
			if (schemaObject.SchemaObjectType == SchemaObjectType.Index)
			{
				sql += @" FROM sys.indexes currentindex
						JOIN sys.indexes i ON (currentindex.object_id = i.object_id AND currentindex.index_id <> i.index_id)
						JOIN sys.objects o ON (i.object_id = o.object_id)
						LEFT JOIN sys.key_constraints k ON (o.object_id = k.parent_object_id AND i.index_id = k.unique_index_id AND is_system_named = 0)";
			}
			else
			{
				sql += @" FROM sys.indexes i
						JOIN sys.objects o ON (i.object_id = o.object_id)
						LEFT JOIN sys.key_constraints k ON (o.object_id = k.parent_object_id AND i.index_id = k.unique_index_id AND is_system_named = 0)";
			}

			// SQL Server may put the index on different filegroups
			if (!context.IsAzure)
			{
				sql += @" LEFT JOIN sys.partition_schemes p ON (i.data_space_id = p.data_space_id) 
						LEFT JOIN sys.filegroups f ON (i.data_space_id = f.data_space_id)";
			}

			// add the where clause
			if (schemaObject.SchemaObjectType == SchemaObjectType.Index)
			{
				sql += @" WHERE currentindex.object_id = OBJECT_ID(@ObjectName) AND currentIndex.type_desc = 'CLUSTERED' AND i.name IS NOT NULL";
			}
			else
			{
				sql += @" WHERE o.object_id = OBJECT_ID(@ObjectName) AND i.Name IS NOT NULL";
			}

			// filter by column if appropriate
			if (columnName != null)
			{
				sql += @" AND i.index_id IN (SELECT index_id 
								FROM sys.index_columns ic
								JOIN sys.columns c ON (c.object_id = ic.object_id AND c.column_id = ic.column_id)
								WHERE ic.object_id = OBJECT_ID(@ObjectName) AND c.name = @ColumnName)";
			}
			sql += @" ORDER BY Type";

			// find the indexes on the table
			var indexes = _connection.QuerySql(
				sql,
				new Dictionary<string, object>()
				{
					{ "ObjectName", schemaObject.SqlName.FullName }, 
					{ "ColumnName", columnName } 
				});
			foreach (dynamic index in indexes)
			{
				// get the columns in the key from the database
				var columns = _connection.QuerySql(@"
					SELECT ColumnName=c.name
					FROM sys.indexes i
					JOIN sys.index_columns ic ON (i.object_id = ic.object_id AND i.index_id = ic.index_id)
					JOIN sys.columns c ON (ic.object_id = c.object_id AND ic.column_id = c.column_id)
					WHERE i.object_id = @ObjectID AND i.index_id = @IndexID",
					new Dictionary<string, object>()
					{
						{ "ObjectID", index.ObjectID },
						{ "IndexID", index.IndexID },
					});

				StringBuilder sb = new StringBuilder();
				if (index.IsConstraint)
				{
					sb.AppendFormat("ALTER TABLE {3} ADD CONSTRAINT {2} {0}{1} (",
						index.IsPrimaryKey ? "PRIMARY KEY " : index.IsUnique ? "UNIQUE " : "",
						index.Type,
						index.Name,
						index.TableName);
				}
				else
				{
					sb.AppendFormat("CREATE {0}{1} INDEX {2} ON {3} (",
						index.IsUnique ? "UNIQUE " : "",
						index.Type,
						index.Name,
						index.TableName);
				}
				sb.Append(String.Join(",", columns.Select((dynamic c) => SqlParser.FormatSqlName(c.ColumnName))));
				sb.Append(")");

				// if the index is on another filegroup or partition scheme, add that
				if (index.DataSpace != null)
				{
					sb.AppendFormat(" ON {0}", SqlParser.FormatSqlName(index.DataSpace));

					// get the partition columns (this will be empty for non-partitioned indexes)
					if (!context.IsAzure)
					{
						var partitionColumns = _connection.QuerySql(@"
								SELECT ColumnName=c.name
								FROM sys.index_columns ic
								JOIN sys.columns c ON (ic.object_id = c.object_id AND ic.column_id = c.column_id)
								JOIN sys.indexes i ON (i.object_id = ic.object_id AND i.index_id = ic.index_id)
								WHERE i.object_id = @ObjectID AND i.index_id = @IndexID AND ic.partition_ordinal <> 0
								ORDER BY ic.partition_ordinal",
							new Dictionary<string, object>()
							{ 
								{ "ObjectID", index.ObjectID },
								{ "IndexID", index.IndexID }
							});

						if (partitionColumns.Any())
						{
							sb.Append("(");
							sb.Append(String.Join(",", partitionColumns.Select((dynamic p) => p.ColumnName)));
							sb.Append(")");
						}
					}
				}

				var dropObject = new SchemaObject(sb.ToString());

				ScriptUpdate(context, dropObject);
			}
		}

		/// <summary>
		/// Script the Xml Indexes on a table.
		/// </summary>
		/// <param name="context">The installation context.</param>
		/// <param name="schemaObject">The object to script.</param>
		[System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1502:AvoidExcessiveComplexity")]
		private void ScriptXmlIndexes(InstallContext context, SchemaObject schemaObject)
		{
			IList<FastExpando> xmlIndexes;

			if (schemaObject.SchemaObjectType == SchemaObjectType.PrimaryXmlIndex)
			{
				// find any secondary indexes dependent upon the primary index
				xmlIndexes = _connection.QuerySql(@"
						IF NOT EXISTS (SELECT * FROM sys.system_objects WHERE name = 'xml_indexes') SELECT TOP 0 Nothing=NULL ELSE
						SELECT ObjectID=i.object_id, IndexID=i.index_id, 
						Name=QUOTENAME(i.name), 
						TableName=QUOTENAME(OBJECT_SCHEMA_NAME(o.object_id)) + '.' + QUOTENAME(OBJECT_NAME(o.object_id)),
						SecondaryType=i.secondary_type_desc, ParentIndexName=QUOTENAME(@ObjectName)
						FROM sys.xml_indexes i
						JOIN sys.objects o ON (i.object_id = o.object_id)
						JOIN sys.xml_indexes p ON (p.index_id = i.using_xml_index_id)
						WHERE p.name = @ObjectName",
					new Dictionary<string, object>() { { "ObjectName", schemaObject.SqlName.Object } });
			}
			else
			{
				// for tables and primary keys, look for primary xml indexes
				xmlIndexes = _connection.QuerySql(@"
						IF NOT EXISTS (SELECT * FROM sys.system_objects WHERE name = 'xml_indexes') SELECT TOP 0 Nothing=NULL ELSE
						SELECT ObjectID=i.object_id, IndexID=i.index_id,
						Name=QUOTENAME(i.name),
						TableName=QUOTENAME(OBJECT_SCHEMA_NAME(o.object_id)) + '.' + QUOTENAME(OBJECT_NAME(o.object_id)),
						SecondaryType=i.secondary_type_desc, ParentIndexName=u.name
						FROM sys.xml_indexes i
						JOIN sys.objects o ON (i.object_id = o.object_id)
						LEFT JOIN sys.xml_indexes u ON (i.using_xml_index_id = u.index_id)
						WHERE i.object_id = OBJECT_ID(@ObjectName)",
					new Dictionary<string, object>() { { "ObjectName", schemaObject.SqlName.FullName } });
			}

			foreach (dynamic xmlIndex in xmlIndexes)
			{
				// get the columns in the key from the database
				var columns = _connection.QuerySql(@"
					SELECT ColumnName=QUOTENAME(c.name)
					FROM sys.xml_indexes i
					JOIN sys.index_columns ic ON (i.object_id = ic.object_id AND i.index_id = ic.index_id)
					JOIN sys.columns c ON (ic.object_id = c.object_id AND ic.column_id = c.column_id)
					WHERE i.object_id = @ObjectID AND i.index_id = @IndexID",
					new Dictionary<string, object>()
					{ 
						{ "ObjectID", xmlIndex.ObjectID },
						{ "IndexID", xmlIndex.IndexID }
					});

				StringBuilder sb = new StringBuilder();
				sb.AppendFormat("CREATE {0}XML INDEX {1} ON {2} (",
					(xmlIndex.ParentIndexName == null) ? "PRIMARY " : "",
					xmlIndex.Name,
					xmlIndex.TableName);
				sb.Append(String.Join(",", columns.Select((dynamic c) => SqlParser.FormatSqlName(c.ColumnName))));
				sb.Append(")");
				if (xmlIndex.SecondaryType != null)
				{
					sb.AppendFormat(" USING XML INDEX {0} FOR ", xmlIndex.ParentIndexName);
					sb.Append(xmlIndex.SecondaryType);
				}

				var dropObject = new SchemaObject(sb.ToString());

				ScriptUpdate(context, dropObject);
			}
		}
		#endregion

		#region Execution Methods
		/// <summary>
		/// Add all of the objects that need to be added.
		/// </summary>
		/// <param name="addObjects">The objects to add.</param>
		/// <param name="objects">The entire schema. Needed for AutoProcs.</param>
		private void AddObjects(InstallContext context)
		{
			// create objects
			foreach (SchemaObject schemaObject in context.AddObjects)
			{
				if (CreatingObject != null)
					CreatingObject(this, new SchemaEventArgs(SchemaEventType.BeforeCreate, schemaObject));

				schemaObject.Install(_connection, context.SchemaObjects);

				if (CreatedObject != null)
					CreatedObject(this, new SchemaEventArgs(SchemaEventType.AfterCreate, schemaObject));
			}
		}

		/// <summary>
		/// Drop objects that need to be dropped.
		/// </summary>
		/// <param name="dropObjects">The list of objects to drop.</param>
		private void DropObjects(IEnumerable<SchemaRegistryEntry> dropObjects)
        {
            // drop objects
            foreach (var dropObject in dropObjects.Distinct())
            {
                if (DroppingObject != null)
					DroppingObject(this, new SchemaEventArgs(SchemaEventType.BeforeDrop, dropObject.ObjectName));

				try
				{
					SchemaObject.Drop(_connection, dropObject.Type, dropObject.ObjectName);
				}
				catch (SqlException e)
				{
					if (!AllowRepair)
						throw;

					if (DropFailed != null)
						DropFailed(this, new SchemaEventArgs(SchemaEventType.DropFailed, dropObject.ObjectName) { Exception = e });
				}
            }
        }

		/// <summary>
		/// Verify that all of the objects that are supposed to be there really are...
		/// </summary>
		/// <param name="schemaObjects">The objects</param>
		private void VerifyObjects (List<SchemaObject> schemaObjects)
		{
			foreach (SchemaObject schemaObject in schemaObjects)
				if (!schemaObject.Exists(_connection))
					throw new SchemaException(String.Format(CultureInfo.InvariantCulture, "Schema Object {0} was not in the database", schemaObject.Name));
		}
		#endregion

		#region Event Handling
        /// <summary>
        /// Called before a SchemaObject is created
        /// </summary>
        public event EventHandler<SchemaEventArgs> CreatingObject;

        /// <summary>
        /// Called after a SchemaObject is created
        /// </summary>
        public event EventHandler<SchemaEventArgs> CreatedObject;

        /// <summary>
        /// Called before a SchemaObject is dropped
        /// </summary>
        public event EventHandler<SchemaEventArgs> DroppingObject;

		/// <summary>
		/// Dropping an object failed
		/// </summary>
		public event EventHandler<SchemaEventArgs> DropFailed;
		#endregion

        #region Internal Helper Methods
		/// <summary>
		/// Compares two registry entry objects to determine the appropriate installation order.
		/// </summary>
		/// <param name="e1">The first object to compare.</param>
		/// <param name="e2">The second object to compere.</param>
		/// <returns>The comparison result.</returns>
		private static int CompareByInstallOrder(SchemaRegistryEntry e1, SchemaRegistryEntry e2)
		{
			int compare = e1.Type.CompareTo(e2.Type);
			if (compare == 0)
				compare = e1.OriginalOrder.CompareTo(e2.OriginalOrder);
			if (compare == 0)
				compare = String.Compare(e1.ObjectName, e2.ObjectName, StringComparison.OrdinalIgnoreCase);

			return compare;
		}

		/// <summary>
		/// Compares two schema objects to determine the appropriate installation order.
		/// </summary>
		/// <param name="o1">The first object to compare.</param>
		/// <param name="o2">The second object to compere.</param>
		/// <returns>The comparison result.</returns>
		private static int CompareByInstallOrder(SchemaObject o1, SchemaObject o2)
		{
			int compare = o1.SchemaObjectType.CompareTo(o2.SchemaObjectType);
			if (compare == 0)
				compare = o1.OriginalOrder.CompareTo(o2.OriginalOrder);
			if (compare == 0)
				compare = String.Compare(o1.Name, o2.Name, StringComparison.OrdinalIgnoreCase);
			return compare;
		}
		#endregion

		#region Private Members
		/// <summary>
		/// The current connection to the database
		/// </summary>
		private RecordingDbConnection _connection;
		#endregion

		internal class InstallContext
		{
			public SchemaRegistry SchemaRegistry;
			public List<SchemaObject> SchemaObjects;
			public List<SchemaRegistryEntry> DropObjects;
			public List<SchemaObject> AddObjects;
			public bool IsAzure;
		}
	}
    #endregion
}