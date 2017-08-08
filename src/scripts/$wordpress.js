(function(global, moduleId, serviceName, angular=global.angular) {

	angular.module(moduleId).service(serviceName, [
		"$bolt",
		"$http",
	($bolt, $http)=>{
		"use strict";

		let apiUrl = angular.element("[rel='https://api.w.org/']").attr("href") + "wp/v2";
		let apiSettings = global.wpRestApiSettings;
		apiSettings.taxonomies = apiSettings.taxonomies || {};

		/**
		 * This is the opposite of objectToQueryString and converts a url query string to an object.
		 *
		 * @public
		 * @param queryString               The query string to parse.
		 * @param {string} [splitter='&']   Splitter between string values.
		 * @param {string} [defaultValue]   Default value when key is present but has no value.  This defines what the object
		 *                                  value is set to for these items.
		 * @returns {Object}                The parse query object.
		 */
		function queryStringToObject(queryString, splitter='&', defaultValue=undefined) {
			let obj = {};
			let parts = queryString.split(splitter);
			parts.forEach(part=>{
				let _parts = part.split('=');
				let key = _parts.shift();
				obj[key] = ((_parts.length) ? _parts.join('=') : defaultValue);
			});
			return obj;
		}

		/**
		 * Get a query object from a given array, avoiding any hash section errors.
		 *
		 * @public
		 * @param {string} url    The url string to parse.
		 * @returns {Object}      The query object.
		 */
		function getUrlQueryObject(url) {
			let parts = url.split('?');
			if (parts.length > 1) {
				return queryStringToObject(parts[1]);
			}
			return {};
		}

		_apiGet("taxonomies").then(tax=>{
			if (tax) {
				Object.keys(tax).forEach(taxName=>{
					apiSettings.taxonomies[taxName] = apiSettings.taxonomies[taxName] || {};
					Object.assign(apiSettings.taxonomies[taxName], {
						base: tax[taxName].slug,
						rest: tax[taxName].rest_base
					});
				});
			}
		});

		function _apiGet(endpoint, _params={}) {
			const url = ((endpoint.indexOf(apiUrl) !== -1) ? endpoint : apiUrl + "/" + endpoint);
			const params = Object.assign({}, getUrlQueryObject(url), _params);

			return $http({
				method: "get",
				url: url.split('?').shift(),
				params,
				headers: {
					'X-SERVER-SELECT': 'moses',
					'X-WP-Nonce': apiSettings.nonce
				}
			}).then(res=>{
				if (res && res.data && (res.data.length || Object.keys(res.data).length)) return res.data;
			});
		}

		function _apiGetData(endpoint, params, carriedData={}) {
			return _apiGet(endpoint, params).then(data=>{
				if (data) {
					let articles = data.map(data=>{
						return {
							title: data.title.rendered,
							content: (data.content || data.description).rendered,
							excerpt: (data.excerpt || data.caption).rendered,
							post_class: data.post_class
						}
					});

					let returnedData = {
						title: carriedData.title || '',
						content: carriedData.content || '',
						articles_class: (carriedData.articles_class || []).concat(['articles']),
						body_class: carriedData.body_class || data[0].body_class,
						body_style: carriedData.body_style || data[0].body_style,
						articles
					};

					return returnedData;
				}
			});
		}

		function getContent(options) {
			let slug = options.src;
			let slugParts = slug.split('/').filter(part=>part.trim());
			let slugBase = slugParts.shift();
			let slugMain = slugParts.join('/');

			if (slugParts.length > 0) slug = "/" + slugParts[slugParts.length-1] + "/";

			if (slug === apiSettings.blogSlug) {
				return _apiGetData("pages", {slug}).then(page=> _apiGetData("posts", {}, {
					articles_class: page.articles_class.concat(page.articles[0].post_class),
					title: page.articles[0].title,
					content: page.articles[0].excerpt
				}));
			}

			if (slugParts.length >= 1) {
				let taxName = Object.keys(apiSettings.taxonomies).find(
					taxName=>(apiSettings.taxonomies[taxName].base === slugBase)
				);
				if (taxName) {
					return _apiGet(apiSettings.taxonomies[taxName].rest).then(taxonomy=>{
						if (taxonomy) {
							let tax = taxonomy.find(tax=>(tax.slug === slugMain));
							if (tax) return _apiGetData(
								tax._links['wp:post_type'][0].href, {}, {
									title: tax.name,
									content: tax.description
								}
							);
						}
					});
				}
			}

			if (slug === apiSettings.homepageSlug) {
				return _apiGetData("pages", {id: apiSettings.homepageId});
			} else {
				return _apiGetData("pages", {slug}).then(data=>
					(data ? data : _apiGetData("posts", {slug}))
				).then(data=>
					(data ? data : _apiGetData("media", {slug}))
				);
			}
		}

		return {
			getContent
		};
	}]);

})(window, "wb", "$wordpress");