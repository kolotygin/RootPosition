using System.Runtime.Serialization;

namespace Root.Analytics.Models
{
    [DataContract]
    public class TimeLineOptions
    {
        [DataMember(Name = "containerId")]
        public string ContainerId;
    }
}
