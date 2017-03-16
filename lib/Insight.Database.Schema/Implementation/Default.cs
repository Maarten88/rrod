using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;

namespace Insight.Database.Schema.Implementation
{
	class Default : SchemaImpl
	{
		public Default(string name, string sql) : base(name, sql, 3)
		{
		}

		public override bool Exists(IDbConnection connection)
		{
			return 0 < connection.ExecuteScalarSql<int>(String.Format(@"SELECT COUNT(*)
						FROM sys.default_constraints d
						JOIN sys.schemas s ON (d.schema_id = s.schema_id)
						JOIN sys.objects o ON (d.parent_object_id = o.object_id)
						JOIN sys.columns c ON (c.object_id = o.object_id AND c.column_id = d.parent_column_id)
						WHERE s.Name = '{0}' AND o.name = '{1}' AND c.name = '{2}'",
				Name.Schema,
				Name.Table,
				Name.Object));
		}

		public override void Drop(IDbConnection connection)
		{
			connection.ExecuteSql(String.Format(@"
						-- ALTER TABLE DROP DEFAULT ON COLUMN
						DECLARE @Name[nvarchar](256) 
						SELECT @Name = d.name
							FROM sys.default_constraints d
							JOIN sys.schemas s ON (d.schema_id = s.schema_id)
							JOIN sys.objects o ON (d.parent_object_id = o.object_id)
							JOIN sys.columns c ON (c.object_id = o.object_id AND c.column_id = d.parent_column_id)
							WHERE s.name = '{0}' AND o.name = '{1}' AND c.name = '{2}'
						DECLARE @sql[nvarchar](MAX) = 'ALTER TABLE {3} DROP CONSTRAINT [' + @Name + ']'
						EXEC sp_executesql @sql
					",
				 Name.Schema,
				 Name.Table,
				 Name.Object,
				 Name.SchemaQualifiedTable));
		}
	}
}
