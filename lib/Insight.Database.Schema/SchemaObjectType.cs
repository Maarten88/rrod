#region Using directives

using System;
using System.Collections.Generic;
using System.Text;
using System.Diagnostics.CodeAnalysis;

#endregion

namespace Insight.Database.Schema
{
    #region SchemaObjectType Enumeration
    /// <summary>
    /// The type of a database object
    /// </summary>
    /// <remarks>These are in the order that objects need to be created</remarks>
    public enum SchemaObjectType
    {
		/// <summary>
		/// A user script that needs to run first
		/// </summary>
		[SuppressMessage("Microsoft.Naming", "CA1702:CompoundWordsShouldBeCasedCorrectly", MessageId = "PreScript", Justification="This field value is stored in databases")]
		UserPreScript,

        /// <summary>
        /// An internal script that needs to run early, but after user scripts
        /// </summary>
        [SuppressMessage("Microsoft.Naming", "CA1702:CompoundWordsShouldBeCasedCorrectly", MessageId = "PreScript", Justification = "This field value is stored in databases")]
        InternalPreScript,

		/// <summary>
		/// A SQL Server 2005 ROLE
		/// </summary>
		Role,

		/// <summary>
		/// A SQL Server 2005 SCHEMA
		/// </summary>
		Schema,

        /// <summary>
        /// A user defined type
        /// </summary>
        UserDefinedType,

		/// <summary>
		/// A database master key
		/// </summary>
		MasterKey,

		/// <summary>
		/// A certificate
		/// </summary>
		Certificate,

		/// <summary>
		/// A symmetric key
		/// </summary>
		SymmetricKey,

		/// <summary>
		/// A partition function
		/// </summary>
		PartitionFunction,

		/// <summary>
		/// A partition scheme
		/// </summary>
		PartitionScheme,

		/// <summary>
		/// Service Broker Message Type
		/// </summary>
		MessageType,

		/// <summary>
		/// Service Broker Contract
		/// </summary>
		Contract,

		/// <summary>
		/// Service Broker Priority
		/// </summary>
		BrokerPriority,

		/// <summary>
		/// Service Broker Queue
		/// </summary>
		Queue,

		/// <summary>
		/// Service Broker Service
		/// </summary>
		Service,

		/// <summary>
        /// A table in the database
        /// </summary>
        Table,

		/// <summary>
		/// A default in the database
		/// </summary>
		Default,

        /// <summary>
        /// A primary key on a table
        /// </summary>
        PrimaryKey,

		/// <summary>
		/// Automatically generated Select, Insert, Update, Delete
		/// </summary>
		AutoProc,

        /// <summary>
        /// A constraint on a table
        /// </summary>
        Constraint,

        /// <summary>
        /// A foreign key constraint
        /// </summary>
        ForeignKey,

        /// <summary>
        /// A user defined function
        /// </summary>
        Function,

		/// <summary>
		/// An indexed view is marked so that insight won't drop it on a procedure change
		/// </summary>
		IndexedView,

		/// <summary>
		/// An index
		/// </summary>
		Index,

        /// <summary>
        /// A view on one or more tables
        /// </summary>
        View,

		/// <summary>
		/// The primary XML Index on a column
		/// </summary>
		PrimaryXmlIndex,

		/// <summary>
		/// A secondary XML Index on a column
		/// </summary>
		SecondaryXmlIndex,

        /// <summary>
        /// A stored procedure
        /// </summary>
        StoredProcedure,

        /// <summary>
        /// A login to the server
        /// </summary>
		[SuppressMessage("Microsoft.Naming", "CA1726:UsePreferredTerms", MessageId = "Login")]
		Login,

        /// <summary>
        /// A user in the database
        /// </summary>
        User,

        /// <summary>
        /// Permission script
        /// </summary>
        Permission,

        /// <summary>
        /// A table trigger
        /// </summary>
        Trigger,

		/// <summary>
		/// General padding things added by SQL Server scripter like SET ANSI NULLS ON
		/// </summary>
		Unused,

        /// <summary>
        /// Objects that were scripted by the dependency generator, or just need to be run by the user
        /// </summary>
        Script,

		/// <summary>
		/// A script object that just runs when it changes
		/// </summary>
		UserScript,

        /// <summary>
        /// An object that contains SQL that we don't support.
        /// </summary>
        Unsupported
    }
    #endregion
}
