using System.Collections.Generic;
using System.Runtime.Serialization;
using Root.Web.Collections;

namespace Root.Analytics.Models
{
    [DataContract]
    public class LineGraphDto
    {
        [DataMember(Name = "points")]
        public IEnumerable<SerializableKeyValuePair<string, int>> Points { get; set; }
    }
}
