#region Using directives

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Reflection;
using System.Collections.ObjectModel;
using System.Globalization;
using System.Data.SqlClient;
using System.Data.Common;

#endregion

namespace Insight.Database.Schema
{
    #region Schema Class
    /// <summary>
    /// Contains a set of SchemaObjects
    /// </summary>
    public class SchemaObjectCollection : Collection <SchemaObject>
    {
        #region Constructors
        /// <summary>
        /// Create an empty schema for manual editing
        /// </summary>
        public SchemaObjectCollection ()
        {
        }

        /// <summary>
        /// Load a schema from a file
        /// </summary>
        /// <param name="fileName">The name of the file to load</param>
		/// <param name="stripPrintStatements">True to automatically strip print statements from scripts as they are loaded.</param>
        /// <exception cref="FileNotFoundException">If the file canont be found</exception>
        /// <exception cref="ArgumentNullException">If fileName is null</exception>
        /// <exception cref="SchemaParsingException">If the schema file cannot be parsed</exception>
        public SchemaObjectCollection (string fileName, bool stripPrintStatements = false)
        {
			StripPrintStatements = stripPrintStatements;

            Load (fileName);
        }

		/// <summary>
		/// Load a schema from a stream
		/// </summary>
		/// <param name="stream">The stream to load from</param>
		/// <param name="stripPrintStatements">True to automatically strip print statements from scripts as they are loaded.</param>
		public SchemaObjectCollection(Stream stream, bool stripPrintStatements = false)
		{
			StripPrintStatements = stripPrintStatements;

			Load(stream);
		}

		/// <summary>
		/// Load the schema from the assembly
		/// </summary>
		/// <param name="assembly"></param>
		/// <param name="stripPrintStatements">True to automatically strip print statements from scripts as they are loaded.</param>
		public SchemaObjectCollection(Assembly assembly, bool stripPrintStatements = false)
		{
			StripPrintStatements = stripPrintStatements;

			Load(assembly);
		}
        #endregion

		#region Properties
		/// <summary>
		/// Set to true to strip print statements on load
		/// </summary>
		public bool StripPrintStatements { get; set; }
		#endregion

		#region Load Methods
		/// <summary>
        /// Load a schema from a file
        /// </summary>
        /// <param name="fileName">The name of the file to load</param>
        /// <exception cref="FileNotFoundException">If the file canont be found</exception>
        /// <exception cref="ArgumentNullException">If fileName is null</exception>
        /// <exception cref="SchemaParsingException">If the schema file cannot be parsed</exception>
        public void Load (string fileName)
        {
            if (fileName == null) throw new ArgumentNullException ("fileName");

            using (Stream stream = new FileStream (fileName, FileMode.Open, FileAccess.Read, FileShare.Read))
                Load (stream);
        }

        /// <summary>
        /// Load a schema from a stream
        /// </summary>
        /// <param name="stream">The stream to load from</param>
        /// <exception cref="ArgumentNullException">If stream is null</exception>
        /// <exception cref="SchemaParsingException">If the schema file cannot be parsed</exception>
        public void Load (Stream stream)
        {
            if (stream == null) throw new ArgumentNullException ("stream");

            using (TextReader textReader = new StreamReader (stream))
                Load (textReader);
        }

        /// <summary>
        /// Load a schema from a text reader
        /// </summary>
        /// <param name="textReader">The text reader to load from</param>
        /// <exception cref="ArgumentNullException">If textReader is null</exception>
        /// <exception cref="SchemaParsingException">If the schema file cannot be parsed</exception>
        public void Load (TextReader textReader)
        {
			if (textReader == null) throw new ArgumentNullException("textReader");

            StringBuilder sb = new StringBuilder ();
            
            // read in each line until we get to a GO command
            for (string line = textReader.ReadLine (); line != null; line = textReader.ReadLine ())
            {
                if (_goCommandExpression.Match (line).Success)
                {
                    // create the object, add it to the schema, and start a new schema
                    Add (sb.ToString ());
                    sb = new StringBuilder ();
                }
                else
                    sb.AppendLine (line);
            }

            // if the file doesn't end with a GO, then we need to create one more object, 
            // unless it's all just comments and whitespace
			// NOTE: autoprocs are currently the only types that can be fully embedded in comments
            string last = sb.ToString ();
			if (!AutoProc.AutoProcRegex.IsMatch(last) &&
				last.Split(_lineTerminator, StringSplitOptions.RemoveEmptyEntries)
				    .All(line => _sqlCommentExpression.IsMatch(line) || String.IsNullOrWhiteSpace(line))) 
                return;

            Add (last.Trim());
        }

