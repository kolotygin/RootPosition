; var root = root || {};

root.Analytics = root.Analytics || {};

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

    //
    // MetricViewModel Model
    //
    var MetricViewModel = this.MetricViewModel = function (controller) {
        this._controller = controller;
        this.values = ko.observable();
    };

    MetricViewModel.prototype = {
        constructor: MetricViewModel,

        _init: function() {
        },

        _getMetricData: function() {
            var getStatsHandler = $.proxy(function (data) { this.values(data); }, this);
            this._controller.getMetricViewData(getStatsHandler);
        },

        show: function() {
            this._getMetricData();
        }

    };

    //
    // TimeLineViewModel
    //
    var TimeLineViewModel = this.TimeLineViewModel = function (controller, options) {
        this.scales = new root.Enum([
            { key: 0, value: "unspecified" },
            { key: 1, value: "Day" },
            { key: 2, value: "Week" },
            { key: 3, value: "Month" },
            { key: 4, value: "Year" }]);
        this.selectedScale = ko.observable(this.scales.Week);
        this.isDayScale = ko.computed(this._isDayScale, this);
        this.isWeekScale = ko.computed(this._isWeekScale, this);
        this.isMonthScale = ko.computed(this._isMonthScale, this);
        this.isYearScale = ko.computed(this._isYearScale, this);
        this.source = ko.observableArray();
        this.source.subscribe(this._onSourceChanged, this);

        this._controller = controller;
        this._options = options;

        this._init();
    };

    TimeLineViewModel.prototype = {
        constructor: TimeLineViewModel,

        _init: function() {
            var graphOptions = $.extend({}, {
                tooltipTextFunction: function (datum) { return datum.key.format("dd-MMM-yyyy") + " : " + datum.value + " Pageviews"; }
            }, this._options);
            this._graph = new root.TimeLineGraph($("#" + this._options.containerId)[0], graphOptions);
            this.source([]);

            this.selectedScale.subscribe(this._scaleChanged, this);

        },

        _scaleChanged: function (newValue) {
            this._getTimeLineViewData();
        },

        _getTimeLineViewData: function () {
            var callback = $.proxy(this._onGetTimeLineViewData, this);
            this._controller.getTimeLineViewData(this.selectedScale(), callback);
        },

        _onGetTimeLineViewData: function (data) {
            this.source(data);
        },

        _onSourceChanged: function (newValue) {
            this._show();
        },

        setScale: function (caller, evt) {
            var clickedOption = evt.currentTarget;
            var $clickedOption = $(clickedOption);
            this.selectedScale(parseInt($clickedOption.attr("data"), 10));
        },

        _isDayScale: function () {
            return this.selectedScale() === this.scales.Day;
        },

        _isWeekScale: function () {
            return this.selectedScale() === this.scales.Week;
        },

        _isMonthScale: function () {
            return this.selectedScale() === this.scales.Month;
        },

        _isYearScale: function () {
            return this.selectedScale() === this.scales.Year;
        },

        _show: function () {
            this._graph.draw(this.source(), this.scales.getEnumName(this.selectedScale()).toLowerCase());
        },

        show: function() {
            this._getTimeLineViewData();
        }

    };

    //
    // GeoMapViewModel
    //
    var GeoMapViewModel = this.GeoMapViewModel = function (controller, options) {
        this._controller = controller;
        this._options = options;
        this._init();
    };

    GeoMapViewModel.prototype = {
        constructor: GeoMapViewModel,

        _init: function() {
            var options = $.extend({}, {
                graphClass: "graph",
                size: { width: 960, height: 400 }
            }, this._options);
            this._map = new root.Analytics.ChoroplethMap($("#" + this._options.containerId)[0], options);
            var onSelectCountryHandler = $.proxy(this._onSelectCountry, this);
            $(this._map).on("onselectcountry", onSelectCountryHandler);

            var zoomOptions = {
                horizontal: false,
                vertical: true,
                yPrecision: 800,
                animationCallback: function(x, y) {
                    //alert(String(12 + x * 24) + 'px');
                }
            };
            //this._zoom = new Dragdealer(this._options.zoomId, zoomOptions);

            this.$this = $(this);
        },

        _onSelectCountry: function (eventObject, country) {
            var callback = $.proxy(this._onGetCountryMapViewData, this, country);
            this._controller.getCountryMapViewData(country, callback);
        },

        _onGetCountryMapViewData: function (country, data) {
            this.showCountry(data);
            this._getCountryChoroplethViewData(country);
        },

        _getCountryChoroplethViewData: function (country) {
            var callback = $.proxy(this._onGetCountryChoroplethViewData, this);
            this._controller.getCountryChoroplethViewData(country, callback);
        },

        _onGetCountryChoroplethViewData: function (data) {
            this.showCountryChoropleth(data);
        },

        _getMapViewData: function () {
            var callback = $.proxy(this._onGetMapViewData, this);
            this._controller.getMapViewData(callback);
        },

        _onGetMapViewData: function (data) {
            this.showWorld(data);
            this._getChoroplethViewData();
        },

        _getChoroplethViewData: function () {
            var callback = $.proxy(this._onGetChoroplethViewData, this);
            this._controller.getChoroplethViewData(callback);
        },

        _onGetChoroplethViewData: function (data) {
            this.showWorldChoropleth(data);
        },

        showCountry: function (data) {
            this._map.showCountry(data);
        },

        showWorld: function(data) {
            this._map.showWorld(data);
        },

        show: function () {
            this._getMapViewData();
        },

        showWorldChoropleth: function (data) {
            this._map.showWorldChoropleth(data);
        },

        showCountryChoropleth: function (data) {
            this._map.showCountryChoropleth(data);
        }

    };

    //
    // SourcesViewModel
    //
    var SourcesViewModel = this.SourcesViewModel = function (controller, options) {
        this._options = options;
        this._controller = controller;
        this.categories = ko.observableArray([]);
        this.metric = ko.observable();
        this.selectedCategory = ko.observable();
        this.selectedCategoryDescription = ko.computed(this._selectedCategoryDescription, this);
        this._init();
    };

    SourcesViewModel.prototype = {
        constructor: SourcesViewModel,

        _init: function () {
            var options = $.extend({}, {
                innerRadius: 60,
                outerRadius: 80,
                size: { width: 650, height: 400 },
                textOffset: 24,
                tweenDuration: 1050,
                tooltipTextFunction: $.proxy(this._getSliceTooltip, this)
            }, this._options);
            this._chart = new root.Analytics.PieChart($("#" + this._options.containerId)[0], options);
            var onSelectSliceHandler = $.proxy(this._onSelectSlice, this);
            $(this._chart).on("onselectslice", onSelectSliceHandler);

            this.$this = $(this);
        },

        _getSliceTooltip: function(d) {
            var slicePageViews = d.data.value.pageViews;
            var perecentage = (slicePageViews / this._getTotalViews()) * 100;
            return d.data.key + ": " + d.data.value.pageViews + " views | " + perecentage.toFixed(0) + "%";
        },

        _getSourcesViewData: function() {
            var callback = $.proxy(this._onGetSourcesViewData, this);
            this._controller.getSourcesViewData(callback);
        },

        _onGetSourcesViewData: function (data) {
            var sourceAccessor = {
                getName: function(d) { return d.key; },
                getValue: function(d) { return d.value.pageViews; },
                getSlices: function(data) { return data.categories; },
                getTotal: function(data) { return data.metric; },
                getTotalName: function(d) { return d.key; },
                getTotalValue: function(d) { return d.value.pageViews; }
            };

            this.categories(data.categories);
            this.metric(data.metric);
            this._chart.show(data, sourceAccessor);

            var categories = data.categories;
            var index = 0;
            var size = categories.length;
            if (size == 0) {
                return;
            }
            if (size > 1) {
                for (var i = 1; i < size; i++) {
                    if (categories[index].value.pageViews < categories[i].value.pageViews) {
                        index = i;
                    }
                }
                this._chart.selectSlice(index);
            }
            this.selectedCategory(data.categories[index]);
        },

        isSelected: function(category) {
            return category === this.selectedCategory();
        },

        selectCategory: function(category) {
            this.selectedCategory(category);
            this._chart.selectSlice(category);
        },

        _selectedCategoryDescription: function () {
            var selectedCategory = this.selectedCategory();
            if (!selectedCategory) {
                return "";
            }
            var total = this._getTotalViews();
            if (isNaN(total)) {
                return "";
            }
            var perecentage = (selectedCategory.value.pageViews / total) * 100;
            return perecentage.toFixed(0) + "%" + " (" + total + ")";
        },

        _getTotalViews: function() {
            var metric = this.metric();
            if (!metric) {
                return NaN;
            }
            return metric.value.pageViews;
        },

        _onSelectSlice: function (eventObject, slice) {
            this.selectedCategory(slice);
        },

        show: function () {
            this._getSourcesViewData();
        }

    };


    var ViewModel = this.ViewModel = function (options) {
        this._options = options;

        var endDateValue = new Date();
        var startDateValue = new Date(new Date().setDate(endDateValue.getDate() - 30));

        this.endDate = ko.observable(endDateValue);
        this.startDate = ko.observable(startDateValue);

        this.startDate.subscribe(this._startDateChanged, this);
        this.endDate.subscribe(this._endDateChanged, this);

        this.stats = ko.observable();

        this.metricTypes = ko.observableArray([]);
        this.selectedMetricType = ko.observable();

        this.init();
    };

    ViewModel.prototype = {
        constructor: ViewModel,

        init: function () {
            this._controller = new root.Analytics.Controller(this._options.services);

            this.metricTypes([
                { key: 0, value: "Pageviews" },
                { key: 1, value: "Unique Pageviews" },
                { key: 2, value: "Average Time" },
                { key: 3, value: "Entrances" },
                { key: 4, value: "Bounce Rate" },
                { key: 5, value: "Exit Rate" }
            ]);
            this.selectedMetricType(root.KeyValueConverter.getKeyValuePairByKey(this.metricTypes(), 0));

            this.metricView = new MetricViewModel(this._controller);
            this.timeLineView = new TimeLineViewModel(this._controller, this._options.timeLineView);
            this.geoMapView = new GeoMapViewModel(this._controller, this._options.geoMapView);
            //this.sourcesView = new SourcesViewModel(this._controller, this._options.sourcesView);

            this.show();
        },

        _startDateChanged: function (newValue) {
            this.show();
        },

        _endDateChanged: function (newValue) {
            this.show();
        },

        show: function () {
            this._controller.setDateRange(this.startDate(), this.endDate());
            this.metricView.show();
            this.timeLineView.show();
            this.geoMapView.show();
            //this.sourcesView.show();
        }

    };

    this.initialize = function (selector, options) {
        $(document).ready(function () {
            var $element = $(selector);
            // in case when control is excluded from rendering by server tags logic,
            // a check on the html element existence is performed here:
            if ($element.length === 0) {
                return;
            }
            var element = $element[0];

            var model = new ViewModel(options);
            if (element.id) {
                root[element.id] = model;
            }
            ko.applyBindings(model, element);

        });
    };

}).apply(root.Analytics, [jQuery, window, document, undefined, ko]);
