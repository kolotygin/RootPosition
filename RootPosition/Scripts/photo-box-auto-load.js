$(document).ready(function() {
	if (! /android|iphone|ipod|series60|symbian|windows ce|blackberry/i .test(navigator.userAgent)) {
		$(".gl-2013 a[rel^='photo-box']").photoBox({/* custom options here */ });
		$(".gl-2012 a[rel^='photo-box']").photoBox({/* custom options here */ });
	}
});
