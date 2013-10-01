using System;
using System.Web;

namespace Infrastructure.Extensions
{
	public static class ServerExtensions
	{
		public static string RelativePath(string path)
		{
			return path.Replace(HttpContext.Current.Request.ServerVariables["APPL_PHYSICAL_PATH"], "~/").Replace(@"\", "/");
		}

		public static string MapPathReverse(string fullServerPath)
		{
			return @"~\" + fullServerPath.Replace(HttpContext.Current.Request.PhysicalApplicationPath.GetTextOrEmpty(), String.Empty);
		}

		static string RelativeFromAbsolutePath(string path)
		{
			var request = HttpContext.Current.Request;
			var applicationPath = request.PhysicalApplicationPath.GetTextOrEmpty();
			var virtualDir = request.ApplicationPath;
			virtualDir = virtualDir == "/" ? virtualDir : (virtualDir + "/");
			return path.Replace(applicationPath, virtualDir).Replace(@"\", "/");
		}

	}
}
