using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
// using Insight.Database.Schema.Properties;

namespace Insight.Database.Schema
{
	#region SqlParserClass
	/// <summary>
	/// A parser that detects the type and name of a sql object from a script.
	/// </summary>
	internal class SqlParser
	{
		#region List of Parser Templates
		/// <summary>
		/// Initializes the list of SQL parsers.
		/// </summary>
		[System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1810:InitializeReferenceTypeStaticFieldsInline"), System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2241:Provide correct arguments to formatting methods")]
		static SqlParser()
		{
			List<SqlParser> parsers = new List<SqlParser>();
			parsers.Add(new SqlParser(SchemaObjectType.IndexedView, String.Format(CultureInfo.InvariantCulture, @"--\s*INDEXEDVIEW.+CREATE\s+VIEW\s+(?<name>{0})", SqlNameExpression)));
			parsers.Add(new SqlParser(SchemaObjectType.UserPreScript, String.Format(CultureInfo.InvariantCulture, @"--\s*PRESCRIPT\s+(?<name>{0})", SqlNameExpression)));
			parsers.Add(new SqlParser(SchemaObjectType.UserScript, String.Format(CultureInfo.InvariantCulture, @"--\s*SCRIPT\s+(?<name>{0})", SqlNameExpression)));
			parsers.Add(new SqlParser(SchemaObjectType.UserDefinedType, String.Format(CultureInfo.InvariantCulture, @"CREATE\s+TYPE\s+(?<name>{0})", SqlNameExpression)));
			parsers.Add(new SqlParser(SchemaObjectType.UserDefinedType, String.Format(CultureInfo.InvariantCulture, @"EXEC(UTE)?\s+sp_addtype\s+'?(?<name>{0})'?", SqlNameExpression)));
			parsers.Add(new SqlParser(SchemaObjectType.MasterKey, String.Format(CultureInfo.InvariantCulture, @"CREATE\s+MASTER\s+KEY\s+(?<name>{0})", SqlNameExpression)));
			parsers.Add(new SqlParser(SchemaObjectType.Certificate, String.Format(CultureInfo.InvariantCulture, @"CREATE\s+CERTIFICATE\s+(?<name>{0})", SqlNameExpression)));
			parsers.Add(new SqlParser(SchemaObjectType.SymmetricKey, String.Format(CultureInfo.InvariantCulture, @"CREATE\s+SYMMETRIC\s+KEY\s+(?<name>{0})", SqlNameExpression)));
			parsers.Add(new SqlParser(SchemaObjectType.PartitionFunction, String.Format(CultureInfo.InvariantCulture, @"CREATE\s+PARTITION\s+FUNCTION\s+(?<name>{0})", SqlNameExpression)));
			parsers.Add(new SqlParser(SchemaObjectType.PartitionScheme, String.Format(CultureInfo.InvariantCulture, @"CREATE\s+PARTITION\s+SCHEME\s+(?<name>{0})", SqlNameExpression)));
			parsers.Add(new SqlParser(SchemaObjectType.MessageType, String.Format(CultureInfo.InvariantCulture, @"CREATE\s+MESSAGE TYPE\s+(?<name>{0})", SqlNameExpression)));
			parsers.Add(new SqlParser(SchemaObjectType.Contract, String.Format(CultureInfo.InvariantCulture, @"CREATE\s+CONTRACT\s+(?<name>{0})", SqlNameExpression)));
			parsers.Add(new SqlParser(SchemaObjectType.BrokerPriority, String.Format(CultureInfo.InvariantCulture, @"CREATE\s+BROKER\s+PRIORITY\s+(?<name>{0})", SqlNameExpression)));
			parsers.Add(new SqlParser(SchemaObjectType.Queue, String.Format(CultureInfo.InvariantCulture, @"CREATE\s+QUEUE\s+(?<name>{0})", SqlNameExpression)));
			parsers.Add(new SqlParser(SchemaObjectType.Service, String.Format(CultureInfo.InvariantCulture, @"CREATE\s+SERVICE\s+(?<name>{0})", SqlNameExpression)));
			parsers.Add(new SqlParser(SchemaObjectType.Table, String.Format(CultureInfo.InvariantCulture, @"CREATE\s+TABLE\s+(?<name>{0})", SqlNameExpression)));
			parsers.Add(new SqlParser(SchemaObjectType.Trigger, String.Format(CultureInfo.InvariantCulture, @"CREATE\s+TRIGGER\s+(?<name>{0})", SqlNameExpression)));
			parsers.Add(new SqlParser(SchemaObjectType.Index, String.Format(CultureInfo.InvariantCulture, @"CREATE\s+(UNIQUE\s+)?(((CLUSTERED)|(NONCLUSTERED))\s+)?INDEX\s+(?<indname>{0})\s+ON\s+(?<tablename>{0})", SqlNameExpression), "$2.$1"));
			parsers.Add(new SqlParser(SchemaObjectType.View, String.Format(CultureInfo.InvariantCulture, @"CREATE\s+VIEW\s+(?<name>{0})", SqlNameExpression)));
			parsers.Add(new SqlParser(SchemaObjectType.StoredProcedure, String.Format(CultureInfo.InvariantCulture, @"CREATE\s+PROC(EDURE)?\s+(?<name>{0})", SqlNameExpression)));
			parsers.Add(new SqlParser(SchemaObjectType.Permission, String.Format(CultureInfo.InvariantCulture, @"GRANT\s+(?<permission>\w+(\s*,\s*\w+)*)\s+ON\s+(?<name>{0})\s+TO\s+(?<grantee>{0})", SqlNameExpression), "$1 ON $2 TO $3"));
			parsers.Add(new SqlParser(SchemaObjectType.PrimaryKey, String.Format(CultureInfo.InvariantCulture, @"ALTER\s+TABLE\s+(?<tablename>{0})\s+(WITH\s+(NO)?CHECK\s+)?ADD\s+CONSTRAINT\s*\(?(?<name>{0})\)?\s+PRIMARY\s+", SqlNameExpression), "$1.$2"));
			parsers.Add(new SqlParser(SchemaObjectType.ForeignKey, String.Format(CultureInfo.InvariantCulture, @"ALTER\s+TABLE\s+(?<tablename>{0})\s+(WITH\s+(NO)?CHECK\s+)?ADD\s+CONSTRAINT\s*\(?(?<name>{0})\)?\s+FOREIGN\s+KEY\s*\(?(?<name>{0})\)?", SqlNameExpression), "$1.$2"));
			parsers.Add(new SqlParser(SchemaObjectType.Constraint, String.Format(CultureInfo.InvariantCulture, @"ALTER\s+TABLE\s+(?<tablename>{0})\s+(WITH\s+(NO)?CHECK\s+)?ADD\s+((CHECK\s+)?CONSTRAINT)\s*\(?(?<name>{0})\)?", SqlNameExpression), "$1.$2"));
            parsers.Add(new SqlParser(SchemaObjectType.Default, String.Format(CultureInfo.InvariantCulture, @"ALTER\s+TABLE\s+(?<tablename>{0})\s+ADD\s+(CONSTRAINT\s+(?<name>{0})\s+)?DEFAULT\s*\(?.*\)?FOR\s+(?<column>{0})", SqlNameExpression), "$1.$3"));
			parsers.Add(new SqlParser(SchemaObjectType.Function, String.Format(CultureInfo.InvariantCulture, @"CREATE\s+FUNCTION\s+(?<name>{0})", SqlNameExpression)));
			parsers.Add(new SqlParser(SchemaObjectType.PrimaryXmlIndex, String.Format(CultureInfo.InvariantCulture, @"CREATE\s+PRIMARY\s+XML\s+INDEX\s+(?<name>{0})\s+ON\s+(?<tablename>{0})", SqlNameExpression), "$2.$1"));
			parsers.Add(new SqlParser(SchemaObjectType.SecondaryXmlIndex, String.Format(CultureInfo.InvariantCulture, @"CREATE\s+XML\s+INDEX\s+(?<name>{0})\s+ON\s+(?<tablename>{0})", SqlNameExpression), "$2.$1"));
			parsers.Add(new SqlParser(SchemaObjectType.Login, String.Format(CultureInfo.InvariantCulture, @"CREATE\s+LOGIN\s+(?<name>{0})", SqlNameExpression), "$1"));
			parsers.Add(new SqlParser(SchemaObjectType.User, String.Format(CultureInfo.InvariantCulture, @"CREATE\s+USER\s+(?<name>{0})", SqlNameExpression)));
			parsers.Add(new SqlParser(SchemaObjectType.Role, String.Format(CultureInfo.InvariantCulture, @"CREATE\s+ROLE\s+(?<name>{0})", SqlNameExpression)));
			parsers.Add(new SqlParser(SchemaObjectType.Schema, String.Format(CultureInfo.InvariantCulture, @"CREATE\s+SCHEMA\s+(?<name>{0})", SqlNameExpression)));
			parsers.Add(new SqlParser(SchemaObjectType.Unused, String.Format(CultureInfo.InvariantCulture, @"SET\s+ANSI_NULLS", SqlNameExpression), null));
			parsers.Add(new SqlParser(SchemaObjectType.Unused, String.Format(CultureInfo.InvariantCulture, @"SET\s+QUOTED_IDENTIFIER", SqlNameExpression), null));
			parsers.Add(new SqlParser(SchemaObjectType.Unused, String.Format(CultureInfo.InvariantCulture, @"SET\s+ARITHABORT", SqlNameExpression), null));
			parsers.Add(new SqlParser(SchemaObjectType.Unused, String.Format(CultureInfo.InvariantCulture, @"SET\s+CONCAT_NULL_YIELDS_NULL", SqlNameExpression), null));
			parsers.Add(new SqlParser(SchemaObjectType.Unused, String.Format(CultureInfo.InvariantCulture, @"SET\s+ANSI_PADDING", SqlNameExpression), null));
			parsers.Add(new SqlParser(SchemaObjectType.Unused, String.Format(CultureInfo.InvariantCulture, @"SET\s+ANSI_WARNINGS", SqlNameExpression), null));
			parsers.Add(new SqlParser(SchemaObjectType.Unused, String.Format(CultureInfo.InvariantCulture, @"SET\s+NUMERIC_ROUNDABORT", SqlNameExpression), null));
			parsers.Add(new SqlParser(SchemaObjectType.Script, String.Format(CultureInfo.InvariantCulture, @"ALTER\s+TABLE\s+(?<tablename>{0})\s+(WITH\s+(NO)?CHECK\s+)?(?!ADD\s+)(((CHECK\s+)?CONSTRAINT)|(DEFAULT))\s*\(?(?<name>{0})\)?", SqlNameExpression), "SCRIPT $1.$2"));
			parsers.Add(new SqlParser(SchemaObjectType.AutoProc, AutoProc.AutoProcRegexString, "$0"));

			// make sure that they are sorted in the order of likelihood
			parsers.Sort((p1, p2) => p1.SchemaObjectType.CompareTo(p2.SchemaObjectType));
			Parsers = new ReadOnlyCollection<SqlParser>(parsers);

            // make a list of SQL that we do NOT support
            List<SqlParser> unsupportedSql = new List<SqlParser>();
			unsupportedSql.Add(new SqlParser(SchemaObjectType.Unsupported, String.Format(CultureInfo.InvariantCulture, @"ALTER\s+TABLE\s+(?<tablename>{0}).+ADD\s+(CONSTRAINT\s+)?((CHECK\s*\()|(PRIMARY KEY)|(FOREIGN KEY))", SqlNameExpression), "$1 : Unnamed CONSTRAINTs are not supported"));
            unsupportedSql.Add(new SqlParser(SchemaObjectType.Unsupported, String.Format(CultureInfo.InvariantCulture, @"CREATE\s+TABLE\s+(?<tablename>{0}).+(CONSTRAINT\s+)?((CHECK\s*\()|(PRIMARY KEY)|(FOREIGN KEY))", SqlNameExpression), "$1 : Inline CONSTRAINTs are not supported"));
            UnsupportedSql = new ReadOnlyCollection<SqlParser>(unsupportedSql); 
		}

