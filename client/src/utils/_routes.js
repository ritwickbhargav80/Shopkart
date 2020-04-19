// import EventsList from "../components/Events/EventsList";
import Dashboard from "../components/Layout/Dashboard";
import { AppstoreOutlined, BuildOutlined } from "@ant-design/icons";

let routes = [
	{
		path: "/",
		exact: true,
		name: "Dashboard",
		component: Dashboard,
		key: "dashboard",
		icon: AppstoreOutlined,
		// description: "List of all the events",
		color: "#F4B400"
	},
	{
		path: "/products",
		exact: true,
		component: Dashboard,
		name: "Products",
		key: "products",
		icon: BuildOutlined,
		// description: "List of all the events",
		color: "#DB4437"
	}
];

export default routes;
