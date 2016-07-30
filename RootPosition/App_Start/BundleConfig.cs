using System.Web.Optimization;
using BundleTransformer.Core.Builders;
using BundleTransformer.Core.Orderers;
using BundleTransformer.Core.Transformers;

namespace RootPosition
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            _RegisterObfuscatedScriptsBundle(bundles);
            BundleTable.EnableOptimizations = true;
        }

        /// <summary>
        /// See http://www.codeproject.com/Articles/863295/Hack-proof-your-Javascript-using-javascript-Obfusc
        /// </summary>
        /// <param name="bundles"></param>
        private static void _RegisterObfuscatedScriptsBundle(BundleCollection bundles)
        {
            // This setting is used when if you have specfied the path Using System.web.Optimization.bundle.Cdnpath then
            // it will try to fetch data from there first
            bundles.UseCdn = true;

            // NullBuilder class is responsible for prevention of early applying of the item transformations and combining of code.
            var nullBuilder = new NullBuilder();

            /*
            // Replace a default bundle resolver in order to the debugging HTTP-handler
            // can use transformations of the corresponding bundle
            BundleResolver.Current = new CustomBundleResolver();
            */

            // StyleTransformer and ScriptTransformer classes produce processing of stylesheets and scripts.
            var styleTransformer = new StyleTransformer();
            var scriptTransformer = new ScriptTransformer();

            // NullOrderer class disables the built-in sorting mechanism and save assets sorted in the order they are declared.
            var nullOrderer = new NullOrderer();

            // create your own scriptbundle
            var obfuscatedScriptBundle = new Bundle("~/Bundles/Gallery")
            {
                Builder = nullBuilder,
                Orderer = nullOrderer
            };
            obfuscatedScriptBundle.Include(
                "~/Scripts/jquery.min.js",
                "~/Scripts/knockout.js",
                "~/Scripts/date.format.js",
                "~/Scripts/jquery.extensions.js",
                "~/Scripts/root.extensions.js",
                "~/Scripts/root.gallery.js",
                "~/Scripts/root.photo-box.js",
                "~/Scripts/root.slider.js");
            obfuscatedScriptBundle.Transforms.Add(scriptTransformer);

            bundles.Add(obfuscatedScriptBundle);
        }
    }
}
