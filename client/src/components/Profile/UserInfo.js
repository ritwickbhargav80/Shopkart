import React, { useState, useEffect } from "react";
import { getProfileService } from "../../utils/services/user";
import { _notification } from "../../utils/_helpers";
import { CheckCircleOutlined } from "@ant-design/icons";

export default props => {
	const [profile, setProfile] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	useEffect(() => {
		(async () => {
			try {
				const res = await getProfileService();
				setProfile(res);
				setIsLoading(false);
			} catch (err) {
				setIsLoading(false);
				_notification("error", "Error", err.message);
			}
		})();
	}, []);

	return (
		<>
			<div className="row">
				<div className="col-4">
					<div className="card p-4 text-center">
						<div
							hidden={!isLoading}
							className="spinner-border spinner-border-sm text-primary mx-auto my-auto"
							role="status"
						>
							<span className="sr-only">Loading...</span>
						</div>
						<h4>{profile.name}</h4>

						<CheckCircleOutlined
							hidden={isLoading}
							style={{ color: "#0F9D58", fontSize: 24 }}
						/>
						<br />

						<p className="pb-0 mb-0">
							{profile.email}
							<br />
							{profile.contact}
						</p>
					</div>
				</div>
			</div>
		</>
	);
};
