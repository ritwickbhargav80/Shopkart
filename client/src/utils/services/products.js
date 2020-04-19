import {
	ADD_PRODUCT,
	ADD_SHOP,
	VIEW_ALL_PRODUCTS,
	VIEW_PRODUCT
} from "../routes";

import http from "../services/httpService";

export async function getProductsService() {
	try {
		const response = await http.get(VIEW_ALL_PRODUCTS);
		console.log(response);
		if (response.status === 200 && response.data.error === false) {
			return response.data;
		} else return response.data;
	} catch (err) {
		return err.response.data;
	}
}
