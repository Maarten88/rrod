using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.SqlClient;
using System.IO;
using System.Text.RegularExpressions;
using System.Globalization;

namespace Insight.Database.Schema
{
	/// <summary>
	/// Handles creation & destruction of AutoCrud stored procedures.
	/// Allows you to simplify procedures in your scripts:
	///		AUTOPROC [type] [table] [_name]
	///		GO
	///		AUTOPROC Insert [Beer] InsertBeer
	///		GO
	/// </summary>
	public class AutoProc
	{
		#region Private Members
		/// <summary>
		/// A string that is added to the hash of the dependencies so that the AutoProc can be forced to change if the internal implementation changes.
		/// </summary>
		private static string VersionSignature = "2.2.8.0";

		/// <summary>
		/// The exception thrown when an optimistic concurrency error is detected.
		/// </summary>
		private static string _concurrencyError = "At least one record has changed or does not exist. (CONCURRENCY CHECK)";

		/// <summary>
		/// The name of the table to autoproc.
		/// </summary>
		private SqlName _tableName;

		/// <summary>
		/// The singular form of the name of the table that we are generating procedures for.
		/// </summary>
		private string _singularTableName;

		/// <summary>
		/// The plural form of the name of the table that we are generating procedures for.
		/// </summary>
		private string _pluralTableName;

		/// <summary>
		/// The type of the procedure to generate.
		/// </summary>
		private ProcTypes _type;

		/// <summary>
		/// For procs that use a TVP, allows the user to rename the TVP.
		/// </summary>
		private string _tvpName;

		/// <summary>
		/// For procs that use an ID TVP, allows the user to rename the ID TVP.
		/// </summary>
		private string _idtvpName;

		/// <summary>
		/// When set to true, dynamic SQL is executed as the owner of the procedure instead of the current user.
		/// This allows you to require all access to tables be done through the stored procedures, but still allow access
		/// to the Find procedure and other dynamic procedures.
		/// </summary>
		private bool _executeAsOwner;

		/// <summary>
		/// Provides the list of columns for a table.
		/// </summary>
		private IColumnDefinitionProvider _columnProvider;

		/// <summary>
		/// The RegEx used to detect and decode an AutoProc.
		/// </summary>
		internal static readonly string AutoProcRegexString = String.Format(CultureInfo.InvariantCulture, @"AUTOPROC\s+(?<type>\w[,\w]+)\s+(?<tablename>{0})(\s+Name=(?<name>[^\s]+))?(\s+IDTVP=(?<idtvp>[^\s]+))?(\s+TVP=(?<tvp>[^\s]+))?(\s+Single=(?<single>[^\s]+))?(\s+Plural=(?<plural>[^\s]+))?(\s+ExecuteAsOwner=(?<execasowner>[^\s]+))?", SqlParser.SqlNameExpression);

		/// <summary>
		/// The RegEx used to detect and decode an AutoProc.
		/// </summary>
		internal static readonly Regex AutoProcRegex = new Regex(AutoProcRegexString);

		/// <summary>
		/// The signature of the AutoProc. This is derived from the table and the private key(s) in the script collection.
		/// </summary>
		internal string Signature { get; private set; }

		/// <summary>
		/// The name of the procedure to generate.
		/// </summary>
		internal string Name { get; private set; }

		/// <summary>
		/// Gets the Sql for the AutoProc. Note that the objects must exist in the database so that the ColumnProvider can read them.
		/// </summary>
		public string Sql { get { return GenerateSql(); } }
		#endregion

		#region Constructors
		/// <summary>
		/// Initializes an automatically generated procedure.
		/// </summary>
		/// <param name="installer">The installer to use when modifying the procedure.</param>
		/// <param name="name">The name of the procedure, in in the format of the AutoProcRegex.</param>
		/// <param name="objects">The list of objects that are in the schema. Used for change detection.</param>
		public AutoProc(string name, IColumnDefinitionProvider columnProvider, IEnumerable<SchemaObject> objects)
		{
			// initialize dependencies
			_columnProvider = columnProvider;

			// break up the name into its components
			var match = new Regex(AutoProcRegexString, RegexOptions.IgnoreCase).Match(name);
			_type = (ProcTypes)Enum.Parse(typeof(ProcTypes), match.Groups["type"].Value, true);
			_tableName = new SqlName(match.Groups["tablename"].Value, 2);

			// generate the singular table name
			if (!String.IsNullOrWhiteSpace(match.Groups["single"].Value))
				_singularTableName = match.Groups["single"].Value;
			else
				_singularTableName = Singularizer.Singularize(_tableName.Table);

			// generate the plural table name
			if (!String.IsNullOrWhiteSpace(match.Groups["plural"].Value))
				_pluralTableName = match.Groups["plural"].Value;
			else
			{
				_pluralTableName = _tableName.Table;
				if (String.Compare(_pluralTableName, _singularTableName, StringComparison.OrdinalIgnoreCase) == 0)
					_pluralTableName = _tableName.Table + "s";
			}

			// get the specified name
			string procName = match.Groups["name"].Value;
			if (!String.IsNullOrWhiteSpace(procName))
				Name = SqlParser.FormatSqlName(procName);

			//  check the exec as owner flag
			if (!String.IsNullOrWhiteSpace(match.Groups["tvp"].Value))
				_tvpName = match.Groups["tvp"].Value;
			if (!String.IsNullOrWhiteSpace(match.Groups["idtvp"].Value))
				_idtvpName = match.Groups["idtvp"].Value;

			//  check the exec as owner flag
			if (!String.IsNullOrWhiteSpace(match.Groups["execasowner"].Value))
				_executeAsOwner = Boolean.Parse(match.Groups["execasowner"].Value);

			// if we received a set of objects, then we can calculate a signature
			if (objects != null)
			{
				Regex optionalSqlName = new Regex(@"([\[\]])");
				string escapedWildcardedName = optionalSqlName.Replace(Regex.Escape(_tableName.Table), @"$1?");
				Regex regex = new Regex(String.Format(CultureInfo.InvariantCulture, @"(CREATE\s+TABLE\s+.*{0}[\]\s]\s*\()|(ALTER\s+TABLE\s+.*{0}.*PRIMARY\s+KEY)", escapedWildcardedName));

				// calculate the signature based upon the TABLE definition, plus any PRIMARY KEY definition for the table
				string sql = String.Join(" ", objects.Where(o => regex.Match(o.Sql).Success)
					.Select(o => o.Sql)
					.OrderBy(s => s));

				// add a version signature so we can force updates if we need to
				sql += VersionSignature;

				Signature = SchemaObject.CalculateSignature(sql);
			}
			else
			{
				// we don't know what the schema is, so assume that the proc has changed
				Signature = Guid.NewGuid().ToString();
			}
		}
		#endregion

