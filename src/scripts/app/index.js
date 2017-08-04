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
			$wordpress.getContent({src: controller.path}).then(
				data=>applyPage(data, controller)
			);
		}

		function applyArticles(data, controller, articles=controller.articleNodes) {
			let articleContent = '';
			let articlesData = $bolt.makeArray(data.articles);

			$directive.destroyChildren(articles);
			articles.empty();

			if (((data.title || "").trim() !== "") || ((data.content || "").trim() !== "")) {
				let innerArticleTemplate = angular.element(controller.articleTemplate).html();
				articleContent += $interpolate(innerArticleTemplate)(data);
			}
			if (articleContent.trim() === "") {
				data.articles_class.unshift('articles-no-intro');
			}
			articlesData.forEach(article=>{
				articleContent += $interpolate(controller.articleTemplate)(article);
			});

			articles.html(articleContent);

			articles.removeAttr('class').attr('class', data.articles_class.join(' '));
			$compile(articles.contents())(controller.current);
		}

		function applyBodyClass(data, controller) {
			controller.root.find("body")
				.removeAttr("class")
				.attr("class", data.body_class.join(' '));
		}

		function applyBodyStyle(data, controller) {
			controller.root.find("body")
				.removeAttr("style")
				.attr("style", Object.keys(data.body_style).map(prop=>
					prop + ': ' + data.body_style[prop] + ';'
				).join());
		}

		function applyTitle(data, controller) {
			let titleParts = controller.pageTitle.text().split("|").map(item=>item.trim());
			let blogTitle = ((titleParts.length > 1) ? titleParts.pop() : (titleParts[0] || ""));
			let title = [data.title, blogTitle].filter(item=>(item.trim() !== "")).join(" | ");
			controller.pageTitle.html(title);
		}

		function applyPage(data, controller) {
			if (controller.current) controller.current.$destroy();
			controller.current = controller.parent.$new();

			applyArticles(data, controller);
			applyTitle(data, controller);
			applyBodyClass(data, controller);
			applyBodyStyle(data, controller);

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