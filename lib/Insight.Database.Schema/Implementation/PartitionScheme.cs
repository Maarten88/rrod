using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace Insight.Database.Schema.Implementation
{
	class PartitionScheme : SchemaImpl
	{
		public PartitionScheme(string name, string sql) : base(name, sql, 1)
		{
		}

		public override bool Exists(IDbConnection connection)
		{
			return 0 < connection.ExecuteScalarSql<int>(String.Format(@"
					SELECT COUNT (*)
						FROM sys.partition_schemes
						WHERE name = '{0}'",
				Name.Object));
		}

		public override bool CanModify(SchemaInstaller.InstallContext context, IDbConnection connection)
		{
			// we can drop a scheme as long as there are no tables using it
			return connection.ExecuteScalarSql<int>(@"SELECT COUNT(*) FROM sys.partition_schemes s 
				WHERE s.name = @Name AND (
					s.data_space_id IN (SELECT data_space_id FROM sys.indexes) OR 
					s.data_space_id IN (SELECT lob_data_space_id FROM sys.tables) OR
					s.data_space_id IN (SELECT filestream_data_space_id FROM sys.tables))
				", new Dictionary<string, object>() { { "Name", Name.Object } }) == 0;
		}

		public override void Drop(IDbConnection connection)
		{
			connection.ExecuteSql(String.Format(@"DROP PARTITION SCHEME {0}", Name.ObjectFormatted));
		}
	}
}
