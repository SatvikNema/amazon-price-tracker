import {
	GET_PROFILE,
	UPDATE_PRODUCT,
	DELETE_PRODUCT,
	ITEMS_LOADING,
} from "./types";

import { getProductList } from "../utils";

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

export const deleteProduct = (id) => {
	return {
		type: DELETE_PRODUCT,
		payload: id,
	};
};
export const setItemsLoading = () => {
	return {
		type: ITEMS_LOADING,
	};
};
