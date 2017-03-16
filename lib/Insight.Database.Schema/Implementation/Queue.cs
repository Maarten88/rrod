using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace Insight.Database.Schema.Implementation
{
	class Queue : SchemaImpl
	{
		public Queue(string name, string sql) : base(name, sql, 2)
		{
		}

		public override bool Exists(IDbConnection connection)
		{
			return 0 < connection.ExecuteScalarSql<int>(String.Format(@"
					SELECT COUNT (*)
						FROM sys.service_queues
						WHERE object_id = OBJECT_ID('{0}')",
				Name.SchemaQualifiedObject));
		}

		public override bool CanDrop(SchemaInstaller.InstallContext context, IDbConnection connection)
		{
			return 0 == connection.ExecuteScalarSql<int>(String.Format(@"
				SELECT COUNT(*)
				FROM sys.service_queues q
				JOIN sys.service_queue_usages u ON (q.object_id = u.service_queue_id)
				WHERE q.object_id = OBJECT_ID('{0}')",
				Name.SchemaQualifiedObject));
		}

		public override void Drop(IDbConnection connection)
		{
			connection.ExecuteSql(String.Format(@"DROP QUEUE {0}", Name.SchemaQualifiedObject));
		}
	}
}
