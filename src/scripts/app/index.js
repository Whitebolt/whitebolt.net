(function(global, controllerAs){
	"use strict";

	const angular = global.angular;

	angular.module("wb").directive(controllerAs, [
		"boltDirective",
	($directive)=>{

		function link(scope, root, attributes, controller) {
			$directive.link({scope, root, controller});
		}

		function bodyController() {
			let controller = this;
		}

		return {
			restrict: "A",
			controllerAs,
			scope: true,
			controller: [bodyController],
			link
		};
	}]);
})(window, "app");