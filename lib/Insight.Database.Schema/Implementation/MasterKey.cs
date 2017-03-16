using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace Insight.Database.Schema.Implementation
{
	class MasterKey : SchemaImpl
	{
		public MasterKey(string name, string sql) : base(name, sql, 1)
		{
		}

		public override bool Exists(System.Data.IDbConnection connection)
		{
			return 0 < connection.ExecuteScalarSql<int>(String.Format(@"
				SELECT COUNT (*)
					FROM sys.symmetric_keys
					WHERE name = '{0}'",
	 				"##MS_DatabaseMasterKey##"));
		}

		public override bool CanDrop(SchemaInstaller.InstallContext context, IDbConnection connection)
		{
			return false;
		}

		public override void Drop(System.Data.IDbConnection connection)
		{
			throw new InvalidOperationException("For your protection, master keys must be dropped manually.");
		}
	}
}