		#region Install Methods
		/// <summary>
		/// Generate the Sql required for this procedure.
		/// </summary>
		/// <returns>The sql for this procedure.</returns>
		private string GenerateSql()
		{
			IList<ColumnDefinition> columns = _columnProvider.GetColumns(_tableName);

			// we need primary keys
			if (!columns.Any(c => c.IsKey))
				throw new InvalidOperationException(String.Format(CultureInfo.InvariantCulture, "Cannot generate AutoProcs for a table with no primary keys ({0}).", _tableName));

			// generate the sql
			string sql = "";

			bool optimistic = _type.HasFlag(ProcTypes.Optimistic);

			if (_type.HasFlag(ProcTypes.Table)) sql += GenerateTableSql(columns) + _batchDivider;
			if (_type.HasFlag(ProcTypes.IdTable)) sql += GenerateIdTableSql(columns, optimistic) + _batchDivider;

			if (_type.HasFlag(ProcTypes.Select)) sql += GenerateSelectSql(columns) + _batchDivider;
			if (_type.HasFlag(ProcTypes.Insert)) sql += GenerateInsertSql(columns) + _batchDivider;
			if (_type.HasFlag(ProcTypes.Update)) sql += GenerateUpdateSql(columns, optimistic) + _batchDivider;
			if (_type.HasFlag(ProcTypes.Upsert)) sql += GenerateUpsertSql(columns, optimistic) + _batchDivider;
			if (_type.HasFlag(ProcTypes.Delete)) sql += GenerateDeleteSql(columns, optimistic) + _batchDivider;

			if (_type.HasFlag(ProcTypes.SelectMany)) sql += GenerateSelectManySql(columns) + _batchDivider;
			if (_type.HasFlag(ProcTypes.InsertMany)) sql += GenerateInsertManySql(columns) + _batchDivider;
			if (_type.HasFlag(ProcTypes.UpdateMany)) sql += GenerateUpdateManySql(columns, optimistic) + _batchDivider;
			if (_type.HasFlag(ProcTypes.UpsertMany)) sql += GenerateUpsertManySql(columns, optimistic) + _batchDivider;
			if (_type.HasFlag(ProcTypes.DeleteMany)) sql += GenerateDeleteManySql(columns, optimistic) + _batchDivider;

			if (_type.HasFlag(ProcTypes.Find)) sql += GenerateFindSql(columns) + _batchDivider;

			return sql;
		}
		private string _batchDivider = Environment.NewLine + "GO" + Environment.NewLine;

		public IEnumerable<Tuple<ProcTypes, string>> GetProcs()
		{
			if (_type.HasFlag(ProcTypes.Table)) yield return new Tuple<ProcTypes, string>(ProcTypes.Table, MakeTableName("Table"));
			if (_type.HasFlag(ProcTypes.IdTable)) yield return new Tuple<ProcTypes, string>(ProcTypes.IdTable, MakeTableName("IdTable"));

			if (_type.HasFlag(ProcTypes.Select)) yield return new Tuple<ProcTypes, string>(ProcTypes.Select, MakeProcName(ProcTypes.Select.ToString(), false));
			if (_type.HasFlag(ProcTypes.Insert)) yield return new Tuple<ProcTypes, string>(ProcTypes.Insert, MakeProcName(ProcTypes.Insert.ToString(), false));
			if (_type.HasFlag(ProcTypes.Update)) yield return new Tuple<ProcTypes, string>(ProcTypes.Update, MakeProcName(ProcTypes.Update.ToString(), false));
			if (_type.HasFlag(ProcTypes.Upsert)) yield return new Tuple<ProcTypes, string>(ProcTypes.Upsert, MakeProcName(ProcTypes.Upsert.ToString(), false));
			if (_type.HasFlag(ProcTypes.Delete)) yield return new Tuple<ProcTypes, string>(ProcTypes.Delete, MakeProcName(ProcTypes.Delete.ToString(), false));

			if (_type.HasFlag(ProcTypes.SelectMany)) yield return new Tuple<ProcTypes, string>(ProcTypes.SelectMany, MakeProcName(ProcTypes.Select.ToString(), true));
			if (_type.HasFlag(ProcTypes.InsertMany)) yield return new Tuple<ProcTypes, string>(ProcTypes.InsertMany, MakeProcName(ProcTypes.Insert.ToString(), true));
			if (_type.HasFlag(ProcTypes.UpdateMany)) yield return new Tuple<ProcTypes, string>(ProcTypes.UpdateMany, MakeProcName(ProcTypes.Update.ToString(), true));
			if (_type.HasFlag(ProcTypes.UpsertMany)) yield return new Tuple<ProcTypes, string>(ProcTypes.UpsertMany, MakeProcName(ProcTypes.Upsert.ToString(), true));
			if (_type.HasFlag(ProcTypes.DeleteMany)) yield return new Tuple<ProcTypes, string>(ProcTypes.DeleteMany, MakeProcName(ProcTypes.Delete.ToString(), true));

			if (_type.HasFlag(ProcTypes.Find)) yield return new Tuple<ProcTypes, string>(ProcTypes.Find, MakeProcName(ProcTypes.Find.ToString(), true));
		}
		#endregion

		#region Standard CRUD Sql
		/// <summary>
		/// Generates the Select procedure.
		/// </summary>
		/// <param name="columns">The list of columns in the table.</param>
		/// <returns>The stored procedure SQL.</returns>
		private string GenerateSelectSql(IList<ColumnDefinition> columns)
		{
			IEnumerable<ColumnDefinition> keys = columns.Where(c => c.IsKey);

			// generate the sql for each proc and install them
			StringBuilder sb = new StringBuilder();
			sb.AppendFormat("CREATE PROCEDURE {0}", MakeProcName("Select", plural: false));
			sb.AppendLine();
			sb.AppendLine("(");
			sb.AppendLine(Join(keys, ",", "{1} {2}"));
			sb.AppendLine(")");
			sb.AppendLine("AS");
			sb.AppendFormat("SELECT * FROM {0} WHERE ", _tableName.SchemaQualifiedTable);
			sb.AppendLine();
			sb.AppendLine(Join(keys, " AND", "{0}={1}"));

			return sb.ToString();
		}

