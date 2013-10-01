// Global namespace
var RootPosition = RootPosition || {};

// Singleton (Instance in a Closure)
RootPosition.PhotoBox = function(options) {

	// make sure the function is called as a constructor
/*	if (!(this instanceof RootPosition.PhotoBox)) {
		return new RootPosition.PhotoBox(options);
	}*/

	// the cached instance
/*	var instance;*/

	// rewrite the constructor
	//RootPosition.PhotoBox = function() {
	//	return instance;
	//};

	// carry over the prototype properties
	//RootPosition.PhotoBox.prototype = this;

	// the instance
	//instance = new RootPosition.PhotoBox(options);
	//instance = this;

	// reset the constructor pointer
	//instance.constructor = RootPosition.PhotoBox;

	this._jQueryThis = jQuery(this);
	this._jQueryWindow = jQuery(window);
	this._containerElement = null;

	this._options = {
		loop: false, // Allows to navigate between first and last images
		overlayOpacity: 0.8, // 1 is opaque, 0 is completely transparent (change the color in the CSS file)
		overlayFadeDuration: 400, // Duration of the overlay fade-in and fade-out animations (in milliseconds)
		resizeDuration: 400, // Duration of each of the box resize animations (in milliseconds)
		resizeEasing: "swing", // "swing" is jQuery's default easing
		minHeight: 300,
		minWidth: 700,
		marginTop: 50,
		marginLeft: 100,
		imageFadeDuration: 400, // Duration of the image fade-in animation (in milliseconds)
		captionAnimationDuration: 400, // Duration of the caption animation (in milliseconds)
		counterText: "Image {x} of {y}", // Translate or change as you wish, or set it to false to disable counter text for image groups
		closeKeys: [27, 88, 67], // Array of keycodes to close Slimbox, default: Esc (27), 'x' (88), 'c' (67)
		previousKeys: [37, 80], // Array of keycodes to navigate to the previous image, default: Left arrow (37), 'p' (80)
		nextKeys: [39, 78] // Array of keycodes to navigate to the next image, default: Right arrow (39), 'n' (78)
	};

	this._options = $.extend(this._options, options);

	this._images = null;
	this._activeImage = -1;
	this._activeURL = null;
	this._prevImage = null;
	this._nextImage = null;
	this._compatibleOverlay;
	this._middle;
	this._centerWidth;
	this._centerHeight;
	this._ie6 = !window.XMLHttpRequest;
	this._hiddenElements = [];
	this._documentElement = document.documentElement;

	// Preload images
	this._preload = {};
	this._preloadPrev = new Image();
	this._preloadNext = new Image();

	// DOM elements
	this._containerElement;
	this._overlayElement;
	this._jQueryImageContainer;
	this._prevLink;
	this._nextLink;
	this._footerContainer;
	this._bottom;
	this._caption;
	this._number;

	//return instance;

};

