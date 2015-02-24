using System.Runtime.Serialization;

namespace RootPosition.Analytics.Models
{
    [DataContract]
    public class SourcesViewOptions
    {
        [DataMember(Name = "containerId")]
        public string ContainerId;
    }
}