		private static string GenerateOutputTable(IList<ColumnDefinition> columns, bool addRowNumber = false)
		{
			StringBuilder sb = new StringBuilder();

			sb.AppendLine("DECLARE @T TABLE(");
			sb.Append(String.Join(",\n", columns.Select(c => 
				String.Format("{0} {1}", 
				c.ColumnName,
				(String.Compare(c.SqlType, "rowversion", StringComparison.OrdinalIgnoreCase) == 0 || String.Compare(c.SqlType, "timestamp", StringComparison.OrdinalIgnoreCase) == 0) ? "binary(8)" : c.SqlType))));
			if (addRowNumber)
			{
				sb.AppendLine(",");
				sb.AppendLine("[_insight_rownumber] [int]");
			}
			sb.AppendLine(")");

			return sb.ToString();
		}

		/// <summary>
		/// Generates the Insert procedure.
		/// </summary>
		/// <param name="columns">The list of columns in the table.</param>
		/// <returns>The stored procedure SQL.</returns>
		private string GenerateInsertSql(IList<ColumnDefinition> columns)
		{
			IList<ColumnDefinition> outputs = columns.Where(c => c.IsReadOnly || c.IsRowVersion || c.HasDefault).ToList();
			IEnumerable<ColumnDefinition> insertable = columns.Where(c => !c.IsReadOnly);

			// generate the sql for each proc and install them
			StringBuilder sb = new StringBuilder();
			sb.AppendFormat("CREATE PROCEDURE {0}", MakeProcName("Insert", plural: false));
			sb.AppendLine();
			sb.AppendLine("(");
			sb.AppendLine(Join(insertable, ",", "{1} {2}{4}"));
			sb.AppendLine(")");
			sb.AppendLine("AS");
			sb.AppendLine("");
			if (outputs.Any())
			{
				sb.AppendLine(GenerateOutputTable(outputs));
			}
			sb.AppendFormat("INSERT INTO {0}", _tableName.SchemaQualifiedTable);
			sb.AppendLine();
			sb.AppendLine("(");
			sb.AppendLine(Join(insertable, ",", "{0}"));
			sb.AppendLine(")");
			if (outputs.Any())
			{
				sb.AppendLine("OUTPUT");
				sb.AppendLine(Join(outputs, ",", "Inserted.{0}"));
				sb.AppendLine("INTO @T");
			}
			sb.AppendLine("VALUES");
			sb.AppendLine("(");
			sb.AppendLine(Join(insertable, ",", "{1}"));
			sb.AppendLine(")");
			if (outputs.Any())
			{
				sb.AppendLine("SELECT * FROM @T");
			}
			return sb.ToString();
		}

		/// <summary>
		/// Generates the Update procedure.
		/// </summary>
		/// <param name="columns">The list of columns in the table.</param>
		/// <returns>The stored procedure SQL.</returns>
		private string GenerateUpdateSql(IList<ColumnDefinition> columns, bool optimistic)
		{
			IEnumerable<ColumnDefinition> inputs = columns.Where(c => c.IsKey || !c.IsReadOnly || c.IsRowVersion);
			IEnumerable<ColumnDefinition> keys = columns.Where(c => c.IsKey);
			IList<ColumnDefinition> outputs = columns.Where(c => c.IsReadOnly || c.IsRowVersion || c.HasDefault).ToList();
			IEnumerable<ColumnDefinition> updatable = columns.Where(c => !c.IsKey && !c.IsReadOnly);
			ColumnDefinition timestamp = columns.Where(c => c.IsRowVersion).SingleOrDefault();

			VerifyOptimisticTimestamp(optimistic, timestamp);

			// generate the sql for each proc and install them
			StringBuilder sb = new StringBuilder();
			sb.AppendFormat("CREATE PROCEDURE {0}", MakeProcName("Update", plural: false));
			sb.AppendLine();
			sb.AppendLine("(");
			sb.AppendLine(Join(inputs, ",", "{1} {2}{4}"));
			sb.AppendLine(")");
			sb.AppendLine("AS");
			if (outputs.Any())
			{
				sb.AppendLine(GenerateOutputTable(outputs));
			}
			if (updatable.Any())
			{
				sb.AppendFormat("UPDATE {0} SET", _tableName.SchemaQualifiedTable);
				sb.AppendLine();
				sb.AppendLine(Join(updatable, ",", "{0}={1}"));
				if (outputs.Any())
				{
					sb.AppendLine("OUTPUT");
					sb.AppendLine(Join(outputs, ",", "Inserted.{0}"));
					sb.AppendLine("INTO @T");
				}
				sb.AppendLine("WHERE");
				sb.AppendLine(Join(keys, " AND", "{0}={1}"));

				if (optimistic)
				{
					sb.AppendLine(String.Format(CultureInfo.InvariantCulture, "AND ({0}={1} OR {1} IS NULL)", timestamp.Name, timestamp.ParameterName));
					sb.AppendLine(GetConcurrencyCheck("1", false));
				}
				if (outputs.Any())
				{
					sb.AppendLine("SELECT * FROM @T");
				}
			}
			else
			{
				sb.AppendFormat("RAISERROR (N'There are no UPDATEable fields on {0}', 18, 0)", _tableName.SchemaQualifiedTable);
				sb.AppendLine();
			}

			return sb.ToString();
		}

