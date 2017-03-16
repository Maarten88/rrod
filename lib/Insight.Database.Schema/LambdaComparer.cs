using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Insight.Database.Schema
{
	/// <summary>
	/// Implements IEqualityComparer with a lambda expression.
	/// </summary>
	/// <typeparam name="T">The type to compare.</typeparam>
	class LambdaComparer<T> : IEqualityComparer<T>
    {
        private readonly Func<T, T, bool> _expression;

        public LambdaComparer(Func<T, T, bool> lambda)
        {
            _expression = lambda;
        }

        public bool Equals(T x, T y)
        {
            return _expression(x, y);
        }

        public int GetHashCode(T obj)
        {
            return 0;
        }
    }

	static class LambdaComparerExtensions
	{
		/// <summary>
		/// Returns all items in the first collection except the ones in the second collection that match the lambda condition.
		/// </summary>
		/// <typeparam name="T">The type.</typeparam>
		/// <param name="listA">The first list.</param>
		/// <param name="listB">The second list.</param>
		/// <param name="lambda">The filter expression.</param>
		/// <returns>The filtered list.</returns>
		public static IEnumerable<T> Except<T>(this IEnumerable<T> listA, IEnumerable<T> listB, Func<T, T, bool> lambda)
		{
			return listA.Except(listB, new LambdaComparer<T>(lambda));
		}

		/// <summary>
		/// Returns all items in the first collection that intersect the ones in the second collection that match the lambda condition.
		/// </summary>
		/// <typeparam name="T">The type.</typeparam>
		/// <param name="listA">The first list.</param>
		/// <param name="listB">The second list.</param>
		/// <param name="lambda">The filter expression.</param>
		/// <returns>The filtered list.</returns>
		public static IEnumerable<T> Intersect<T>(this IEnumerable<T> listA, IEnumerable<T> listB, Func<T, T, bool> lambda)
		{
			return listA.Intersect(listB, new LambdaComparer<T>(lambda));
		}
	}
}
