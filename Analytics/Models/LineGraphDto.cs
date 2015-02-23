using System.Collections.Generic;
using System.Runtime.Serialization;
using RootPosition.Infrastructure.Collections;

namespace RootPosition.Analytics.Models
{
    [DataContract]
    public class LineGraphDto
    {
        [DataMember(Name = "points")]
        public IEnumerable<SerializableKeyValuePair<string, int>> Points { get; set; }
    }
}
