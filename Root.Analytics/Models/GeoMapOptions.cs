using System.Runtime.Serialization;

namespace Root.Analytics.Models
{
    [DataContract]
    public class GeoMapOptions
    {
        [DataMember(Name = "containerId")]
        public string ContainerId;
    }
}
