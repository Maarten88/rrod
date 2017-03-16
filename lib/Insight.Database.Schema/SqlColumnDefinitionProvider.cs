using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Text;
using Insight.Database;

namespace Insight.Database.Schema
{
	/// <summary>
	/// Provides information about the columns in a SQL Server table.
	/// </summary>
	class SqlColumnDefinitionProvider : IColumnDefinitionProvider
	{
		/// <summary>
		/// The connection to use to connect to the database.
		/// </summary>
		private IDbConnection _connection;

		/// <summary>
		/// Initializes an instance of a SqlColumnDefinitionProvider.
		/// </summary>
		/// <param name="connection">The connection to the database.</param>
		public SqlColumnDefinitionProvider(IDbConnection connection)
		{
			_connection = connection;
		}

		/// <summary>
		/// Return the column definitions for a table.
		/// </summary>
		/// <param name="tableName">The name of the table.</param>
		/// <returns>The definitions of the columns in the table.</returns>
		public IList<ColumnDefinition> GetColumns(SqlName tableName)
		{
			List<ColumnDefinition> columns = new List<ColumnDefinition>();

			// get the schema of the table and the primary key
			string schemaSql = String.Format(CultureInfo.InvariantCulture, @"
				SELECT c.name, type_name=t.name, c.max_length, c.precision, c.scale, is_identity, is_readonly = is_identity | is_computed, c.is_nullable,
					is_key = CASE WHEN pk.column_id IS NOT NULL THEN 1 ELSE 0 END,
					has_default = CASE WHEN c.default_object_id <> 0 THEN 1 ELSE 0 END
					FROM sys.columns c
					JOIN sys.types t ON (c.user_type_id = t.user_type_id AND t.is_user_defined = 0)
					LEFT JOIN (
						SELECT ic.object_id, ic.column_id
							FROM sys.index_columns ic
							JOIN sys.indexes i ON (ic.object_id = i.object_id AND ic.index_id = i.index_id)
							WHERE i.is_primary_key = 1
					) AS pk ON (c.object_id = pk.object_id AND c.column_id = pk.column_id)
					WHERE c.object_id = OBJECT_ID('{0}')
				", tableName.SchemaQualifiedTable);

			using (IDataReader reader = _connection.GetReaderSql(schemaSql))
			{
				while (reader.Read())
				{
					ColumnDefinition column = new ColumnDefinition()
					{
						Name = reader["name"].ToString(),
						SqlType = reader["type_name"].ToString(),

						IsKey = Convert.ToBoolean(reader["is_key"], CultureInfo.InvariantCulture),
						IsIdentity = Convert.ToBoolean(reader["is_identity"], CultureInfo.InvariantCulture),
						IsReadOnly = Convert.ToBoolean(reader["is_readonly"], CultureInfo.InvariantCulture),
						IsUpdateNullable = Convert.ToBoolean(reader["is_nullable"], CultureInfo.InvariantCulture),
						HasDefault = Convert.ToBoolean(reader["has_default"], CultureInfo.InvariantCulture),
					};

					switch (column.SqlType)
					{
						case "char":
						case "nchar":
						case "varchar":
						case "nvarchar":
						case "binary":
						case "varbinary":
							column.SqlType += String.Format(CultureInfo.InvariantCulture, "({0})", GetColumnLength(column.SqlType, Int32.Parse(reader["max_length"].ToString(), CultureInfo.InvariantCulture)));
							break;

						case "decimal":
						case "numeric":
							column.SqlType += String.Format(CultureInfo.InvariantCulture, "({0}, {1})", reader["precision"].ToString(), reader["scale"].ToString());
							break;

						case "float":
							column.SqlType += String.Format(CultureInfo.InvariantCulture, "({0})", reader["precision"].ToString());
							break;

						case "real":
							break;

						case "rowversion":
						case "timestamp":
							column.IsReadOnly = true;
							column.IsRowVersion = true;
							column.IsUpdateNullable = true;
							break;
					}

					columns.Add(column);
				}
			}

			return columns;
		}

		/// <summary>
		/// Calculate the column length based on the max_length field in SQL Server.
		/// </summary>
		/// <param name="sqlType">The type of the column</param>
		/// <param name="maxLength">The length in the sys.columns table.</param>
		/// <returns>The length to use for scripting.</returns>
		internal static string GetColumnLength(string sqlType, int maxLength)
		{
			if (maxLength == -1)
				return "MAX";

			if (sqlType == "nchar" || sqlType == "nvarchar")
				maxLength /= 2;

			return maxLength.ToString(CultureInfo.InvariantCulture);
		}
	}
}
