
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
			var jQueryWindow = jQuery(window);
			return this.each(function () {
				var jQueryThis = jQuery(this);
				var top = (jQueryWindow.height() - jQueryThis.outerHeight(true)) / 2 + jQueryWindow.scrollTop();
				top = top > 0 ? top : 0;
				var left = (jQueryWindow.width() - jQueryThis.outerWidth(true)) / 2 + jQueryWindow.scrollLeft();
				left = left > 0 ? left : 0;
				jQueryThis.css({ position: "absolute", margin: 0, top: top + "px", left: left + "px" });
				return jQueryThis;
			});
		}
	});
})(jQuery);
