using System.Runtime.Serialization;

namespace RootPosition.Analytics.Models
{
    [DataContract]
    public class AnalyticsOptions
    {
        [DataMember(Name = "services")]
        public StatsServicesOptions Services;

        [DataMember(Name = "graph")]
        public GraphOptions Graph;

        [DataMember(Name = "map")]
        public MapOptions Map;

        public AnalyticsOptions()
        {
            Services = new StatsServicesOptions();
            Graph = new GraphOptions();
            Map = new MapOptions();
        }

    }
}
