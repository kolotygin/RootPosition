using System.Runtime.Serialization;

namespace RootPosition.Analytics.Models
{
    [DataContract]
    public class GeoMapOptions
    {
        [DataMember(Name = "containerId")]
        public string ContainerId;
    }
}
