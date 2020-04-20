import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import { LockOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import routes from "../../utils/_routes";
import {
	Redirect,
	Route,
	Switch,
	BrowserRouter as Router,
	Link
} from "react-router-dom";

const { Content, Sider } = Layout;

const Dashboard = props => {
	const [isCollapsed, setIsCollapsed] = useState(true);
	const routeKey = localStorage.getItem("routeKey");

	useEffect(() => {
		if (
			!localStorage.getItem("token") ||
			localStorage.getItem("token") === "undefined"
		) {
			props.history.push("/login");
		}
	});

	return (
		<>
			<Router>
				<Layout>
					<Sider
						theme="light"
						trigger={null}
						collapsible
						collapsed={isCollapsed}
					>
						<Menu
							theme="light"
							height="100%"
							mode="inline"
							defaultSelectedKeys={routeKey || "dashboard"}
						>
							{routes.map((route, idx) => (
								<Menu.Item
									key={route.key}
									onClick={() => {
										localStorage.setItem(
											"routeKey",
											route.key
										);
									}}
								>
									<route.icon />
									<span>{route.name}</span>
									<Link to={route.path} />
								</Menu.Item>
							))}
							<Menu.Item
								key={"signout"}
								onClick={() => {
									localStorage.clear();
									props.history.push("/login");
								}}
							>
								<LockOutlined />
								<span>Sign Out</span>
							</Menu.Item>

							<Menu.Divider />

							<Menu.Item
								key={"menu-extend"}
								onClick={() => {
									setIsCollapsed(!isCollapsed);
								}}
								style={{
									top: "64vh"
								}}
							>
								{isCollapsed ? (
									<RightOutlined />
								) : (
									<LeftOutlined />
								)}

								<span></span>
							</Menu.Item>
						</Menu>
					</Sider>

					<Layout>
						<Content
							style={{
								margin: 12,
								padding: 20,
								background: "#f9f9f9",
								minHeight: "280"
							}}
						>
							<Switch>
								{routes.map((route, idx) => {
									return route.component ? (
										<Route
											key={idx}
											path={route.path}
											exact={route.exact}
											render={props => (
												<route.component {...props} />
											)}
										/>
									) : null;
								})}
								<Redirect from="/dashboard" to="/" />
							</Switch>
						</Content>
					</Layout>
				</Layout>
			</Router>
		</>
	);
};

export default Dashboard;
