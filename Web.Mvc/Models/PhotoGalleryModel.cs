using System.Collections.Generic;

namespace Web.Mvc.Models
{
	public class PhotoGalleryModel
	{
		public string Path { get; set; }
		public string Title { get; set; }
		public List<PhotoModel> Photos { get; set; }

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