        /// <summary>
        /// The parsers used to detect the type of SQL.
        /// </summary>
		internal static readonly ReadOnlyCollection<SqlParser> Parsers;

        /// <summary>
        /// The parsers used to detect SQL that we don't support.
        /// </summary>
        internal static readonly ReadOnlyCollection<SqlParser> UnsupportedSql;

		/// <summary>
		/// Matches a SQL name in the form [a].[b].[c], or "a"."b"."c" or a.b.c (or any combination)
		/// Also: TYPE :: sqlname for global scoping
		/// </summary>
		internal const string SqlNameExpression = @"([\w\d]+\s*::\s*)?((\[[^\]]+\]|[\w\d]+)\.){0,2}((\[[^\]]+\]|[\w\d]+))";
		#endregion

		#region Constructors
		/// <summary>
		/// Create a parser that detects a type from a pattern
		/// </summary>
		/// <param name="type">The type represented by the pattern</param>
		/// <param name="pattern">The pattern to detect</param>
		/// <param name="nameTemplate">The string used to generate the resulting name</param>
		public SqlParser(SchemaObjectType type, string pattern, string nameTemplate = "$1")
		{
			// NOTE: don't use compiled regex here. the expressions are too complicated for the 64-bit JIT and it takes 10x more time. really.
			SchemaObjectType = type;
			_regex = new Regex(pattern, RegexOptions.IgnoreCase | RegexOptions.Singleline | RegexOptions.ExplicitCapture);
			_nameTemplate = nameTemplate;
		}
		#endregion

