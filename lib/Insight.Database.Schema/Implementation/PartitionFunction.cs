using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace Insight.Database.Schema.Implementation
{
	class PartitionFunction : SchemaImpl
	{
		public PartitionFunction(string name, string sql) : base(name, sql, 1)
		{
		}

		public override bool Exists(IDbConnection connection)
		{
			return 0 < connection.ExecuteScalarSql<int>(String.Format(@"
					SELECT COUNT (*)
						FROM sys.partition_functions
						WHERE name = '{0}'",
				Name.Object));
		}

		public override bool CanModify(SchemaInstaller.InstallContext context, IDbConnection connection)
		{
			// we can drop a function as long as there are no schemes using it
			return connection.ExecuteScalarSql<int>(
				"SELECT COUNT(*) FROM sys.partition_functions p JOIN sys.partition_schemes s ON (p.function_id = s.function_id) WHERE p.name = @Name", 
				new Dictionary<string, object>() { { "Name", Name.Object } }) == 0;
		}

		public override void Drop(IDbConnection connection)
		{
			connection.ExecuteSql(String.Format(@"DROP PARTITION FUNCTION {0}", Name.ObjectFormatted));
		}
	}
}
