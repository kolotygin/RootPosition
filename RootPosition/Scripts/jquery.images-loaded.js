/*!
* jQuery imagesLoaded plugin v2.1.0
* http://github.com/desandro/imagesloaded
*
* MIT License. by Paul Irish et al.
*/

/*jshint curly: true, eqeqeq: true, noempty: true, strict: true, undef: true, browser: true */
/*global jQuery: false */

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
(function (jQuery) {
	'use strict';

	// blank image data-uri bypasses webkit log warning (thx doug jones)
	var blankImageDataUri = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

	jQuery.fn.imagesLoaded = function (callback) {
		var $this = this,
		deferred = jQuery.isFunction(jQuery.Deferred) ? jQuery.Deferred() : 0,
		hasNotify = jQuery.isFunction(deferred.notify),
		$images = $this.find('img').add($this.filter('img')),
		loaded = [],
		proper = [],
		broken = [];

		// Register deferred callbacks
		if (jQuery.isPlainObject(callback)) {
			jQuery.each(callback, function (key, value) {
				if (key === 'callback') {
					callback = value;
				} else if (deferred) {
					deferred[key](value);
				}
			});
		}

		function doneLoading() {
			var $proper = jQuery(proper),
			$broken = jQuery(broken);

			if (deferred) {
				if (broken.length) {
					deferred.reject($images, $proper, $broken);
				} else {
					deferred.resolve($images);
				}
			}

			if (jQuery.isFunction(callback)) {
				callback.call($this, $images, $proper, $broken);
			}
		}

		function imgLoaded(img, isBroken) {
			// don't proceed if BLANK image, or image is already loaded
			if (img.src === blankImageDataUri || jQuery.inArray(img, loaded) !== -1) {
				return;
			}

			// store element in loaded images array
			loaded.push(img);

			// keep track of broken and properly loaded images
			if (isBroken) {
				broken.push(img);
			} else {
				proper.push(img);
			}

			// cache image and its state for future calls
			jQuery.data(img, 'imagesLoaded', { isBroken: isBroken, src: img.src });

			// trigger deferred progress method if present
			if (hasNotify) {
				deferred.notifyWith(jQuery(img), [isBroken, $images, jQuery(proper), jQuery(broken)]);
			}

			// call doneLoading and clean listeners if all images are loaded
			if ($images.length === loaded.length) {
				setTimeout(doneLoading, 30);
				$images.unbind('.imagesLoaded');
			}
		}

		function processLoad() {
			$images.bind('load.imagesLoaded error.imagesLoaded', function (event) {
				// trigger imgLoaded
				imgLoaded(event.target, event.type === 'error');
			}).each(function (i, el) {
				var src = el.src;
				
				// find out if this image has been already checked for status
				// if it was, and src has not changed, call imgLoaded on it
				var cached = jQuery.data(el, 'imagesLoaded');
				if (cached && cached.src === src) {
					imgLoaded(el, cached.isBroken);
					return;
				}

				// if complete is true and browser supports natural sizes, try
				// to check for image status manually
				if (el.complete) {
					if (el.naturalWidth !== undefined && el.naturalHeight !== undefined) {
						imgLoaded(el, el.naturalWidth === 0 || el.naturalHeight === 0);
						return;
					}
					else if (el.width !== undefined && el.height !== undefined) {
						imgLoaded(el, el.width === 0 || el.height === 0);
						return;
					}
				}

				// cached images don't fire load sometimes, so we reset src, but only when
				// dealing with IE, or image is complete (loaded) and failed manual check
				// webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
				if (el.readyState || el.complete) {
					el.src = blankImageDataUri;
					el.src = src;
				}
			});
		}

		// if no images, trigger immediately
		if (!$images.length) {
			doneLoading();
		}
		else {
			setTimeout(processLoad, 1);
		}

		return deferred ? deferred.promise($this) : $this;
	};

})(jQuery);