RootPosition.PhotoBox.prototype = {
	createLayout: function () {
		var container = $("<div id='photo-container' />").css("display", "none");
		this._containerElement = container[0];
		this._overlayElement = $('<div id="overlay-container" />').css("display", "none")[0];
		$("body").append(this._overlayElement);
		$("body").append(this._containerElement);

		// Append the Slimbox HTML code at the bottom of the document
		this._jQueryImageContainer = $('<div id="image-container" />');
		container.append($([this._jQueryImageContainer[0], this._footerContainer = $('<div id="footer-container" />')[0]]));

		var self = this;

		this._jQueryImageContainer.append(
			[this._prevLink = $('<a id="lbPrevLink" href="#" />').click(function () { self._previous(); })[0],
				this._nextLink = $('<a id="lbNextLink" href="#" />').click(function () { self._next(); })[0]]);

		this._bottom = $('<div id="lbBottom" />').appendTo(this._footerContainer).append([
				$('<a id="lbCloseLink" href="#" />').add(this._overlayElement).click(function () { self._close(); })[0],
				this._caption = $('<div id="lbCaption" />')[0],
				this._number = $('<div id="lbNumber" />')[0],
				$('<div style="clear: both;" />')[0]
			])[0];

	},

	_center: function () {
		var height = (this._jQueryWindow.height() - this._options.marginTop * 2);
		height = height < this._options.minHeight ? this._options.minHeight : height;

		var width = (this._jQueryWindow.width() - this._options.marginLeft * 2);
		width = width < this._options.minWidth ? this._options.minWidth : width;

		jQuery(this._containerElement).css({ width: width + "px", height: height + "px" }).show();
		jQuery(this._containerElement).center();

	},

	show: function (images, startImage) {

		if (!this._containerElement) {
			this.createLayout();
			this._center();
		}

		// The function is called for a single image, with URL and Title as first two arguments
		if (typeof images === "string") {
			images = [[images, startImage]];
			startImage = 0;
		}
		/*
		this._compatibleOverlay = this._ie6 || (this._overlayElement.currentStyle && (this._overlayElement.currentStyle.position !== "fixed"));
		if (this._compatibleOverlay) {
		this._overlayElement.style.position = "absolute";
		}
		*/
		$(this._overlayElement).css("opacity", this._options.overlayOpacity).fadeIn(this._options.overlayFadeDuration);
		//position();
		this._setup(true);

		this._images = images;
		this._options.loop = this._options.loop && (this._images.length > 1);
		return this._changeImage(startImage);
	},

	_previous: function () {
		return this._changeImage(this._prevImage);
	},

	_next: function () {
		return this._changeImage(this._nextImage);
	},

	_changeImage: function (imageIndex) {
		if (this._imageIndex >= 0) {
			this._activeImage = imageIndex;
			this._activeURL = this._images[this._activeImage][0];
			this._prevImage = (this._activeImage || (this._options.loop ? this._images.length : 0)) - 1;
			this._nextImage = ((this._activeImage + 1) % this._images.length) || (this._options.loop ? 0 : -1);

			this._stop();
			this._containerElement.className = "lbLoading";

			this._preload = new Image();
			this._preload.onload = this._animateBox;
			this._preload.src = this._activeURL;
		}
		return false;
	},

	_animateBox: function () {
		this._containerElement.className = "";
		this._jQueryImageContainer.css({ backgroundImage: "url(" + this._activeURL + ")", visibility: "hidden", display: "" });
		//jQueryImageContainer.width(preload.width);
		//jQueryImageContainer.height(preload.height);
		$([this._prevLink, this._nextLink]).height(preload.height);

		$(this._caption).html(this._images[this._activeImage][1] || "");
		$(this._number).html((((this._images.length > 1) && this._options.counterText) || "").replace(/{x}/, this._activeImage + 1).replace(/{y}/, this._images.length));

		if (this._prevImage >= 0) {
			this._preloadPrev.src = this._images[this._prevImage][0];
		}
		if (this._nextImage >= 0) {
			this._preloadNext.src = this._images[this._nextImage][0];
		}
	},

	_close: function () {
		if (this._activeImage >= 0 || this._containerElement) {
			this._stop();
			this._activeImage = this._prevImage = this._nextImage = -1;
			$(this._containerElement).hide();
			var self = this;
			$(this._overlayElement).stop().fadeOut(this._options.overlayFadeDuration, self._setup);
		}
		return false;
	},

	_stop: function () {
		this._preload.onload = null;
		this._preload.src = this._preloadPrev.src = this._preloadNext.src = this._activeURL;
		$([this._containerElement, this._jQueryImageContainer[0], this._bottom]).stop(true);
		$([this._prevLink, this._nextLink, this._jQueryImageContainer[0]]).hide();
	},

	_setup: function (open) {
		var self = this;
		if (open) {
			this._hiddenElements = [];
			jQuery("object").add(self._ie6 ? "select" : "embed").each(function (index, el) {
				this._hiddenElements[index] = [el, el.style.visibility];
				el.style.visibility = "hidden";
			});
		}
		else {
			jQuery.each(this._hiddenElements, function (index, el) {
				el[0].style.visibility = el[1];
			});
			HtmlExtension.RemoveElement(this._containerElement);
			this._containerElement = null;
			HtmlExtension.RemoveElement(this._overlayElement);
			this._overlayElement = null;
		}
		var fn = open ? "bind" : "unbind";
		this._jQueryWindow[fn]("scroll resize", function () { self._center(); });
		jQuery(document)[fn]("keydown", function () { self._onKeyDown(); });
	},

	_onKeyDown: function (event) {
		var key;
		var evt = window.event;
		if (evt) {
			// For IE and Firefox prior to version 4
			key = evt.keyCode;
		}
		else {
			key = event.keyCode;
		}
		// Prevent default keyboard action (like navigating inside the page)
		return (jQuery.inArray(key, this._options.closeKeys) >= 0) ? this._close()
			: (jQuery.inArray(key, this._options.nextKeys) >= 0) ? this._next()
			: (jQuery.inArray(key, this._options.previousKeys) >= 0) ? this._previous()
			: false;
	}

};


