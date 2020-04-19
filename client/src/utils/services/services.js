import axios from "axios";
import {
	ADD_PRODUCT,
	ADD_SHOP,
	VIEW_ALL_PRODUCTS,
	VIEW_PRODUCT
} from "../routes";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

axios.defaults.baseURL = BASE_URL;

function setUserToken(token) {
	let AUTH_TOKEN = localStorage.getItem("token");
	if (AUTH_TOKEN) {
		if (AUTH_TOKEN.includes("Logout")) {
			localStorage.clear();
			window.location.push("/login");
		}
		axios.defaults.headers.common["x-auth-token"] = AUTH_TOKEN;
	}
}

/******************AUTH SERVICES********************/
export async function loginService(data) {
	try {
		const response = await axios.post(LOGIN, data);
		if (response.status === 200 && response.data.error === false) {
			return {
				res: response.data,
				token: response.headers["x-auth-token"]
			};
		} else return response.data;
	} catch (err) {
		return err.response.data;
	}
}

/******************EVENT SERVICES********************/
export async function getProductsService() {
	try {
		const response = await http.get(VIEW_ALL_PRODUCTS);
		if (response.status === 200 && response.data.error === false) {
			return response.data;
		} else return response.data;
	} catch (err) {
		return err.response.data;
	}
}

export async function getEventService(id) {
	try {
		const params = { id };
		const response = await axios.get(GET_EVENT, { params });
		if (response.status === 200 && response.data.error === false) {
			return response.data;
		} else if (response.status === 500)
			return { response: { data: { message: "Something went wrong" } } };
		else return response.data;
	} catch (err) {
		return err.response.data;
	}
}

export async function addEventService(data) {
	setUserToken();
	try {
		const config = {
			headers: {
				"content-type": "multipart/form-data"
			}
		};
		const response = await axios.post(ADD_EVENT, data, config);
		if (response.status === 200 && response.data.error === false) {
			return response.data;
		} else return response.data;
	} catch (err) {
		return err.response.data;
	}
}
