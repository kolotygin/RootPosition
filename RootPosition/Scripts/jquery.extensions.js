
(function(jQuery) {
    jQuery.extend({
        bindIframeLoadEvent: function(iframe, callback) {
            jQuery(iframe).bind('load', function() {
                // when we remove iframe from dom the request stops, but in IE load event fires
                if (!iframe.parentNode) {
                    return;
                }
                // fixing Opera 10.53
                if (iframe.contentDocument && iframe.contentDocument.body && iframe.contentDocument.body.innerHTML === "false") {
                    // In Opera event is fired second time when body.innerHTML changed from false
                    // to server response approx. after 1 sec when we upload file with iframe
                    return;
                }
                callback();
            });
        },

        scaleToFit: function(element, hostingElement, options) {
            if (!element) {
                return null;
            }
            options = jQuery.extend({ verticalCenter: false, horizontalCenter: false }, options);

            var $element = jQuery(element);
            var elementWidth = options.originalWidth || $element.width();
            var elementHeight = options.originalHeight || $element.height();

            var jQueryHostingElement = jQuery(hostingElement);
            var hostWidth = jQueryHostingElement.width();
            var hostHeight = jQueryHostingElement.height();
            hostWidth -= $element.outerWidth(true) - $element.width();
            hostHeight -= $element.outerHeight(true) - $element.height();
            var scaledElementWidth;
            var scaledElementHeight;

            if ((elementWidth > hostWidth) || (elementHeight > hostHeight)) {
                // calculate scale ratios
                var ratioX = hostWidth / elementWidth;
                var ratioY = hostHeight / elementHeight;

                var scale = ratioX < ratioY ? ratioX : ratioY;

                // calculate our new image dimensions
                scaledElementWidth = parseInt(elementWidth * scale, 10);
                scaledElementHeight = parseInt(elementHeight * scale, 10);
            }
            else {
                scaledElementWidth = elementWidth;
                scaledElementHeight = elementHeight;
            }

            var css = {
                width: scaledElementWidth.toString() + "px",
                height: scaledElementHeight.toString() + "px"
            };

            if (options.verticalCenter) {
                css.left = Math.round((hostWidth - scaledElementWidth) / 2).toString() + "px";
            }
            if (options.horizontalCenter) {
                css.top = Math.round((hostHeight - scaledElementHeight) / 2).toString() + "px";
            }
            return css;
        }

    });
})(jQuery);


