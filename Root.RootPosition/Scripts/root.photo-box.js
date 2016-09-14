;// Global namespace
var Root = Root || {};

// Singleton (Instance in a Closure)
Root.PhotoBox = function (options) {
    var self = this;

    self._options = {
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
        nextKeys: [39, 78], // Array of keycodes to navigate to the next image, default: Right arrow (39), 'n' (78)
        noImageAvailable: "/Images/child-singing.jpg"
    };

    self._options = $.extend(self._options, options);
    self._ie6 = ($.browser && $.browser.msie && parseFloat($.browser.version) < 7);

    self._$window = $(window);

    self._images = null;
    self._currentImageIndex = -1;
    self._prevImageIndex = -1;
    self._nextImageIndex = -1;

    self._onKeyDownFunction = function (event) { self._onKeyDown(event); };
    self._onResizeFunction = function (event) { self._center(event); };
    self._onImageLoadedFunction = function (event) { self._onImageLoaded(event); };

    self._closeFunction = function () { self._close(); return false; };
    self._prevImageFunction = function () { self._showPrevImage(); };
    self._nextImageFunction = function () { self._showNextImage(); };
    self._showPrevImageFunction = function () { self._showImage(self._prevImageIndex); };
    self._showNextImageFunction = function () { self._showImage(self._nextImageIndex); };
    self._hideLayoutFunction = function () { self._hideLayout(); };

    //	this._loadingImage = new Image();
    //	this._$loadingImage = jQuery(this._loadingImage);
    //	this._loadingImage.src = this._options.loadingImage;
    //	this._$loadingImage.addClass("hide");

};