		/// <summary>
		/// Load a schema from all of the .SQL resource files in an assembly.
		/// </summary>
		/// <param name="assembly">The assembly to load from.</param>
		public void Load (Assembly assembly)
		{
			Load(assembly, resourceName => true);
		}

		/// <summary>
		/// Load a schema from all of the .SQL resource files in an assembly that match a filter.
		/// </summary>
		/// <param name="assembly">The assembly to load from.</param>
		/// <param name="resourceFilter">A predicate that returns true if the named resource should be loaded, false otherwise.</param>
		public void Load(Assembly assembly, Predicate<string> resourceFilter)
		{
			if (assembly == null) throw new ArgumentNullException("assembly");
			if (resourceFilter == null) throw new ArgumentNullException("resourceFilter");

			// find all of the embedded sql in the given assembly
			foreach (string resourceName in assembly.GetManifestResourceNames().Where(rn => rn.EndsWith(".sql", StringComparison.OrdinalIgnoreCase)))
			{
				if (resourceFilter(resourceName))
				{
					string sql;

					// read in the sql
					Stream stream = assembly.GetManifestResourceStream(resourceName);
					var disposable = stream;
					using (StreamReader reader = new StreamReader(stream))
					{
						disposable = null;

						sql = reader.ReadToEnd();						
					}

					// now load up the sql
					using (StringReader sr = new StringReader(sql))
						Load(sr);
				}
			}
		}

        /// <summary>
        /// Add a schema object corresponding to a script
        /// </summary>
        /// <param name="sql">The sql to add</param>
        /// <exception cref="ArgumentNullException">If sql is null</exception>
        /// <exception cref="SchemaParsingException">If the sql cannot be parsed</exception>
        public void Add (string sql)
        {
			if (sql == null) throw new ArgumentNullException("sql");

			// change PRINT to --PRINT so we can keep diagnostics in the 
			if (StripPrintStatements)
				sql = sql.Replace ("PRINT", "--PRINT");

            Add (new SchemaObject (sql));
        }
        #endregion

		/// <summary>
		/// Validate that the schema is a valid schema. This checks names and duplicate objects.
		/// </summary>
		public void Validate()
		{
			// check for duplicate objects and invalid names
			foreach (SchemaObject schemaObject in this)
			{
				if (schemaObject.SchemaObjectType == SchemaObjectType.Unused)
					continue;

				// validate the name
				SqlParser.AssertValidSqlName(schemaObject.Name);

				// if there are any duplicates, throw an exception
				if (this.Count(o => o.Name == schemaObject.Name) > 1)
					throw new ArgumentException(String.Format(CultureInfo.InvariantCulture, Properties.Resources.DuplicateObjectName, schemaObject.Name));
			}
		}

		/// <summary>
		/// Verify that all of the objects are in the database.
		/// </summary>
		/// <param name="connection">The connection to use for testing.</param>
		public void Verify(DbConnection connection)
		{
			using (RecordingDbConnection recordingConnection = new RecordingDbConnection(connection))
			{
				foreach (SchemaObject schemaObject in this)
				{
					if (!schemaObject.Exists(recordingConnection))
					{
						throw new SchemaException(String.Format(CultureInfo.InvariantCulture, "SchemaObject {0} was not in the database", schemaObject.Name));
					}
				}
			}
		}

		/// <summary>
		/// The Regex used to detect GO commands. GO must be on its own line.
		/// </summary>
        private static readonly Regex _goCommandExpression = new Regex (@"^\s*GO\s*$", RegexOptions.IgnoreCase | RegexOptions.Singleline | RegexOptions.Compiled);

        /// <summary>
        /// The Regex used to detect comment line
        /// </summary>
        private static readonly Regex _sqlCommentExpression = new Regex(@"^\s*--.*", RegexOptions.IgnoreCase | RegexOptions.Singleline | RegexOptions.Compiled);

		/// <summary>
		/// The current environment's line terminator
		/// </summary>
		private static readonly string[] _lineTerminator = new string[] { Environment.NewLine };
    }
    #endregion
}
