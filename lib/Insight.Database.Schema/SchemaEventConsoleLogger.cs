using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Insight.Database.Schema
{
	/// <summary>
	/// Logs console events to the console
	/// </summary>
	public class SchemaEventConsoleLogger : SchemaEventLogger
	{
		public override void LogSchemaChange (SchemaEventArgs se)
		{
			Console.WriteLine (FormatEventArgs (se));
		}
	}
}
