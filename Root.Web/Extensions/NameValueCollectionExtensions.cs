using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using Root.Web.Url;

namespace Root.Web.Extensions
{
    public static class NameValueCollectionExtensions
    {
        public static string AsEncodedQueryString(this NameValueCollection collection)
        {
            var nameValueStrings =
                from string name in collection
                where !string.IsNullOrEmpty(name) && !string.IsNullOrEmpty(collection[name])
                select string.Concat(name, "=", StringDecoder.Encode(collection[name]));
            return string.Join("&", nameValueStrings);
        }

        public static string AsCommaDelimitedString(this NameValueCollection collection)
        {
            var items = new List<string>();
            foreach (string name in collection)
            {
                items.Add(string.Concat(name, "=", collection[name]));
            }
            return string.Join(",", items.ToArray());
        }

        public static void Add(this NameValueCollection collection, params KeyValuePair<string, string>[] resourceParameters)
        {
            collection.Add(true, resourceParameters);
        }

        public static void Add(this NameValueCollection collection, bool overrideIfExist, params KeyValuePair<string, string>[] resourceParameters)
        {
            if (resourceParameters != null)
            {
                foreach (var parameter in resourceParameters)
                {
                    if (overrideIfExist || !collection.Contains(parameter.Key))
                    {
                        collection[parameter.Key] = parameter.Value;
                    }
                }
            }
        }

        public static bool Contains(this NameValueCollection collection, string key)
        {
            return (collection[key] != null);
        }

    }

}
