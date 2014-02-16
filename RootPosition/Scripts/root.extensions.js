Number.parseLocaleFixed = function (value) {
    return Number.parseLocale(value.replace(" ", "Â "));
};

Object.isNullOrUndefined = function (value) {
    return (typeof (value) === "undefined" || value === null);
};

String.isNullOrEmpty = function (value) {
    return (Object.isNullOrUndefined(value) || value === "");
};

String.Empty = "";

if (typeof String.toCamel === "undefined") {
    String.toCamel = function (text) {
        return String.isNullOrEmpty(text) ? text : (text.charAt(0).toLowerCase() + text.substr(1));
    };
};

if (typeof Object.ToCamel === "undefined") {
    Object.ToCamel = function (o) {
        var camelizedObject = {};
        var propertyValue;
        for (var propertyName in o) {
            if (Object.prototype.hasOwnProperty.call(o, propertyName) && typeof (propertyName) === "string") {
                propertyValue = o[propertyName];
                if (typeof (propertyValue) === "object" && propertyValue !== null && propertyValue.constructor !== Array) {
                    propertyValue = Object.ToCamel(propertyValue);
                }
                camelizedObject[String.toCamel(propertyName)] = propertyValue;
            }
        }
        return camelizedObject;
    };
};

String.prototype.append = function (stringToAppend, separator) {
    if (String.isNullOrEmpty(stringToAppend)) {
        return this;
    }
    else if (String.isNullOrEmpty(this)) {
        return stringToAppend;
    }
    else {
        var result = [];
        result[0] = this;
        result[1] = stringToAppend;
        return result.join(separator);
    }
};

if (!String.prototype.trim) {
    String.prototype.trim = function () { return this.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); };
}

if (!String.prototype.ltrim) {
    String.prototype.ltrim = function () { return this.replace(/^\s+/, ''); };
}

if (!String.prototype.rtrim) {
    String.prototype.rtrim = function () { return this.replace(/\s+$/, ''); };
}

if (!String.prototype.fulltrim) {
    String.prototype.fulltrim = function () { return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' '); };
}

var Root = Root || {};

Root.HtmlEncode = function (text) {
    if (typeof (text) === "string") {
        text = text.replace(/&/g, "&amp;");
        text = text.replace(/"/g, "&quot;");
        text = text.replace(/</g, "&lt;");
        text = text.replace(/>/g, "&gt;");
        text = text.replace(/'/g, "&#146;");
    }
    return text;
};

/* encodes HTML entities
* and also replaces non-breakable spaces with common ones for proper appearance
*/
Root.HtmlEncodeAndReplaceNBSP = function (text) {
    if (typeof (text) === "string") {
        text = Root.HtmlEncode(text);
        text = text.replace(/\u00a0/g, ' ');
    }
    return text;
};

Root.GetControl = function (controlId) {
    var control = null;

    if (document.getElementById) {
        control = document.getElementById(controlId);
    }
    else if (document.all) {
        control = document.all[controlId];
    }
    else if (document.layers) {
        control = document.layers(controlId);
    }
    else if (document.forms) {
        if (document.forms[controlId]) {
            control = document.forms[controlId];
        }
        else {
            var i;
            for (i = 0; i < document.forms.length; i++) {
                if (document.forms[i][controlId]) {
                    control = document.forms[i][controlId];
                    break;
                }
            }
        }
    }
    return control;
};

Root.GetControls = function (controlIDs) {
    if (Root.IsArray(controlIDs)) {
        var returnArray = new Array(controlIDs.length);
        var i;
        for (i = 0; i < controlIDs.length; i++) {
            returnArray[i] = Root.GetControl(controlIDs[i]);
        }
        return returnArray;
    }
    return Root.GetControl(controlIDs);
};

Root.SetCheckBoxValue = function (cb, value) {
    if (cb) {
        cb.checked = value;
    }
};

Root.AddEvent = function (el, evname, func) {
    if (el.attachEvent) { // IE
        el.attachEvent(evname, func);
    }
    else if (el.addEventListener) { // Gecko / W3C
        el.addEventListener(evname, func, true);
    }
    else { // Opera (or old browsers)
        el[evname] = func;
    }
};

Root.RemoveEvent = function (el, evname, func) {
    if (el.detachEvent) { // IE
        el.detachEvent(evname, func);
    }
    else if (el.removeEventListener) { // Gecko / W3C
        el.removeEventListener(evname, func, true);
    }
    else { // Opera (or old browsers)
        el[evname] = null;
    }
};

Root.SetTopDocumentTitle = function (title) {
    try {
        window.top.document.title = title;
    }
    catch (ex) {
    }
};

Root.SetFocus = function (controlId) {
    if (String.isNullOrEmpty(controlId)) {
        return false;
    }
    var ctrl = Root.GetControl(controlId);
    if (!Object.isNullOrUndefined(ctrl)) {
        if (!ctrl.disabled) {
            try {
                ctrl.focus();
                return true;
            }
            catch (e) {
            }
        }
    }
    return false;
};

Root.IsArray = function (obj) {
    if (obj && typeof obj === 'object' && obj.constructor === Array) {
        return true;
    }
    return false;
};

Root.GetIframeBody = function (iframe) {
    var doc = Root.GetIFrameDocument(iframe);
    return doc ? doc.body : undefined;
};

// Returns a reference to the document object in the IFrame.
Root.GetIFrameDocument = function (iframe) {
    if (Object.isNullOrUndefined(iframe)) {
        return null;
    }
    var doc;
    if (iframe.contentDocument) {
        // For NS6
        doc = iframe.contentDocument;
    }
    else if (iframe.contentWindow) {
        // For IE5.5 and IE6
        doc = iframe.contentWindow.document;
    }
    else if (iframe.document) {
        // For IE5
        doc = iframe.document;
    }
    else {
        // Default
        doc = iframe.document;
    }
    return doc;
};

// This detects whether there is a need for a scrollbar.
// For the default of iframes this is the same as whether there is a scrollbar, but if scrollbars are forced on or off
// (using the â€˜scrolling="yes"/"no"â€™ attribute in the parent document, or CSS â€˜overflow: scroll/hiddenâ€™ in the iframe document)
// then this may differ.
Root.CanHaveVerticalScrollBar = function (element) {
    if (Object.isNullOrUndefined(element)) {
        element = document.compatMode == 'BackCompat' ? document.body : document.documentElement;
    }
    return element.scrollHeight > element.clientHeight;
};

Root.CanHaveHorizontalScrollBar = function (element) {
    if (Object.isNullOrUndefined(element)) {
        element = document.compatMode == 'BackCompat' ? document.body : document.documentElement;
    }
    return element.scrollWidth > element.clientWidth;
};

// obtain the scrolling offsets
// see http://www.howtocreate.co.uk/tutorials/javascript/browserwindow for details
Root.GetScrollPosition = function () {
    var scrollLeft = 0;
    var scrollTop = 0;

    if (typeof (window.pageYOffset) === "number") {
        // Netscape compliant
        scrollTop = window.pageYOffset;
        scrollLeft = window.pageXOffset;
    }
    else if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
        // DOM compliant
        scrollTop = document.body.scrollTop;
        scrollLeft = document.body.scrollLeft;
    }
    else if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
        // IE6 standards compliant mode 
        scrollTop = document.documentElement.scrollTop;
        scrollLeft = document.documentElement.scrollLeft;
    }
    return { "top": scrollTop, "left": scrollLeft };
};

