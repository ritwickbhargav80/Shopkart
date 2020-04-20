import React, { useState } from "react";
import { Skeleton } from "antd";
// import Icon from "@ant-design/icons";
// import { Link } from "react-router-dom";
// import _routes from "../../utils/_routes";
import UserChart from "./Widgets/UserChart";
import StockCount from "./Widgets/StockCount";
import TodaySales from "./Widgets/TodaySales";
import Calendar from "./Widgets/Calendar";
import UnitsSoldToday from "./Widgets/UnitsSoldToday";
import TotalSale from "./Widgets/TotalSale";

export const DashCards = () => {
	const [isLoading, setIsLoading] = useState(true);
	// const iconStyle = color => {
	// 	return {
	// 		fontSize: "40px",
	// 		paddingRight: 8,
	// 		color: color
	// 	};
	// };

	setTimeout(() => {
		setIsLoading(false);
	}, 800);

	return (
		<>
			<Skeleton active loading={isLoading}>
				<div className="mt-2 row">
					<div className="col-lg-4 mb-4">
						<div className="card p-4">
							<h4 className="text-center">
								<b>User Counter</b>
							</h4>
							<UserChart />
							<p className="text-center">
								<span className="mr-4 p-1 active-users-tag">
									Active
								</span>
								<span className="p-1 total-users-tag">
									Non-Active
								</span>
							</p>
						</div>
					</div>
					<div className="col-lg-6 mb-4">
						<div className="card p-4">
							<h4 className="text-center">
								<b>Sale History</b>
							</h4>
							<TodaySales />
						</div>
					</div>
					<div className="col-lg-4 mb-4">
						<div className="card p-4">
							<h4 className="text-center">
								<b>Units sold (Today)</b>
							</h4>
							<UnitsSoldToday />
						</div>
					</div>

					<div className="col-lg-4 mb-4">
						<div className="card p-4">
							<h4 className="text-center">
								<b>Today Sales</b>
							</h4>
							<TotalSale />
						</div>
					</div>
				</div>

				<div className="row mt-4">
					<div className="col-lg-6">
						<StockCount />
					</div>
					<div className="col-lg-4">
						<Calendar />
					</div>
				</div>
			</Skeleton>
			<Skeleton active loading={isLoading}></Skeleton>
		</>
	);
};
