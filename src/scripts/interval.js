(function($, global) {
	"use strict";

	global.requestAnimationFrame =
		global.requestAnimationFrame ||
		global.mozRequestAnimationFrame ||
		global.webkitRequestAnimationFrame ||
		global.msRequestAnimationFrame ||
		function(f){return setTimeout(f, 1000/60)};

	global.cancelAnimationFrame =
		global.cancelAnimationFrame ||
		global.mozCancelAnimationFrame ||
		function(requestID){clearTimeout(requestID)};

	global.intervalCallbacks = new Set();

	let last;
	(function interval() {
		let now = new Date().getTime();
		let period = (now - (last || now));
		last = now;

		global.intervalCallbacks.forEach(callback=>{
			if (callback) {
				if (callback.period) {
					callback.currentPeriod = (callback.currentPeriod || 0) + period;
					if (callback.period <= callback.currentPeriod) {
						callback.currentPeriod = 0;
						callback();
					}
				} else {
					callback();
				}
			}
		});
		global.requestAnimationFrame(interval);
	})();

})(jQuery || $, window);