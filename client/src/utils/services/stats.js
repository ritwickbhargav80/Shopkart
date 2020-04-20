import { USER_COUNT, STOCK_COUNT } from "../routes";
import { isLoggedIn } from "./auth";

import http from "../services/httpService";

export async function userCountService() {
	const isOkay = isLoggedIn();
	if (isOkay) {
		try {
			const response = await http.get(USER_COUNT);
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

export async function stockCountService(data) {
	const isOkay = isLoggedIn();
	if (isOkay) {
		try {
			const response = await http.post(STOCK_COUNT, data);
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
