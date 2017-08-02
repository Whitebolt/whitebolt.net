(function(global, controllerAs){
	"use strict";

	const angular = global.angular;

	angular.module("wb").directive("body", [
		"boltDirective",
	($directive) => {

		/**
		 * @description
		 * Initial linking of directive.  This will add watches and some of the
		 * controller attributes.
		 *
		 * @private
		 * @param {Object} scope			AngularJs scope object.
		 * @param {Object} root				jQuery node for the root of directive
		 * 									(ie. the calling, initialising element).
		 * @param {Object} attributes		AngularJs attributes object for the
		 * 									calling element.
		 * @param {Object} controller		AngularJs controller instance.
		 */
		function link(scope, root, attributes, controller) {
			$directive.link({scope, root, controller});
		}

		function bodyController() {
			let controller = this;
		}

		return {
			restrict: "E",
			controllerAs,
			scope: true,
			controller: [bodyController],
			link
		};
	}]);
})(window, "app");