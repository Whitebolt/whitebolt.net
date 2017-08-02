(function($, global){
	"use strict";

	const $doc = $(document);
	const angular = global.angular;

	angular.module("wb", [
		"bolt"
	]).directive("body", [
		"boltDirective",
		"$document",
	($directive, $doc) => {

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
			controllerAs: "app",
			scope: true,
			controller: [bodyController],
			link
		};
	}]);

	angular.module("wb").directive("annotateMenu", [
		"boltDirective",
		"$document",
	($directive, $doc)=>{
			function link(scope, root, attributes, controller) {
				$directive.link({scope, root, controller});

				controller.menu = $doc.find(controller.annotateMenu + " li").not(".no-annotation");
				controller.annotations = root.find("li");
				nextMenuItem(controller);

				controller.menu.hover(menuHover.bind(controller));

				let _nextMenuItem = nextMenuItem.bind(controller);
				_nextMenuItem.period = (controller.period ? (parseFloat(controller.period) * 1000) : 5000);
				global.intervalCallbacks.add(_nextMenuItem);
			}

			function incNode(controller=this) {
				if (controller.currentNodeNo === undefined) controller.currentNodeNo = (controller.menu.length-1);
				controller.currentNodeNo++;
				if (controller.currentNodeNo >= controller.menu.length) controller.currentNodeNo = 0;
				controller.currentNode = $(controller.menu.get(controller.currentNodeNo));
			}

			function menuHover(event, controller=this) {
				if (pause(controller)) {
					removeHover(controller);
					controller.currentNode = angular.element(event.target).closest("li");
					controller.menu.each((n, item)=>{
						if (item === controller.currentNode.get(0)) controller.currentNodeNo = n;
					});
					setHover(controller);
					setInfo(controller);
				}
			}

			function setHover(controller=this) {
				if (controller.currentNode) controller.currentNode.addClass("hover");
			}

			function removeHover(controller=this) {
				if (controller.currentNode) controller.currentNode.removeClass("hover");
			}

			function setInfo(controller=this) {
				controller.annotations.filter(".hover").removeClass("hover");
				$(controller.annotations.get(controller.currentNodeNo)).addClass("hover");
			}

			function pause(controller=this) {
				controller.paused = !controller.paused;
				return controller.paused;
			}

			function nextMenuItem(controller=this) {
				if (controller.paused) return;
				removeHover(controller);
				incNode(controller);
				setHover(controller);
				setInfo(controller);
			}

			function annotateMenuSliderController() {
				let controller = this;
				controller.paused = false;
			}

			return {
				restrict: "AE",
				controllerAs: "annotateMenuSlider",
				scope: true,
				controller: [annotateMenuSliderController],
				link,
				bindToController: {
					annotateMenu: "@",
					period: "@"
				}
			};
		}
	]);

	$doc.ready(()=>{
		$(global.document).foundation();

		$("[app]").each((index, appNode)=>{
			const appName = $(appNode).attr("app");
			angular.bootstrap(appNode, [appName]);
		});
	});
})(jQuery || $, window);