import { XMLHttpRequest } from "xmlhttprequest";

export const sendHTTPRequest = (method, url, obj, isJSON) => {
	const promise = new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();

		request.open(method, url);
		if (obj) {
			request.setRequestHeader("Content-Type", "application/json");
		}
		request.send(JSON.stringify(obj));
		request.onload = () => {
			if (request.status >= 400) {
				reject(request.responseText);
			} else {
				if (isJSON) {
					resolve(JSON.parse(request.responseText));
				} else {
					resolve(request.responseText);
				}
			}
		};
		request.onerror = () => {
			reject(
				"Something went wrong. Either the url is incorrect, or there are some network issues!"
			);
		};
	});
	return promise;
};