// see http://www.howtocreate.co.uk/tutorials/javascript/browserwindow for details
Root.SetScrollPosition = function (scrollTop, scrollLeft) {
    if (window.scrollTo) {
        window.scrollTo(scrollLeft, scrollTop);
        return;
    }
    if (typeof (window.pageYOffset) === "number") {
        // Netscape compliant
        window.pageYOffset = scrollTop;
        window.pageXOffset = scrollLeft;
    }
    else if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
        // DOM compliant
        document.body.scrollTop = scrollTop;
        document.body.scrollLeft = scrollLeft;
    }
    else if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
        // IE6 standards compliant mode
        document.documentElement.scrollTop = scrollTop;
        document.documentElement.scrollLeft = scrollLeft;
    }
};

// finding the size of the browser window
// see http://www.howtocreate.co.uk/tutorials/javascript/browserwindow for details
Root.GetClientBounds = function () {
    var windowWidth = 0;
    var windowHeight = 0;

    if (typeof (window.innerWidth) === "number") {
        // Non-IE 
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
    }
    else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        // IE 6+ in 'standards compliant mode'
        windowWidth = document.documentElement.clientWidth;
        windowHeight = document.documentElement.clientHeight;
    }
    else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
        // IE 4 compatible 
        windowWidth = document.body.clientWidth;
        windowHeight = document.body.clientHeight;
    }
    return { "width": windowWidth, "height": windowHeight };
};

Root.GetFormOrBody = function () {
    if (!Object.isNullOrUndefined(document.forms) && !Object.isNullOrUndefined(document.forms[0])) {
        return document.forms[0];
    }
    return document.body;
};

/**
* Creates and returns element from html string. Uses innerHTML to create an element
*/
Root.CreateElement = (function () {
    var div = document.createElement('div');
    return function (html) {
        div.innerHTML = html;
        var element = div.firstChild;
        div.removeChild(element);
        return element;
    };
})();

Root.GetUniqueID = (function () {
    var id = 0;
    return function () {
        if (arguments[0] === 0) {
            id = 0;
        }
        return id++;
    };
})();

Root.RemoveElement = function (element) {
    if (element && element.parentNode) {
        element.parentNode.removeChild(element);
    }
};

Root.DisableElement = function (element, disabled) {
    if (element) {
        if (disabled) {
            element.setAttribute("disabled", "true");
        }
        else {
            element.removeAttribute("disabled");
        }
    }
};

