using System.Runtime.Serialization;
using RootPosition.Infrastructure.JavaScript;

namespace RootPosition.Infrastructure.Collections
{
    [DataContract]
    public class SerializableKeyValuePair<TKey, TValue>
    {
        [DataMember(Name = "key")]
        public TKey Key { get; set; }

        [DataMember(Name = "value")]
        public TValue Value { get; set; }

        public SerializableKeyValuePair(TKey key, TValue value)
        {
            Key = key;
            Value = value;
        }

        public override string ToString()
        {
            return Json.Serialize(this);
        }
    }

}
