;
var root = root || {};

root.gallery = root.gallery || {};

// the semi-colon before function invocation is a safety net against concatenated 
// scripts and/or other plugins which may not be closed properly.
(function($, window, document, undefined, ko) {
    "use strict";

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variables rather than globals
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    var PhotoViewModel = this.PhotoViewModel = function(model, path) {
        this.thumbnailSource = ko.computed(function() {
            return "/Image" + "/120/120/" + path + "/" + model.source;
        }, this);

        this.imageSource = ko.computed(function() {
            return "/Image" + "/600/600/" + path + "/" + model.source;
        }, this);

        this.cssClass = ko.computed(function() {
            return model.orientation === 0 ? "ls" : "pt";
        }, this);

        this.loaded = ko.observable(false);
    };

    PhotoViewModel.prototype = {
        constructor: PhotoViewModel,

        onLoad: function(data, event) {
            this.loaded(true);
        }
    };

    var PhotoGalleryViewModel = this.PhotoGalleryViewModel = function(model, options) {
        this._options = options;
        this.photos = this._toObservable(model);
        this.date = ko.observable(new Date(model.date).format("longDate"));
    };

    PhotoGalleryViewModel.prototype = {
        constructor: PhotoGalleryViewModel,

        _toObservable: function(model) {
            var photos = [];
            for (var i = 0, size = model.photos.length; i < size; i++) {
                photos.push(new PhotoViewModel(model.photos[i], model.path));
            }
            return ko.observableArray(photos);
        }
    };

    var ViewModel = this.ViewModel = function(model, options) {
        this.galleries = this._toObservable(model);
        this._options = options;
    };

    ViewModel.prototype = {
        constructor: ViewModel,

        _toObservable: function(model) {
            var galleries = [];
            for (var i = 0, size = model.length; i < size; i++) {
                galleries.push(new PhotoGalleryViewModel(model[i]));
            }
            return ko.observableArray(galleries);
        }
    };

    this.initialize = function(selector, model, options) {
        var sliderOptions;
        ko.bindingHandlers.sectionCreated = {
            update: function(element, valueAccessor, allBindingsAccessor, elementViewModel, bindingContext) {
                // This will be called once when the binding is first applied to an element,
                // and again whenever the associated observable changes value.
                // Update the DOM element based on the supplied values here.
                var $element = $(element);
                sliderOptions = {
                    containerSelector: $element.find("ul"),
                    prevButton: $element.find(".gl-slides-prev-button"),
                    nextButton: $element.find(".gl-slides-next-button")
                };
            }
        };
        ko.bindingHandlers.thumbnailsCreated = {
            update: function(element, valueAccessor, allBindingsAccessor, elementViewModel, bindingContext) {
                // This will be called once when the binding is first applied to an element,
                // and again whenever the associated observable changes value.
                // Update the DOM element based on the supplied values here.
                var $ul = $(element); // ul
                if (!/android|iphone|ipod|series60|symbian|windows ce|blackberry/i.test(navigator.userAgent)) {
                    $ul.find("a").photoBox({/* custom options here */ });
                }
                var containerWidth = 0;
                var elementWidth = 0;
                sliderOptions.containerSelector = $ul;
                $ul.children().each(function () {
                    containerWidth += $(this).outerWidth(true);
                    if (elementWidth === 0) {
                        elementWidth = containerWidth;
                    }
                });
//                var containerWidthFunction = function($container) {
//                    var containerWidth = 0;
//                    $container.children().each(function() {
//                        containerWidth += $(this).outerWidth(true);
//                    });
//                    return containerWidth;
//                };
                sliderOptions.containerWidth = containerWidth;
                sliderOptions.displayAreaWidth = Math.floor($ul.innerWidth() / elementWidth) * elementWidth;
                var slider = new root.Slider($(".gl-slides-center-column")[0], sliderOptions);
            }
        };
        $(document).ready(function() {
            // preload image
            new Image().src = "/Images/in-progress-small.gif";
            var vm = new ViewModel(model, options);
            ko.applyBindings(vm, $(selector)[0]);
        });
    };

}).apply(root.gallery, [jQuery, window, document, undefined, ko]);