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

function HtmlExtension() {
}

HtmlExtension.HtmlEncode = function (text) {
	if (null !== text && "" !== text) {
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
HtmlExtension.HtmlEncodeAndReplaceNBSP = function (text) {
	if (null !== text && "" !== text) {
		text = HtmlExtension.HtmlEncode(text);
		text = text.replace(/\u00a0/g, ' ');
	}
	return text;
};

HtmlExtension.GetControl = function (controlID) {
	var control = null;

	if (document.getElementById) {
		control = document.getElementById(controlID);
	}
	else if (document.all) {
		control = document.all[controlID];
	}
	else if (document.layers) {
		control = document.layers(controlID);
	}
	else if (document.forms) {
		if (document.forms[controlID]) {
			control = document.forms[controlID];
		}
		else {
			var i;
			for (i = 0; i < document.forms.length; i++) {
				if (document.forms[i][controlID]) {
					control = document.forms[i][controlID];
					break;
				}
			}
		}
	}
	return control;
};

HtmlExtension.GetControls = function (controlIDs) {
	if (HtmlExtension.IsArray(controlIDs)) {
		var returnArray = new Array(controlIDs.length);
		var i;
		for (i = 0; i < controlIDs.length; i++) {
			returnArray[i] = HtmlExtension.GetControl(controlIDs[i]);
		}
		return returnArray;
	}
	return HtmlExtension.GetControl(controlIDs);
};

HtmlExtension.SetCheckBoxValue = function (cb, value) {
	if (cb) {
		cb.checked = value;
	}
};

HtmlExtension.AddEvent = function (el, evname, func) {
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

HtmlExtension.RemoveEvent = function (el, evname, func) {
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

HtmlExtension.SetTopDocumentTitle = function (title) {
	try {
		window.top.document.title = title;
	}
	catch (ex) {
	}
};

HtmlExtension.SetFocus = function (controlID) {
	if (String.isNullOrEmpty(controlID)) {
		return false;
	}
	var ctrl = HtmlExtension.GetControl(controlID);
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

HtmlExtension.IsArray = function (obj) {
	if (obj && typeof obj === 'object' && obj.constructor === Array) {
		return true;
	}
	return false;
};

HtmlExtension.GetIframeBody = function (iframe) {
	var doc = HtmlExtension.GetIFrameDocument(iframe);
	return doc ? doc.body : undefined;
};

// Returns a reference to the document object in the IFrame.
HtmlExtension.GetIFrameDocument = function (iframe) {
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

// Returns true if the executing browser it a Microsoft Internet Explorer browser.
HtmlExtension.IsBrowserIE = function () {
	try {
		return (window.navigator.userAgent.indexOf("MSIE ") > 0);
	}
	catch (x) {
		return false;
	}
};

// Returns true if the executing browser it a Netscape browser.
HtmlExtension.IsBrowserNS = function () {
	try {
		return (window.navigator.userAgent.indexOf("Netscape") > 0);
	}
	catch (x) {
		return false;
	}
};

// Returns true if the executing browser it a Firefox browser.
HtmlExtension.IsBrowserFirefox = function () {
	try {
		return (window.navigator.userAgent.indexOf("Firefox") > 0);
	}
	catch (x) {
		return false;
	}
};

// This detects whether there is a need for a scrollbar.
// For the default of iframes this is the same as whether there is a scrollbar, but if scrollbars are forced on or off
// (using the â€˜scrolling="yes"/"no"â€™ attribute in the parent document, or CSS â€˜overflow: scroll/hiddenâ€™ in the iframe document)
// then this may differ.
HtmlExtension.CanHaveVerticalScrollBar = function (element) {
	if (Object.isNullOrUndefined(element)) {
		element = document.compatMode == 'BackCompat' ? document.body : document.documentElement;
	}
	return element.scrollHeight > element.clientHeight;
};

HtmlExtension.CanHaveHorizontalScrollBar = function (element) {
	if (Object.isNullOrUndefined(element)) {
		element = document.compatMode == 'BackCompat' ? document.body : document.documentElement;
	}
	return element.scrollWidth > element.clientWidth;
};

// obtain the scrolling offsets
// see http://www.howtocreate.co.uk/tutorials/javascript/browserwindow for details
HtmlExtension.GetScrollPosition = function () {
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
HtmlExtension.SetScrollPosition = function (scrollTop, scrollLeft) {
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
HtmlExtension.GetClientBounds = function () {
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

HtmlExtension.GetFormOrBody = function () {
	if (!Object.isNullOrUndefined(document.forms) && !Object.isNullOrUndefined(document.forms[0])) {
		return document.forms[0];
	}
	return document.body;
};

/**
* Creates and returns element from html string. Uses innerHTML to create an element
*/
HtmlExtension.CreateElement = (function () {
	var div = document.createElement('div');
	return function (html) {
		div.innerHTML = html;
		var element = div.firstChild;
		div.removeChild(element);
		return element;
	};
})();

HtmlExtension.GetUniqueID = (function () {
	var id = 0;
	return function () {
		if (arguments[0] === 0) {
			id = 0;
		}
		return id++;
	};
})();

HtmlExtension.RemoveElement = function (element) {
	if (element && element.parentNode) {
		element.parentNode.removeChild(element);
	}
};

HtmlExtension.DisableElement = function (element, disabled) {
	if (element) {
		if (disabled) {
			element.setAttribute("disabled", "true");
		}
		else {
			element.removeAttribute("disabled");
		}
	}
};

HtmlExtension.GetParentOfElement = function (element, parentTag) {
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
HtmlExtension.GetTableRowOfElement = function (element, table) {
	var row = HtmlExtension.GetParentOfElement(element, "tr");
	if (!table) {
		return row;
	}
	var rowTable;
	while (row) {
		rowTable = HtmlExtension.GetParentOfElement(row, "table");
		if (rowTable === table) {
			return row;
		}
		row = HtmlExtension.GetParentOfElement(rowTable, "tr");
	}
	return null;
};

HtmlExtension.GetFormOfElement = function (element) {
	return HtmlExtension.GetParentOfElement(element, "form");
};

HtmlExtension.TimedTasks = function (tasks, args, callback) {
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

HtmlExtension.TimedProcessArray = function (items, process, callback) {
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

HtmlExtension.SetSize = function (element, size) {
	if (HtmlExtension.IsBrowserIE()) {
		element.style.width = size.width;
		element.style.height = size.height;
	}
	else {
		element.style.width = size.width.toString() + "px";
		element.style.height = size.height.toString() + "px";
	}
};

HtmlExtension.LoadStyleSheet = function (doc, path, callback, scope) {
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
