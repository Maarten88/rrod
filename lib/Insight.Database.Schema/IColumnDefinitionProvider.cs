using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Insight.Database.Schema
{
	/// <summary>
	/// Provides the schema engine the definitions of the columns of a table.
	/// </summary>
	/// <remarks>This class is framework code and is not intended to be used by external code.</remarks>
	public interface IColumnDefinitionProvider
	{
		/// <summary>
		/// Returns the column definitions for a given table.
		/// </summary>
		/// <param name="tableName">The name of the table.</param>
		/// <returns>A list of the columns for the table.</returns>
		IList<ColumnDefinition> GetColumns(SqlName tableName);
	}
}
