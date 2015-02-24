; var root = root || {};

root.Analytics = root.Analytics || {};

// the semi-colon before function invocation is a safety net against concatenated 
// scripts and/or other plugins which may not be closed properly.
(function ($, window, document, undefined) {
    "use strict";

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variables rather than globals
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    var Controller = this.Controller = function (options) {
        this.options = options;
        this.init();
    };

    Controller.prototype = {
        constructor: Controller,

        init: function () {
            this.options = $.extend({}, Controller.defaults(), this.options);
            this._serviceUrl = this.options.serviceRoot;
            //this._serviceUrl = "http://evoq-svc-ci.rootdev.local/api/";
            this.extraParameters = root.KeyValueConverter.arrayToDictionary(this.options.extraParameters, "Key", "Value");
        },

        _callGetTest: function (parameters, onLoadHandler, method) {
            //var params = $.extend(parameters.entries(), this.extraParameters.entries());
            var params = "";
            for (var i = 0, size = parameters.length; i < size; i++) {
                params += "/" + parameters[i];
            }
            var serviceSettings = {
                url: this._serviceUrl + "/" + method + params,
                contentType: "application/json; charset=utf-8",
                //dataType: "json",
                //data: params,
                type: "GET",
                async: true,
                success: onLoadHandler,
                error: function () { alert("Ajax error"); }
            };
            $.ajax(serviceSettings);
        },

        setDateRange: function (startDate, endDate) {
            this._startDate = startDate;
            this._endDate = endDate;
        },

        getMetricViewData: function (onGetDataCallback) {
            var parameters = [];
            parameters.push(this._startDate.format("yyyy-MM-dd"));
            parameters.push(this._endDate.format("yyyy-MM-dd"));
            //parameters.set("pageUrl", "http://somesite.com");
            var handler = $.proxy(this._onGetStatsViewData, this, onGetDataCallback);
            this._callGetTest(parameters, handler, this.options.getStatsViewDataMethod, "getStatsViewData");
        },

        getTimeLineViewData: function (scale, onGetDataCallback) {
            var handler = $.proxy(this._onGetTimeLineViewData, this, onGetDataCallback);
            var parameters = [];
            parameters.push(this._startDate.format("yyyy-MM-dd"));
            parameters.push(this._endDate.format("yyyy-MM-dd"));
            parameters.push(scale);
            //parameters.set("pageUrl", "http://somesite.com");
            this._callGetTest(parameters, handler, this.options.getGraphViewDataMethod, "getGraphViewData");
        },

        _onGetStatsViewData: function (callback, data, textStatus, jqXhr) {
            callback.apply(this, [data ? Object.ToCamel(data.Stats) : null]);
        },

        _onGetTimeLineViewData: function (callback, data, textStatus, jqXhr) {
            var points = [];
            if (data && data.Points && data.Points.points) {
                points = data.Points.points;
                for (var i = 0, size = points.length; i < size; i++) {
                    points[i].key = Controller._parseDate(points[i].key);
                }
            }
            callback.apply(this, [points]);
        },

        getCountryMapViewData: function (country, onGetDataCallback) {
            var callback = $.proxy(this._onGetCountryMapViewData, this, onGetDataCallback);
            var parameters = [country];
            this._callGetTest(parameters, callback, this.options.getMapViewDataMethod, "getCountryMapViewData");
        },

        _onGetCountryMapViewData: function (callback, data, textStatus, jqXhr) {
            var map = null;
            if (data && data.Map) {
                map = JSON.parse(data.Map);
            }
            typeof callback === "function" && callback.apply(this, [map]);
        },

        getMapViewData: function (onGetDataCallback) {
            var handler = $.proxy(this._onGetMapViewData, this, onGetDataCallback);
            var parameters = new root.Dictionary();
            this._callGetTest(parameters, handler, this.options.getMapViewDataMethod, "getMapViewData");
        },

        _onGetMapViewData: function (callback, data, textStatus, jqXhr) {
            var map = null;
            if (data && data.Map) {
                map = JSON.parse(data.Map);
            }
            typeof callback === "function" && callback.apply(this, [map]);
        },

        getChoroplethViewData: function (onGetDataCallback) {
            var handler = $.proxy(this._onGetChoroplethViewData, this, onGetDataCallback);
            var parameters = new root.Dictionary();
            this._callGetTest(parameters, handler, this.options.getChoroplethViewDataMethod, "getChoroplethViewData");
        },

        getCountryChoroplethViewData: function (country, onGetDataCallback) {
            var handler = $.proxy(this._onGetChoroplethViewData, this, onGetDataCallback);
            var parameters = [country];
            this._callGetTest(parameters, handler, this.options.getChoroplethViewDataMethod, "getChoroplethViewData");
        },

        _onGetChoroplethViewData: function (callback, data, textStatus, jqXhr) {
            var choropleth = null;
            if (data) {
                choropleth = data.Choropleth;
            }
            typeof callback === "function" && callback.apply(this, [choropleth]);
        },

        getSourcesViewData: function (onGetDataCallback) {
            var handler = $.proxy(this._onGetSourcesViewData, this, onGetDataCallback);
            var parameters = new root.Dictionary();
            this._callGetTest(parameters, handler, this.options.getSourcesViewDataMethod, "getSourcesViewData");
        },

        _onGetSourcesViewData: function (callback, data, textStatus, jqXhr) {
            typeof callback === "function" && callback.apply(this, [data.Sources]);
        }

    };

    // parse a date in yyyy-mm-dd format
    Controller._parseDate = function (dateString) {
        var parts = dateString.split('-');
        return new Date(parts[0], parts[1] - 1, parts[2]); // months are 0-based
    };

    Controller._defaults = {
        serviceRoot: "InternalServices",
        getStatsMethod: "ItemListService/GetStats"
    };

    Controller.defaults = function (settings) {
        if (typeof settings !== "undefined") {
            $.extend(Controller._defaults, settings);
        }
        return Controller._defaults;
    };

}).apply(root.Analytics, [jQuery, window, document]);
