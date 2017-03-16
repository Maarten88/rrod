using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;

namespace Insight.Database.Schema.Implementation
{
	class Constraint : SchemaImpl
	{
		public Constraint(string name, string sql) : base(name, sql, 3)
		{
		}

		public override bool Exists(IDbConnection connection)
		{
			return 0 < connection.ExecuteScalarSql<int>(String.Format(@"SELECT COUNT(*)
						FROM sys.objects o
						JOIN sys.tables t ON (o.parent_object_id = t.object_id)
						JOIN sys.schemas s ON (t.schema_id = s.schema_id)
						WHERE s.Name = '{0}' AND t.name = '{1}' AND o.name = '{2}'",
				Name.Schema,
				Name.Table,
				Name.Object));
		}

		public override void Drop(IDbConnection connection)
		{
			connection.ExecuteSql(String.Format(@"ALTER TABLE {0} DROP CONSTRAINT {1}",
				 Name.SchemaQualifiedTable,
				 Name.ObjectFormatted));
		}
	}
}
