(function($, global) {
	"use strict";

	const fontSizes = new WeakMap();

	function applyResizer(resizers=this) {
		resizers.each((n, node)=>{
			let resizer = $(node);
			let bottom = resizer.offset().top + resizer.outerHeight() - parseInt(resizer.css("padding-bottom"), 10);
			if (!fontSizes.has(node)) {
				fontSizes.set(node, resizer.css("font-size"))
			} else {
				resizer.css("font-size", fontSizes.get(node));
			}

			resizer.find("*").each((n, node)=>{
				let child = $(node);
				let breakout = 50;
				while ((breakout > 0) && ((child.offset().top + child.height()) > bottom)) {
					breakout--;
					resizer.css("font-size", (parseInt(resizer.css("font-size"), 10) - 1) + "px");
				}
			});
		});
	}

	function fireResizers() {
		$("[resizer]").piyResizer()
	}

	$.fn.piyResizer = applyResizer;
	$(document).ready(fireResizers);
	$(global).resize(fireResizers);

})(jQuery || $, window);