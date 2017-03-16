using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace Insight.Database.Schema.Implementation
{
	class UserDefinedType : SchemaImpl
	{
		public UserDefinedType(string name, string sql) : base(name, sql, 2)
		{
		}

		public override bool Exists(System.Data.IDbConnection connection)
		{
			return 0 < connection.ExecuteScalarSql<int>(String.Format(@"
				SELECT COUNT (*)
					FROM sys.types t
					JOIN sys.schemas s ON (t.schema_id = s.schema_id)
					WHERE s.name = '{0}' AND t.name = '{1}'", 
					Name.Schema,
					Name.Object));
		}

		public override bool CanModify(SchemaInstaller.InstallContext context, IDbConnection connection)
		{
			// we can drop a udt unless it is used in a table
			return connection.ExecuteScalarSql<int>(
				"SELECT COUNT(*) FROM sys.types t JOIN sys.columns c ON (t.user_type_id = c.user_type_id) WHERE t.Name = @Name",
				new Dictionary<string, object>() { { "Name", Name.Object } }) == 0;
		}

		public override void Drop(System.Data.IDbConnection connection)
		{
			connection.ExecuteSql(String.Format ("DROP TYPE {0}", Name.FullName));
		}
	}
}
