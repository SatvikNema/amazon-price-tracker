import { STATES } from "mongoose";
import {
	GET_PROFILE,
	UPDATE_PRODUCT,
	DELETE_PRODUCT,
	ITEMS_LOADING,
} from "../actions/types";
const initialState = {
	profile: {},
	loading: false,
};

export default function (state = initialState, action) {
	switch (action.type) {
		case GET_PROFILE:
			const obj = { ...state, profile: action.payload, loading: false };
			console.log(obj);
			return {
				...state,
				profile: action.payload,
				loading: false,
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
		case ITEMS_LOADING:
			return {
				...state,
				loading: true,
			};
		default:
			return state;
	}
}

// profile: {
// 		_id: "5fb4f11466f2e24990f80722",
// 		items: [
// 			{
// 				_id: "5fb4e3c966f2e24990f80720",
// 				checkInMins: 50,
// 				productImage:
// 					"https://images-na.ssl-images-amazon.com/images/I/71WdrLib1GL._SL1500_.jpg",
// 				owner: {
// 					id: "5fae35bc0d99a93b8c5f581b",
// 					username: "satvik",
// 				},
// 				link:
// 					"https://www.amazon.in/Samsung-Inverter-Refrigerator-RT28T3483S8-HL/dp/B083461G9M/ref=sr_1_2?dchild=1&pf_rd_p=d3d50d9d-04d3-46b2-b102-91ba1cf2a11f&pf_rd_r=CKPDBVPT3MBBNSRXJVMX&qid=1605690288&refinements=p_85%3A10440599031&rps=1&s=kitchen&sr=1-2",
// 				title:
// 					"Samsung 253L 3 Star Inverter Frost Free Double Door Refrigerator (RT28T3483S8/HL, Elegant Inox)",
// 				price: [
// 					{
// 						_id: "5fb4e3c966f2e24990f80721",
// 						value: 23340,
// 						date: "2020-11-18T09:05:13.095Z",
// 					},
// 				],
// 				targetPrice: 22000,
// 				__v: 0,
// 			},
// 			{
// 				_id: "5fb4f12966f2e24990f80723",
// 				checkInMins: 3600,
// 				productImage:
// 					"https://images-na.ssl-images-amazon.com/images/I/61v5xP47SbL._SL1500_.jpg",
// 				owner: {
// 					id: "5fb4f11466f2e24990f80722",
// 					username: "satvik",
// 				},
// 				link:
// 					"https://www.amazon.in/NEW-Microsoft-Surface-Headphones-Light/dp/B086Q9YGD3/",
// 				title: "NEW Microsoft Surface Headphones 2 - Light Gray",
// 				price: [
// 					{
// 						_id: "5fb4f12966f2e24990f80724",
// 						value: 79780,
// 						date: "2020-11-18.808Z",
// 					},
// 				],
// 				targetPrice: 30000,
// 				__v: 0,
// 			},
// 			{
// 				_id: "5fb4f12e66f2e24990f80727",
// 				checkInMins: 60,
// 				productImage:
// 					"https://images-na.ssl-images-amazon.com/images/I/710weRkP-nL._SL1500_.jpg",
// 				owner: {
// 					id: "5fb4f11466f2e24990f80722",
// 					username: "satvik",
// 				},
// 				link:
// 					"https://www.amazon.in/Samsung-Galaxy-Electric-Blue-128GB-Storage/dp/B085J1J32G/",
// 				title:
// 					"Samsung Galaxy M51 (Electric Blue, 6GB RAM, 128GB Storage)",
// 				price: [
// 					{
// 						_id: "5fb4f12e66f2e24990f80728",
// 						value: 24999,
// 						date: "2020-11-18T10:02:22.465Z",
// 					},
// 				],
// 				targetPrice: 21000,
// 				__v: 0,
// 			},
// 		],
// 		username: "satvik",
// 		password:
// 			"$2b$10$/rS3YQZ8tIB0ctbJc1kYMeaFeD0LiIOb2HVoOzw4Da0YaiQqlKvIC",
// 		__v: 13,
// 	},
