using System.Runtime.Serialization;

namespace RootPosition.Analytics.Models
{
    [DataContract]
    public class MapOptions
    {
        [DataMember(Name = "containerId")]
        public string ContainerId;

        [DataMember(Name = "zoomId")]
        public string ZoomId;
    }
}
