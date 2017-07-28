(function($, global){
	"use strict";

	const $doc = $(document);
	const angular = global.angular;

	let homeMenu = $("body>header nav li");
	let menuInfo = $($("nav.homepage-nav .menu-info").get(0));
	let cNodeNo = (homeMenu.length - 1);
	let cNode;
	let paused = false;
	let logoSets = new Set();

	$("nav.homepage-nav img.menu-logos").each((n, _node)=>{
		$(_node)
			.attr("class")
			.split(' ')
			.map(className=>className.trim())
			.filter(className=>(className !== ""))
			.forEach(className=>logoSets.add(className));
	});

	homeMenu.hover(onHover);

	function onHover(event) {
		if (paused) return pause();
		pause();
		removeHover();
		setCNode(event.target);
		setHover();
		setInfo();
	}

	function pause() {
		paused = !paused;
	}

	function setCNode(target) {
		cNode = $(target).closest("li");
		cNode.parent().find("li").each((n, node)=>{
			if (node === target) cNodeNo = n;
		});
	}

	function setInfo() {
		let a = cNode.find("a[description]");
		let description = ((a.length) ? $(a.get(0)).attr("description").trim() : "");
		let title = cNode.text();
		menuInfo.html("<h2>"+title+"</h2><p>"+description+"</p>");
	}

	function setHover() {
		cNode.addClass("hover");
		cNode.attr("class")
			.split(' ')
			.map(className=>className.trim())
			.filter(className=>(logoSets.has(className)))
			.forEach(className=>{
				$("nav.homepage-nav").addClass(className);
			});
	}

	function removeHover() {
		cNode.removeClass("hover");
		$("nav.homepage-nav").removeClass(Array.from(logoSets).join(" "));
	}

	function incNode() {
		cNodeNo++;
		if (cNodeNo >= homeMenu.length) cNodeNo = 0;
		cNode = $(homeMenu.get(cNodeNo));
	}

	function nextMenuItem() {
		if (paused) return;
		removeHover();
		incNode();
		setHover();
		setInfo();
	}

	nextMenuItem.period = 5000;
	incNode();
	global.intervalCallbacks.add(nextMenuItem);
	nextMenuItem();


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

	$doc.ready(()=>{
		$(global.document).foundation();
		$("[app]").each((index, appNode)=>{
			const appName = $(appNode).attr("app");
			angular.bootstrap(appNode, [appName]);
		});
	});
})(jQuery || $, window);