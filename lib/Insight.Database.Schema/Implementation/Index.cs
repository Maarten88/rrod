using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;

namespace Insight.Database.Schema.Implementation
{
	class Index : SchemaImpl
	{
		public Index(string name, string sql) : base(name, sql, 3)
		{
		}

		public override bool Exists(IDbConnection connection)
		{
			return 0 < connection.ExecuteScalarSql<int>(String.Format(@"SELECT COUNT(*)
						FROM sys.indexes i
						JOIN sys.objects t ON (i.object_id = t.object_id)
						JOIN sys.schemas s ON (t.schema_id = s.schema_id)
						WHERE s.Name = '{0}' AND t.name = '{1}' AND i.name = '{2}'",
				Name.Schema,
				Name.Table,
				Name.Object));
		}

		public override bool CanModify(SchemaInstaller.InstallContext context, IDbConnection connection)
		{
			// azure can't drop the clustered index, so we have to warn if we are attempting to modify that
			if (context.IsAzure)
			{
				if (Sql.IndexOf("NONCLUSTERED", StringComparison.OrdinalIgnoreCase) == -1 && Sql.IndexOf("CLUSTERED", StringComparison.OrdinalIgnoreCase) != -1)
					return false;
			}

			return true;
		}

		public override void Drop(IDbConnection connection)
		{
			connection.ExecuteSql(String.Format(@"DROP INDEX {1} ON {0}",
				 Name.SchemaQualifiedTable,
				 Name.ObjectFormatted));
		}
	}
}