		internal class SqlParserMatch
		{
			public SchemaObjectType SchemaObjectType;
			public string Name;
			public int Position;
		}

		#region Match Methods
		/// <summary>
		/// Attempts to match the sql to the pattern. If successful, sets the type and name
		/// </summary>
		/// <param name="sql">The sql to parse</param>
		/// <param name="type">If matched, updated to the current type</param>
		/// <param name="name">If matched, updated to the name</param>
		/// <returns></returns>
		public SqlParserMatch Match(string sql)
		{
			Match match = _regex.Match(sql);
			if (match.Success)
			{
				SqlParserMatch parserMatch = new SqlParserMatch() 
				{ 
					SchemaObjectType = this.SchemaObjectType,
					Position = match.Index
				};

				// for the unused crud, there is no additional parsing.
				if (SchemaObjectType != Schema.SchemaObjectType.Unused)
				{
					string name = match.Result(_nameTemplate);

					// return a match
					parserMatch.Name = name;
				}

				return parserMatch;
			}

			return null;
		}
		#endregion

		#region Utility Formatting Methods
		/// <summary>
		/// Get the name of a SqlObject without owner and schema, and unformat the name
		/// </summary>
		/// <remarks>[dbo]..[foo] returns foo</remarks>
		/// <param name="name">The full name to clean up</param>
		/// <returns>The unformatted object name</returns>
		internal static string UnformatSqlName(string name)
		{
			if (name == null)
				return null;

			if (name.StartsWith("[") && name.EndsWith("]"))
				return name.Substring(1, name.Length - 2);

			return name;
		}

