#region Using directives

using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using Insight.Database;
using Insight.Database.Schema.Implementation;
#endregion

namespace Insight.Database.Schema
{
    #region SchemaObject Class
    public sealed class SchemaObject
    {
        #region Constructors
		private SchemaImpl _implementation;

        /// <summary>
        /// Constructs a SchemaObject of the given type, name, and sql script
        /// </summary>
        /// <param name="type">The type of the SchemaObject</param>
        /// <param name="name">The name of the SchemaObject</param>
        /// <param name="sql">The SQL script for the SchemaObject</param>
        /// <remarks>The type and name must match the SQL script.</remarks>
        /// <exception cref="ArgumentNullException">If name or sql is null</exception>
        internal SchemaObject (SchemaObjectType type, string name, string sql)
        {
            if (name == null) throw new ArgumentNullException ("name");

            _type = type;
            _sql = sql;
			_implementation = SchemaImpl.GetImplementation(_type, name, _sql);
        }

        /// <summary>
        /// Create a SchemaObject from a sql snippet, attempting to detect the type and name of the object
        /// </summary>
        /// <param name="sql">The sql to parse</param>
        /// <exception cref="SchemaParsingException">If the SQL cannot be parsed</exception>
        public SchemaObject (string sql)
        {
			_sql = sql;
			var name = ParseSql();
			_implementation = SchemaImpl.GetImplementation(_type, name, _sql);
		}
        #endregion

        #region Properties
        /// <summary>
        /// The sql script for the object
        /// </summary>
        /// <value>The sql script for the object</value>
        /// <exception cref="SqlParsingException">If sql cannot be parsed</exception>
        public string Sql 
        { 
            get { return _sql; } 
            set 
            {
                if (value == null) throw new ArgumentNullException ("value");
                _sql = value; 
                ParseSql (); 
            } 
        }
        private string _sql;

        /// <summary>
        /// The name of the SchemaObject
        /// </summary>
        /// <value>The name of the SchemaObject</value>
        public string Name { get { return SqlName.FullName; } }

		/// <summary>
		/// The full name of the object.
		/// </summary>
		public SqlName SqlName { get { return _implementation.Name; } }

        /// <summary>
        /// The type of the SchemaObject
        /// </summary>
        /// <value>The type of the SchemaObject</value>
        public SchemaObjectType SchemaObjectType { get { return _type; } }
        private SchemaObjectType _type;

        /// <summary>
        /// The signature of the SchemaObject
        /// </summary>
        /// <value></value>
		internal string GetSignature(IDbConnection connection, IEnumerable<SchemaObject> objects)
		{
			if (_type == Schema.SchemaObjectType.AutoProc)
				return new AutoProc(Name, new SqlColumnDefinitionProvider(connection), objects).Signature;
			else
				return CalculateSignature(Sql);
		}

        /// <summary>
        /// The order in which the script was added to the schema
        /// </summary>
        /// <value>The original order</value>
        /// <remarks>Used for ties within the same type of object</remarks>
        internal int OriginalOrder
        {
            get { return _originalOrder; }
            set { _originalOrder = value; }
        }
        private int _originalOrder;
        #endregion

        #region Install/Uninstall Methods
        /// <summary>
        /// Install the object into the database
        /// </summary>
        /// <param name="connection">The database connection to use</param>
		internal void Install(RecordingDbConnection connection, IEnumerable<SchemaObject> objects)
        {
			_implementation.Install(connection, objects);
        }

        /// <summary>
        /// Verify that the object exists in the database.
        /// </summary>
        /// <param name="connection">The connection to query.</param>
        /// <returns>True if the object exists, false if it doesn't.</returns>
		[System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling"), System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1505:AvoidUnmaintainableCode"), System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1502:AvoidExcessiveComplexity")]
		internal bool Exists(RecordingDbConnection connection)
		{
			return _implementation.Exists(connection);
		}

		/// <summary>
		/// Determine if this is a type of object that we can modify.
		/// </summary>
		/// <param name="type">The type of the object.</param>
		/// <returns>True if we know how to drop the object.</returns>
		internal bool CanModify(SchemaInstaller.InstallContext context, RecordingDbConnection connection)
		{
			return connection.DoNotLog(() => _implementation.CanModify(context, connection));
		}

		public bool CanModify(IDbConnection connection)
		{
			return _implementation.CanModify(new SchemaInstaller.InstallContext(), connection);
		}

        /// <summary>
        /// Drop an object from the database
        /// </summary>
        /// <param name="connection">The Sql connection to use</param>
        /// <param name="type">The type of the object</param>
        /// <param name="objectName">The name of the object</param>
		internal static void Drop(IDbConnection connection, SchemaObjectType type, string objectName)
        {
			var implementation = SchemaImpl.GetImplementation(type, objectName, null);

			implementation.Drop(connection);
		}
        #endregion

        #region Signature Methods
        /// <summary>
        /// Calculate the signature of a string as a hash code
        /// </summary>
        /// <param name="s">The string to hash</param>
        /// <returns>The hash code for the string</returns>
        /// <remarks>This is used to detect changes to a schema object</remarks>
        internal static string CalculateSignature (string s)
        {
            // Convert the string into an array of bytes.
            byte[] bytes = new UnicodeEncoding ().GetBytes (s);

            // Create a new instance of SHA1Managed to create the hash value.
			using (var shHash = SHA1.Create())
			{
				// Create the hash value from the array of bytes.
				byte[] hashValue = shHash.ComputeHash(bytes);

				// return the hash as a string
				return Convert.ToBase64String(hashValue);
			}
        }
        #endregion

        #region Parsing Methods
        /// <summary>
        /// Parse the SQL to determine the type and name
        /// </summary>
        private string ParseSql ()
        {
			// find the first match by position, then by type
			var match = SqlParser.Parsers.Select(p => p.Match(_sql))
				.Where(m => m != null)
				.OrderBy(m => m.Position)
				.ThenBy(m => m.SchemaObjectType)
				.FirstOrDefault();

			// if we didn't get a match, then throw an exception
			if (match == null)
				throw new SchemaParsingException (Properties.Resources.CannotDetermineScriptType, _sql);

            // if the sql contains something that we know that we don't support, then throw an exception
            var invalid = SqlParser.UnsupportedSql.Select(p => p.Match(_sql)).Where(m => m != null).FirstOrDefault();
            if (invalid != null)
                throw new SchemaParsingException(String.Format(CultureInfo.InvariantCulture, "Error parsing Sql: {0}", invalid.Name), _sql);

			// fill in the type and name
			_type = match.SchemaObjectType;
			
			return match.Name;
		}
		#endregion
	}
    #endregion
}
