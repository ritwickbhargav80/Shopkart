import {
	ADD_PRODUCT,
	// ADD_SHOP,
	VIEW_ALL_PRODUCTS
	// VIEW_PRODUCT
} from "../routes";
import { isLoggedIn } from "./auth";

import http from "../services/httpService";

export async function getProductsService() {
	const isOkay = isLoggedIn();
	if (isOkay) {
		try {
			const response = await http.get(VIEW_ALL_PRODUCTS);
			if (response.status === 200 && response.data.error === false) {
				return response.data;
			} else return response.data;
		} catch (err) {
			return err.response.data;
		}
	} else {
		window.location.push("/login");
	}
}

export async function addProductsService(data) {
	const isOkay = isLoggedIn();
	if (isOkay) {
		try {
			const response = await http.post(ADD_PRODUCT, data);

			if (response.status === 200 && response.data.error === false) {
				return response.data;
			} else return response.data;
		} catch (err) {
			return err.response.data;
		}
	} else {
		window.location.push("/login");
	}
}
