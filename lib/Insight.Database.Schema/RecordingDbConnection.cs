using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Insight.Database.Schema
{
	/// <summary>
	/// Wraps an IDbConnection with the ability to record the queries run against it.
	/// </summary>
	class RecordingDbConnection : DbConnection
	{
		#region Private Members
		/// <summary>
		/// The log that the connection writes to for items that need to be scripted.
		/// </summary>
		public StringBuilder ScriptLog { get; private set; }

		/// <summary>
		/// The log that the connection writes to for any command executed.
		/// </summary>
		public StringBuilder ExecutionLog { get; private set; }

		/// <summary>
		/// Gets the inner connection to use to execute the database commands.
		/// </summary>
		internal DbConnection InnerConnection { get; private set; }

		/// <summary>
		/// Specifies a default command timeout for all commands created through connection.CreateCommand.
		/// </summary>
		public int? CommandTimeout { get; set; }
		#endregion

		#region Constructors
		/// <summary>
		/// Initializes a new instance of the ReliableConnection class.
		/// A default retry strategy is used.
		/// </summary>
		/// <param name="innerConnection">The inner connection to wrap.</param>
		public RecordingDbConnection(DbConnection innerConnection)
		{
			if (innerConnection is RecordingDbConnection)
				throw new InvalidOperationException("Cannot record from within a RecordingDbConnection");

			InnerConnection = innerConnection;
			ScriptLog = new StringBuilder();
			ExecutionLog = new StringBuilder();
		}
		#endregion

		#region Logging Members
		/// <summary>
		/// Log the command in the recording.
		/// </summary>
		/// <param name="command">The text to log.</param>
		internal void LogCommand(string command)
		{
			// don't log if it is disabled
			if (_loggingDisabled == 0)
			{
				ScriptLog.AppendLine(command);
				ScriptLog.AppendLine("GO");
			}

			if (CanExecute)
			{
				ExecutionLog.AppendLine(command);
				ExecutionLog.AppendLine("GO");
			}
		}
		#endregion

		#region Logging Control Members
		/// <summary>
		/// Reset the log.
		/// </summary>
		public void ResetLog()
		{
			ScriptLog = new StringBuilder();
			ExecutionLog = new StringBuilder();
		}

		/// <summary>
		/// Executes the action while disabling logging.
		/// </summary>
		/// <param name="action">The action to execute.</param>
		public T DoNotLog<T>(Func<T> action)
		{
			_loggingDisabled++;
			try
			{
				return action();
			}
			finally
			{
				_loggingDisabled--;
			}
		}

		/// <summary>
		/// Executes the action while disabling logging.
		/// </summary>
		/// <param name="action">The action to execute.</param>
		public void DoNotLog(Action action)
		{
			DoNotLog(() => { action(); return true; });
		}

		/// <summary>
		/// Manages the disabling of logging. If > 0, then commands should not be logged.
		/// </summary>
		private int _loggingDisabled = 0;

		/// <summary>
		/// Logs the action while disabling execution.
		/// </summary>
		/// <param name="action">The action to execute.</param>
		public void OnlyRecord(Action action)
		{
			_executingDisabled++;
			try
			{
				action();
			}
			finally
			{
				_executingDisabled--;
			}
		}

		/// <summary>
		/// Gets a boolean value representing whether commands should be executed.
		/// </summary>
		internal bool CanExecute { get { return !ScriptOnly || (_executingDisabled == 0); } }

		/// <summary>
		/// Manages the disabling of execution. If > 0, then commands should not be executed.
		/// </summary>
		private int _executingDisabled = 0;

		/// <summary>
		/// When set to true, commands that modify the system will not be executed, only scripted.
		/// </summary>
		public bool ScriptOnly { get; set; }
		#endregion

		#region Core Implementation Methods
		/// <summary>
		/// Opens the database connection with retry.
		/// </summary>
		public override void Open()
		{
			InnerConnection.Open();
		}

		/// <summary>
		/// Creates a DbCommand for calls to the database.
		/// </summary>
		/// <returns>A ReliableCommand.</returns>
		protected override DbCommand CreateDbCommand()
		{
			var command = new RecordingDbCommand(InnerConnection.CreateCommand(), this);
			var disposable = command;

			try
			{

				// if we have a default command timeout, then set it on the command
				if (CommandTimeout.HasValue)
					command.CommandTimeout = CommandTimeout.Value;

				disposable = null;
				return command;
			}
			finally
			{
				if (disposable != null)
					disposable.Dispose();
			}
		}
		#endregion

		#region IDbConnection Implementation
		protected override DbTransaction BeginDbTransaction(IsolationLevel isolationLevel)
		{
			return InnerConnection.BeginTransaction(isolationLevel);
		}

		// protected override bool CanRaiseEvents
		// {
		// 	get
		// 	{
		// 		return false;
		// 	}
		// }

		public override void ChangeDatabase(string databaseName)
		{
			InnerConnection.ChangeDatabase(databaseName);
		}

		public override void Close()
		{
			InnerConnection.Close();
		}

		public override string ConnectionString
		{
			get
			{
				return InnerConnection.ConnectionString;
			}

			set
			{
				InnerConnection.ConnectionString = value;
			}
		}

		public override string ServerVersion
		{
			get { return InnerConnection.ServerVersion; }
		}

		public override string DataSource
		{
			get { return InnerConnection.DataSource; }
		}

		public override int ConnectionTimeout
		{
			get { return InnerConnection.ConnectionTimeout; }
		}

		public override string Database
		{
			get { return InnerConnection.Database; }
		}

		public override ConnectionState State
		{
			get { return InnerConnection.State; }
		}

		// public override DataTable GetSchema()
		// {
		// 	return InnerConnection.GetSchema();
		// }

		// public override DataTable GetSchema(string collectionName)
		// {
		// 	return InnerConnection.GetSchema(collectionName);
		// }

		// public override DataTable GetSchema(string collectionName, string[] restrictionValues)
		// {
		// 	return InnerConnection.GetSchema(collectionName, restrictionValues);
		// }
		#endregion
	}
}
