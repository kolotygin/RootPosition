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


    //
    // ChoroplethMap
    //
    var ChoroplethMap = this.ChoroplethMap = function (element, options, controller) {
        this.element = element;
        this._options = options;
        this._controller = controller;
        this.init();
    };

    ChoroplethMap.prototype = {
        constructor: ChoroplethMap,

        init: function () {
            // Place initialization logic here
            // You already have access to the DOM element and the options via the instance, 
            // e.g., this.element and this.options
            this._options = $.extend({}, ChoroplethMap.defaults(), this._options);
            this.$this = $(this);
            this.$element = $(this.element);

            this._size = this._options.size; // { width: 940, height: 300 };
            this._blender = new ChoroplethBlender(this._options.colorRange);
            this.initializeMap();
        },

//        quantize: function (d) {
//            return "q" + Math.floor(getCountyNorm(d.id) * 10) + "-9";
//        },

        initializeMap: function () {
            var map = d3.geo.equirectangular().scale(150);
            this.path = d3.geo.path().projection(map);

            this.svg = d3.select(this.element).append("svg")
              .attr("width", "100%")
              .attr("height", "100%")
              .attr("viewBox", "0 0 " + this._options.size.width + " " + this._options.size.height)
              .attr("preserveAspectRatio", "xMidYMid");

            // Add a transparent rect so that zoomMap works if user clicks on SVG
            var self = this;
            var onRectangleClickHandler = function () { self.zoomMap(); };
            this.svg.append("rect")
              .attr("class", "choropleth-background")
              .attr("width", this._options.size.width)
              .attr("height", this._options.size.height)
              .on("click", onRectangleClickHandler);
        },

        showWorld: function (topology) {
            // Add g element to load country paths
            this.svg.selectAll("#countries").remove();
            this.g = this.svg.append("g").attr("id", "countries");

            var self = this;
            var onMouseOverHandler = function (d) { d3.select(this).classed("country-hovered", true); };
            var onMouseOutHandler = function (d) { d3.select(this).classed("country-hovered", false); };
            var onMouseClickHandler = function (d) { self.zoomMap(d); };
            var getId = function (d) { return d.properties.name.split(" ").join(""); };

            this.g.selectAll("path")
                .data(topojson.feature(topology, topology.objects.countries).features)
                .enter().append("path")
                .attr("d", this.path)
                .attr("id", getId)
                .classed("country", true)
                .on("mouseover", onMouseOverHandler)
                .on("mouseout", onMouseOutHandler)
                .on("click", onMouseClickHandler)
                .append("svg:title")
                .text(function (d) { return d.properties.name; });

            // remove Antarctica
            this.g.select("#Antarctica").remove();
        },

        showWorldChoropleth: function (choropleth) {
            this._blender.showChoropleth(choropleth, this.g.selectAll("path"), function (d) { return d.id; });
        },

        showCountryChoropleth: function (choropleth) {
            if (this._inTransition) {
                this._countryChoropleth = choropleth;
                return;
            }
            this._countryChoropleth = undefined;
            if (this.countryElement) {
                this._blender.showChoropleth(choropleth, this.countryElement.selectAll("path"), function (d) { return d.properties.NAME_1; });
            }
        },

        zoomMap: function (d) {
            var x, y, zoomLevel;

            if (d && this.centered !== d) {
                var centroid = this.path.centroid(d);
                x = centroid[0];
                y = centroid[1];
                zoomLevel = 2;
                this.centered = d;
                this.zoomCountry(d);
            }
            else {
                // zoom out, this happens when user clicks on the same country or an ocean
                x = this._options.size.width / 2;
                y = this._options.size.height / 2;
                zoomLevel = 1;
                this.centered = null;
            }

            // remove the country layer on zoom either out or other country
            this.svg.selectAll("#country").remove();
            this.countryElement = null;

            var self = this;
            this.g.selectAll("path").classed("active", this.centered && function (d) { return d === self.centered; });
            this._startTransition(x, y, zoomLevel);
        },

        _startTransition: function (x, y, zoomLevel) {
            var self = this;
            this._inTransition = true;
            var onEndTransitionHandler = function () { self._onEndTransition(); };
            this.g.transition()
              .duration(600)
              .delay(0)
              .attr("transform", "translate(" + this._options.size.width / 2 + "," + this._options.size.height / 2 + ")scale(" + zoomLevel + ")translate(" + -x + "," + -y + ")")
              .each("end", onEndTransitionHandler);
        },

        _onEndTransition: function() {
            console.log("transition ends");
            this._inTransition = false;
            if (this._countryTopology) {
                this.showCountry(this._countryTopology);
            }
            if (this._countryChoropleth) {
                this.showCountryChoropleth(this._countryChoropleth);
            }
        },

        zoomCountry: function (d) {
            var e = $.Event('onselectcountry');
            this.$this.trigger(e, [d.id]);
        },

        showCountry: function (topology) {
            console.log("show country");
            if (this._inTransition || !topology) {
                this._countryTopology = topology;
                return;
            }
            this._countryTopology = undefined;

            // remove the country
            this.svg.selectAll("#country").remove();
            this.countryElement = this.svg.append("g").attr("id", "country");
            this.countryGroup = this.svg.select("#country");

            var centroid = this.path.centroid(this.centered);
            var x = centroid[0];
            var y = centroid[1];
            var regions = topology.objects;
            var o = null;
            for (var property in regions) {
                o = regions[property];
            }
            var self = this;
            var onMouseOverHandler = function (d) { d3.select(this).classed("state-hovered", true); };
            var onMouseOutHandler = function (d) { d3.select(this).classed("state-hovered", false); };
            var onMouseClickHandler = function (d) { self.zoomToState(d); };
            var getId = function (d) { return d.properties.NAME_1 && d.properties.NAME_1.split(" ").join(""); };
            this.countryGroup.selectAll("path")
                .data(topojson.feature(topology, o).features)
                .enter().append("path")
                .attr("d", this.path)
                .attr("id", getId)
                .classed("state", true)
                .on("mouseover", onMouseOverHandler)
                .on("mouseout", onMouseOutHandler)
                .on("click", onMouseClickHandler)
                .append("svg:title")
                .text(function (d) { return d.properties.NAME_1 ? d.properties.NAME_1 : ""; });

            this.countryElement.attr("transform", "translate(" + this._options.size.width / 2 + "," + this._options.size.height / 2 + ")scale(" + 2 + ")translate(" + -x + "," + -y + ")");

        },

        zoomToState: function (d) {
            console.log('zoom to state');
            var x, y, zoomLevel, centroid;

            if (d && this.centeredState !== d) {
                centroid = this.path.centroid(d);
                x = centroid[0];
                y = centroid[1];
                zoomLevel = 4;
                this.centeredState = d;
                //this.zoomCountry(d);
            }
            else {
                // zoom out, this happens when user clicks on the same state, ocean, or country
                centroid = this.path.centroid(this.centered);
                x = centroid[0];
                y = centroid[1];
                zoomLevel = 2;
                this.centeredState = null;
            }

            // remove the country layer on zoom either out or other country
            //this.svg.selectAll("#country").remove();

            var self = this;
            //this.g.selectAll("path").classed("active", this.centeredState && function (d) { return d === self.centeredState; });
            this._startStateTransition(x, y, zoomLevel);
        },

        _startStateTransition: function (x, y, zoomLevel) {
            var self = this;
            this._inTransition = true;
            var onEndTransitionHandler = function () { self._onEndTransition(); };
            this.g.transition()
              .duration(600)
              .delay(0)
              .attr("transform", "translate(" + this._options.size.width / 2 + "," + this._options.size.height / 2 + ")scale(" + zoomLevel + ")translate(" + -x + "," + -y + ")")
              //.each("end", onEndTransitionHandler);
            this.countryElement.transition()
              .duration(600)
              .delay(0)
              .attr("transform", "translate(" + this._options.size.width / 2 + "," + this._options.size.height / 2 + ")scale(" + zoomLevel + ")translate(" + -x + "," + -y + ")")
              //.each("end", onEndTransitionHandler);
        }

    };

    ChoroplethMap._defaults = {
        size: { width: 940, height: 300 },
        colorRange: ["#ccc", "rgb(162,202,229)", "rgb(151,196,226)", "rgb(100,167,212)", "rgb(48,137,198)"]
    };

    ChoroplethMap.defaults = function (settings) {
        if (typeof settings !== "undefined") {
            $.extend(ChoroplethMap._defaults, settings);
        }
        return ChoroplethMap._defaults;
    };


    var ChoroplethBlender = this.ChoroplethBlender = function (colorRange) {
        this._colorRange = colorRange; // ["rgb(162,202,229)", "rgb(151,196,226)", "rgb(100,167,212)", "rgb(48,137,198)"]
        this.init();
    };

    ChoroplethBlender.prototype = {
        constructor: ChoroplethBlender,

        init: function() {
            this._color = d3.scale.quantize().range(this._colorRange);
        },

        showChoropleth: function(choropleth, selection, key) {
            if (!choropleth) {
                return;
            }

            this._color.domain([
                d3.min(choropleth, function(d) { return d.value; }),
                d3.max(choropleth, function(d) { return d.value; })
            ]);

            var self = this;
            selection.each(function (d, i) {
                var keyValue = (typeof key === "function") ? key.call(this, d) : key;
                var value = self._getChoroplethValue(choropleth, keyValue);
                d3.select(this).style("fill", isNaN(value) ? self._colorRange[0] : self._color(value));
            });
        },

        _getChoroplethValue: function (choropleth, key) {
            for (var i = 0, size = choropleth.length; i < size; i++) {
                if (choropleth[i].key === key) {
                    return choropleth[i].value;
                }
            }
            return NaN;
        }
    };

}).apply(root.Analytics, [jQuery, window, document, undefined]);
