import React from "react";
import { Row, Col, Card } from "antd";
import Icon from "@ant-design/icons";
import { Link } from "react-router-dom";
import _routes from "../../utils/_routes";
import UserChart from "./Widgets/UserChart";
export const DashCards = () => {
	const iconStyle = color => {
		return {
			fontSize: "40px",
			paddingRight: 8,
			color: color
		};
	};
	return (
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
			<div className="col-lg-4">
				<div className="card p-4">
					<h4 className="text-center">
						<b>User Counter</b>
					</h4>
					<UserChart />
					<p className="text-center">
						<span className="mr-4 p-1 active-users-tag">
							Active
						</span>
						<span className="p-1 total-users-tag">Non-Active</span>
					</p>
				</div>
			</div>
		</div>
	);
};
