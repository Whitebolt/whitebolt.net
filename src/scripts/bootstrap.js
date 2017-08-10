(function($, global){
	"use strict";

	const $doc = $(document);
	const angular = global.angular;

	$doc.ready(()=>{
		$(global.document).foundation();

		$("[app]").each((index, appNode)=>{
			const appName = $(appNode).attr("app");
			angular.bootstrap(appNode, [appName]);
		});

		$(".top-menu li").click(()=>$("#offCanvas").foundation("close"));
	});
})(jQuery || $, window);