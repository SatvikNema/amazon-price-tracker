import {
	GET_PROFILE,
	UPDATE_PRODUCT,
	DELETE_PRODUCT,
	ITEMS_LOADING,
	SINGLE_ITEM_LOADING,
} from "../actions/types";
const initialState = {
	profile: {},
	loading: false,
	singleLoading: false,
};

export default function changeState(state = initialState, action) {
	switch (action.type) {
		case GET_PROFILE:
			return {
				...state,
				profile: action.payload,
				loading: false,
				singleLoading: false,
			};
		case DELETE_PRODUCT:
			return {
				profile: {
					...state.profile,
					items: state.profile.items.filter(
						(item) => item._id !== action.payload
					),
				},
			};
		case UPDATE_PRODUCT:
			return {
				...state,
				loading: false,
				singleLoading: false,
			};
		case ITEMS_LOADING:
			return {
				...state,
				loading: true,
			};
		case SINGLE_ITEM_LOADING:
			return {
				...state,
				singleLoading: true,
			};
		default:
			return state;
	}
}
