using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Insight.Database.Schema
{
	/// <summary>
	/// Represents a column in the database.
	/// </summary>
	/// <remarks>This class is framework code and is not intended to be used by external code.</remarks>
	public class ColumnDefinition
	{
		/// <summary>
		/// The name of the column.
		/// </summary>
		public string Name { get; set; }

		/// <summary>
		/// The type of the column, including the precision/size.
		/// </summary>
		public string SqlType { get; set; }

		/// <summary>
		/// True if the column is a key field.
		/// </summary>
		public bool IsKey { get; set; }

		/// <summary>
		/// True if the column is not updatable.
		/// </summary>
		public bool IsReadOnly { get; set; }

		/// <summary>
		/// True if the column is an identity.
		/// </summary>
		public bool IsIdentity { get; set; }

		/// <summary>
		/// True if the column is a rowversion.
		/// </summary>
		public bool IsRowVersion { get; set; }

		/// <summary>
		/// True if the column is nullable on update.
		/// </summary>
		public bool IsUpdateNullable { get; set; }

		/// <summary>
		/// True if the column has a default
		/// </summary>
		public bool HasDefault { get; set; }

		/// <summary>
		/// The name of the column formatted properly for use as a SQL column.
		/// </summary>
		public string ColumnName { get { return SqlParser.FormatSqlName(Name); } }

		/// <summary>
		/// The name of the column formatted properly for use as a SQL parameter.
		/// </summary>
		public string ParameterName { get { return "@" + Name; } }
	}
}
