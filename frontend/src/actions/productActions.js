import {
	GET_PROFILE,
	UPDATE_PRODUCT,
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
} from "../utils";

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
		.then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw "Error while deleting product " + id;
			}
		})
		.then((response) => {
			console.log(response);
			return dispatch({
				type: GET_PROFILE,
				payload: response,
			});
		})
		.catch((e) => console.log(e));
};

export const editThisProduct = (id, obj) => (dispatch) => {
	dispatch(startRequest());
	editProduct(id, obj)
		.then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw "error in editing " + id;
			}
		})
		.then((response) => {
			console.log(response);
			return dispatch(endRequest());
		})
		.catch((e) => console.log(e));
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
				throw "Error in updating";
			}
		})
		.catch((e) => {
			console.log(e);
			return dispatch(endRequest());
		});
};

export const addThisProduct = (obj) => (dispatch) => {
	dispatch({
		type: START_REQUEST,
	});
	addProduct(obj)
		.then((res) => {
			if (res.ok) return res.json();
			else throw "Unable to add product";
		})
		.then((response) => {
			//dispatch an action
			return dispatch({
				type: END_REQUEST,
			});
		})
		.catch((e) => console.log(e));
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