		/// <summary>
		/// Generates the Upsert procedure.
		/// </summary>
		/// <param name="columns">The list of columns in the table.</param>
		/// <returns>The stored procedure SQL.</returns>
		private string GenerateUpsertSql(IList<ColumnDefinition> columns, bool optimistic)
		{
			IEnumerable<ColumnDefinition> inputs = columns.Where(c => c.IsKey || !c.IsReadOnly || c.IsRowVersion);
			IEnumerable<ColumnDefinition> keys = columns.Where(c => c.IsKey);
			IEnumerable<ColumnDefinition> updatable = columns.Where(c => !c.IsKey && !c.IsReadOnly);
			IEnumerable<ColumnDefinition> insertable = columns.Where(c => !c.IsReadOnly);
			IList<ColumnDefinition> outputs = columns.Where(c => c.IsReadOnly || c.IsRowVersion || c.HasDefault).ToList();
			ColumnDefinition timestamp = columns.Where(c => c.IsRowVersion).SingleOrDefault();

			VerifyOptimisticTimestamp(optimistic, timestamp);

			// generate the sql for each proc and install them
			StringBuilder sb = new StringBuilder();
			sb.AppendFormat("CREATE PROCEDURE {0}", MakeProcName("Upsert", plural: false));
			sb.AppendLine();
			sb.AppendLine("(");
			sb.AppendLine(Join(inputs, ",", "{1} {2}{4}"));
			sb.AppendLine(")");
			sb.AppendLine("AS");
			if (outputs.Any())
			{
				sb.AppendLine(GenerateOutputTable(outputs));
			}
			if (optimistic)
				sb.AppendLine("BEGIN TRANSACTION; SET XACT_ABORT ON;");

			if (updatable.Any())
			{
				sb.AppendFormat("MERGE INTO {0} AS t", _tableName.SchemaQualifiedTable);
				sb.AppendLine();
				sb.AppendLine("USING");
				sb.AppendLine("(");
				sb.AppendLine("SELECT");
				sb.AppendLine(Join(inputs, ",", "{0} = {1}"));
				sb.AppendLine(")");
				sb.AppendLine("AS s");
				sb.AppendLine("ON");
				sb.AppendLine("(");
				sb.AppendLine(Join(keys, " AND", "t.{0} = s.{0}"));
				sb.AppendLine(")");
				if (updatable.Any())
				{
					if (optimistic)
						sb.AppendLine(String.Format(CultureInfo.InvariantCulture, "WHEN MATCHED AND (t.{0} = s.{0} OR s.{0} IS NULL) THEN UPDATE SET", timestamp.Name));
					else
						sb.AppendLine("WHEN MATCHED THEN UPDATE SET");
					sb.AppendLine(Join(updatable, ",", "\tt.{0} = s.{0}"));
				}
				if (insertable.Any())
				{
					sb.AppendLine("WHEN NOT MATCHED BY TARGET THEN INSERT");
					sb.AppendLine("(");
					sb.AppendLine(Join(insertable, ",", "{0}"));
					sb.AppendLine(")");
					sb.AppendLine("VALUES");
					sb.AppendLine("(");
					sb.AppendLine(Join(insertable, ",", "s.{0}"));
					sb.AppendLine(")");
				}
				if (outputs.Any())
				{
					sb.AppendLine("OUTPUT");
					sb.AppendLine(Join(outputs, ",", "Inserted.{0}"));
					sb.AppendLine("INTO @T");
				}
				sb.AppendLine(";");
			}
			else
			{
				sb.AppendFormat("RAISERROR (N'There are no UPDATEable fields on {0}', 18, 0)", _tableName.SchemaQualifiedTable);
				sb.AppendLine();
			}

			if (optimistic)
			{
				sb.AppendLine(GetConcurrencyCheck("1", true));
				sb.AppendLine("COMMIT");
			}
			if (outputs.Any())
			{
				sb.AppendLine("SELECT * FROM @T");
			}
			return sb.ToString();
		}

		/// <summary>
		/// Generates the Delete procedure.
		/// </summary>
		/// <param name="columns">The list of columns in the table.</param>
		/// <returns>The stored procedure SQL.</returns>
		private string GenerateDeleteSql(IList<ColumnDefinition> columns, bool optimistic)
		{
			IEnumerable<ColumnDefinition> inputs = columns.Where(c => c.IsKey || c.IsRowVersion);
			IEnumerable<ColumnDefinition> keys = columns.Where(c => c.IsKey);
			ColumnDefinition timestamp = columns.Where(c => c.IsRowVersion).SingleOrDefault();

			VerifyOptimisticTimestamp(optimistic, timestamp);

			// generate the sql for each proc and install them
			StringBuilder sb = new StringBuilder();
			sb.AppendFormat("CREATE PROCEDURE {0}", MakeProcName("Delete", plural: false));
			sb.AppendLine();
			sb.AppendLine("(");
			sb.AppendLine(Join(inputs, ",", "{1} {2}{4}"));
			sb.AppendLine(")");
			sb.AppendLine("AS");
			sb.AppendFormat("DELETE FROM {0} WHERE", _tableName.SchemaQualifiedTable);
			sb.AppendLine();
			sb.AppendLine(Join(keys, " AND", "{0}={1}"));

			if (optimistic)
			{
				sb.AppendLine(Join(timestamp, "", "AND ({0}={1} OR {1} IS NULL)"));
				sb.AppendLine(GetConcurrencyCheck("1", false));
			}

			return sb.ToString();
		}
		#endregion

		#region Multiple CRUD Sql
		/// <summary>
		/// Generates the Table Type.
		/// </summary>
		/// <param name="columns">The list of columns in the table.</param>
		/// <returns>The stored procedure SQL.</returns>
		private string GenerateTableSql(IList<ColumnDefinition> columns)
		{
			// generate the sql for each proc and install them
			StringBuilder sb = new StringBuilder();
			sb.AppendFormat("CREATE TYPE {0}", MakeTableName("Table"));
			sb.AppendLine();
			sb.AppendLine("AS TABLE");
			sb.AppendLine("(");
			sb.AppendLine(Join(columns, ",", "{0} {5} {3}"));
			sb.AppendLine(")");

			return sb.ToString();
		}

		/// <summary>
		/// Generates the ID Table type.
		/// </summary>
		/// <param name="columns">The list of columns in the table.</param>
		/// <returns>The stored procedure SQL.</returns>
		private string GenerateIdTableSql(IList<ColumnDefinition> columns, bool optimistic)
		{
			IEnumerable<ColumnDefinition> keys = columns.Where(c => c.IsKey || c.IsRowVersion);
			ColumnDefinition timestamp = columns.Where(c => c.IsRowVersion).SingleOrDefault();

			VerifyOptimisticTimestamp(optimistic, timestamp);

			// generate the sql for each proc and install them
			StringBuilder sb = new StringBuilder();
			sb.AppendFormat("CREATE TYPE {0}", MakeTableName("IdTable"));
			sb.AppendLine();
			sb.AppendLine("AS TABLE");
			sb.AppendLine("(");
			sb.AppendLine(Join(keys, ",", "{0} {5}"));
			sb.AppendLine(")");

			return sb.ToString();
		}

