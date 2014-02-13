
(function (jQuery) {
	jQuery.extend({
		bindIframeLoadEvent: function(iframe, callback) {
			jQuery(iframe).bind('load', function () {
				// when we remove iframe from dom the request stops, but in IE load event fires
				if (!iframe.parentNode) {
					return;
				}
				// fixing Opera 10.53
				if (iframe.contentDocument && iframe.contentDocument.body && iframe.contentDocument.body.innerHTML == "false") {
					// In Opera event is fired second time when body.innerHTML changed from false
					// to server response approx. after 1 sec when we upload file with iframe
					return;
				}
				callback();
			});
		}
	});
})(jQuery);

(function (jQuery) {
	jQuery.fn.extend({
		center: function() {
			var $window = jQuery(window);
			return this.each(function () {
				var $this = jQuery(this);
				var top = ($window.height() - $this.outerHeight(true)) / 2 + $window.scrollTop();
				top = top > 0 ? top : 0;
				var left = ($window.width() - $this.outerWidth(true)) / 2 + $window.scrollLeft();
				left = left > 0 ? left : 0;
				$this.css({ position: "absolute", margin: 0, top: top + "px", left: left + "px" });
				return $this;
			});
		}
	});
})(jQuery);

(function ($) {
    if (typeof __doPostBack === "function") {
        var __doPostBackOriginal = __doPostBack;
        __doPostBack = function (eventTarget, eventArgument) {
            $("form").trigger("onPostBack");
            __doPostBackOriginal(eventTarget, eventArgument);
        };
    }

    $.onPostBack = function (func) {
        $("form").on("onPostBack", function () { func(); });
    };
})(jQuery);

