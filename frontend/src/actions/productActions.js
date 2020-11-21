import {
	GET_PROFILE,
	UPDATE_PRODUCT,
	ITEMS_LOADING,
	SINGLE_ITEM_LOADING,
} from "./types";

import {
	getProductList,
	deleteProduct,
	editProduct,
	updatePrice,
} from "../utils";

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
	dispatch(setItemsLoading());
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
	dispatch(setItemsLoading());
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
			return dispatch({
				type: UPDATE_PRODUCT,
			});
		})
		.catch((e) => console.log(e));
};

export const updateCurrentPrice = (id) => (dispatch) => {
	dispatch(setSingleItemLoading());
	updatePrice(id)
		.then((res) => {
			if (res.status === 201) {
				res.json().then((response) => {
					return dispatch({
						type: GET_PROFILE,
						payload: response,
					});
				});
			} else if (res.status === 200) {
				return dispatch({
					type: UPDATE_PRODUCT,
				});
			} else {
				throw "Error in updating";
			}
		})
		.catch((e) => {
			console.log(e);
			return dispatch({
				type: UPDATE_PRODUCT,
			});
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