		/// <summary>
		/// Generates the SelectMany procedure.
		/// </summary>
		/// <param name="columns">The list of columns in the table.</param>
		/// <returns>The stored procedure SQL.</returns>
		private string GenerateSelectManySql(IList<ColumnDefinition> columns)
		{
			IEnumerable<ColumnDefinition> keys = columns.Where(c => c.IsKey);

			string parameterName = _singularTableName;

			// generate the sql for each proc and install them
			StringBuilder sb = new StringBuilder();
			sb.AppendFormat("CREATE PROCEDURE {0} (@{1} {2} READONLY)", MakeProcName("Select", plural: true), parameterName, MakeTableName("IdTable"));
			sb.AppendLine();
			sb.AppendLine("AS");
			sb.AppendFormat("SELECT * FROM {0} AS t", _tableName.SchemaQualifiedTable);
			sb.AppendLine();
			sb.AppendFormat("JOIN @{0} AS s ON", parameterName);
			sb.AppendLine();
			sb.AppendLine("(");
			sb.AppendLine(Join(keys, " AND", "t.{0} = s.{0}"));
			sb.AppendLine(")");

			return sb.ToString();
		}

		/// <summary>
		/// Generates the InsertMany procedure.
		/// </summary>
		/// <param name="columns">The list of columns in the table.</param>
		/// <returns>The stored procedure SQL.</returns>
		private string GenerateInsertManySql(IList<ColumnDefinition> columns)
		{
			IList<ColumnDefinition> outputs = columns.Where(c => c.IsReadOnly || c.IsRowVersion || c.HasDefault).ToList();
			IEnumerable<ColumnDefinition> insertable = columns.Where(c => !c.IsReadOnly);

			string parameterName = _singularTableName;

			// generate the sql for each proc and install them
			StringBuilder sb = new StringBuilder();
			sb.AppendFormat("CREATE PROCEDURE {0} (@{1} {2} READONLY)", MakeProcName("Insert", plural: true), parameterName, MakeTableName("Table"));
			sb.AppendLine();
			sb.AppendLine("AS");
			if (outputs.Any())
			{
				sb.AppendLine(GenerateOutputTable(outputs));
			}
			sb.AppendFormat("INSERT INTO {0}", _tableName.SchemaQualifiedTable);
			sb.AppendLine();
			if (insertable.Any())
			{
				sb.AppendLine("(");
				sb.AppendLine(Join(insertable, ",", "{0}"));
				sb.AppendLine(")");
			}
			if (outputs.Any())
			{
				sb.AppendLine("OUTPUT");
				sb.AppendLine(Join(outputs, ",", "Inserted.{0}"));
				sb.AppendLine("INTO @T");
			}
			sb.AppendLine("SELECT");
			sb.AppendLine(Join(insertable, ",", "{0}"));
			sb.AppendFormat("FROM @{0}", parameterName);
			sb.AppendLine();
			if (outputs.Any())
			{
				sb.AppendLine("SELECT * FROM @T");
			}
			return sb.ToString();
		}

		/// <summary>
		/// Generates the UpdateMany procedure.
		/// </summary>
		/// <param name="columns">The list of columns in the table.</param>
		/// <returns>The stored procedure SQL.</returns>
		private string GenerateUpdateManySql(IList<ColumnDefinition> columns, bool optimistic)
		{
			IEnumerable<ColumnDefinition> keys = columns.Where(c => c.IsKey);
			IEnumerable<ColumnDefinition> updatable = columns.Where(c => !c.IsReadOnly);
			IList<ColumnDefinition> outputs = columns.Where(c => c.IsReadOnly || c.IsRowVersion || c.HasDefault).ToList();
			ColumnDefinition timestamp = columns.Where(c => c.IsRowVersion).SingleOrDefault();

			VerifyOptimisticTimestamp(optimistic, timestamp);

			string parameterName = _singularTableName;

			// generate the sql for each proc and install them
			StringBuilder sb = new StringBuilder();
			sb.AppendFormat("CREATE PROCEDURE {0} (@{1} {2} READONLY)", MakeProcName("Update", plural: true), parameterName, MakeTableName("Table"));
			sb.AppendLine();
			sb.AppendLine("AS");
			if (outputs.Any())
			{
				sb.AppendLine(GenerateOutputTable(outputs));
			}
			if (optimistic)
			{
				sb.AppendLine("BEGIN TRANSACTION; SET XACT_ABORT ON;");
				sb.AppendLine("DECLARE @expected[int]");
				sb.AppendLine(String.Format(CultureInfo.InvariantCulture, "SELECT @expected = COUNT(*) FROM @{0}", parameterName));
			}

			sb.AppendFormat("MERGE INTO {0} AS t", _tableName.SchemaQualifiedTable);
			sb.AppendLine();
			sb.AppendFormat("USING @{0} AS s", parameterName);
			sb.AppendLine();
			sb.AppendLine("ON");
			sb.AppendLine("(");
			sb.AppendLine(Join(keys, " AND", "t.{0} = s.{0}"));
			sb.AppendLine(")");
			if (optimistic)
				sb.AppendLine(String.Format(CultureInfo.InvariantCulture, "WHEN MATCHED AND (t.{0} = s.{0} OR s.{0} IS NULL) THEN UPDATE SET", timestamp.Name));
			else
				sb.AppendLine("WHEN MATCHED THEN UPDATE SET");
			sb.AppendLine(Join(updatable, ",", "t.{0} = s.{0}"));
			if (outputs.Any())
			{
				sb.AppendLine("OUTPUT");
				sb.AppendLine(Join(outputs, ",", "Inserted.{0}"));
				sb.AppendLine("INTO @T");
			}
			sb.AppendLine(";");

			if (optimistic)
			{
				sb.AppendLine(GetConcurrencyCheck("@expected", true));
				sb.AppendLine("COMMIT");
			}
			if (outputs.Any())
			{
				sb.AppendLine("SELECT * FROM @T");
			}
			return sb.ToString();
		}

