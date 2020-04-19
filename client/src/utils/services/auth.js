import http from "./httpService";
import { LOGIN } from "../routes";

const isLoggedIn = () => {
	const userToken = localStorage.get("user_token");
	if (userToken) {
		http.setUserToken(userToken);
		return userToken;
	} else {
		return false;
	}
};

const loginService = async (email, password) => {
	const response = await http
		.post(LOGIN, {
			email,
			password
		})
		.catch(error => {
			if (error.response) {
				return error.response;
			}
		});
	if (response.status === 200) {
		localStorage.set("user_token", response.data.token);
	}
	return response;
};

const logout = () => {
	localStorage.clear();
};

// const registerNewUser = async (fname, lname, gender, emailid, password) => {
// 	console.log({
// 		user: {
// 			email: emailid,
// 			username: emailid,
// 			password: password,
// 			first_name: fname,
// 			last_name: lname
// 		},
// 		gender: gender,
// 		avatar: getAvatar(gender)
// 	});

// 	const response = await http
// 		.post(APIURL.CREATE_NEW_USER, {
// 			user: {
// 				email: emailid,
// 				username: emailid,
// 				password: password,
// 				first_name: fname,
// 				last_name: lname
// 			},
// 			gender: gender,
// 			avatar: getAvatar(gender)
// 		})
// 		.catch(error => {
// 			if (error.response) {
// 				return error.response;
// 			}
// 		});
// 	return response;
// };

export { loginService, logout, isLoggedIn };
