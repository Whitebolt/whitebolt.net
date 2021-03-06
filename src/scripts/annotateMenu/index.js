(function(global, moduleId, controllerAs, angular=global.angular) {

	angular.module(moduleId).directive(controllerAs, [
		"boltDirective",
		"$document",
		"$animationInterval",
	($directive, $doc, $animationInterval)=>{
		"use strict";

		function link(scope, root, attributes, controller) {
			$directive.link({scope, root, controller});

			controller.menu = $doc.find(controller.annotateMenu + " li").not(".no-annotation");
			controller.annotations = root.find("article");
			nextMenuItem(controller);

			controller.menu.hover(menuHover.bind(controller));

			let _nextMenuItem = nextMenuItem.bind(controller);
			_nextMenuItem.period = (controller.period ? (parseFloat(controller.period) * 1000) : 5000);
			$animationInterval.add(_nextMenuItem);

			scope.$watch(()=>root.is(":visible"), visible=>onVisible(visible, controller));
		}

		function incNode(controller=this) {
			if (controller.currentNodeNo === undefined) controller.currentNodeNo = (controller.menu.length-1);
			controller.currentNodeNo++;
			if (controller.currentNodeNo >= controller.menu.length) controller.currentNodeNo = 0;
			controller.currentNode = $(controller.menu.get(controller.currentNodeNo));
		}

		function menuHover(event, controller=this) {
			if (controller.visible && pause(controller)) {
				removeHover(controller);
				controller.currentNode = angular.element(event.target).closest("li");
				controller.menu.each((n, item)=>{
					if (item === controller.currentNode.get(0)) controller.currentNodeNo = n;
				});
				setHover(controller);
				setInfo(controller);
			}
		}

		function onVisible(visible, controller=this) {
			if (!visible) {
				controller.paused = true;
				controller.visible = false;
				removeHover(controller);
			} else {
				controller.paused = false;
				controller.visible = true;
				setHover(controller);
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
			controller.visible = true;
		}

		return {
			restrict: "AE",
			controllerAs,
			scope: true,
			controller: [annotateMenuSliderController],
			link,
			bindToController: {
				annotateMenu: "@",
				period: "@"
			}
		};
	}]);
})(window, "wb", "annotateMenu");