		/// <summary>
		/// Generates the UpsertMany procedure.
		/// </summary>
		/// <param name="columns">The list of columns in the table.</param>
		/// <returns>The stored procedure SQL.</returns>
		private string GenerateUpsertManySql(IList<ColumnDefinition> columns, bool optimistic)
		{
			IEnumerable<ColumnDefinition> keys = columns.Where(c => c.IsKey);
			IEnumerable<ColumnDefinition> updatable = columns.Where(c => !c.IsKey && !c.IsReadOnly);
			IEnumerable<ColumnDefinition> insertable = columns.Where(c => !c.IsReadOnly);
			IList<ColumnDefinition> outputs = columns.Where(c => c.IsReadOnly || c.IsRowVersion || c.HasDefault).ToList();
			ColumnDefinition timestamp = columns.Where(c => c.IsRowVersion).SingleOrDefault();

			VerifyOptimisticTimestamp(optimistic, timestamp);

			string parameterName = _singularTableName;

			// generate the sql for each proc and install them
			StringBuilder sb = new StringBuilder();
			sb.AppendFormat("CREATE PROCEDURE {0} (@{1} {2} READONLY)", MakeProcName("Upsert", plural: true), parameterName, MakeTableName("Table"));
			sb.AppendLine();
			sb.AppendLine("AS");
			if (outputs.Any())
			{
				sb.AppendLine(GenerateOutputTable(outputs, addRowNumber: true));
			}
			if (optimistic)
			{
				sb.AppendLine("BEGIN TRANSACTION; SET XACT_ABORT ON;");
				sb.AppendLine("DECLARE @expected[int]");
				sb.AppendLine(String.Format(CultureInfo.InvariantCulture, "SELECT @expected = COUNT(*) FROM @{0}", parameterName));
			}

			sb.AppendFormat("MERGE INTO {0} AS t", _tableName.SchemaQualifiedTable);
			sb.AppendLine();
			sb.AppendFormat("USING (SELECT *, [_insight_rownumber] = ROW_NUMBER() OVER (ORDER BY (SELECT 1)) FROM @{0}) AS s", parameterName);
			sb.AppendLine();
			sb.AppendLine("ON");
			sb.AppendLine("(");
			sb.AppendLine(Join(keys, " AND", "t.{0} = s.{0}"));
			sb.AppendLine(")");
			if (updatable.Any())
			{
				if (optimistic)
					sb.AppendLine(String.Format(CultureInfo.InvariantCulture, "WHEN MATCHED AND (t.{0} = s.{0} OR s.{0} IS NULL) THEN UPDATE SET", timestamp.Name));
				else
					sb.AppendLine("WHEN MATCHED THEN UPDATE SET");
				sb.AppendLine(Join(updatable, ",", "t.{0} = s.{0}"));
			}
			if (insertable.Any())
			{
				sb.AppendLine("WHEN NOT MATCHED BY TARGET THEN INSERT");
				sb.AppendLine("(");
				sb.AppendLine(Join(insertable, ",", "{0}"));
				sb.AppendLine(")");
				sb.AppendLine("VALUES");
				sb.AppendLine("(");
				sb.AppendLine(Join(insertable, ",", "s.{0}"));
				sb.AppendLine(")");
			}
			if (outputs.Any())
			{
				sb.AppendLine("OUTPUT");
				sb.AppendLine(Join(outputs, ",", "Inserted.{0}"));
				sb.AppendLine(", s.[_insight_rownumber]");
				sb.AppendLine("INTO @T");
			}
			sb.AppendLine(";");

			if (optimistic)
			{
				sb.AppendLine(GetConcurrencyCheck("@expected", true));
				sb.AppendLine("COMMIT");
			}
			if (outputs.Any())
			{
				sb.AppendLine("SELECT ");
				sb.AppendLine(Join(outputs, ",", "{0}"));
				sb.AppendLine("FROM @T ORDER BY [_insight_rownumber]");
			}
			return sb.ToString();
		}

		/// <summary>
		/// Generates the DeleteMany procedure.
		/// </summary>
		/// <param name="columns">The list of columns in the table.</param>
		/// <returns>The stored procedure SQL.</returns>
		private string GenerateDeleteManySql(IList<ColumnDefinition> columns, bool optimistic)
		{
			IEnumerable<ColumnDefinition> keys = columns.Where(c => c.IsKey);
			ColumnDefinition timestamp = columns.Where(c => c.IsRowVersion).SingleOrDefault();

			VerifyOptimisticTimestamp(optimistic, timestamp);

			string parameterName = _singularTableName;

			// generate the sql for each proc and install them
			StringBuilder sb = new StringBuilder();
			sb.AppendFormat("CREATE PROCEDURE {0} (@{1} {2} READONLY)", MakeProcName("Delete", plural: true), parameterName, MakeTableName("IdTable"));
			sb.AppendLine();
			sb.AppendLine("AS");

			if (optimistic)
			{
				sb.AppendLine("BEGIN TRANSACTION; SET XACT_ABORT ON;");
				sb.AppendLine("DECLARE @expected[int]");
				sb.AppendLine(String.Format(CultureInfo.InvariantCulture, "SELECT @expected = COUNT(*) FROM @{0}", parameterName));
			}

			sb.AppendFormat("DELETE FROM {0}", _tableName.SchemaQualifiedTable);
			sb.AppendLine();
			sb.AppendFormat("\tFROM {0} AS t", _tableName.SchemaQualifiedTable);
			sb.AppendLine();
			sb.AppendFormat("JOIN @{0} AS s ON", parameterName);
			sb.AppendLine();
			sb.AppendLine("(");
			sb.AppendLine(Join(keys, " AND", "t.{0} = s.{0}"));
			if (optimistic)
				sb.AppendLine(Join(timestamp, " AND", " AND (t.{0} = s.{0} OR s.{0} IS NULL)"));
			sb.AppendLine(")");

			if (optimistic)
			{
				sb.AppendLine(GetConcurrencyCheck("@expected", true));
				sb.AppendLine("COMMIT");
			}

			return sb.ToString();
		}
		#endregion

