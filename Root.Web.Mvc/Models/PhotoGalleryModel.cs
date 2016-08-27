using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Root.Web.Mvc.Models
{
    public class PhotoGalleryModel
    {
        private readonly Lazy<List<PhotoModel>> _photos = new Lazy<List<PhotoModel>>(() => new List<PhotoModel>());

        public PhotoGalleryModel(string path, DateTime date)
        {
            Path = path;
            Date = date;
        }

        public string Path { get; }

        [JsonProperty(ItemConverterType = typeof(JavaScriptDateTimeConverter))]
        public DateTime Date { get; }

        public List<PhotoModel> Photos => _photos.Value;

//		public List<PhotoModel> GetThumbnails()
//		{
//			return Photos.Select(photo => new PhotoModel { Source = GetThumbnailSource(photo.Source), Orientation = photo.Orientation }).ToList();
//		}
//
//		private string GetThumbnailSource(string source)
//		{
//			var i = source.LastIndexOf(".", StringComparison.InvariantCulture);
//			return source.Substring(0, i) + ThumbnailSuffix + source.Substring(i);
//		}
	}

}