(function ($) {
	$.fn.photoBox = function(options) {

		var photoBoxInstance = new RootPosition.PhotoBox(options);
		var linkMapper = function (el) {
			return [el.href, el.title];
		};

		var linksFilter = function () {
			return true;
		};

		var links = this;

		return links.unbind("click").click(function () {
			// Build the list of images that will be displayed
			var link = this;
			var startIndex = 0;
			/*var i = 0;
			var length = 0;*/
			var filteredLinks = $.grep(links, function (el, i) {
				return linksFilter.call(link, el, i);
			});

			// We cannot use jQuery.map() because it flattens the returned array
			for (var length = filteredLinks.length, i = 0; i < length; ++i) {
				if(filteredLinks[i] === link) {
					startIndex = i;
				}
				filteredLinks[i] = linkMapper(filteredLinks[i], i);
			}
			//return $.slimbox(filteredLinks, startIndex, _options);
			return photoBoxInstance.show(filteredLinks, startIndex);
		});
	};
})(jQuery);




/*!
	Slimbox v2.04 - The ultimate lightweight Lightbox clone for jQuery
	(c) 2007-2010 Christophe Beyls <http://www.digitalia.be>
	MIT-style license.
*/

(function ($) {

	// Global variables, accessible to Slimbox only
	var win = $(window), options, images, activeImage = -1, activeURL, prevImage, nextImage, compatibleOverlay, middle, centerWidth, centerHeight,
		ie6 = !window.XMLHttpRequest, hiddenElements = [], documentElement = document.documentElement,

	// Preload images
	preload = {}, preloadPrev = new Image(), preloadNext = new Image(),

	// DOM elements
	containerElement, overlayElement, jQueryImageContainer, prevLink, nextLink, footerContainer, bottom, caption, number;

	/*
	Initialization
	*/

	$(function () {
		var container = $("<div id='photo-container' />").css("display", "none");
		containerElement = container[0];
		overlayElement = $('<div id="overlay-container" />').css("display", "none")[0];
		$("body").append(overlayElement);
		$("body").append(containerElement);

		// Append the Slimbox HTML code at the bottom of the document
		jQueryImageContainer = $('<div id="image-container" />');
		container.append($([jQueryImageContainer[0], footerContainer = $('<div id="footer-container" />')[0] ]));

		jQueryImageContainer.append(
			[ prevLink = $('<a id="lbPrevLink" href="#" />').click(previous)[0],
			nextLink = $('<a id="lbNextLink" href="#" />').click(next)[0] ]);

		bottom = $('<div id="lbBottom" />').appendTo(footerContainer).append([
			$('<a id="lbCloseLink" href="#" />').add(overlayElement).click(close)[0],
			caption = $('<div id="lbCaption" />')[0],
			number = $('<div id="lbNumber" />')[0],
			$('<div style="clear: both;" />')[0]
		])[0];
	});


	/*
	API
	*/

	// Open Slimbox with the specified parameters
	$.slimbox = function (_images, startImage, _options) {
		options = $.extend({
			loop: false, 			// Allows to navigate between first and last images
			overlayOpacity: 0.8, 		// 1 is opaque, 0 is completely transparent (change the color in the CSS file)
			overlayFadeDuration: 400, 	// Duration of the overlay fade-in and fade-out animations (in milliseconds)
			resizeDuration: 400, 		// Duration of each of the box resize animations (in milliseconds)
			resizeEasing: "swing", 		// "swing" is jQuery's default easing
			initialWidth: 400, 		// Initial width of the box (in pixels)
			initialHeight: 700, 		// Initial height of the box (in pixels)
			minHeight: 300,
			minWidth: 700,
			marginTop: 50,
			marginLeft: 100,
			imageFadeDuration: 400, 		// Duration of the image fade-in animation (in milliseconds)
			captionAnimationDuration: 400, 	// Duration of the caption animation (in milliseconds)
			counterText: "Image {x} of {y}", // Translate or change as you wish, or set it to false to disable counter text for image groups
			closeKeys: [27, 88, 67], 	// Array of keycodes to close Slimbox, default: Esc (27), 'x' (88), 'c' (67)
			previousKeys: [37, 80], 		// Array of keycodes to navigate to the previous image, default: Left arrow (37), 'p' (80)
			nextKeys: [39, 78]			// Array of keycodes to navigate to the next image, default: Right arrow (39), 'n' (78)
		}, _options);


		var jQueryWindow = jQuery(window);

		var height = (jQueryWindow.height() - options.marginTop * 2);
		height = height < options.minHeight ? options.minHeight : height;

		var top = height / 2 + jQueryWindow.scrollTop();
		top = top > 0 ? top : 0;
		var width = (jQueryWindow.width() - options.marginLeft * 2);
		width = width < options.minWidth ? options.minWidth : width;
		var left = width / 2 + jQueryWindow.scrollLeft();
		left = left > 0 ? left : 0;
		//jQueryThis.css({ position: "absolute", margin: 0, top: top + "px", left: left + "px" });

		$(containerElement).css({ width: width + "px", height: height + "px" }).show();
		$(containerElement).center();

		// The function is called for a single image, with URL and Title as first two arguments
		if (typeof _images == "string") {
			_images = [[_images, startImage]];
			startImage = 0;
		}

		middle = win.scrollTop() + (win.height() / 2);
		centerWidth = width;
		centerHeight = height;

		//$(containerElement).css({ top: Math.max(0, middle - (centerHeight / 2)), width: centerWidth, height: centerHeight, marginLeft: -centerWidth / 2 }).show();

		compatibleOverlay = ie6 || (overlayElement.currentStyle && (overlayElement.currentStyle.position != "fixed"));
		if (compatibleOverlay) overlayElement.style.position = "absolute";
		$(overlayElement).css("opacity", options.overlayOpacity).fadeIn(options.overlayFadeDuration);
		//position();
		//setup(1);

		images = _images;
		options.loop = options.loop && (images.length > 1);
		return changeImage(startImage);
	};

	/*
	options:	Optional options object, see jQuery.slimbox()
	linkMapper:	Optional function taking a link DOM element and an index as arguments and returning an array containing 2 elements:
	the image URL and the image caption (may contain HTML)
	linksFilter:	Optional function taking a link DOM element and an index as arguments and returning true if the element is part of
	the image collection that will be shown on click, false if not. "this" refers to the element that was clicked.
	This function must always return true when the DOM element argument is "this".
	*/
	$.fn.slimbox = function (_options, linkMapper, linksFilter) {
		linkMapper = linkMapper || function (el) {
			return [el.href, el.title];
		};

		linksFilter = linksFilter || function () {
			return true;
		};

		var links = this;

		return links.unbind("click").click(function () {
			// Build the list of images that will be displayed
			var link = this;
			var startIndex = 0;
			/*var i = 0;
			var length = 0;*/
			var filteredLinks = $.grep(links, function (el, i) {
				return linksFilter.call(link, el, i);
			});

			// We cannot use jQuery.map() because it flattens the returned array
			for (var length = filteredLinks.length, i = 0; i < length; ++i) {
				if(filteredLinks[i] === link) {
					startIndex = i;
				}
				filteredLinks[i] = linkMapper(filteredLinks[i], i);
			}
			//return $.slimbox(filteredLinks, startIndex, _options);
			return new RootPosition.PhotoBox().show(filteredLinks, startIndex);
		});
	};


	/*
	Internal functions
	*/

	function position() {
		var l = win.scrollLeft(), w = win.width();
		$(containerElement).css("left", l + (w / 2));
		if (compatibleOverlay) {
			$(overlayElement).css({ left: l, top: win.scrollTop(), width: w, height: win.height() });
		}
	}

	function setup(open) {
		if (open) {
			$("object").add(ie6 ? "select" : "embed").each(function (index, el) {
				hiddenElements[index] = [el, el.style.visibility];
				el.style.visibility = "hidden";
			});
		} else {
			$.each(hiddenElements, function (index, el) {
				el[0].style.visibility = el[1];
			});
			hiddenElements = [];
		}
		var fn = open ? "bind" : "unbind";
		//win[fn]("scroll resize", position);
		$(document)[fn]("keydown", keyDown);
	}

	function keyDown(event) {
		var code = event.keyCode, fn = $.inArray;
		// Prevent default keyboard action (like navigating inside the page)
		return (fn(code, options.closeKeys) >= 0) ? close()
			: (fn(code, options.nextKeys) >= 0) ? next()
			: (fn(code, options.previousKeys) >= 0) ? previous()
			: false;
	}

	function previous() {
		return changeImage(prevImage);
	}

	function next() {
		return changeImage(nextImage);
	}

	function changeImage(imageIndex) {
		if (imageIndex >= 0) {
			activeImage = imageIndex;
			activeURL = images[activeImage][0];
			prevImage = (activeImage || (options.loop ? images.length : 0)) - 1;
			nextImage = ((activeImage + 1) % images.length) || (options.loop ? 0 : -1);

			stop();
			containerElement.className = "lbLoading";

			preload = new Image();
			preload.onload = animateBox;
			preload.src = activeURL;
		}

		return false;
	}

	function animateBox() {
		containerElement.className = "";
		jQueryImageContainer.css({ backgroundImage: "url(" + activeURL + ")", visibility: "hidden", display: "" });
		//jQueryImageContainer.width(preload.width);
		//jQueryImageContainer.height(preload.height);
		$([prevLink, nextLink]).height(preload.height);

		$(caption).html(images[activeImage][1] || "");
		$(number).html((((images.length > 1) && options.counterText) || "").replace(/{x}/, activeImage + 1).replace(/{y}/, images.length));

		if (prevImage >= 0) preloadPrev.src = images[prevImage][0];
		if (nextImage >= 0) preloadNext.src = images[nextImage][0];

		//centerWidth = jQueryImageContainer[0].offsetWidth;
		//centerHeight = jQueryImageContainer[0].offsetHeight;
		var top = Math.max(0, middle - (centerHeight / 2));
		if (containerElement.offsetHeight != centerHeight) {
			/*$(containerElement).animate({ height: centerHeight, top: top }, options.resizeDuration, options.resizeEasing);*/
			//$(containerElement).animate({ top: top }, options.resizeDuration, options.resizeEasing);
		}
		if (containerElement.offsetWidth != centerWidth) {
			/*$(containerElement).animate({ width: centerWidth, marginLeft: -centerWidth / 2 }, options.resizeDuration, options.resizeEasing);*/
			//$(containerElement).animate({ marginLeft: -centerWidth / 2 }, options.resizeDuration, options.resizeEasing);
		}
		$(containerElement).queue(function () {
			/*$(footerContainer).css({ width: centerWidth, top: top + centerHeight, marginLeft: -centerWidth / 2, visibility: "hidden", display: "" });*/
			//jQueryImageContainer.css({ display: "none", visibility: "", opacity: "" }).fadeIn(options.imageFadeDuration, animateCaption);
		});
	}

	function animateCaption() {
		if (prevImage >= 0) $(prevLink).show();
		if (nextImage >= 0) $(nextLink).show();
		/*$(bottom).css("marginTop", -bottom.offsetHeight).animate({ marginTop: 0 }, options.captionAnimationDuration);*/
		/*footerContainer.style.visibility = "";*/
	}

	function stop() {
		preload.onload = null;
		preload.src = preloadPrev.src = preloadNext.src = activeURL;
		$([containerElement, jQueryImageContainer[0], bottom]).stop(true);
		$([prevLink, nextLink, jQueryImageContainer[0]]).hide();
	}

	function close() {
		if (activeImage >= 0) {
			stop();
			activeImage = prevImage = nextImage = -1;
			$(containerElement).hide();
			$(overlayElement).stop().fadeOut(options.overlayFadeDuration, setup);
		}

		return false;
	}

})(jQuery);
