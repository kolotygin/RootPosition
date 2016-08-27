using System.Web;

namespace Root.Web.Url
{
    internal class StringDecoder
    {
        public static string Decode(string text)
        {
            // NOTE:
            // Since .NET internaly converts space character (even if passed in its escaped form: "%20") to plus character "+"
            // and since Uri.UnescapeDataString("+") returns "+", we cannot obtain the original space character by unescaping the
            // string with Uri.UnescapeDataString, but this is the function that correctluy implements RFC 2396.
            // Anyway, since HttpUtillity.UrlDecode converts "+" back to the space character, we need to use this one as long
            // as .NET behaves like described above. HttpUtillity.UrlDecode("%20") returns also space character.

            //   this instruction will unescape the apostrophes as well,
            //   as long as they were escaped with the correct escape sequence: "%27"
            return string.IsNullOrEmpty(text) ? text : HttpUtility.UrlDecode(text);
        }

        public static string Encode(string text)
        {
            if (string.IsNullOrEmpty(text))
            {
                return text;
            }

            //   escape the characters for URI
            //NOTE:
            //   since HttpUtility.UrlEncode escapes space character with plus sign instead of the escaping sequence "%20"
            //   which is recommended by RFC 2396, the resulted string after escape may be shorter; due to our current issue
            //   with too long query strings [PopupPageQueryStringBuilder has a Param which is set with a xml string] we cannot
            //   use Uri.EscapeDataString() - it was found that some URLs are longer than max limit and HttpUtility.UrlEncode
            //   produces a slightly shorter URL - until the issue is solved at the root level we use this temporary workaround.
            //result = Uri.EscapeDataString(text)
            var result = HttpUtility.UrlEncode(text);

            //   apostrophe characters are not escaped for URI since they are considered 'unreserved' in RFC 2396
            //   we explicitly escape apostrophes with their escape sequence "%27"
            result = result.Replace("'", "%27");

            return result;
        }
    }
}
