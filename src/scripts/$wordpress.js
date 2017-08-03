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

			return $http({
				method: "get",
				url,
				params: {slug}
			}).then(res=>{
				if (res && res.data && res.data.length) return {
					title: res.data[0].title.rendered,
					content: res.data[0].content.rendered
				};
				console.error(res.data);
				throw options.incorrectDataError || "Incorrect data returned";
			});
		}

		return {
			getPage
		};
	}]);

})(window, "wb", "$wordpress");