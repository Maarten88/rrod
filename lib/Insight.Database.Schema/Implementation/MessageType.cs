using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;

namespace Insight.Database.Schema.Implementation
{
	class MessageType : SchemaImpl
	{
		public MessageType(string name, string sql) : base(name, sql, 1)
		{
		}

		public override bool Exists(IDbConnection connection)
		{
			return 0 < connection.ExecuteScalarSql<int>(String.Format(@"
					SELECT COUNT (*)
						FROM sys.service_message_types
						WHERE name = '{0}'",
				Name.Object));
		}

		public override bool CanDrop(SchemaInstaller.InstallContext context, IDbConnection connection)
		{
			return 0 == connection.ExecuteScalarSql<int>(String.Format(@"
				SELECT COUNT(*)
				FROM sys.service_contract_message_usages c
				JOIN sys.service_message_types m ON (c.message_type_id = m.message_type_id)
				WHERE m.name = '{0}'",
				Name.Object));
		}

		public override void Drop(IDbConnection connection)
		{
			connection.ExecuteSql(String.Format(@"DROP MESSAGE TYPE {0}", Name.ObjectFormatted));
		}
	}
}
