using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;

namespace Insight.Database.Schema.Implementation
{
	class Script : SchemaImpl
	{
		public Script(string name, string sql) : base(name, sql, 1)
		{
		}

		public override bool Exists(IDbConnection connection)
		{
			return true;
		}

		public override bool CanDrop(SchemaInstaller.InstallContext context, IDbConnection connection)
		{
			return false;
		}

		public override bool CanModify(SchemaInstaller.InstallContext context, IDbConnection connection)
		{
			return true;
		}

		public override void Drop(IDbConnection connection)
		{
		}
	}
}
