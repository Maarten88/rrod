using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace Insight.Database.Schema
{
	/// <summary>
	/// Converts plural table names to singular function names.
	/// </summary>
    class Singularizer
    {
		/// <summary>
		/// Words that should stay the same.
		/// </summary>
        private static readonly IList<string> Unpluralizables =
            new List<string>
                {
                    "EQUIPMENT",
                    "INFORMATION",
                    "RICE",
                    "MONEY",
                    "SPECIES",
                    "SERIES",
                    "FISH",
                    "SHEEP",
                    "DEER"
                };

		/// <summary>
		/// Mappings from plural to single.
		/// </summary>
        private static readonly IDictionary<string, string> Singularizations =
            new Dictionary<string, string>
                {
                    // Start with the rarest cases, and move to the most common
                    {"people", "Person"},
                    {"oxen", "Ox"},
                    {"children", "Child"},
                    {"feet", "Foot"},
                    {"teeth", "Tooth"},
                    {"geese", "Goose"},
                    // and now the more standard rules.
                    {"wives?", "wife"},
                    {"(.*)lves?", "$1lf"},
                    // ie, wolf, wife
                    {"(.*)men$", "$1man"},
                    {"(.+[aeiou])ys$", "$1y"},
                    {"(.+[^aeiou])ies$", "$1y"},
                    {"(.+z)zes$", "$1"},
                    {"(.+)zes$", "$1ze"},
                    {"([m|l])ice$", "$1ouse"},
                    {"matrices", @"Matrix"},
                    {"indices", @"Index"},
                    {"(.+[^aeiou])ices$","$1ice"},
                    {"(.*)ices", @"$1ex"},
                    // ie, matrix, index
                    {"(octop|vir)i$", "$1us"},
                    {"(.+(ase))s$", @"$1"},
                    {"(.+(s|x|sh|ch))es$", @"$1"},
                    {"(.+)s$", @"$1"}
                };

		/// <summary>
		/// Converts a word to its plural form or keeps it the same.
		/// </summary>
		/// <param name="word">The word to singularize.</param>
		/// <returns>The singular form of the word.</returns>
        public static string Singularize(string word)
        {
            if (Unpluralizables.Contains(word.ToUpperInvariant()))
            {
                return word;
            }

            foreach (var singularization in Singularizations)
            {
                if (Regex.IsMatch(word, singularization.Key, RegexOptions.IgnoreCase))
                {
					return Regex.Replace(word, singularization.Key, singularization.Value, RegexOptions.IgnoreCase);
                }
            }

            return word;
        }
    }
}
