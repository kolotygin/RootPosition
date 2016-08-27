using System.Collections.Generic;
using System.Linq;

namespace Root.Infrastructure.Extensions
{
    public static class StringExtensions
    {
        /// <summary>
        /// Link text and stringToLink strings together and insert delimiter between them
        /// </summary>
        /// <param name="stringValue"></param>
        /// <param name="stringToLink"></param>
        /// <param name="delimiter"></param>
        /// <returns></returns>
        /// <remarks></remarks>
        public static string Append(this string stringValue, string stringToLink, string delimiter)
        {
            if (string.IsNullOrEmpty(stringValue))
            {
                return stringToLink;
            }
            if (string.IsNullOrEmpty(stringToLink))
            {
                return stringValue;
            }
            return stringValue + delimiter + stringToLink;
        }

        public static string TextOrEmpty(this string text)
        {
            return text ?? string.Empty;
        }

        public static IEnumerable<string> ToEnumerable(this string text, char delimiter)
        {
            if (string.IsNullOrEmpty(text))
            {
                return new string[0];
            }
            return from stringItem in text.Split(delimiter)
                   let trimmedItem = stringItem.Trim()
                   where !string.IsNullOrEmpty(trimmedItem)
                   select trimmedItem;
        }
    }
}
