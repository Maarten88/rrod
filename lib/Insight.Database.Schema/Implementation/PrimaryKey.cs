using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;

namespace Insight.Database.Schema.Implementation
{
	class PrimaryKey : SchemaImpl
	{
		public PrimaryKey(string name, string sql) : base(name, sql, 3)
		{
		}

		public override bool Exists(IDbConnection connection)
		{
			return 0 < connection.ExecuteScalarSql<int>(String.Format(@"SELECT COUNT(*)
						FROM sys.indexes i
						JOIN sys.tables t ON (i.object_id = t.object_id)
						JOIN sys.schemas s ON (t.schema_id = s.schema_id)
						WHERE s.Name = '{0}' AND t.name = '{1}' AND i.name = '{2}'",
				Name.Schema,
				Name.Table,
				Name.Object));
		}

		public override bool CanDrop(SchemaInstaller.InstallContext context, IDbConnection connection)
		{
			// azure can't drop the clustered index, so we have to warn if we are attempting to modify that
			if (context.IsAzure)
			{
				if (Sql.IndexOf("NONCLUSTERED", StringComparison.OrdinalIgnoreCase) == -1 && Sql.IndexOf("CLUSTERED", StringComparison.OrdinalIgnoreCase) != -1)
					return false;
			}

			return 0 == connection.ExecuteScalarSql<int>(String.Format(@"SELECT COUNT(*)
						FROM sys.xml_indexes i
						WHERE i.object_id = OBJECT_ID('{0}')",
				Name.SchemaQualifiedTable));
		}

		public override void Drop(IDbConnection connection)
		{
			connection.ExecuteSql(String.Format(@"ALTER TABLE {0} DROP CONSTRAINT {1}",
				 Name.SchemaQualifiedTable,
				 Name.ObjectFormatted));
		}
	}
}
