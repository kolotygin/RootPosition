using System.Runtime.Serialization;

namespace Root.Analytics.Models
{
    [DataContract]
    public class StatsDto
    {
        [DataMember(Name = "pageViews")]
        public string PageViews { get; set; }

        [DataMember(Name = "uniquePageViews")]
        public string UniquePageViews { get; set; }

        [DataMember(Name = "averageTime")]
        public string AverageTime { get; set; }

        [DataMember(Name = "entrances")]
        public string Entrances { get; set; }

        [DataMember(Name = "bounceRate")]
        public string BounceRate { get; set; }

        [DataMember(Name = "exitRate")]
        public string ExitRate { get; set; }
    }
}
