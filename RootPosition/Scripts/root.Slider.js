; var root = root || {};

// the semi-colon before function invocation is a safety net against concatenated 
// scripts and/or other plugins which may not be closed properly.
(function ($, window, document, undefined) {
    "use strict";

    var SliderCalculator = this.SliderCalculator = function(options) {
        this._displayAreaWidth = options.displayAreaWidth || 0;
        this._containerWidth = options.containerWidth || 0;
        this._leftMargin = options.leftMargin || 0;
    };

    SliderCalculator.prototype = {
        constructor: SliderCalculator,

        size: function() {
            return window.Math.ceil(this._containerWidth / this._displayAreaWidth);
        },

        currentIndex: function (index) {
            var currentIndexValue = window.Math.ceil(this._leftMargin / this._displayAreaWidth);
            if (typeof index === "undefined") {
                return currentIndexValue;
            }
            if (!this.isIndexInRange(index)) {
                throw "index is out of range";
            }
            if (index > currentIndexValue) {
                this.slideLeft(this._displayAreaWidth * (index - currentIndexValue));
            }
            else {
                this.slideRight(this._displayAreaWidth * (currentIndexValue - index));
            }
            return index;
        },

        leftMargin: function() {
            return this._leftMargin;
        },

        rightMargin: function() {
            return this._containerWidth - this._displayAreaWidth - this._leftMargin;
        },

        // next slide: move forwards by slideLength
        slideLeft: function (slideLength) {
            var offset = this.rightMargin();
            if (offset > 0) {
                this._leftMargin += window.Math.min(typeof slideLength === "undefined" ? this._displayAreaWidth : slideLength, offset);
            }
        },

        // prev slide: move backwards by slideLength
        slideRight: function (slideLength) {
            var offset = this.leftMargin();
            if (offset > 0) {
                this._leftMargin -= window.Math.min(typeof slideLength === "undefined" ? this._displayAreaWidth : slideLength, this.leftMargin());
            }
        },

        isIndexInRange: function(index) {
            return index < this.size() && index >= 0;
        },

        canSlide: function() {
            return this.leftMargin() > 0 || this.rightMargin() > 0;
        },

        canSlideLeft: function() {
            return this.rightMargin() > 0;
        },

        canSlideRight: function() {
            return this.leftMargin() > 0;
        }

    };


    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variables rather than globals
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    var pluginName = 'slider';

    // The actual plugin constructor
    var Slider = this.Slider = function (element, options) {
        this.element = element;
        this.options = options;

        this.init();
    };

    Slider.prototype = {

        constructor: Slider,

        init: function () {
            // Place initialization logic here
            // You already have access to the DOM element and the options via the instance, 
            // e.g., this.element and this.options
            this.options = $.extend({}, Slider.defaults(), this.options);

            this.$this = $(this);
            this.$element = $(this.element); // container

            this.$container = this.options.containerSelector ? $(this.options.containerSelector) : $(this.$element.children[0]); // items container

            this.$nextButton = $(this.options.nextButton);
            this.$prevButton = $(this.options.prevButton);

            this._onNextButtonClickHandler = $.proxy(this._onNextButtonClick, this);
            this._onPrevButtonClickHandler = $.proxy(this._onPrevButtonClick, this);
            this.$prevButton.on("click", this._onPrevButtonClickHandler);
            this.$nextButton.on("click", this._onNextButtonClickHandler);

            this._initialLeftMargin = this._getContainerLeftMargin();

            this._$completeLeft = $.proxy(this._complete, this, "left");
            this._$completeRight = $.proxy(this._complete, this, "right");
            this._$completeNoSlide = $.proxy(this._complete, this, "no-slide");
            this._$inProgressHandler = $.proxy(this._complete, this, "in-progress");

            this._calculator = new SliderCalculator({
                displayAreaWidth: this.$element.width(),
                containerWidth: this.$container.outerWidth(),
                leftMargin: 0
            });

            this._inProgress = false;
        },

        _complete: function (state) {
            if (state !== "in-progress") {
                this._inProgress = false;
            }
            this.$this.trigger($.Event("slide-completed"), [state]);
        },

        _onNextButtonClick: function (eventObject) {
            eventObject.preventDefault();
            this.slideLeft();
        },

        _onPrevButtonClick: function (eventObject) {
            eventObject.preventDefault();
            this.slideRight();
        },

        _scroll: function(onComplete) {
            this.$container.animate({ marginLeft: -this._calculator.leftMargin() + this._initialLeftMargin }, this.options.slidingSpeed, "linear", onComplete);
        },

        _getContainerLeftMargin: function () {
            // get current margin of slider
            var leftMargin = this.$container.css("margin-left");
            // first page load, margin will be auto, we need to change this to 0
            if (leftMargin === "auto") {
                leftMargin = 0;
            }
            // return the current margin to the function as an integer
            return (-window.parseInt(leftMargin, 10));
        },

        inProgress: function () {
            return this._inProgress;
        },

        currentIndex: function (index) {
            if (typeof index === "undefined") {
                return this._calculator.currentIndex();
            }
            if (this._inProgress) {
                this._$inProgressHandler();
            }
            this._inProgress = true;
            if (index === this._calculator.currentIndex()) {
                this._$completeNoSlide();
                return index;
            }
            var onComplete = index > this._calculator.currentIndex() ? this._$completeLeft : this._$completeRight;
            this._calculator.currentIndex(index);
            this._scroll(onComplete);
            return index;
        },

        size: function() {
            return this._calculator.size();
        },

        // next slide
        slideLeft: function () {
            if (this._inProgress) {
                this._$inProgressHandler();
                return;
            }
            this._inProgress = true;
            if (this._calculator.canSlideLeft()) {
                this._calculator.slideLeft();
                this._scroll(this._$completeLeft);
            }
            else {
                this._$completeNoSlide();
            }
        },

        // prev slide
        slideRight: function () {
            if (this._inProgress) {
                this._$inProgressHandler();
                return;
            }
            this._inProgress = true;
            if (this._calculator.canSlideRight()) {
                this._calculator.slideRight();
                this._scroll(this._$completeRight);
            }
            else {
                this._$completeNoSlide();
            }
        },

        canSlide: function () {
            return this._calculator.canSlide();
        },

        canSlideLeft: function () {
            return this._calculator.canSlideLeft();
        },

        canSlideRight: function () {
            return this._calculator.canSlideRight();
        }

    };

    Slider._defaults = {
        containerSelector: "",
        nextButton: null,
        prevButton: null,
        slidingSpeed: 600
    };

    Slider.defaults = function (settings) {
        if (typeof settings !== "undefined") {
            $.extend(Slider._defaults, settings);
        }
        return Slider._defaults;
    };


    $.fn[pluginName] = function (option) {

        // get the arguments
        var args = $.makeArray(arguments);
        var params = args.slice(1);

        return this.each(function () {
            var $this = $(this);
            var instance = $this.data(pluginName);
            if (!instance) {
                var options = $.extend({}, typeof option === "object" && option);
                $this.data(pluginName, (instance = new Slider(this, options)));
            }
            if (typeof option === "string") {
                instance[option].apply(instance, params);
            }
        });
    };

}).apply(root, [jQuery, window, document]);

