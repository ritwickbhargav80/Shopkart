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
