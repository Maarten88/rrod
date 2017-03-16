using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Insight.Database.Schema
{
	internal static class ConnectionExtensions
	{
		public static bool IsAzure(this string connectionString)
		{
			return connectionString.Contains("windows.net");
		}
		public static bool IsAzure(this IDbConnection connection)
		{
			return connection.ConnectionString.IsAzure();
		}

		public static DbConnection Unwrap(this DbConnection connection)
		{
			RecordingDbConnection recording = connection as RecordingDbConnection;
			if (recording != null)
				return recording.InnerConnection.Unwrap();

			return connection;
		}

		public static int ExecuteSql(this IDbConnection connection, string sql)
		{
			var cmd = connection.CreateCommand();
			cmd.CommandText = sql;
			cmd.CommandType = CommandType.Text;

			return cmd.ExecuteNonQuery();
		}

		public static T ExecuteScalarSql<T>(this IDbConnection connection, string sql, IDictionary<string, object> parameters = null)
		{
			var cmd = connection.CreateCommand();
			cmd.CommandText = sql;
			cmd.CommandType = CommandType.Text;

			if (parameters != null)
				CreateParameters(parameters, cmd);

			return (T)cmd.ExecuteScalar();
		}

		public static IDataReader GetReaderSql(this IDbConnection connection, string sql)
		{
			var cmd = connection.CreateCommand();
			cmd.CommandText = sql;
			cmd.CommandType = CommandType.Text;

			return cmd.ExecuteReader();
		}

		public static IList<FastExpando> QuerySql(this IDbConnection connection, string sql, IDictionary<string, object> parameters)
		{
			var cmd = connection.CreateCommand();
			cmd.CommandText = sql;
			cmd.CommandType = CommandType.Text;

			CreateParameters(parameters, cmd);

			var results = new List<FastExpando>();

			using (var reader = cmd.ExecuteReader())
			{
				while (reader.Read())
				{
					var expando = new FastExpando();
					var dict = (IDictionary<string, object>)expando;
					for (int i = 0; i < reader.FieldCount; i++)
					{
						object value = reader.GetValue(i);
						if (value == DBNull.Value)
							value = null;
						dict[reader.GetName(i)] = value;
					}
					results.Add(expando);
				}
			}

			return results;
		}

		private static void CreateParameters(IDictionary<string, object> parameters, IDbCommand cmd)
		{
			if (parameters == null)
				return;

			foreach (var pair in parameters)
			{
				var p = cmd.CreateParameter();
				p.ParameterName = "@" + pair.Key;
				if (pair.Value != null)
					p.Value = pair.Value;
				else
					p.Value = DBNull.Value;
				cmd.Parameters.Add(p);
			}
		}
	}
}
