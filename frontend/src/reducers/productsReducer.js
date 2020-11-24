import {
	GET_PROFILE,
	UPDATE_PRODUCT,
	ITEMS_LOADING,
	SINGLE_ITEM_LOADING,
	START_REQUEST,
	END_REQUEST,
	EMAIL_NOTIFICATION_ON,
	EMAIL_NOTIFICATION_OFF,
} from "../actions/types";
const initialState = {
	profile: {},
	loading: false,
	singleLoading: false,
	status: null,
};

export default function changeState(state = initialState, action) {
	switch (action.type) {
		case GET_PROFILE:
			return {
				...state,
				profile: action.payload,
				loading: false,
				singleLoading: false,
				status: null,
			};
		case UPDATE_PRODUCT:
			return {
				...state,
				status: null,
			};
		case ITEMS_LOADING:
			return {
				...state,
				loading: true,
				status: null,
			};
		case SINGLE_ITEM_LOADING:
			return {
				...state,
				singleLoading: true,
				status: null,
			};
		case START_REQUEST:
			return {
				...state,
				status: "start",
			};
		case END_REQUEST:
			return {
				...state,
				status: "finished",
			};
		default:
			return state;
	}
}