Root.GetParentOfElement = function (element, parentTag) {
    var parent = element;
    var parentTagName = parentTag.toLowerCase();
    while (parent) {
        if (parent.tagName.toLowerCase() === parentTagName) {
            return parent;
        }
        parent = parent.parentNode;
    }
    return null;
};

/*
Any html table may contain nested tables.
This method returns a table row (tr) of the specified "table" that contains the "element"
*/
Root.GetTableRowOfElement = function (element, table) {
    var row = Root.GetParentOfElement(element, "tr");
    if (!table) {
        return row;
    }
    var rowTable;
    while (row) {
        rowTable = Root.GetParentOfElement(row, "table");
        if (rowTable === table) {
            return row;
        }
        row = Root.GetParentOfElement(rowTable, "tr");
    }
    return null;
};

Root.GetFormOfElement = function (element) {
    return Root.GetParentOfElement(element, "form");
};

Root.TimedTasks = function (tasks, args, callback) {
    var tasksCopy = tasks.concat(); // clone the array
    setTimeout(function () {
        var start = +new Date();
        var task;
        do {
            task = tasksCopy.shift();
            task.apply(null, args || []);
        } while (tasksCopy.length > 0 && (+new Date() - start < 50));
        if (tasksCopy.length > 0) {
            setTimeout(arguments.callee, 25);
        } else {
            if (typeof (callback) === "function") {
                callback();
            }
        }
    }, 25);
};

Root.TimedProcessArray = function (items, process, callback) {
    var itemsCopy = items.concat(); // clone the array
    setTimeout(function () {
        var start = +new Date();
        var item;
        do {
            item = itemsCopy.shift();
            process(item);
        } while (itemsCopy.length > 0 && (+new Date() - start < 50));
        if (itemsCopy.length > 0) {
            setTimeout(arguments.callee, 25);
        } else {
            if (typeof (callback) === "function") {
                callback();
            }
        }
    }, 25);
};

Root.SetSize = function (element, size) {
    if (Root.browser.msie) {
        element.style.width = size.width;
        element.style.height = size.height;
    }
    else {
        element.style.width = size.width.toString() + "px";
        element.style.height = size.height.toString() + "px";
    }
};

Root.LoadStyleSheet = function (doc, path, callback, scope) {
    var head = doc.getElementsByTagName("head")[0]; // reference to document.head for appending/ removing link nodes
    var link = doc.createElement("link");
    link.setAttribute("href", path);
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("type", "text/css");

    var sheet, cssRules;
    // get the correct properties to check for depending on the browser
    if ("sheet" in link) {
        sheet = "sheet";
        cssRules = "cssRules";
    }
    else {
        sheet = "styleSheet";
        cssRules = "rules";
    }

    var intervalId = setInterval(function () { // start checking whether the style sheet has successfully loaded
        try {
            if (link[sheet] && link[sheet][cssRules].length) { // SUCCESS! our style sheet has loaded
                clearInterval(intervalId); // clear the counters
                clearTimeout(timeoutId);
                callback.call(scope || window, true, link); // fire the callback with success == true
            }
        } catch (e) {
        }
        finally {
        }
    }, 10), // how often to check if the stylesheet is loaded
        timeoutId = setTimeout(function () { // start counting down till fail
            clearInterval(intervalId); // clear the counters
            clearTimeout(timeoutId);
            head.removeChild(link); // since the style sheet didn't load, remove the link node from the DOM
            callback.call(scope || window, false, link); // fire the callback with success == false
        }, 15000); // how long to wait before failing

    head.appendChild(link); // insert the link node into the DOM and start loading the style sheet

    return link; // return the link node;
};

Root.browser = (function () {
    var browser = {
        chrome: false,
        mozilla: false,
        opera: false,
        msie: false,
        safari: false
    };
    var userAgent = navigator.userAgent;
    if (userAgent.indexOf("Chrome") > -1) {
        browser.chrome = true;
    }
    else if (userAgent.indexOf("Safari") > -1) {
        browser.safari = true;
    }
    else if (userAgent.indexOf("Opera") > -1) {
        browser.opera = true;
    }
    else if (userAgent.indexOf("Firefox") > -1) {
        browser.mozilla = true;
    }
    else if (userAgent.indexOf("MSIE") > -1) {
        browser.msie = true;
    }
    return browser;
})();

if (typeof Date.prototype.format === "undefined") {
    Date.prototype.format = function (pattern) {
        var hours = this.getHours();
        var ttime = "AM";
        if (pattern.indexOf("t") > -1 && hours > 12) {
            hours = hours - 12;
            ttime = "PM";
        }

        var o = {
            "M+": this.getMonth() + 1, //month
            "d+": this.getDate(), //day
            "h+": hours, //hour
            "m+": this.getMinutes(), //minute
            "s+": this.getSeconds(), //second
            "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
            "S": this.getMilliseconds(), //millisecond,
            "t+": ttime
        };

        if (/(y+)/.test(pattern)) {
            pattern = pattern.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(pattern)) {
                pattern = pattern.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return pattern;
    };
}
