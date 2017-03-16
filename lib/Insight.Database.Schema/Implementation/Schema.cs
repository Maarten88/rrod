using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace Insight.Database.Schema.Implementation
{
	class Schema : SchemaImpl
	{
		public Schema(string name, string sql) : base(name, sql, 1)
		{
		}

		public override bool Exists(System.Data.IDbConnection connection)
		{
			return 0 < connection.ExecuteScalarSql<int>(String.Format("SELECT COUNT (*) FROM sys.schemas WHERE name = '{0}'", Name.Object));
		}

		public override void Drop(System.Data.IDbConnection connection)
		{
			connection.ExecuteSql(String.Format ("DROP SCHEMA {0}", Name.ObjectFormatted));
		}

		public override bool CanDrop(SchemaInstaller.InstallContext context, IDbConnection connection)
		{
			return 0 == connection.ExecuteScalarSql<int>(String.Format("SELECT COUNT(*) FROM sys.objects o WHERE o.schema_id = SCHEMA_ID('{0}')", Name.Object));
		}
	}
}
