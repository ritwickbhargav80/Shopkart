import { PROFILE } from "../routes";
import { isLoggedIn } from "./auth";
import http from "../services/httpService";

export async function getProductsService() {
	const isOkay = isLoggedIn();
	if (isOkay) {
		try {
			const response = await http.get(PROFILE);
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
