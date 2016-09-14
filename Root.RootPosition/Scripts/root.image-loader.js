// $('img.photo',this).imagesLoaded(myFunction)
// execute a callback when all images have loaded.
// needed because .load() doesn't work on cached images

// mit license. paul irish. 2010.
// webkit fix from Oren Solomianik. thx!

// callback function is passed the last image to load
//   as an argument, and the collection as `this`

$.fn.imagesLoaded = function (callback) {
    var elems = this.filter('img'),
        len = elems.length,
        blank = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

    //$("<img src = " + elems[i].src + "/>")
    elems.unbind('load.imagesLoaded').bind('load.imagesLoaded', function (e) {
        if (--len <= 0 && e.target.src !== blank) {
            callback.call(elems, e.target);
            elems.unbind('load.imagesLoaded');
        }
    }).each(function (index, e) {
        // cached images don't fire load sometimes, so we reset src.
        if (e.complete || e.complete === void 0) {
            var src = e.src;
            // webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
            // data uri bypasses webkit log warning (thx doug jones)
            e.src = blank;
            e.src = src;
        }
    });

    return this;
};
