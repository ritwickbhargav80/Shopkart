import React, { useState } from "react";
import { SyncOutlined } from "@ant-design/icons";
import { Drawer } from "antd";
import { getProductsService } from "../../utils/services/products";
import { _notification } from "../../utils/_helpers";
import AddProduct from "./AddProduct";

export default props => {
	const [isLoading, setIsLoading] = useState(false);
	const [isDrVisible, setIsDrVisible] = useState(false);

	const showDrawer = () => {
		setIsDrVisible(true);
	};

	const onClose = () => {
		setIsDrVisible(false);
	};

	const handleSearch = async e => {
		const val = e.target.value;
		setIsLoading(true);
		try {
			const res = await getProductsService();
			if (res.success) {
				setIsLoading(false);
				let products = res.product;
				products = products.filter(product =>
					String(product.name).toLowerCase().includes(val)
				);
				props.onSearch(products);
			} else {
				setIsLoading(false);
				_notification("error", "Error", res.message);
			}
		} catch (err) {
			setIsLoading(false);
			_notification("error", "Error", err.message);
		}
	};

	const handleRefresh = async () => {
		setIsLoading(true);
		try {
			const res = await getProductsService();
			if (res.success) {
				setIsLoading(false);
				props.onRefresh(res.product);
			} else {
				setIsLoading(false);
				_notification("error", "Error", res.message);
			}
		} catch (err) {
			setIsLoading(false);
			_notification("error", "Error", err.message);
		}
	};

	const handleAddProduct = () => {
		onClose();
		handleRefresh();
	};

	return (
		<>
			<div className="form-inline">
				<button
					type="button"
					className="btn btn-primary"
					onClick={showDrawer}
				>
					Add Product
				</button>
				<input
					type="text"
					className="form-control ml-4"
					id="InputSearch"
					aria-describedby="inputHelp"
					placeholder="Search Product"
					onChange={handleSearch}
				></input>

				<SyncOutlined
					className="ml-4"
					style={{ cursor: "pointer" }}
					onClick={handleRefresh}
					spin={isLoading}
				/>
			</div>

			<Drawer
				title="Add Product"
				placement="right"
				closable={false}
				onClose={onClose}
				width={600}
				visible={isDrVisible}
			>
				<AddProduct onAddProduct={handleAddProduct} />
			</Drawer>
		</>
	);
};
