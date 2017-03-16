using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;

namespace Insight.Database.Schema.Implementation
{
	class Certificate : SchemaImpl
	{
		public Certificate(string name, string sql) : base(name, sql, 2)
		{
		}

		public override bool Exists(IDbConnection connection)
		{
			return 0 < connection.ExecuteScalarSql<int>(String.Format(@"
					SELECT COUNT (*)
						FROM sys.certificates
						WHERE name = '{0}'",
				Name.Object));
		}

		public override bool CanDrop(SchemaInstaller.InstallContext context, IDbConnection connection)
		{
			return false;
		}

		public override void Drop(IDbConnection connection)
		{
			throw new InvalidOperationException("For your protection, certificates must be dropped manually.");
		}
	}
}
