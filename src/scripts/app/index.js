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
		"$timeout",
	($doc, $bolt, $directive, $wordpress, $location, $compile, $templates, $interpolate, $timeout)=>{
		"use strict";

		function link(scope, root, attributes, controller) {
			$directive.link({scope, root, controller});
			watchPath(controller);
			applyInnerHeight(controller);
			angular.element(global).resize(()=>applyInnerHeight(controller));
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

			$templates.get("article.html").then(articleTemplate=>{
				$directive.destroyChildren(articles);
				articles.empty();

				if (((data.title || "").trim() !== "") || ((data.content || "").trim() !== "")) {
					let innerArticleTemplate = angular.element(articleTemplate).html();
					articleContent += $interpolate(innerArticleTemplate)(data);
				}
				if (articleContent.trim() === "") {
					data.articles_class.unshift('articles-no-intro');
				}
				articlesData.forEach(article=>{
					articleContent += $interpolate(articleTemplate)(article);
				});

				articles.html(articleContent);
				articles.removeAttr('class').attr('class', data.articles_class.join(' '));
				$compile(articles.contents())(controller.current);
			});
		}

		function applyBodyClass(data, controller) {
			controller.root.find("body")
				.removeAttr("class")
				.attr("class", data.body_class.join(' '));
		}

		function applyMainClass(data, controller) {
			controller.root.find("main")
				.removeAttr("class")
				.attr("class", data.main_class.join(' '));
		}

		function applyMainStyle(data, controller) {
			controller.root.find("main")
				.removeAttr("style")
				.attr("style", Object.keys(data.main_style).map(prop=>
					prop + ': ' + data.main_style[prop] + ';'
				).join());
		}

		function applyTitle(data, controller) {
			let titleParts = controller.pageTitle.text().split("|").map(item=>item.trim());
			let blogTitle = ((titleParts.length > 1) ? titleParts.pop() : (titleParts[0] || ""));
			let title = [data.title, blogTitle].filter(item=>(item.trim() !== "")).join(" | ");
			controller.pageTitle.html(title);
		}

		function applyInnerHeight(controller) {
			$timeout(()=>{
				let articles = angular.element(".articles");
				let height = articles.height() + controller.spacer;
				let docHeight = angular.element(global).height();
				controller.wrapper.height(((docHeight>height) || !articles.is(":visible"))?docHeight:height);
				angular.element("html, body").animate({scrollTop: "0px"}, 800);
			}, 400);
		}

		function applyPage(data, controller) {
			if (controller.current) controller.current.$destroy();
			controller.current = controller.parent.$new();


			applyArticles(data, controller);
			applyTitle(data, controller);
			applyBodyClass(data, controller);
			applyMainClass(data, controller);
			applyMainStyle(data, controller);
			applyInnerHeight(controller);

			if (controller.path === "/") {
				angular.element("body").addClass("home");
			} else {
				angular.element("body").removeClass("home");
			}
		}

		function appController() {
			let controller = this;

			controller.spacer = parseInt(angular.element(".articles").css('padding-top'), 10) + angular.element("body>header").height();
			controller.path = $location.path();
			controller.wrapper = angular.element(".off-canvas-wrapper");
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