		#region Find Sql
		/// <summary>
		/// Generates the Find procedure.
		/// </summary>
		/// <param name="columns">The list of columns in the table.</param>
		/// <returns>The stored procedure SQL.</returns>
		private string GenerateFindSql(IList<ColumnDefinition> columns)
		{
		    string parameterName = _singularTableName;
		    const string cteName = "_insightcte";
			const string tempTableName = "#_insighttemp";
			const string countColumnName = "_insightTotalRows";

			// generate the sql for each proc and install them
			StringBuilder sb = new StringBuilder();
			sb.AppendFormat("CREATE PROCEDURE {0}", MakeProcName("Find", plural: true));
			sb.AppendLine();
			sb.AppendLine("(");
			sb.Append(Join(columns, ",", "{1} {2} = NULL"));
			sb.AppendLine(",");
			sb.AppendLine("\t@Top [int] = NULL,");
			sb.AppendLine("\t@Skip [int] = NULL,");
			sb.AppendLine("\t@OrderBy [nvarchar](256) = NULL,");
			sb.AppendLine("\t@ThenBy [nvarchar](256) = NULL,");
			sb.AppendLine("\t@TotalRows [int] = NULL OUTPUT,");
			sb.AppendLine(Join(columns, ",", "{1}Operator [varchar](10) = '='"));
			sb.AppendLine(")");
			if (_executeAsOwner)
				sb.AppendLine("WITH EXECUTE AS OWNER");
			sb.AppendLine("AS");
			sb.AppendLine("SET NOCOUNT ON");
			sb.AppendFormat("DECLARE @sql [nvarchar](MAX) = ';WITH {0} AS (SELECT '", cteName);
            sb.AppendLine();
			sb.AppendLine("\tIF @Top IS NOT NULL AND @Skip IS NULL SET @sql = @sql + 'TOP (@Top) '");
			sb.AppendFormat("SET @sql = @sql + ' * FROM {0} WHERE 1=1'", _tableName.SchemaQualifiedTable);
			sb.AppendLine();

			// handle where clauses
			sb.AppendLine(Join(columns, "", "SELECT @sql = @sql + CASE\r\n\tWHEN {1}Operator IN ('=', '<', '>', '<=', '>=', '<>', 'LIKE') AND {1} IS NOT NULL THEN ' AND {0} ' + {1}Operator + ' {1}'" +
				"\r\n\tWHEN {1}Operator IN ('IS NULL', 'IS NOT NULL') THEN ' AND {0} ' + {1}Operator" +
				"\r\n\tWHEN {1}Operator IS NOT NULL AND {1} IS NOT NULL THEN ' OPERATOR NOT SUPPORTED ON {0} '" +
				"\r\n\tELSE ''" +
				"\r\n\tEND"));

            // close the cte; begin select from cte
		    sb.AppendLine("SET @sql = @sql + ') select * '");

            // handle total column
		    sb.AppendFormat("IF @TotalRows IS NOT NULL SET @sql = @sql + ', {1}=count(*) over() INTO {0}'", tempTableName, countColumnName);
			sb.AppendLine();

            // finish select from cte
		    sb.AppendFormat("SET @sql = @sql + ' FROM {0} '", cteName);
            sb.AppendLine();

			// handle order by
			sb.AppendLine("IF @OrderBy IS NOT NULL SET @sql = @sql + ' ORDER BY ' + CASE WHEN @OrderBy IN (");
			sb.AppendLine(Join(columns, ",", "'{0}', '{0} DESC'"));
			sb.AppendLine(") THEN @OrderBy ELSE ' ORDER BY INVALID COLUMN ' END");
			sb.AppendLine("IF @OrderBy IS NOT NULL AND @ThenBy IS NOT NULL SET @sql = @sql + CASE WHEN @ThenBy IN (");
			sb.AppendLine(Join(columns, ",", "'{0}', '{0} DESC'"));
			sb.AppendLine(") THEN ',' + @ThenBy ELSE ' ORDER BY INVALID COLUMN ' END");

			// handle top/skip -> offset/fetch
			// if skip is specified, convert TOP to OFFSET
			// if order by is not specified, then order by the first column
			sb.AppendLine("IF @Skip IS NOT NULL BEGIN");
			sb.AppendLine("\tIF @OrderBy IS NULL SET @sql = @sql + ' ORDER BY 1'");
			sb.AppendLine("\tSET @sql = @sql + ' OFFSET @Skip ROWS'");
			sb.AppendLine("\tIF @Top IS NOT NULL SET @sql = @sql + ' FETCH NEXT @Top ROWS ONLY'");
			sb.AppendLine("END");

			// if there is a total column, then we need to pull out the data
			sb.AppendFormat("IF @TotalRows IS NOT NULL SET @sql = @sql + ' SELECT * FROM {0} SET NOCOUNT ON SELECT TOP 1 @TotalRows={1} FROM {0} '", tempTableName, countColumnName);
			sb.AppendLine();

			sb.AppendLine("EXEC sp_executesql @sql, N'@Top [int],@Skip [int],@TotalRows [int] OUTPUT,");
			sb.AppendLine(Join(columns, ",", "{1} {2}"));
			sb.AppendLine("', @Top=@Top,@Skip=@Skip,@TotalRows=@TotalRows OUTPUT,");
			sb.AppendLine(Join(columns, ",", "{1}={1}"));

			return sb.ToString();
		}
		#endregion

		#region Proc Name Methods
        /// <summary>
        /// Determines if we are generating all types of procs with this autoproc.
        /// </summary>
        /// <returns></returns>
        private bool IsAllProcs
        {
            get { return MoreThanOneBitIsSet((int)_type); }
        }

		/// <summary>
		/// Make a procedure name for a given type of procedure.
		/// </summary>
		/// <param name="type">The type of procedure to make.</param>
		/// <returns>The name of the procedure.</returns>
		private string MakeProcName(string type, bool plural)
		{
            var objectName = plural ? _pluralTableName : _singularTableName;

			// use the user-specified name or make one from the type
            // params 1&2 are the same for backward compabitility
            return SqlParser.FormatSqlName(_tableName.Schema,
                    String.Format(Name ?? (plural ? "{0}{1}" : "{0}{2}"),
                type,
                IsAllProcs ? objectName : _pluralTableName,
                IsAllProcs ? objectName : _singularTableName));
		}

		/// <summary>
		/// Make a type type name.
		/// </summary>
		/// <param name="type">The type of table to make.</param>
		/// <returns>The name of the table.</returns>
		private string MakeTableName(string type)
		{
			string basename = null;

			if (_type.ToString() == type)
				basename = Name;
			else if (type == "Table")
				basename = _tvpName;
			else if (type == "IdTable")
				basename = _idtvpName;

			// use the user-specified name or make one from the type
			return SqlParser.FormatSqlName(_tableName.Schema,
				String.Format(basename ?? "{1}{0}",
				type,
				_tableName.Table));
		}

		/// <summary>
		/// Make a drop statement for a given type of procedure.
		/// </summary>
		/// <param name="type">The type of procedure to make.</param>
		/// <param name="plural">True to generate the name with a plural number of objects.</param>
		/// <returns>The Drop statement.</returns>
		private string MakeDropStatment(string type, bool plural)
		{
			return String.Format(CultureInfo.InvariantCulture, "IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'{0}') AND type in (N'P', N'PC')) DROP PROCEDURE {0}", MakeProcName(type, plural));
		}

