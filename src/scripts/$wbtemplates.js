(function(global, moduleId, serviceName, angular=global.angular) {

	angular.module(moduleId).service(serviceName, [
		"$document",
	($doc)=>{
		"use strict";

		let templates = new Map();

		$doc.find("script[type=template][id]").each((n, script)=>{
			let templateNode = angular.element(script);
			templates.set(templateNode.attr("id"), templateNode.text());
		});

		return templates;
	}]);

})(window, "wb", "$wbtemplates");