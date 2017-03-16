using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace Insight.Database.Schema.Implementation
{
	class Permission : SchemaImpl
	{
		public Permission(string name, string sql) : base(name, sql, 1)
		{
		}

		[System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1505:AvoidUnmaintainableCode"), System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1502:AvoidExcessiveComplexity")]
		public override bool Exists(IDbConnection connection)
		{
            // check permissions by querying the permissions table
			Match m = Regex.Match(Name.Original, String.Format(CultureInfo.InvariantCulture, @"(?<permission>\w+)\s+ON\s+(?<object>{0})\s+TO\s+(?<user>{0})", SqlParser.SqlNameExpression));

			var userName = new SqlName(m.Groups["user"].Value, 1);
			var o = m.Groups["object"].Value;
			var objectName = new SqlName(o, o.Contains("TYPE::[dbo]") ? 3 : 2);

			var permissions = connection.QuerySql(@"SELECT PermissionName=p.permission_name, ObjectType=ISNULL(o.type_desc, p.class_desc)
					FROM sys.database_principals u
					JOIN sys.database_permissions p ON (u.principal_id = p.grantee_principal_id)
					LEFT JOIN sys.objects o ON (p.class_desc = 'OBJECT_OR_COLUMN' AND p.major_id = o.object_id)
					LEFT JOIN sys.schemas os ON (o.schema_id = os.schema_id AND os.name = @SchemaName)
					LEFT JOIN sys.types t ON (p.class_desc = 'TYPE' AND p.major_id = t.user_type_id)
					LEFT JOIN sys.schemas s ON (p.class_desc = 'SCHEMA' AND p.major_id = s.schema_id)
					WHERE state_desc IN ('GRANT', 'GRANT_WITH_GRANT_OPTION')
						AND u.name = @UserName 
						AND COALESCE(o.name, t.name, s.name) = @ObjectName",
					new Dictionary<string, object>()
					{ 
						{ "UserName", userName.Object },
						{ "SchemaName", objectName.Schema },
						{ "ObjectName", objectName.Object }
					});

			string type = permissions.Select((dynamic p) => p.ObjectType).FirstOrDefault();
			string permission = m.Groups["permission"].Value.ToUpperInvariant();

			switch (permission)
			{
				case "EXEC":
					return permissions.Any((dynamic p) => p.PermissionName == "EXECUTE");

				case "ALL":
					switch (type)
					{
						case null:
							// this happens on initial install when there is no database
							return false;

						case "SQL_STORED_PROCEDURE":
							return permissions.Any((dynamic p) => p.PermissionName == "EXECUTE");

						case "SQL_SCALAR_FUNCTION":
							return permissions.Any((dynamic p) => p.PermissionName == "EXECUTE") &&
								permissions.Any((dynamic p) => p.PermissionName == "REFERENCES");

						case "SQL_INLINE_TABLE_VALUED_FUNCTION":
						case "SQL_TABLE_VALUED_FUNCTION":
						case "USER_TABLE":
						case "VIEW":
							return permissions.Any((dynamic p) => p.PermissionName == "REFERENCES") &&
								permissions.Any((dynamic p) => p.PermissionName == "SELECT") &&
								permissions.Any((dynamic p) => p.PermissionName == "INSERT") &&
								permissions.Any((dynamic p) => p.PermissionName == "UPDATE") &&
								permissions.Any((dynamic p) => p.PermissionName == "DELETE");

						case "DATABASE":
							return permissions.Any((dynamic p) => p.PermissionName == "BACKUP DATABASE") &&
								permissions.Any((dynamic p) => p.PermissionName == "BACKUP LOG") &&
								permissions.Any((dynamic p) => p.PermissionName == "CREATE DATABASE") &&
								permissions.Any((dynamic p) => p.PermissionName == "CREATE DEFAULT") &&
								permissions.Any((dynamic p) => p.PermissionName == "CREATE FUNCTION") &&
								permissions.Any((dynamic p) => p.PermissionName == "CREATE PROCEDURE") &&
								permissions.Any((dynamic p) => p.PermissionName == "CREATE RULE") &&
								permissions.Any((dynamic p) => p.PermissionName == "CREATE TABLE") &&
								permissions.Any((dynamic p) => p.PermissionName == "CREATE VIEW");

						default:
							throw new SchemaException(String.Format(CultureInfo.InvariantCulture, "GRANT ALL is not supported for {0} objects", type));
					}

				default:
					return permissions.Any((dynamic p) => p.PermissionName == permission);
			}
		}

		public override void Drop(IDbConnection connection)
		{
			connection.ExecuteSql(String.Format(@"REVOKE {0}", Name.Original));
		}
	}
}
