using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;

namespace Insight.Database.Schema.Implementation
{
	class StoredProcedure : SchemaImpl
	{
		public StoredProcedure(string name, string sql) : base(name, sql, 2)
		{
		}

		public override bool Exists(IDbConnection connection)
		{
			return 0 < connection.ExecuteScalarSql<int>(String.Format(@"
					SELECT COUNT (*)
						FROM sys.procedures p
						JOIN sys.schemas s ON (p.schema_id = s.schema_id)
						WHERE s.name = '{0}' AND p.name = '{1}'",
				Name.Schema,
				Name.Object));
		}

		public override void Drop(IDbConnection connection)
		{
			connection.ExecuteSql(String.Format(@"DROP PROCEDURE {0}",
				 Name.SchemaQualifiedObject));
		}
	}
}
