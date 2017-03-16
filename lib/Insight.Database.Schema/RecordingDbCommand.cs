using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Insight.Database.Schema
{
	/// <summary>
	/// Wraps an IDbCommand and allows the commands to be recorded.
	/// </summary>
	class RecordingDbCommand : DbCommand
	{
		#region Private Members
		/// <summary>
		/// Gets the inner command to use to execute the command.
		/// </summary>
		private DbCommand InnerCommand { get; set; }

		/// <summary>
		/// The recording connection we are associated with.
		/// </summary>
		private RecordingDbConnection RecordingConnection { get; set; }
		#endregion

		#region Constructors
		/// <summary>
		/// Initializes a new instance of the ReliableCommand class, and bind it to the specified ReliableConnection and innerCommand.
		/// </summary>
		/// <param name="retryStrategy">The retry strategy to use for the command.</param>
		/// <param name="innerCommand">The innerCommand to bind to.</param>
		public RecordingDbCommand(DbCommand innerCommand, RecordingDbConnection recordingConnection)
		{
			if (innerCommand is RecordingDbCommand)
				throw new InvalidOperationException("Cannot record from within a RecordingDbCommand");

			InnerCommand = innerCommand;
			RecordingConnection = recordingConnection;
		}
		#endregion

		#region Synchronous DbCommand Implementation
		public override int ExecuteNonQuery()
		{
			RecordingConnection.LogCommand(CommandText);

			if (!RecordingConnection.CanExecute)
				return 0;

			return InnerCommand.ExecuteNonQuery();
		}

		protected override DbDataReader ExecuteDbDataReader(CommandBehavior behavior)
		{
			RecordingConnection.LogCommand(CommandText);

			if (!RecordingConnection.CanExecute)
				return null;

			return InnerCommand.ExecuteReader(behavior);
		}

		public override object ExecuteScalar()
		{
			RecordingConnection.LogCommand(CommandText);

			if (!RecordingConnection.CanExecute)
				return null;

			return InnerCommand.ExecuteScalar();
		}
		#endregion

		#region Support Methods
		public override void Prepare()
		{
			InnerCommand.Prepare();
		}
		#endregion

		#region IDbCommand Implementation
		public override void Cancel()
		{
			InnerCommand.Cancel();
		}

		public override string CommandText
		{
			get
			{
				return InnerCommand.CommandText;
			}

			set
			{
				InnerCommand.CommandText = value;
			}
		}

		public override int CommandTimeout
		{
			get
			{
				return InnerCommand.CommandTimeout;
			}

			set
			{
				InnerCommand.CommandTimeout = value;
			}
		}

		public override CommandType CommandType
		{
			get
			{
				return InnerCommand.CommandType;
			}

			set
			{
				InnerCommand.CommandType = value;
			}
		}

		protected override DbConnection DbConnection
		{
			get
			{
				return InnerCommand.Connection;
			}

			set
			{
				InnerCommand.Connection = value.Unwrap();
			}
		}

		protected override DbParameter CreateDbParameter()
		{
			return InnerCommand.CreateParameter();
		}

		protected override DbParameterCollection DbParameterCollection
		{
			get { return InnerCommand.Parameters; }
		}

		protected override DbTransaction DbTransaction
		{
			get
			{
				return InnerCommand.Transaction;
			}

			set
			{
				InnerCommand.Transaction = value;
			}
		}

		public override UpdateRowSource UpdatedRowSource
		{
			get
			{
				return InnerCommand.UpdatedRowSource;
			}

			set
			{
				InnerCommand.UpdatedRowSource = value;
			}
		}

		public override bool DesignTimeVisible
		{
			get
			{
				return InnerCommand.DesignTimeVisible;
			}

			set
			{
				InnerCommand.DesignTimeVisible = value;
			}
		}
		#endregion
	}
}
