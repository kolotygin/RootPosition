using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Infrastructure.Extensions
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
    }
}