		/// <summary>
		/// Format a Sql Name to escape it out properly;
		/// </summary>
		/// <param name="name">The name to escape</param>
		/// <returns>The escaped name</returns>
		internal static string FormatSqlName(string name)
		{
			if (name == null)
				return null;

			if (!name.StartsWith("[") || !name.EndsWith("]"))
				return "[" + name + "]";

			return name;
		}

		/// <summary>
		/// Format a Sql Name to escape it out properly;
		/// </summary>
		/// <param name="name">The name to escape</param>
		/// <param name="name2">The name to escape</param>
		/// <returns>The escaped name</returns>
		internal static string FormatSqlName(string name, string name2)
		{
			return String.Format(CultureInfo.InvariantCulture, "[{0}].[{1}]", UnformatSqlName(name), UnformatSqlName(name2));
		}

		/// <summary>
		/// The divider between pieces of a sql name
		/// </summary>
		private const char _sqlNameDivider = '.';

		/// <summary>
		/// The divider between pieces of a sql name
		/// </summary>
		private const string _sqlNameDividerString = ".";

		/// <summary>
		/// Defines a SQL Type Prefix.
		/// </summary>
		private static readonly Regex _sqlTypePrefixRegex = new Regex(@"^\[?\w+\]?::");

		/// <summary>
		/// Matches characters used to escape a sql name
		/// </summary>
		private static readonly Regex _sqlNameCharactersRegex = new Regex(@"[\[\]\""]");

		/// <summary>
		/// Makes sure that a name of a schema object does not contain any insecure characters.
		/// </summary>
		/// <param name="name">The name to check</param>
		/// <exception cref="ArgumentException">If a parameter contains an invalid SQL character</exception>
		/// <exception cref="ArgumentNullException">If the name is null</exception>
		internal static void AssertValidSqlName(string name)
		{
			if (name == null)
				throw new ArgumentNullException("name");
			if (name.Length == 0 || name.IndexOfAny(_insecureSqlChars) >= 0)
				throw new ArgumentException(String.Format(CultureInfo.CurrentCulture, Insight.Database.Schema.Properties.Resources.InvalidSqlObjectName, name));
		}

		/// <summary>
		/// Characters that could cause bad sql things to happen
		/// </summary>
		/// <remarks>
		///     -   can create a comment
		///     ;   can end a statement
		///     '   can end a string
		///     "   can end a string
		/// </remarks>
		private static readonly char[] _insecureSqlChars = new char[] { '-', ';', '\'' };
		#endregion

		#region Private Members
		/// <summary>
		/// The expression pattern to match
		/// </summary>
		private Regex _regex;

		/// <summary>
		/// The corresponding object type
		/// </summary>
		public SchemaObjectType SchemaObjectType { get; private set; }

		/// <summary>
		/// The string used to generate the name from the match
		/// </summary>
		private string _nameTemplate;
		#endregion
	}
	#endregion
}
