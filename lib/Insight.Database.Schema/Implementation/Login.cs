using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace Insight.Database.Schema.Implementation
{
	class Login : SchemaImpl
	{
		public Login(string name, string sql) : base(name, sql, 1)
		{
		}

		public override bool Exists(IDbConnection connection)
		{
			return 0 < connection.ExecuteScalarSql<int>(String.Format(@"
					SELECT COUNT (*)
						FROM sys.server_principals WHERE name = '{0}' AND type <> 'R'",
				Name.Object));
		}

		public override void Install(IDbConnection connection, IEnumerable<SchemaObject> objects)
		{
			if (!Exists(connection))
				base.Install(connection, objects);
		}

		public override bool CanDrop(SchemaInstaller.InstallContext context, IDbConnection connection)
		{
			// assume that logins can be used across the server
			return false;
		}

		public override void Drop(IDbConnection connection)
		{
			connection.ExecuteSql(String.Format(@"DROP LOGIN {0}", Name.ObjectFormatted));
		}
	}
}
