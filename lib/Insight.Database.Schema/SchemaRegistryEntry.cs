using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Insight.Database.Schema
{
	/// <summary>
	/// Represents a record in the schema registry.
	/// </summary>
	class SchemaRegistryEntry
	{
		/// <summary>
		/// The schema group to which this belongs.
		/// </summary>
		public string SchemaGroup;

		/// <summary>
		/// The name of the schema object.
		/// </summary>
		public string ObjectName;

		/// <summary>
		/// The signature of the object.
		/// </summary>
		public string Signature;

		/// <summary>
		/// The type of the object.
		/// </summary>
		public SchemaObjectType Type;

		/// <summary>
		/// The original order in which the object was installed.
		/// </summary>
		public int OriginalOrder;
	}
}
