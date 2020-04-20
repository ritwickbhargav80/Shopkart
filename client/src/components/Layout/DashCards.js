import React, { useState } from "react";
import { Skeleton } from "antd";
// import Icon from "@ant-design/icons";
// import { Link } from "react-router-dom";
// import _routes from "../../utils/_routes";
import UserChart from "./Widgets/UserChart";
import StockCount from "./Widgets/StockCount";
import TodaySales from "./Widgets/TodaySales";
import Calendar from "./Widgets/Calendar";

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
					{/* {_routes.map(route => {
				if (route.key === "dashboard") {
					return null;
				}
				return (
					<Col lg={8} md={8} sm={12} key={route.key}>
						<Link to={route.path}>
							<Card
								hoverable
								className="content-clickable"
								bordered={false}
								style={{
									width: "100%",
									borderBottom: `16px solid ${route.color}`
								}}
							>
								<Row gutter={16}>
									<Col
										xl={18}
										lg={18}
										sm={12}
										md={16}
										xs={12}
									>
										<h2
											style={{
												fontWeight: 700,
												marginBottom: 0
											}}
										>
											{route.name}
										</h2>
										{route.description}
									</Col>
									<Col xl={6} lg={6} sm={12} md={8} xs={12}>
										<route.icon
											style={iconStyle(route.color)}
										/>
									</Col>
								</Row>
							</Card>
						</Link>
					</Col>
				);
			})} */}
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
							{/* <p className="text-center">
								<span className="mr-4 p-1 active-users-tag">
									Active
								</span>
								<span className="p-1 total-users-tag">
									Non-Active
								</span>
							</p> */}
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
