using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace Insight.Database.Schema.Implementation
{
	class Table : SchemaImpl
	{
		public Table(string name, string sql) : base(name, sql, 2)
		{
		}

		public override bool Exists(System.Data.IDbConnection connection)
		{
			return 0 < connection.ExecuteScalarSql<int>(String.Format(@"
				SELECT COUNT (*)
					FROM sys.tables t
					JOIN sys.schemas s ON (t.schema_id = s.schema_id)
					WHERE s.name = '{0}' AND t.name = '{1}'", 
					Name.Schema,
					Name.Table));
		}

		public override void Drop(System.Data.IDbConnection connection)
		{
			connection.ExecuteSql(String.Format ("DROP TABLE {0}", Name.FullName));
		}
	}
}
