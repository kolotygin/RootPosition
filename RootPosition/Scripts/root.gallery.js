var root = root || {};

root.gallery = root.gallery || {};

// the semi-colon before function invocation is a safety net against concatenated 
// scripts and/or other plugins which may not be closed properly.
(function ($, window, document, undefined, ko) {
    "use strict";

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variables rather than globals
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    var PhotoViewModel = this.PhotoViewModel = function (model, path) {
        this.thumbnailSource = ko.computed(function () {
            return "/Image" + "/120/120/" + path + "/" + model.source;
        }, this);

        this.imageSource = ko.computed(function () {
            return "/Image" + "/600/600/" + path + "/" + model.source;
        }, this);

        this.cssClass = ko.computed(function () {
            return model.orientation === 0 ? "ls" : "pt";
        }, this);

        this.loaded = ko.observable(false);
    };

    PhotoViewModel.prototype = {
        constructor: PhotoViewModel,

        onLoad: function (data, event) {
            this.loaded(true);
        }

    };

    var PhotoGalleryViewModel = this.PhotoGalleryViewModel = function (model, options) {
        this._options = options;
        this.photos = this._toObservable(model);
        this.date = ko.computed(function () {
            var date = new Date(model.date);
            return date.format("longDate");
        }, this);
    };

    PhotoGalleryViewModel.prototype = {
        constructor: PhotoGalleryViewModel,

        _toObservable: function (model) {
            var photos = [];
            for (var i = 0, size = model.photos.length; i < size; i++) {
                photos.push(new PhotoViewModel(model.photos[i], model.path));
            }
            return ko.observableArray(photos);
        }
    };

    var ViewModel = this.ViewModel = function (model, options) {
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

    this.initialize = function (selector, model, options) {
        $(document).ready(function () {
            var $element = $(selector);
            var element = $element[0];
            ko.bindingHandlers.showGalleryDate = {
                update: function (element, valueAccessor, allBindingsAccessor, elementViewModel, bindingContext) {
                    // This will be called once when the binding is first applied to an element,
                    // and again whenever the associated observable changes value.
                    // Update the DOM element based on the supplied values here.
                    var date = new Date(elementViewModel.createdAt);
                    $(element).text(date.format("h:mmt dd-MM-yyyy")).attr("datetime", date.toLocaleTimeString());
                }
            };
            ko.bindingHandlers.attachOnThumbnailClick = {
                update: function (element, valueAccessor, allBindingsAccessor, elementViewModel, bindingContext) {
                    // This will be called once when the binding is first applied to an element,
                    // and again whenever the associated observable changes value.
                    // Update the DOM element based on the supplied values here.
                    if (! /android|iphone|ipod|series60|symbian|windows ce|blackberry/i.test(navigator.userAgent)) {
                        $(element).find("a") .photoBox({/* custom options here */ });
                    }
                }
            };
            var vm = new ViewModel(model, options);
            ko.applyBindings(vm, element);
        });
    };


}).apply(root.gallery, [jQuery, window, document, undefined, ko]);

