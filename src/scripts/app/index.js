(function(global, moduleId, controllerAs, angular=global.angular){

	angular.module(moduleId).directive(controllerAs, [
		"$document",
		"$bolt",
		"boltDirective",
		"$wordpress",
		"$location",
		"$compile",
		"$wbtemplates",
		"$interpolate",
	($doc, $bolt, $directive, $wordpress, $location, $compile, $templates, $interpolate)=>{
		"use strict";

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
			$wordpress.getPage({src: controller.path}).then(
				data=>applyPage(data, controller)
			);
		}

		function applyArticle(page, controller, articles=controller.articleNodes) {
			let articleContent = '';

			$directive.destroyChildren(articles);
			articles.empty();
			$bolt.makeArray(page).forEach(page=>{
				articleContent += $interpolate(controller.articleTemplate)(page);
			});
			articles.html(articleContent);
			$compile(articles.contents())(controller.current);
		}

		function applyBodyClass(page, controller) {
			controller.root.find("body")
				.removeAttr("class")
				.attr("class", page[0].body_class.join(' '));
		}

		function applyBodyStyle(page, controller) {
			controller.root.find("body")
				.removeAttr("style")
				.attr("style", Object.keys(page[0].body_style).map(prop=>
					prop + ': ' + page[0].body_style[prop] + ';'
				).join());
		}

		function applyTitle(page, controller) {
			let titleParts = controller.pageTitle.text().split("|").map(item=>item.trim());
			let blogTitle = ((titleParts.length > 1) ? titleParts.pop() : (titleParts[0] || ""));
			let title = [page[0].title, blogTitle].filter(item=>(item.trim() !== "")).join(" | ");
			controller.pageTitle.html(title);
		}

		function applyPage(page, controller) {
			if (controller.current) controller.current.$destroy();
			controller.current = controller.parent.$new();

			applyArticle(page, controller);
			applyTitle(page, controller);
			applyBodyClass(page, controller);
			applyBodyStyle(page, controller);

			if (controller.path === "/") {
				angular.element("body").addClass("home");
			} else {
				angular.element("body").removeClass("home");
			}
		}

		function appController() {
			let controller = this;

			controller.path = $location.path();
			controller.articleTemplate = $templates.get('articleTemplate');
		}

		return {
			restrict: "A",
			controllerAs,
			scope: true,
			controller: [appController],
			link
		};
	}]).config(["$locationProvider", ($locationProvider)=>{
		"use strict";

		$locationProvider.html5Mode({
			enabled: true,
			rewriteLinks: true
		});
	}]);
})(window, "wb", "app");