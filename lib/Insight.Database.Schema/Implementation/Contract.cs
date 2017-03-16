using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;

namespace Insight.Database.Schema.Implementation
{
	class Contract : SchemaImpl
	{
		public Contract(string name, string sql) : base(name, sql, 1)
		{
		}

		public override bool Exists(IDbConnection connection)
		{
			return 0 < connection.ExecuteScalarSql<int>(String.Format(@"
					SELECT COUNT (*)
						FROM sys.service_contracts
						WHERE name = '{0}'",
				Name.Object));
		}

		public override void Drop(IDbConnection connection)
		{
			connection.ExecuteSql(String.Format(@"DROP CONTRACT {0}", Name.ObjectFormatted));
		}
	}
}
