using System;

namespace Web.Mvc.Models {

	public enum ImageOrientation {
		Undefined = 0,
		Landscape = 1,
		Portrait = 2
	}

	public class PhotoModel {

		private const string ThumbnailSuffix = ".thumb";

		public string PhotoSource;
		public string AlternateText;
		public string Title;
		public ImageOrientation Orientation;

		public string ThumbnailSource {
			get {
				return GetThumbnailSource(PhotoSource);
			}
		}

		private static string GetThumbnailSource(string source) {
			var i = source.LastIndexOf(".", StringComparison.InvariantCulture);
			return source.Substring(0, i) + ThumbnailSuffix + source.Substring(i);
		}

		public override string ToString() {
			return String.Format("{0} [{1}]", PhotoSource, Title);
		}

	}
}
