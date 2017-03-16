using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;

namespace Insight.Database.Schema.Implementation
{
	class AutoProc : SchemaImpl
	{
		public AutoProc(string name, string sql) : base(name, sql, 2)
		{
		}

		public override void Install(IDbConnection connection, IEnumerable<SchemaObject> objects)
		{
			// for auto-procs, convert the comment into a list of stored procedures
			var sql = new Insight.Database.Schema.AutoProc(Name.Original, new SqlColumnDefinitionProvider(connection), objects).Sql;
			if (sql.Length == 0)
				return;

			foreach (string s in _goSplit.Split(sql).Where(piece => !String.IsNullOrWhiteSpace(piece)))
				connection.ExecuteSql(s);
		}

		public override bool Exists(IDbConnection connection)
		{
			return new Insight.Database.Schema.AutoProc(Name.Original, null, null).GetProcs().All(tuple =>
			{
				switch (tuple.Item1)
				{
					case Insight.Database.Schema.AutoProc.ProcTypes.Table:
					case Insight.Database.Schema.AutoProc.ProcTypes.IdTable:
						return new UserDefinedType(tuple.Item2, null).Exists(connection);

					default:
						return new StoredProcedure(tuple.Item2, null).Exists(connection);
				}
			});
		}

		public override void Drop(IDbConnection connection)
		{
			var sql = new Insight.Database.Schema.AutoProc(Name.Original, new SqlColumnDefinitionProvider(connection), null).DropSql;

			foreach (string s in _goSplit.Split(sql).Where(piece => !String.IsNullOrWhiteSpace(piece)))
				connection.ExecuteSql(s);
		}
	}
}
