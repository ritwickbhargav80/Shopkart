import React, { useState, useEffect } from "react";
import { getProductsService } from "../../utils/services/products";
import { _notification } from "../../utils/_helpers";
import Product from "./Product";
import "./style.css";

export default props => {
	const [products, setProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	useEffect(() => {
		(async () => {
			try {
				const res = await getProductsService();
				if (res.success) {
					setProducts(res.product);
					setIsLoading(false);
				} else {
					_notification("error", "Error", res.message);
				}
			} catch (err) {
				_notification("error", "Error", err.message);
			}
		})();
	}, []);
	return (
		<table className="table table-hover">
			<thead>
				<tr>
					<th scope="col">#</th>
					<th scope="col">Name</th>
					<th scope="col">Category</th>
					<th scope="col">Price</th>
					<th scope="col">Quantity</th>
					<th scope="col">MFD.</th>
					<th scope="col">EXP.</th>
					<th scope="col">Manufacturer</th>
				</tr>
			</thead>
			<tbody>
				{products
					? products.map((product, idx) => {
							return <Product product={product} idx={idx} />;
					  })
					: null}
			</tbody>
			<div className="p-4" style={{ width: "100%" }} hidden={!isLoading}>
				<div
					className="spinner-border text-primary text-center mx-auto"
					role="status"
				>
					<span className="sr-only">Loading...</span>
				</div>
			</div>
		</table>
	);
};