(function(jQuery) {
    jQuery.fn.extend({
        // https://github.com/moagrius/isOnScreen
        isOnScreen: function(x, y) {
            if (x === null || typeof x == "undefined") x = 1;
            if (y === null || typeof y == "undefined") y = 1;

            var win = $(window);

            var viewport = {
                top: win.scrollTop(),
                left: win.scrollLeft()
            };
            viewport.right = viewport.left + win.width();
            viewport.bottom = viewport.top + win.height();

            var height = this.outerHeight();
            var width = this.outerWidth();

            if (!width || !height) {
                return false;
            }

            var bounds = this.offset();
            bounds.right = bounds.left + width;
            bounds.bottom = bounds.top + height;

            var visible = (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));

            if (!visible) {
                return false;
            }

            var deltas = {
                top: Math.min(1, (bounds.bottom - viewport.top) / height),
                bottom: Math.min(1, (viewport.bottom - bounds.top) / height),
                left: Math.min(1, (bounds.right - viewport.left) / width),
                right: Math.min(1, (viewport.right - bounds.left) / width)
            };
            return (deltas.left * deltas.right) >= x && (deltas.top * deltas.bottom) >= y;
        },

        center: function(host) {
            var $host = host ? jQuery(host) : jQuery(window);
            return this.each(function() {
                var $this = jQuery(this);
                var top = ($host.height() - $this.outerHeight(true)) / 2 + $host.scrollTop();
                top = top > 0 ? top : 0;
                var left = ($host.width() - $this.outerWidth(true)) / 2 + $host.scrollLeft();
                left = left > 0 ? left : 0;
                $this.css({ position: "absolute", margin: 0, top: top + "px", left: left + "px" });
                return $this;
            });
        },

        fitToParent: function() {
            return this.each(function() {
                var jQueryThis = jQuery(this);
                var width = jQueryThis.width();
                var height = jQueryThis.height();
                var parentWidth = jQueryThis.parent().width();
                var parentHeight = jQueryThis.parent().height();
                var newWidth;
                var newHeight;

                if (width / parentWidth < height / parentHeight) {
                    newWidth = parentWidth;
                    newHeight = newWidth / width * height;
                }
                else {
                    newHeight = parentHeight;
                    newWidth = newHeight / height * width;
                }
                var marginTop = (parentHeight - newHeight) / 2;
                var marginLeft = (parentWidth - newWidth) / 2;

                jQueryThis.css({
                    'margin-top': marginTop + 'px',
                    'margin-left': marginLeft + 'px',
                    'height': newHeight + 'px',
                    'width': newWidth + 'px'
                });
            });
        },

        // Parse style and remove properties with style rebuilding style.
        // Example: jQueryElement.removeCssProperties("height", "width", "left");
        removeCssProperties: function() {
            var propertyNames = arguments;
            return this.each(function() {
                var jQueryThis = jQuery(this);
                jQuery.grep(propertyNames, function(propertyName) {
                    propertyName = propertyName.trim();
                    var style = jQueryThis.attr('style');
                    if (style) {
                        return jQueryThis.attr('style',
                            jQuery.grep(jQueryThis.attr('style').split(";"),
                                function(cssPropertyName) {
                                    if (cssPropertyName.toLowerCase().indexOf(propertyName.toLowerCase() + ':') < 0) {
                                        return cssPropertyName;
                                    }
                                    return "";
                                }
                            ).join(";"));
                    }
                    else {
                        return jQueryThis;
                    }
                });
            });
        }

    });
})(jQuery);

/*
	- All browsers fire onload or onerror for images that haven't received a server/cache response
	- FF and Opera cache the 404 response from bad images, and treat future requests for that url as a cache pull
	- FF and Opera browsers do not fire (at least) onerror for cached 404 pulls
	- cached 404s in FF/Opera show img.complete == true
	- FF and SF3 support img.naturalHeight and img.naturalWidth, which report 0 if the image did not load (also cached 404 + img.complete)
	- Opera reports img.width and img.height of 0 for failed urls
	- All other browsers report img.width img.height as the dims of the alt text
	- IE reports img.complete == false for failed urls
*/

(function(jQuery) {
    jQuery.event.special.imageLoad = {
        add: function(hollaback) {

            if (this.nodeType === 1 && this.tagName.toLowerCase() === "img" && this.src !== "") {
                // Image is already complete, fire the hollaback (fixes browser issues were cached
                // images isn't triggering the load event)
                if (this.complete || this.readyState === 4) {
                    if ((this.naturalWidth && this.naturalHeight) || (this.width && this.height)) {
                        hollaback.handler.apply(this, [jQuery.Event("imageLoad", { target: this, currentTarget: this })]);
                    }
                    else {
                        hollaback.handler.apply(this, [jQuery.Event("imageLoad", { target: this, currentTarget: this, failed: true })]);
                    }
                    return;
                }
                // Check if data URI images is supported, fire 'error' event if not
                else
                    if (this.readyState === "uninitialized" && this.src.indexOf("data:") === 0) {
                        hollaback.handler.apply(this, [jQuery.Event("imageLoad", { target: this, currentTarget: this, failed: true })]);
                        //jQuery(this).trigger('error');
                        return;
                    }
            }
            var $this = jQuery(this);
            //$this.bind('load', hollaback.handler);
            $this.bind("load", function(e) {
                $this.unbind("load");
                hollaback.handler(e);
            });
            $this.bind("error", function(e) {
                $this.unbind("error");
                hollaback.handler.apply(this, [jQuery.Event("imageLoad", { target: this, currentTarget: this, failed: true })]);
            });
        }
    };
})(jQuery);