// let options = {
// 	credentials: "include",
// };
let options = {};
let url = null,
	res = null,
	response = null;

export const getProductList = async () => {
	url = "/api/productList";

	res = await fetch(url, options);
	return res;
};

export const getUser = async () => {
	url = "/api/getUser";
	res = await fetch(url, options);
	if (res.ok) {
		response = await res.json();
		return response.username;
	} else {
		return null;
	}
};

export const addProduct = async (obj) => {
	url = "/api/addProduct";
	res = await fetch(url, {
		...options,
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(obj),
	});
	return res;
};

export const updatePrice = async (id) => {
	url = "/api/scheduledUpdate/" + id;
	res = await fetch(url, options);
	return res;
};

export const fetchProduct = async (id) => {
	url = "/api/product/" + id;
	res = await fetch(url, options);

	return res;
};

export const editProduct = async (id, obj) => {
	url = "/api/editProduct/" + id;
	res = await fetch(url, {
		...options,
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(obj),
	});
	return res;
};

export const emailOn = async () => {
	res = await fetch("/api/startGettingEmails");
	return res;
};
export const emailOff = async () => {
	res = await fetch("/api/stopGettingEmails");
	return res;
};

export const deleteProduct = async (id) => {
	url = "/api/deleteProduct/" + id;
	res = await fetch(url, {
		...options,
		method: "DELETE",
	});
	return res;
};

export const registerUser = async (obj) => {
	url = "/api/register";
	console.log(url);
	res = await fetch(url, {
		...options,
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(obj),
	});
	return res;
};
export const loginUser = async (obj) => {
	url = "/api/login";
	res = await fetch(url, {
		...options,
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(obj),
	});
	return res;
};

export const sendAccessToken = async (token) => {
	const res = await fetch("/api/useAccessToken", {
		...options,
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ access_token: token }),
	});
	return res;
};

export const logoutUser = async () => {
	url = "/api/logout";
	res = await fetch(url, options);
	return res;
};

// export { getUser, registerUser, loginUser, logoutUser };
