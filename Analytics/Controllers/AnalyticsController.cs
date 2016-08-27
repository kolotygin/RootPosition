using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Web.Hosting;
using System.Web.Mvc;
using Root.Analytics.Models;
using Root.Web.Collections;

namespace Root.Analytics.Controllers
{
    public class AnalyticsController : Controller
    {

        public JsonResult GetStatsData(string startDate, string endDate)
        {
            var response = new
            {
                Success = true,
                Stats = GetStatsDataInternal(startDate, endDate)
            };
            return new JsonResult() { Data = response, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public JsonResult GetGraphData(string startDate, string endDate, int scale)
        {
            var response = new
            {
                Success = true,
                Points = GetGraphDataInternal(startDate, endDate, scale)
            };
            return new JsonResult() { Data = response, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public JsonResult GetMapData(string country = "")
        {
            var response = new
            {
                Success = true,
                Map = GetMapDataInternal(country)
            };
            return new JsonResult() { Data = response, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public JsonResult GetChoroplethData(string country = "")
        {
            var response = new
            {
                Success = true,
                Choropleth = GetChoroplethDataInternal(country)
            };
            return new JsonResult() { Data = response, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        private IEnumerable<SerializableKeyValuePair<string, int>> GetChoroplethDataInternal(string country)
        {
            List<SerializableKeyValuePair<string, int>> choropleth;
            if (String.IsNullOrEmpty(country))
            {
                choropleth = new List<SerializableKeyValuePair<string, int>>
                {
                    new SerializableKeyValuePair<string, int>("USA", 20),
                    new SerializableKeyValuePair<string, int>("RUS", 10),
                    new SerializableKeyValuePair<string, int>("CAN", 15),
                    new SerializableKeyValuePair<string, int>("MEX", 10),
                    new SerializableKeyValuePair<string, int>("UKR", 5),
                    new SerializableKeyValuePair<string, int>("GBR", 30),
                    new SerializableKeyValuePair<string, int>("EST", 20),
                    new SerializableKeyValuePair<string, int>("BRN", 10),
                    new SerializableKeyValuePair<string, int>("CHN", 30),
                    new SerializableKeyValuePair<string, int>("AUT", 15),
                    new SerializableKeyValuePair<string, int>("ARG", 10),
                    new SerializableKeyValuePair<string, int>("FRA", 30),
                    new SerializableKeyValuePair<string, int>("ESP", 10),
                    new SerializableKeyValuePair<string, int>("ITA", 20),
                    new SerializableKeyValuePair<string, int>("BRA", 20)
                };
            }
            else if (string.Equals(country, "USA", StringComparison.InvariantCultureIgnoreCase))
            {
                choropleth = new List<SerializableKeyValuePair<string, int>>
                {
                    new SerializableKeyValuePair<string, int>("Alabama", 11791),
                    new SerializableKeyValuePair<string, int>("Arkansas", 13705),
                    new SerializableKeyValuePair<string, int>("Arizona", 13847),
                    new SerializableKeyValuePair<string, int>("California", 17979),
                    new SerializableKeyValuePair<string, int>("Colorado", 10325),
                    new SerializableKeyValuePair<string, int>("Connecticut", 13209),
                    new SerializableKeyValuePair<string, int>("Delaware", 14345),
                    new SerializableKeyValuePair<string, int>("Florida", 16304),
                    new SerializableKeyValuePair<string, int>("Georgia", 13891),
                    new SerializableKeyValuePair<string, int>("Iowa", 15297),
                    new SerializableKeyValuePair<string, int>("Idaho", 14285),
                    new SerializableKeyValuePair<string, int>("Illinois", 15297),
                    new SerializableKeyValuePair<string, int>("Indiana", 14220),
                    new SerializableKeyValuePair<string, int>("Kansas", 10124),
                    new SerializableKeyValuePair<string, int>("Kentucky", 09403),
                    new SerializableKeyValuePair<string, int>("Louisiana", 09904),
                    new SerializableKeyValuePair<string, int>("Maine", 13877),
                    new SerializableKeyValuePair<string, int>("Maryland", 12457),
                    new SerializableKeyValuePair<string, int>("Massachusetts", 11458),
                    new SerializableKeyValuePair<string, int>("Michigan", 11058),
                    new SerializableKeyValuePair<string, int>("Minnesota", 12359),
                    new SerializableKeyValuePair<string, int>("Missouri", 10212),
                    new SerializableKeyValuePair<string, int>("Mississippi", 11306),
                    new SerializableKeyValuePair<string, int>("Montana", 08145),
                    new SerializableKeyValuePair<string, int>("North Carolina", 13554),
                    new SerializableKeyValuePair<string, int>("North Dakota", 10278),
                    new SerializableKeyValuePair<string, int>("Nebraska", 11619),
                    new SerializableKeyValuePair<string, int>("New Hampshire", 10204),
                    new SerializableKeyValuePair<string, int>("New Jersey", 12831),
                    new SerializableKeyValuePair<string, int>("New Mexico", 08925),
                    new SerializableKeyValuePair<string, int>("Nevada", 09640),
                    new SerializableKeyValuePair<string, int>("New York", 11327),
                    new SerializableKeyValuePair<string, int>("Ohio", 12075),
                    new SerializableKeyValuePair<string, int>("Oklahoma", 07693),
                    new SerializableKeyValuePair<string, int>("Oregon", 13154),
                    new SerializableKeyValuePair<string, int>("Pennsylvania", 10601),
                    new SerializableKeyValuePair<string, int>("Rhode Island", 14192),
                    new SerializableKeyValuePair<string, int>("South Carolina", 11247),
                    new SerializableKeyValuePair<string, int>("South Dakota", 10760),
                    new SerializableKeyValuePair<string, int>("Tennessee", 07648),
                    new SerializableKeyValuePair<string, int>("Texas", 08873),
                    new SerializableKeyValuePair<string, int>("Utah", 09638),
                    new SerializableKeyValuePair<string, int>("Virginia", 09660),
                    new SerializableKeyValuePair<string, int>("Vermont", 10762),
                    new SerializableKeyValuePair<string, int>("Washington", 11457),
                    new SerializableKeyValuePair<string, int>("Wisconsin", 11130),
                    new SerializableKeyValuePair<string, int>("West Virginia", 05777),
                    new SerializableKeyValuePair<string, int>("Wyoming", 05712)
                };
            }
            else
            {
                choropleth = new List<SerializableKeyValuePair<string, int>>();
            }
            return choropleth;
        }

        private static string GetMapDataInternal(string country)
        {
            var jsonAsString = string.Empty;
            try
            {
                var fileName = String.IsNullOrEmpty(country) ? "World.topo.json" : country + ".topo.json";
                var file = HostingEnvironment.MapPath("/App_Data/") + fileName;
                using (var sr = new StreamReader(file))
                {
                    jsonAsString = sr.ReadToEnd();
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
            return jsonAsString;
        }

        private static StatsDto GetStatsDataInternal(string startDate, string endDate)
        {
            return new StatsDto
            {
                AverageTime = "00:05:08",
                BounceRate = "31.00%",
                Entrances = "103",
                ExitRate = "24.50%",
                PageViews = "302",
                UniquePageViews = "509"
            };
        }


        private static DateTime GetDate(string dateString)
        {
            DateTime parsedDate;
            DateTime.TryParseExact(dateString, "yyyy-MM-dd", null, DateTimeStyles.None, out parsedDate);
            return parsedDate;
        }

        private static int GetDifferenceInYears(DateTime startDate, DateTime endDate)
        {
            return (endDate.Year - startDate.Year - 1) +
                (((endDate.Month > startDate.Month) ||
                ((endDate.Month == startDate.Month) && (endDate.Day >= startDate.Day))) ? 1 : 0);
        }

        public static int GetDifferenceInMonths(DateTime startDate, DateTime endDate)
        {
            if (startDate > endDate) // If from > to, invert
            {
                var temp = startDate;
                startDate = endDate;
                endDate = temp;
            }
            var monthDiff = Math.Abs((endDate.Year * 12 + (endDate.Month - 1)) - (startDate.Year * 12 + (startDate.Month - 1)));
            if (startDate.AddMonths(monthDiff) > endDate || endDate.Day < startDate.Day)
            {
                return monthDiff - 1;
            }
            else
            {
                return monthDiff;
            }
        }

        public static int GetDifferenceInDays(DateTime startDate, DateTime endDate)
        {
            return endDate.Date.Subtract(startDate.Date).Days;
        }

        public static int GetDifferenceInWeeks(DateTime startDate, DateTime endDate)
        {
            return GetDifferenceInDays(startDate, endDate) / 7;
        }

        private static LineGraphDto GetGraphDataInternal(string startDateString, string endDateString, int scale)
        {
            var points = new List<SerializableKeyValuePair<string, int>>();
            DateTime startDate = GetDate(startDateString);
            DateTime endDate = GetDate(endDateString);

            var rnd = new Random();

            int max = 0;

            DateTime currentDate;
            switch(scale)
            {
                case 1:
                    max = GetDifferenceInDays(startDate, endDate);
                    currentDate = startDate;
                    for (int i = 0; i <= max; i++)
                    {
                        currentDate = currentDate.AddDays(1);
                        //points.Add(new SerializableKeyValuePair<string, int>(currentDate.ToString("d"), rnd.Next(500)));
                        points.Add(new SerializableKeyValuePair<string, int>(currentDate.ToString("yyyy-MM-dd"), rnd.Next(500)));
                    }
                    break;
                case 2:
                    max = GetDifferenceInWeeks(startDate, endDate);
                    currentDate = startDate;
                    for (int i = 0; i <= max; i++)
                    {
                        currentDate = currentDate.AddDays(7);
                        //points.Add(new SerializableKeyValuePair<string, int>(currentDate.ToString("d"), rnd.Next(600)));
                        points.Add(new SerializableKeyValuePair<string, int>(currentDate.ToString("yyyy-MM-dd"), rnd.Next(600)));
                    }
                    break;
                case 3:
                    max = GetDifferenceInMonths(startDate, endDate);
                    currentDate = startDate;
                    for (int i = 0; i <= max; i++)
                    {
                        currentDate = currentDate.AddMonths(1);
                        //points.Add(new SerializableKeyValuePair<string, int>(currentDate.ToString("y"), rnd.Next(400)));
                        points.Add(new SerializableKeyValuePair<string, int>(currentDate.ToString("yyyy-MM-dd"), rnd.Next(400)));
                    }
                    break;
                case 4:
                    max = GetDifferenceInYears(startDate, endDate);
                    currentDate = startDate;
                    for (int i = 0; i <= max; i++)
                    {
                        currentDate = currentDate.AddYears(1);
                        //points.Add(new SerializableKeyValuePair<string, int>(currentDate.ToString("Y"), rnd.Next(800)));
                        points.Add(new SerializableKeyValuePair<string, int>(currentDate.ToString("yyyy-MM-dd"), rnd.Next(800)));
                    }
                    break;
            }

            return new LineGraphDto { Points = points };
        }

    }

}
