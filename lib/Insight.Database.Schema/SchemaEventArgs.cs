#region Using directives

using System;
using System.Collections.Generic;
using System.Text;

#endregion

namespace Insight.Database.Schema
{
    /// <summary>
    /// Arguments for a Schema change event
    /// </summary>
    public class SchemaEventArgs : EventArgs
    {
        /// <summary>
        /// The type of Schema event
        /// </summary>
        /// <value>The type of Schema event</value>
        public SchemaEventType EventType { get { return _eventType; } }
        private SchemaEventType _eventType;

        /// <summary>
        /// The name of the schema object
        /// </summary>
        /// <value>The type of Schema event</value>
        public string ObjectName { get { return _objectName; } }
        private string _objectName;

        /// <summary>
        /// The schema object being updated.
        /// </summary>
        /// <value>The type of Schema event</value>
        /// <remarks>This is null for a drop object event</remarks>
        public SchemaObject SchemaObject { get { return _schemaObject; } }
        private SchemaObject _schemaObject;

		/// <summary>
		/// In the case of a DropFailed event, the exception that was thrown.
		/// </summary>
		/// <value>The exception that was thrown.</value>
		public Exception Exception { get; internal set; }
		
        internal SchemaEventArgs (SchemaEventType eventType, string objectName)
        {
            _eventType = eventType;
            _objectName = objectName;
        }

        internal SchemaEventArgs (SchemaEventType eventType, SchemaObject schemaObject)
        {
            _eventType = eventType;
            _schemaObject = schemaObject;
            _objectName = schemaObject.Name;
        }
    }
}
