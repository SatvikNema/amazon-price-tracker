// let options = {
// 	credentials: "include",
// };
let options = {};
let url = null,
	res = null,
	response = null;

export const getProductList = async () => {
	url = "/productList";

	res = await fetch(url, options);
	return res;
};

export const getUser = async () => {
	url = "/getUser";
	res = await fetch(url, options);
	if (res.ok) {
		response = await res.json();
		return response.username;
	} else {
		return null;
	}
};

export const addProduct = async (obj) => {
	url = "/addProduct";
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
	url = "/scheduledUpdate/" + id;
	res = await fetch(url, options);
	return res;
};

export const fetchProduct = async (id) => {
	url = "/product/" + id;
	console.log(url);
	res = await fetch(url, options);

	return res;
};

export const editProduct = async (id, obj) => {
	url = "/editProduct/" + id;
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

export const deleteProduct = async (id) => {
	url = "/deleteProduct/" + id;
	res = await fetch(url, {
		...options,
		method: "DELETE",
	});
	return res;
};

export const registerUser = async (obj) => {
	url = "/register";
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
	url = "/login";
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

export const logoutUser = async () => {
	url = "/logout";
	res = await fetch(url, options);
	return res;
};

// export { getUser, registerUser, loginUser, logoutUser };
