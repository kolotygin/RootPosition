using System.Runtime.Serialization;

namespace RootPosition.Analytics.Models
{
    [DataContract]
    public class GraphOptions
    {
        [DataMember(Name = "containerId")]
        public string ContainerId;
    }
}