Root.PhotoBox.prototype = {

    _createLayout: function () {
        var self = this;

        self._image = new Image();
        self._image.setAttribute('unselectable', 'on');
        self._image.tabIndex = '-1';
        self._$image = $(self._image);

        self._$image.on('load', self._onImageLoadedFunction);
        self._$image.on('error', self._onImageLoadedFunction);

        self._$overlay = $('<div id="overlay-container" />');
        self._overlay = self._$overlay[0];
        self._$overlay.bind('click', self._closeFunction);

        self._$container = $('<div id="photo-container" />');
        self._$container.addClass('hide');
        self._container = self._$container[0];

        self._$imageContainer = $('<div id="image-container" />');
        self._imageContainer = self._$imageContainer[0];

        self._imageContainer.appendChild(self._image);

        self._$closeButton = $('<a id="close-button" href="#" />').bind('click', self._closeFunction);
        self._$prevImageButton = $('<a id="previous-button" href="#" />').bind('click', self._prevImageFunction);
        self._$nextImageButton = $('<a id="next-button" href="#" />').bind('click', self._nextImageFunction);

        self._container.appendChild(self._$imageContainer[0]);
        self._container.appendChild(self._$prevImageButton[0]);
        self._container.appendChild(self._$nextImageButton[0]);
        self._container.appendChild(self._$closeButton[0]);

        /*
		this._$footer = jQuery('<div id="footer-container" />');
		this._footer = this._$footer[0];

		this._container.appendChild(this._footer);
		this._bottom = jQuery('<div id="lbBottom" />').appendTo(this._footer).append([
		this._caption = jQuery('<div id="lbCaption" />')[0],
		this._number = jQuery('<div id="lbNumber" />')[0],
		jQuery('<div style="clear: both;" />')[0]
		])[0];
		*/
    },

    _enforceFocus: function () {
        var self = this;
        $(document).on("focusin.photoBox", function (eventObject) {
            if (self._container !== eventObject.target && !self._$container.has(eventObject.target).length) {
                self._$closeButton.focus();
            }
        });
    },

    _releseFocus: function () {
        $(document).off("focusin.photoBox");
    },

    _ensureLayout: function () {
        if (!this._container) {
            this._createLayout();
        }
    },

    _displayLayout: function () {
        this._ensureLayout();

        this._$image.addClass("hide");

        $("body").append(this._overlay);
        this._$overlay.css("opacity", this._options.overlayOpacity).fadeIn(this._options.overlayFadeDuration);

        $("body").append(this._container);

        this._hiddenElements = [];
        var self = this;
        $("object").add(self._ie6 ? "select" : "embed").each(function (index, el) {
            self._hiddenElements[index] = [el, el.style.visibility];
            el.style.visibility = "hidden";
        });

        this._$window.bind("scroll resize", this._onResizeFunction);
        $(document).bind(Root.browser.mozilla ? "keypress" : "keydown", this._onKeyDownFunction);

        this._center();

        this._$container.focus();
        this._enforceFocus();
    },

    _hideLayout: function () {
        this._$container.addClass("hide");
        //this._resetImageSize();
        Root.RemoveElement(this._container);
        Root.RemoveElement(this._overlay);
        if (this._hiddenElements) {
            $.each(this._hiddenElements, function (index, el) { el[0].style.visibility = el[1]; });
            this._hiddenElements = null;
        }
        this._$window.unbind("scroll resize", this._onResizeFunction);
        $(document).unbind(Root.browser.mozilla ? "keypress" : "keydown", this._onKeyDownFunction);
        this._releseFocus();
    },

    _destroyLayout: function () {
        var self = this;

        self._$image.off('load');
        self._$image.off('error');
        self._image = null;

        self._$overlay.unbind('click', self._closeFunction);
        self._overlay = null;

        self._$closeButton.unbind('click', self._closeFunction);
        self._$prevImageButton.unbind('click', self._prevImageFunction);
        self._$nextImageButton.unbind('click', self._nextImageFunction);

        self._container = null;
    },

    _center: function () {
        var height,
            width;

        /* figuring out a pixel width and pixel height to set the overlay to for IE6. IE6 does not like using percentages in this case. */
        if (this._ie6) {
            width = this._$window.width();
            height = this._$window.height();
            var pageHeight = document.body.clientHeight;
            if (pageHeight > height) {
                height = pageHeight;
            }
            this._$overlay.css({ width: width, height: height });
        }

        height = (this._$window.height() - this._options.marginTop * 2);
        height = height < this._options.minHeight ? this._options.minHeight : height;

        width = (this._$window.width() - this._options.marginLeft * 2);
        width = width < this._options.minWidth ? this._options.minWidth : width;

        this._$container.css({ width: width + "px", height: height + "px" }).removeClass("hide").center();

        this._centerImage();
    },

    _centerImage: function () {
        if (this._image.src) {
            var scaledImageCss = $.scaleToFit(this._image, this._imageContainer, this._imageScalingOptions);
            this._$image.css(scaledImageCss);
        }
        //this._$loadingImage.center(this._imageContainer);
    },

    show: function (images, startImage) {
        this._images = images;
        this._loop = this._options.loop && (this._images.length > 1);
        this._displayLayout();
        return this._showImage(startImage);
    },

    _showPrevImage: function () {
        var self = this;
        if (!self._loading && self._currentImageIndex > 0) {
            //this._$image.fadeOut(this._options.imageFadeDuration, this._showPrevImageFunction);
            self._$image./*stop(true, true).*/animate({ left: '+=600', opacity: 'hide' },
                self._options.imageFadeDuration, self._showPrevImageFunction);
        }
    },

    _showNextImage: function () {
        var self = this;
        if (!self._loading && self._currentImageIndex < self._images.length - 1) {
            //this._$image.fadeOut(this._options.imageFadeDuration, this._showNextImageFunction);
            self._$image/*.stop(true, true)*/.animate({ left: '-=600', opacity: 'hide' }, self._options.imageFadeDuration,
                self._showNextImageFunction);
        }
    },

    _resetImageSize: function () {
        this._$image.removeAttr("naturalWidth");
        this._$image.removeAttr("naturalHeight");
        this._$image.removeAttr("width");
        this._$image.removeAttr("height");
        this._$image.removeAttr("style");
    },

    _showImage: function (imageIndex) {
        if (imageIndex >= 0 && imageIndex < this._images.length && !this._loading) {
            this._loading = true;

            this._currentImageIndex = imageIndex;
            var src = this._images[this._currentImageIndex].src;
            this._prevImageIndex = (this._currentImageIndex || (this._loop ? this._images.length : 0)) - 1;
            this._nextImageIndex = ((this._currentImageIndex + 1) % this._images.length) || (this._loop ? 0 : -1);

            if (this._prevImageIndex === -1) {
                this._$prevImageButton.css("display", "none");
            }
            else {
                this._$prevImageButton.removeCssProperties("display");
            }

            if (this._nextImageIndex === -1) {
                this._$nextImageButton.css("display", "none");
            }
            else {
                this._$nextImageButton.removeCssProperties("display");
            }

            this._setImageSrc(src);
        }
    },

    _setImageSrc: function (src) {
        this._resetImageSize();
        this._image.src = src + "?timestamp=" + new Date().getTime();
    },

    _onImageLoaded: function (event) {
        if (event && event.type && event.type === "error") {
            this._onLoadFail();
            return;
        }
        var loadedImage = event.currentTarget;
        var $loadedImage = $(loadedImage);

        var originalWidth = $loadedImage.width();
        var originalHeigth = $loadedImage.height();

        if (!(originalWidth && originalHeigth)) {
            this._onLoadFail();
            return;
        }

        this._imageScalingOptions = { originalWidth: originalWidth, originalHeight: originalHeigth, verticalCenter: true, horizontalCenter: true };
        var scaledImageCss = $.scaleToFit(loadedImage, this._imageContainer, this._imageScalingOptions);
        this._$image.css(scaledImageCss);

        //self._$image.removeClass("hide");
        this._$image.fadeIn(300);
        this._loading = false;
    },

    _onLoadFail: function () {
        this._setImageSrc(this._options.noImageAvailable);
    },

    _close: function () {
        this._currentImageIndex = this._prevImageIndex = this._nextImageIndex = -1;
        this._$image.fadeOut(this._options.imageFadeDuration);
        this._$overlay.fadeOut(this._options.overlayFadeDuration, this._hideLayoutFunction);
    },

    _stop: function () {
        this._$overlay.stop(true); // Stop the currently-running animation on the matched elements.
    },

    _onKeyDown: function (event) {
        var key;
        var windowEvent = window.event;
        if (windowEvent) {
            // For IE and Firefox prior to version 4
            key = windowEvent.keyCode;
        }
        else {
            key = (event.keyCode ? event.keyCode : event.which);
            event.stopPropagation();
        }
        // Prevent default keyboard action (like navigating inside the page)
        return ($.inArray(key, this._options.closeKeys) >= 0) ? this._close()
			: ($.inArray(key, this._options.nextKeys) >= 0) ? this._showNextImage()
			: ($.inArray(key, this._options.previousKeys) >= 0) ? this._showPrevImage()
			: false;
    }

};


(function ($) {
    $.fn.photoBox = function (options) {

        var photoBoxInstance = new Root.PhotoBox(options);
        var linkMapper = function (el) { return { src: el.href, title: el.title }; };
        var linksFilter = function () { return true; };

        var links = this;

        return links.unbind("click").bind("click", function () {
            // build the list of images that will be displayed
            var link = this;
            var startIndex = 0;
            var filteredLinks = $.grep(links, function (el, i) {
                return linksFilter.call(link, el, i);
            });

            // cannot use $.map() because it flattens the returned array
            for (var length = filteredLinks.length, i = 0; i < length; ++i) {
                if (filteredLinks[i] === link) {
                    startIndex = i;
                }
                filteredLinks[i] = linkMapper(filteredLinks[i], i);
            }
            photoBoxInstance.show(filteredLinks, startIndex);
            return false;
        });
    };
})(jQuery);
