(function(global, moduleId, controllerAs){
	"use strict";

	const angular = global.angular;

	angular.module(moduleId).directive(controllerAs, [
		"$document",
		"$bolt",
		"boltDirective",
		"boltAjax",
		"$location",
		"$compile",
	($doc, $bolt, $directive, $ajax, $location, $compile)=>{

		function link(scope, root, attributes, controller) {
			$directive.link({scope, root, controller});
			watchPath(controller);
		}

		function watchPath(controller=this) {
			controller.parent.$watch(()=>$location.path(), value=>{
				if (controller.path !== value) {
					controller.path = value;
					onSrcChange(controller)
				}
			});
		}

		function onSrcChange(controller=this) {
			$ajax.getWordpressPage({src: controller.path}).then(
				data=>applyPage(data, controller)
			);
		}

		function applyNodes(nodeMap, page, controller) {
			Object.keys(nodeMap).forEach(nodeRef=>{
				let node = controller.parent.app[nodeRef];
				if (node) {
					$directive.destroyChildren(node);
					node.empty();
					node.html(page[nodeMap[nodeRef]] || "");
					$compile(node.contents())(controller.current);
				}
			})
		}

		function applyPage(page, controller) {
			if (controller.current) controller.current.$destroy();
			controller.current = controller.parent.$new();
			applyNodes({
				pageHeading: "title",
				articleContent: "content"
			}, page, controller);
			if (controller.path === "/") {
				angular.element("body").addClass("home");
			} else {
				angular.element("body").removeClass("home");
			}
		}

		function appController() {
			let controller = this;

			controller.path = $location.path();
		}

		return {
			restrict: "A",
			controllerAs,
			scope: true,
			controller: [appController],
			link
		};
	}]).config(["$locationProvider", ($locationProvider)=>{
		$locationProvider.html5Mode({
			enabled: true,
			rewriteLinks: true
		});
	}]);
})(window, "wb", "app");