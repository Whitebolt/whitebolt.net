(function(global, moduleId, serviceName, angular=global.angular) {

	angular.module(moduleId).service(serviceName, [
		"$window",
	($win)=>{
		"use strict";

		let requestAnimationFrame = $win.requestAnimationFrame || $win.mozRequestAnimationFrame || $win.webkitRequestAnimationFrame || $win.msRequestAnimationFrame || function(f){return setTimeout(f, 1000/60)};
		let intervalCallbacks = new Set();

		let last;
		(function interval() {
			let now = new Date().getTime();
			let period = (now - (last || now));
			last = now;

			intervalCallbacks.forEach(callback=>{
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
			requestAnimationFrame(interval);
		})();

		return intervalCallbacks;
	}]);

})(window, "wb", "$animationInterval");