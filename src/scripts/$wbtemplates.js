(function(global, moduleId, serviceName, angular=global.angular) {

	angular.module(moduleId).service(serviceName, [
		"$document",
		"$http",
	($doc, $http)=>{
		"use strict";

		let callbacks = new WeakMap();
		let templates = new Map();
		let superGet = templates.get.bind(templates);

		function addCallback(name, loader, promise) {
			callbacks.get(loader).add(()=>{
				let template = superGet(name);
				if (template instanceof Error) return promise.reject(template);
				return promise.resolve(template);
			});
		}

		function fireCallbacks(loader) {
			callbacks.get(loader).forEach(callback=>callback());
			callbacks.delete(loader);
			return true;
		}

		templates.get = function(name) {
			return new Promise((resolve, reject)=>{
				if (!templates.has(name)) {
					let script = $doc.find("script[type='angular/template'][id='"+name+"']");
					if (!script.length) {
						templates.set(name, new Error(`Template ${name} not found.`));
						return reject(superGet(name));
					}

					let templateNodeRef = angular.element(script.get(0));
					let src = templateNodeRef.attr("src");

					if (src !== "") {
						let loader = $http.get(templateNodeRef.attr("src")).then(res=>{
							if (res && res.data) {
								templates.set(name, res.data);
							} else {
								templates.set(name, new Error(`Template ${name} returned no data.`));
							}
							return fireCallbacks(loader);
						}, ()=>{
							templates.set(name, new Error(`Template ${name} returned an error.`));
							return fireCallbacks(loader);
						}).then(()=>{
							loader = undefined;
						});

						callbacks.set(loader, new Set());
						addCallback(name, loader, {resolve, reject});
						templates.set(name, loader);
					} else {
						templates.set(name, templateNodeRef.text());
						resolve(templates.get(name));
					}
				} else {
					let template = superGet(name);
					if (template instanceof Error) return reject(template);
					if (template instanceof Promise) return addCallback(name, template, {resolve, reject});
					return resolve(template);
				}
			});
		}.bind(templates);

		return templates;
	}]);

})(window, "wb", "$wbtemplates");