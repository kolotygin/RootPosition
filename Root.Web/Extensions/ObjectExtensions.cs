using System.Collections;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Root.Web.Extensions
{
    public static class ObjectExtensions
    {
        public static string ToJson(this object obj)
        {
            var serializerSettings = new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };
            return JsonConvert.SerializeObject(obj, Formatting.None, serializerSettings);
        }

        public static string ToJson(this IEnumerable obj)
        {
            var serializerSettings = new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };
            return JsonConvert.SerializeObject(obj, Formatting.None, serializerSettings);
        }
    }
}
