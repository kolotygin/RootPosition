using System.Runtime.Serialization;

namespace RootPosition.Analytics.Models
{
    [DataContract]
    public class AnalyticsOptions
    {
        [DataMember(Name = "services")]
        public StatsServicesOptions Services;

        [DataMember(Name = "timeLineView")]
        public TimeLineOptions TimeLineView;

        [DataMember(Name = "geoMapView")]
        public GeoMapOptions GeoMapView;

        [DataMember(Name = "sourcesView")]
        public SourcesViewOptions SourcesView;

        public AnalyticsOptions()
        {
            Services = new StatsServicesOptions();
            TimeLineView = new TimeLineOptions();
            GeoMapView = new GeoMapOptions();
            SourcesView = new SourcesViewOptions();
        }

    }
}
