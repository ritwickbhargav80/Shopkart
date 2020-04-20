import React, { useState, useEffect } from "react";
import { getTodaySalesService } from "../../../utils/services/stats";
import { _notification } from "../../../utils/_helpers";

export default props => {
	const [unitSold, setUnitSold] = useState();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		(async () => {
			try {
				const res = await getTodaySalesService();
				if (res.success) {
					setUnitSold(res.totalSalePrice);
				} else {
					_notification("error", "Error", res.message);
				}
				setIsLoading(false);
			} catch (err) {
				setIsLoading(false);
				_notification("error", "Error", err.message);
			}
		})();
	}, []);

	return (
		<>
			<div
				hidden={!isLoading}
				className="spinner-border spinner-border-sm text-primary mx-auto my-auto"
				role="status"
			>
				<span className="sr-only">Loading...</span>
			</div>
			<h1 className="text-center" style={{ color: "#4285f4" }}>
				<b>{unitSold}</b>
			</h1>
		</>
	);
};
