import ProductList from "../components/Products/ProductList";
import Dashboard from "../components/Layout/Dashboard";
import {
	AppstoreOutlined,
	BuildOutlined,
	UserOutlined
} from "@ant-design/icons";

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
		component: ProductList,
		name: "Products",
		key: "products",
		icon: BuildOutlined,
		// description: "List of all the events",
		color: "#DB4437"
	},
	{
		path: "/profile",
		exact: true,
		component: ProductList,
		name: "Profile",
		key: "profile",
		icon: UserOutlined,
		// description: "List of all the events",
		color: "#F4B400"
	}
];

export default routes;
