using System;
using System.Collections.Specialized;
using System.Web;
using Root.Infrastructure.Extensions;
using Root.Web.Extensions;

namespace Root.Web.Url
{
    [Serializable()]
    public class WebResourceUrl
    {

        private string _pathPart = null;
        private readonly string _pathAndQuery = null;
        private NameValueCollection _parameters = null;
        private bool _isInitialized = false;

        public WebResourceUrl(string pathAndQuery)
        {
            _pathAndQuery = pathAndQuery;
        }

        private void InitializeUrlParts(string pathAndQuery)
        {
            string queryStringPart = string.Empty;
            if ((string.IsNullOrEmpty(pathAndQuery)))
            {
                _pathPart = null;
                _parameters = HttpUtility.ParseQueryString(queryStringPart);
            }
            else
            {
                string[] parts = pathAndQuery.Split('?');
                _pathPart = parts[0];
                if (parts.Length > 1)
                {
                    queryStringPart = parts[1].TextOrEmpty();
                }
                _parameters = HttpUtility.ParseQueryString(queryStringPart);
            }
            _isInitialized = true;
        }

        private void EnsureInitialize()
        {
            if (!_isInitialized)
            {
                InitializeUrlParts(_pathAndQuery);
            }
        }

        public string Path
        {
            get
            {
                EnsureInitialize();
                return _pathPart;
            }
        }

        public NameValueCollection Parameters
        {
            get
            {
                EnsureInitialize();
                return _parameters;
            }
        }

        public string ToPathAndQuery()
        {
            return Path.Append(Parameters.AsEncodedQueryString(), "?");
        }

        public static WebResourceUrl GetCurrent()
        {
            return new WebResourceUrl(HttpContext.Current.Request.Url.PathAndQuery);
        }

    }

}
