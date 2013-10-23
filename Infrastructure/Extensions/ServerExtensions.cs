using System;
using System.Web;

namespace Infrastructure.Extensions
{
	public static class ServerExtensions
	{
		public static string RelativePath(string absolutePath)
		{
			return absolutePath.Replace(HttpContext.Current.Request.ServerVariables["APPL_PHYSICAL_PATH"], "~/").Replace(@"\", "/");
		}

		public static string MapPathReverse(string absolutePath)
		{
			return @"~\" + absolutePath.Replace(HttpContext.Current.Request.PhysicalApplicationPath.GetTextOrEmpty(), String.Empty);
		}

		static string GetVirtualPath(string absolutePath)
		{
			var request = HttpContext.Current.Request;
			var applicationPath = request.PhysicalApplicationPath.GetTextOrEmpty();
			var virtualDir = request.ApplicationPath;
			virtualDir = virtualDir == "/" ? virtualDir : (virtualDir + "/");
			return absolutePath.Replace(applicationPath, virtualDir).Replace(@"\", "/");
		}

	}
}