		/// <summary>
		/// Make a drop statement for a table type.
		/// </summary>
		/// <param name="tableName">The name of the table to drop.</param>
		/// <returns>The Drop statement.</returns>
		private string MakeTableDropStatment(string tableName)
		{
			var sqlName = new SqlName(MakeTableName(tableName), 2);
			return String.Format(CultureInfo.InvariantCulture, @"
				IF EXISTS (SELECT * FROM sys.types st JOIN sys.schemas ss ON st.schema_id = ss.schema_id WHERE ss.name = N'{1}' AND st.name = N'{2}')
					DROP TYPE {0}", sqlName.SchemaQualifiedObject, sqlName.Schema, sqlName.Object);
		}
		#endregion

		#region Drop Methods
		/// <summary>
		/// Return the Sql to drop the autoproc.
		/// </summary>
		public string DropSql
		{
			get
			{
				string sql = "";
				if (_type.HasFlag(ProcTypes.Select)) sql += MakeDropStatment("Select", plural: false) + _batchDivider;
				if (_type.HasFlag(ProcTypes.Insert)) sql += MakeDropStatment("Insert", plural: false) + _batchDivider;
				if (_type.HasFlag(ProcTypes.Update)) sql += MakeDropStatment("Update", plural: false) + _batchDivider;
				if (_type.HasFlag(ProcTypes.Upsert)) sql += MakeDropStatment("Upsert", plural: false) + _batchDivider;
				if (_type.HasFlag(ProcTypes.Delete)) sql += MakeDropStatment("Delete", plural: false) + _batchDivider;
				if (_type.HasFlag(ProcTypes.SelectMany)) sql += MakeDropStatment("Select", plural: true) + _batchDivider;
				if (_type.HasFlag(ProcTypes.InsertMany)) sql += MakeDropStatment("Insert", plural: true) + _batchDivider;
				if (_type.HasFlag(ProcTypes.UpdateMany)) sql += MakeDropStatment("Update", plural: true) + _batchDivider;
				if (_type.HasFlag(ProcTypes.UpsertMany)) sql += MakeDropStatment("Upsert", plural: true) + _batchDivider;
				if (_type.HasFlag(ProcTypes.DeleteMany)) sql += MakeDropStatment("Delete", plural: true) + _batchDivider;
				if (_type.HasFlag(ProcTypes.Find)) sql += MakeDropStatment("Find", plural: true) + _batchDivider;

				if (_type.HasFlag(ProcTypes.Table)) sql += MakeTableDropStatment("Table") + _batchDivider;
				if (_type.HasFlag(ProcTypes.IdTable)) sql += MakeTableDropStatment("IdTable") + _batchDivider;

				return sql;
			}
		}
		#endregion

		#region Helper Functions
		/// <summary>
		/// Creates a column list with the specified divider and template.
		/// </summary>
		/// <param name="columns">The columns to emit.</param>
		/// <param name="divider">The divider to use for the columns.</param>
		/// <param name="template">The template to use for each column.</param>
		/// <returns>The delimited list of column names.</returns>
		private static string Join(IEnumerable<ColumnDefinition> columns, string divider, string template)
		{
			return String.Join(divider + Environment.NewLine, columns.Select(col => String.Format(CultureInfo.InvariantCulture, "\t" + template, 
				col.ColumnName, 
				col.ParameterName, 
				col.SqlType, 
				(col.IsUpdateNullable || col.IsIdentity) ? "NULL" : "NOT NULL",
				col.IsUpdateNullable ? " = NULL" : "",
				col.IsRowVersion ? "binary(8)" : col.SqlType)));
		}

		private static string Join(ColumnDefinition column, string divider, string template)
		{
			var columns = new List<ColumnDefinition>();
			columns.Add(column);
			return Join(columns, divider, template);
		}

		/// <summary>
		/// Generates the sql for a concurrency check.
		/// </summary>
		/// <param name="expectedCount">A string representing the expected number of affected records.</param>
		/// <param name="doRollback">True to rollback the current transaction before throwing the error.</param>
		/// <returns>The SQL for the concurrency check.</returns>
		private static string GetConcurrencyCheck(string expectedCount, bool doRollback)
		{
			StringBuilder sb = new StringBuilder();
			sb.AppendFormat("IF @@ROWCOUNT <> {0}", expectedCount);
			if (doRollback)
				sb.AppendFormat(CultureInfo.InvariantCulture, " BEGIN ROLLBACK");
			sb.AppendFormat(" RAISERROR('{0}', 16, 1)", _concurrencyError);
			if (doRollback)
				sb.Append(" END");

			return sb.ToString();
		}

		/// <summary>
		/// Verifies that if the proc is optimistic, then there is a timestamp column.
		/// </summary>
		/// <param name="optimistic">True if it is an optimistic proc.</param>
		/// <param name="timestamp">The timestamp column if there is one.	</param>
		private void VerifyOptimisticTimestamp(bool optimistic, ColumnDefinition timestamp)
		{
			if (optimistic && timestamp == null)
				throw new SchemaException(String.Format(CultureInfo.InvariantCulture, "Cannot find a timestamp column on Table {0} for concurrency checking", _tableName));
		}
		#endregion

		#region Private Classes
		/// <summary>
		/// The types of stored procedures that we support.
		/// </summary>
		[Flags]
		public enum ProcTypes
		{
			Table = 1 << 0,
			IdTable = 1 << 1,
			Select = 1 << 2,
			Insert = 1 << 3,
			Update = 1 << 4,
			Upsert = 1 << 5,
			Delete = 1 << 6,
			SelectMany = 1 << 7,
			InsertMany = 1 << 8,
			UpdateMany = 1 << 9,
			UpsertMany = 1 << 10,
			DeleteMany = 1 << 11,
			Find = 1 << 12,

			Optimistic = 1 << 31,

			All =
				Table | IdTable |
				Select | Insert | Update | Upsert | Delete |
				SelectMany | InsertMany | UpdateMany | UpsertMany | DeleteMany |
				Find
		}
		#endregion

		/// <summary>
		/// Determines whether more than one bit is set in an int.
		/// </summary>
		private static bool MoreThanOneBitIsSet(int x)
		{
			int rightmostbit = x & (-x);
			x &= ~rightmostbit;
			return x != 0;
		}
	}
}
