import { combineReducers } from "redux";
import productsReducer from "./productsReducer";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";

export default combineReducers({
	profile: productsReducer,
	auth: authReducer,
	error: errorReducer,
});
