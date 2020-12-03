import {
	GET_PROFILE,
	ITEMS_LOADING,
	SINGLE_ITEM_LOADING,
	START_REQUEST,
	END_REQUEST,
} from "./types";

import {
	getProductList,
	deleteProduct,
	editProduct,
	updatePrice,
	addProduct,
	emailOn,
	emailOff,
} from "../utils";

import { returnErrors, clearErrors } from "./errorActions";

// For scenrios where async actions are required, 3 main states used: start, running, finished

export const getProfile = () => (dispatch) => {
	dispatch(setItemsLoading());
	getProductList()
		.then((res) => res.json())
		.then((response) => {
			return dispatch({
				type: GET_PROFILE,
				payload: response,
			});
		});
};

export const deleteThisProduct = (id) => (dispatch) => {
	deleteProduct(id)
		.then((res) => res.json())
		.then((response) => {
			if (response.err) {
				throw new Error(response.err);
			}
			return dispatch({
				type: GET_PROFILE,
				payload: response,
			});
		})
		.catch((e) => dispatch(returnErrors(e.message, 406)));
};

export const startEmailNotification = () => (dispatch) => {
	emailOn()
		.then((res) => res.json())
		.then((response) => {
			if (response.err) {
				throw new Error(response.err);
			}

			return dispatch(getProfile());
		})
		.catch((e) => {
			return dispatch(returnErrors(e.message, 401));
		});
};
export const stopEmailNotification = () => (dispatch) => {
	emailOff()
		.then((res) => res.json())
		.then((response) => {
			if (response.err) {
				throw new Error(response.err);
			}
			return dispatch(getProfile());
		})
		.catch((e) => {
			return dispatch(returnErrors(e.message, 401));
		});
};

export const editThisProduct = (id, obj) => (dispatch) => {
	dispatch(startRequest());
	editProduct(id, obj)
		.then((res) => res.json())
		.then((response) => {
			if (response.err) {
				throw new Error(response.err);
			}
			return dispatch(endRequest());
		})
		.catch((e) => dispatch(returnErrors(e.message, 406)));
};

export const updateCurrentPrice = (id) => (dispatch) => {
	dispatch(startRequest());
	updatePrice(id)
		.then((res) => {
			if (res.status === 201) {
				dispatch(endRequest());
				res.json().then((response) => {
					return dispatch({
						type: GET_PROFILE,
						payload: response,
					});
				});
			} else if (res.status === 200) {
				return dispatch(endRequest());
			} else {
				throw new Error("Error in updating");
			}
		})
		.catch((e) => {
			console.log(e.message);
			return dispatch(endRequest());
		});
};

export const addThisProduct = (obj) => (dispatch) => {
	dispatch({
		type: START_REQUEST,
	});
	addProduct(obj)
		.then((res) => res.json())
		.then((response) => {
			if (response.err) {
				throw new Error(response.err);
			}
			dispatch(clearErrors());
			return dispatch({
				type: END_REQUEST,
			});
		})
		.catch((e) => {
			dispatch(endRequest());
			return dispatch(returnErrors(e.message, 406));
		});
};

export const setItemsLoading = () => {
	return {
		type: ITEMS_LOADING,
	};
};
export const setSingleItemLoading = () => {
	return {
		type: SINGLE_ITEM_LOADING,
	};
};

export const startRequest = () => {
	return {
		type: START_REQUEST,
	};
};
export const endRequest = () => {
	return {
		type: END_REQUEST,
	};
};
