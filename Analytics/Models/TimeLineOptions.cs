using System.Runtime.Serialization;

namespace RootPosition.Analytics.Models
{
    [DataContract]
    public class TimeLineOptions
    {
        [DataMember(Name = "containerId")]
        public string ContainerId;
    }
}
