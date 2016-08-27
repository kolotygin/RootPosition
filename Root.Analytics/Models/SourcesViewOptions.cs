using System.Runtime.Serialization;

namespace Root.Analytics.Models
{
    [DataContract]
    public class SourcesViewOptions
    {
        [DataMember(Name = "containerId")]
        public string ContainerId;
    }
}
