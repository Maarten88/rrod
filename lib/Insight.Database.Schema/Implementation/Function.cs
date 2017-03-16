using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;

namespace Insight.Database.Schema.Implementation
{
	class Function : SchemaImpl
	{
		public Function(string name, string sql) : base(name, sql, 2)
		{
		}

		public override bool Exists(IDbConnection connection)
		{
			return 0 < connection.ExecuteScalarSql<int>(String.Format(@"
					SELECT COUNT (*)
						FROM sys.objects o
						JOIN sys.schemas s ON (o.schema_id = s.schema_id)
						WHERE s.name = '{0}' AND o.name = '{1}'",
				Name.Schema,
				Name.Object));
		}

		public override void Drop(IDbConnection connection)
		{
			connection.ExecuteSql(String.Format(@"DROP FUNCTION {0}", Name.SchemaQualifiedObject));
		}
	}
}
