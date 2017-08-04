(function(global, moduleId, serviceName, angular=global.angular) {

	angular.module(moduleId).service(serviceName, [
		"$bolt",
		"$http",
	($bolt, $http)=>{
		"use strict";

		let apiUrl = angular.element("[rel='https://api.w.org/']").attr("href") + "wp/v2";
		let apiSettings = global.wpRestApiSettings;

		function _apiQuery(endpoint, params) {
			let url = apiUrl + "/" + endpoint;

			return $http({
				method: "get",
				url,
				params,
				headers: {
					'X-SERVER-SELECT': 'moses',
					'X-WP-Nonce': apiSettings.nonce
				} }).then(res=>{
				console.log("RESPONSE", res);
				if (res && res.data && res.data.length) {
					let articles = res.data.map(data=>{
						return {
							title: data.title.rendered,
							content: data.content.rendered,
							post_class: data.post_class
						}
					});

					let data = {
						title: res.data[0].title.rendered,
						content: '',
						articles_class: ['articles'],
						body_class: res.data[0].body_class,
						body_style: res.data[0].body_style,
						articles
					};

					console.log("DATA", data);
					return data;
				}
				console.error(res.data);
				throw options.incorrectDataError || "Incorrect data returned";
			});
		}

		function getContent(options) {
			let slug = options.src;

			if (slug === apiSettings.blogSlug) {
				return _apiQuery("pages", {slug}).then(page=>{
					return _apiQuery("posts", {}).then(posts=>{
						return Object.assign(posts, {
							articles_class: page.articles_class.concat(page.articles[0].post_class),
							title: page.title,
							content: page.articles[0].content
						});
					});
				});
			} else if (slug === apiSettings.homepageSlug) {
				return _apiQuery("pages", {id: apiSettings.homepageId});
			} else {
				return _apiQuery("pages", {slug});
			}
		}

		return {
			getContent
		};
	}]);

})(window, "wb", "$wordpress");