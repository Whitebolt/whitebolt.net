(function(global, moduleId, serviceName, angular=global.angular) {

	angular.module(moduleId).service(serviceName, [
		"$bolt",
		"$http",
	($bolt, $http)=>{
		"use strict";

		let apiUrl = angular.element("[rel='https://api.w.org/']").attr("href") + "wp/v2";

		function getPage(options) {
			let url = apiUrl + "/pages";
			let slug = options.src;

			console.log("GET", {
				method: "get",
				url,
				params: {slug}
			});

			return $http({
				method: "get",
				url,
				params: {slug},
				headers: {
					'X-SERVER-SELECT': 'moses',
					'X-WP-Nonce': global.wpApiSettings.nonce
				}
			}).then(res=>{
				console.log("RESPONSE", res);
				if (res && res.data && res.data.length) {
					return res.data.map(page=>{
						return {
							body_classes: page.body_classes,
							title: page.title.rendered,
							content: page.content.rendered
						}
					});
				}
				console.error(res.data);
				throw options.incorrectDataError || "Incorrect data returned";
			});
		}

		return {
			getPage
		};
	}]);

})(window, "wb", "$wordpress");