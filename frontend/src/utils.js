const baseURL = "http://localhost:5000";
let options = {
	credentials: "include",
};
let url = null,
	res = null,
	response = null;

export const getProductList = async () => {
	url = baseURL + "/productList";
	res = await fetch(url, options);
	return res;
};

export const getUser = async () => {
	url = baseURL + "/getUser";
	res = await fetch(url, options);
	if (res.ok) {
		response = await res.json();
		return response.username;
	} else {
		return null;
	}
};

export const loginUser = async (obj) => {
	url = baseURL + "/login";
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

export const registerUser = async (obj) => {
	url = baseURL + "/register";
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
	url = baseURL + "/logout";
	res = await fetch(url, options);
	return res;
};

// export { getUser, registerUser, loginUser, logoutUser };
