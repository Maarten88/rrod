#region Using directives

using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using Insight.Database;

#endregion

namespace Insight.Database.Schema
{
    /// <summary>
    /// Manages the list of schema objects installed in the database.
    /// </summary>
    class SchemaRegistry
    {
        #region Constructors
        /// <summary>
        /// Manages the signatures of objects in the schema database
        /// </summary>
        /// <param name="connection">The connection to the database</param>
		/// <param name="schemaGroup">The name of the schema group to modify</param>
        public SchemaRegistry (RecordingDbConnection connection, string schemaGroup)
        {
			SchemaGroup = schemaGroup;
			Connection = connection;

			// make sure we have a table to work with
            EnsureSchemaTable();

			// load in the entries from the database
			Connection.DoNotLog(() =>
			{
				Entries = Connection.QuerySql(
					String.Format(CultureInfo.InvariantCulture, "SELECT * FROM [{0}] WHERE SchemaGroup = @SchemaGroup", SchemaRegistryTableName),
					new Dictionary<string, object>() { { "SchemaGroup", schemaGroup } }).Select(
					(dynamic e) => new SchemaRegistryEntry()
					{
						SchemaGroup = e.SchemaGroup,
						ObjectName = e.ObjectName,
						Signature = e.Signature,
						Type = (SchemaObjectType)Enum.Parse(typeof(SchemaObjectType), e.Type),
						OriginalOrder = e.OriginalOrder
					}).ToList();

				// automatically handle the old format for entries
				// WAS: 'ROLE [foo]'
				// NOW: '[foo]'
				foreach (var entry in Entries.Where(e =>
					e.Type == SchemaObjectType.Schema ||
					e.Type == SchemaObjectType.Login ||
					e.Type == SchemaObjectType.User ||
					e.Type == SchemaObjectType.Role ||
					e.Type == SchemaObjectType.Queue || 
					e.Type == SchemaObjectType.Service))
					entry.ObjectName = _registryUpgradeRegex.Replace(entry.ObjectName, "");

				// automatically reformat names to fully qualified name
				// WAS: '[foo]'
				// NOW: '[dbo].[foo]'
				foreach (var entry in Entries)
					entry.ObjectName = new SchemaObject(entry.Type, entry.ObjectName, null).Name;
			});
		}

		private static readonly Regex _registryUpgradeRegex = new Regex(@"^((SCHEMA)|(LOGIN)|(USER)|(ROLE)|(QUEUE)|(SERVICE))\s*", RegexOptions.IgnoreCase | RegexOptions.Compiled);
        #endregion

        #region Public Methods
		/// <summary>
		/// Finds an entry by name
		/// </summary>
		/// <param name="objectName">The name of the schema object.</param>
		/// <returns>The schema entry or null if it can't be found.</returns>
		public SchemaRegistryEntry Find(string objectName)
		{
			return Entries.FirstOrDefault(e => String.Compare(e.ObjectName, objectName, StringComparison.OrdinalIgnoreCase) == 0);
		}

		/// <summary>
		/// Finds an entry by name
		/// </summary>
		/// <param name="objectName">The name of the schema object.</param>
		/// <returns>The schema entry or null if it can't be found.</returns>
		public SchemaRegistryEntry Find(SchemaObject schemaObject)
		{
			return Find(schemaObject.Name);
		}

		/// <summary>
		/// Determine if the database already contains a given object
		/// </summary>
		/// <param name="schemaObject">The schema object to look for</param>
		/// <returns>True if the object is in the registry, false otherwise</returns>
		public bool Contains(SchemaObject schemaObject)
		{
			return Find(schemaObject) != null;
		}

		/// <summary>
		/// Determine if the database already contains a given object
		/// </summary>
		/// <param name="schemaObject">The schema object to look for</param>
		/// <returns>True if the object is in the registry, false otherwise</returns>
		public bool Contains(string objectName)
		{
			return Find(objectName) != null;
		}

		/// <summary>
        /// Update the schema registry with the new objects
        /// </summary>
        /// <param name="schemaObject">The object to update</param>
        /// <param name="schemaGroup">The name of the schema group</param>
		public void Update(IEnumerable<SchemaObject> objects)
		{
			// make an new list of entries
			Entries = objects.Select(o =>
				new SchemaRegistryEntry()
				{
					SchemaGroup = SchemaGroup,
					ObjectName = o.Name,
					Type = o.SchemaObjectType,
					Signature = o.GetSignature(Connection, objects),
					OriginalOrder = o.OriginalOrder
				}).ToList();

			Commit();
		}

		/// <summary>
		/// Commit the data to the database.
		/// </summary>
		/// 
		internal void Commit()
		{
			Connection.OnlyRecord(() =>
			{
				// delete all of the old records in the schema group
				Connection.ExecuteSql(String.Format(CultureInfo.InvariantCulture, "DELETE FROM [{0}] WHERE SchemaGroup = '{1}'", SchemaRegistryTableName, SchemaGroup));

				// insert all of the new records
				foreach (var entry in Entries)
					Connection.ExecuteSql(String.Format(CultureInfo.InvariantCulture, "INSERT INTO [{0}] (SchemaGroup, ObjectName, Signature, Type, OriginalOrder) VALUES ('{1}', '{2}', '{3}', '{4}', '{5}')", 
						SchemaRegistryTableName,
						SchemaGroup,
						entry.ObjectName,
						entry.Signature,
						entry.Type,
						entry.OriginalOrder
				));
			});
        }
        #endregion

        #region Private Methods
        /// <summary>
        /// Create the schema registry table in the database
        /// </summary>
		private void EnsureSchemaTable()
        {
			// create the table
			Connection.ExecuteSql(String.Format (CultureInfo.InvariantCulture, 
@"-- Make sure that the Insight_SchemaRegistry table exists
IF NOT EXISTS (SELECT * FROM sys.objects WHERE name = '{0}')
CREATE TABLE [{0}]
(
	[SchemaGroup] [varchar](64) NOT NULL,
	[ObjectName] [varchar](256) NOT NULL,
	[Signature] [varchar](28) NOT NULL,
	[Type][varchar](32) NOT NULL,
	[OriginalOrder] [int] DEFAULT (0)
	CONSTRAINT PK_{0} PRIMARY KEY ([ObjectName])
)", SchemaRegistryTableName));
        }
        #endregion

        #region Private Data
        /// <summary>
        /// The name of the schema registry table
        /// </summary>
        public const string SchemaRegistryTableName = "Insight_SchemaRegistry";

		/// <summary>
		/// The entries in the database.
		/// </summary>
		internal IList<SchemaRegistryEntry> Entries;

		/// <summary>
		/// The connection we are bound to.
		/// </summary>
		private RecordingDbConnection Connection;

		/// <summary>
		/// The name of the SchemaGroup we are bound to.
		/// </summary>
		private string SchemaGroup;
        #endregion
	}
}
