using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace Insight.Database.Schema.Implementation
{
	class SymmetricKey : SchemaImpl
	{
		public SymmetricKey(string name, string sql) : base(name, sql, 1)
		{
		}

		public override bool Exists(System.Data.IDbConnection connection)
		{
			return 0 < connection.ExecuteScalarSql<int>(String.Format(@"
				SELECT COUNT (*)
					FROM sys.symmetric_keys
					WHERE name = '{0}'",
	 				Name.Object));
		}

		public override bool CanDrop(SchemaInstaller.InstallContext context, IDbConnection connection)
		{
			return false;
		}

		public override void Drop(System.Data.IDbConnection connection)
		{
			throw new InvalidOperationException("For your protection, symmetric keys must be dropped manually.");
		}
	}
}
