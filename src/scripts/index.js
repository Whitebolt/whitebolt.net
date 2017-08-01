(function($, global){
	"use strict";

	const $doc = $(document);
	const angular = global.angular;

	let homeMenu = $("body>header nav li.menu-item");
	let menuInfo = $($("nav.homepage-nav .menu-info").get(0));
	let cNodeNo = (homeMenu.length - 1);
	let cNode;
	let paused = false;
	let logoNodes = new Map();

	homeMenu.hover(onHover);

	homeMenu.find("a[logos]").each((n, a)=>createLogos($(a)));

	function createLogos(a) {
		let logos = JSON.parse(a.attr("logos") || "[]");
		let ref = a.attr("ref-id");

		let sides = {
			leftRight: menuInfo.offset().left,
			topBottom: menuInfo.offset().top
		};

		logos.forEach(logo=>{
			if ((logo.angle >= 0 ) && (logo.angle <= 45)) {
				logo.left = (menuInfo.outerWidth() / 2) + ((menuInfo.outerWidth() / 100) * ((45 - logo.angle) * 1.111));
				logo.top = sides.topBottom - ((sides.topBottom / 100) * logo.distance);
			} else if ((logo.angle > 45) && (logo.angle <= 135)) {
				logo.left = menuInfo.outerWidth() + sides.leftRight + ((sides.leftRight / 100) * logo.distance);
				logo.top = ($(global).height()/100) * ((90-(135-logo.angle)) * 1.111);
			} else if ((logo.angle > 135) && (logo.angle <= 225)) {
				logo.left = (($(global).width() / 100) * (100 - ((225 - logo.angle) * 1.111))) - (logo.width/2);
				logo.top = sides.topBottom + menuInfo.outerHeight() + ((sides.topBottom / 100) * logo.distance);
			} else if ((logo.angle > 225) && (logo.angle <= 315)) {
				logo.left = sides.leftRight - (logo.distance * (sides.leftRight/100)) - (logo.width/ 2);
				logo.top = ($(global).height() / 100) * ((315 - logo.angle) * 1.111);
			} else if ((logo.angle > 315) && (logo.angle <= 360)) {
				logo.left = ($(global).width() / 100) * (100 - ((360 - logo.angle) * 1.111));
				logo.top = sides.topBottom - ((sides.topBottom / 100) * logo.distance);
			}

			if (!logoNodes.has(logo.src)) logoNodes.set(logo.src, $("<img>"));
			let logoNode = logoNodes.get(logo.src);

			logoNode.attr("src", logo.src)
				.attr("width", logo.width)
				.attr("height", logo.height)
				.addClass("ref-"+ref)
				.addClass("menu-logos")
				.css({
					left: parseInt(logo.left, 10) + "px",
					top: parseInt(logo.top, 10) +"px"
				})
				.appendTo("nav.homepage-nav");
		});
	}

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
		cNode = $(target).closest("li.menu-item");
		cNode.parent().find("li.menu-item").each((n, node)=>{
			if (node === target) cNodeNo = n;
		});
	}

	function setInfo() {
		let a = $(cNode.find("a[description],a[excerpt]").get(0));
		let description = ((a.length) ? (a.attr("description") || "").trim() : undefined);
		let title = a.attr("title") || cNode.text();
		menuInfo.html("<h2>" + title + "</h2><p>" + (description || "") + "</p>");
		createLogos(a);
	}

	function setHover() {
		cNode.addClass("hover");
		let ref = cNode.find("a").attr("ref-id");
		$("nav.homepage-nav img").each((n, _img)=>{
			let img = $(_img);
			if (img.hasClass("ref-"+ref)) {
				img.css("visibility", "visible");
			} else {
				img.css("visibility", "hidden");
			}
		});
	}

	function removeHover() {
		cNode.removeClass("hover");
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