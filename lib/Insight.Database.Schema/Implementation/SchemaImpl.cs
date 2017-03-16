using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace Insight.Database.Schema.Implementation
{
	abstract class SchemaImpl
	{
		/// <summary>
		/// Determines how to split a GO statement in a batch.
		/// </summary>
		protected static Regex _goSplit = new Regex(@"^\s*GO\s*$", RegexOptions.IgnoreCase | RegexOptions.Compiled | RegexOptions.Multiline);

		public SqlName Name { get; private set; }
		public string Sql { get; private set; }

		public SchemaImpl(string name, string sql, int expectedPartsInName)
		{
			Name = new SqlName(name, expectedPartsInName);
			Sql = sql;
		}

		public virtual void Install(IDbConnection connection, IEnumerable<SchemaObject> objects)
		{
			try
			{
				foreach (string s in _goSplit.Split(Sql).Where(piece => !String.IsNullOrWhiteSpace(piece)))
					connection.ExecuteSql(s);
			}
			catch (Exception e)
			{
				throw new InvalidOperationException(String.Format(CultureInfo.InvariantCulture, "Cannot create SQL object {0}: {1}", Name.FullName, e.Message), e);
			}
		}

		public virtual bool CanDrop(SchemaInstaller.InstallContext context, IDbConnection connection)
		{
			return true;
		}

		public virtual bool CanModify(SchemaInstaller.InstallContext context, IDbConnection connection)
		{
			return CanDrop(context, connection);
		}

		public abstract void Drop(IDbConnection connection);
		public abstract bool Exists(IDbConnection connection);

		[System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1502:AvoidExcessiveComplexity")]
		public static SchemaImpl GetImplementation(SchemaObjectType type, string name, string sql)
		{
			switch (type)
			{
				case SchemaObjectType.AutoProc:
					return new AutoProc(name, sql);
				case SchemaObjectType.BrokerPriority:
					return new BrokerPriority(name, sql);
				case SchemaObjectType.Certificate:
					return new Certificate(name, sql);
				case SchemaObjectType.Contract:
					return new Contract(name, sql);
				case SchemaObjectType.Constraint:
					return new Constraint(name, sql);
				case SchemaObjectType.Default:
					return new Default(name, sql);
				case SchemaObjectType.Index:
					return new Index(name, sql);
				case SchemaObjectType.ForeignKey:
					return new Constraint(name, sql);
				case SchemaObjectType.Function:
					return new Function(name, sql);
				case SchemaObjectType.IndexedView:
					return new View(name, sql);
				case SchemaObjectType.Login:
					return new Login(name, sql);
				case SchemaObjectType.MasterKey:
					return new MasterKey(name, sql);
				case SchemaObjectType.MessageType:
					return new MessageType(name, sql);
				case SchemaObjectType.PartitionFunction:
					return new PartitionFunction(name, sql);
				case SchemaObjectType.PartitionScheme:
					return new PartitionScheme(name, sql);
				case SchemaObjectType.Permission:
					return new Permission(name, sql);
				case SchemaObjectType.PrimaryKey:
					return new PrimaryKey(name, sql);
				case SchemaObjectType.PrimaryXmlIndex:
					return new Index(name, sql);
				case SchemaObjectType.Queue:
					return new Queue(name, sql);
				case SchemaObjectType.Role:
					return new Role(name, sql);
				case SchemaObjectType.Schema:
					return new Schema(name, sql);
				case SchemaObjectType.SecondaryXmlIndex:
					return new Index(name, sql);
				case SchemaObjectType.Service:
					return new Service(name, sql);
				case SchemaObjectType.StoredProcedure:
					return new StoredProcedure(name, sql);
				case SchemaObjectType.SymmetricKey:
					return new SymmetricKey(name, sql);
				case SchemaObjectType.Table:
					return new Table(name, sql);
				case SchemaObjectType.Trigger:
					return new Trigger(name, sql);
				case SchemaObjectType.User:
					return new User(name, sql);
				case SchemaObjectType.UserDefinedType:
					return new UserDefinedType(name, sql);
				case SchemaObjectType.View:
					return new View(name, sql);


				case SchemaObjectType.UserPreScript:
                case SchemaObjectType.InternalPreScript:
                case SchemaObjectType.Unused:
				case SchemaObjectType.Script:
				case SchemaObjectType.UserScript:
					return new Script(name, sql);

				default:
					return null;
			}
		}
	}
}
