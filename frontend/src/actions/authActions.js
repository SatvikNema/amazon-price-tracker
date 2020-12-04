import { returnErrors, clearErrors } from "./errorActions";
import {
	USER_LOADED,
	USER_LOADING,
	AUTH_ERROR,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT_SUCCESS,
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	GOOGLE_SIGN_IN_SUCCESS,
	GOOGLE_SIGN_IN_FAIL,
} from "./types";

import {
	loginUser,
	registerUser,
	getUser,
	logoutUser,
	sendAccessToken,
} from "../utils";

export const loginThisUser = (obj) => (dispatch) => {
	dispatch({
		type: USER_LOADING,
	});
	loginUser(obj)
		.then((res) => res.json())
		.then((response) => {
			if (response.err) {
				throw new Error(response.err);
			}
			dispatch(clearErrors());
			return dispatch({
				type: LOGIN_SUCCESS,
				payload: response,
			});
		})
		.catch((e) => {
			dispatch(returnErrors(e.message, 401));
			return dispatch({
				type: LOGIN_FAIL,
			});
		});
};
export const registerThisUser = (obj) => (dispatch) => {
	dispatch({
		type: USER_LOADING,
	});
	registerUser(obj)
		.then((res) => res.json())
		.then((response) => {
			if (response.err) {
				throw new Error(response.err);
			}
			console.log(response);
			dispatch(returnErrors(response.msg, 200));
			return dispatch({
				type: REGISTER_SUCCESS,
				payload: response,
			});
		})
		.catch((e) => {
			dispatch(returnErrors(e.message, 401));
			dispatch({
				type: REGISTER_FAIL,
			});
		});
};

export const getThisUser = () => (dispatch) => {
	dispatch({
		type: USER_LOADING,
	});
	getUser().then((user) => {
		if (user) {
			dispatch(clearErrors());
			return dispatch({
				type: USER_LOADED,
				payload: user,
			});
		} else {
			dispatch(returnErrors("No user logged in", 200));
			return dispatch({
				type: AUTH_ERROR,
			});
		}
	});
};
export const googleSignIn = (token) => (dispatch) => {
	dispatch({
		type: USER_LOADING,
	});
	sendAccessToken(token)
		.then((res) => res.json())
		.then((response) => {
			if (response.err) {
				throw new Error(response.err);
			}
			dispatch(clearErrors());
			return dispatch({
				type: GOOGLE_SIGN_IN_SUCCESS,
				payload: response,
			});
		})
		.catch((e) => {
			dispatch(returnErrors(e.message, 401));
			return dispatch({
				type: GOOGLE_SIGN_IN_FAIL,
			});
		});
};

export const logout = () => (dispatch) => {
	logoutUser().then((res) => {
		if (res.ok) {
			return dispatch({
				type: LOGOUT_SUCCESS,
			});
		}
	});
};
