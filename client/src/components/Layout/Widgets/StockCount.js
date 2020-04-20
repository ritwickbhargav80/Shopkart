import React, { useState, useEffect } from "react";
import { stockCountService } from "../../../utils/services/stats";
import { _notification } from "../../../utils/_helpers";

export default props => {
	const [products, setProducts] = useState([]);
	const [minQuantity, setMinQuant] = useState(10);

	useEffect(() => {
		(async () => {
			try {
				const res = await stockCountService({
					minQuantity
				});
				if (res.success) {
					setProducts(res.products);
				} else {
					_notification("error", "Error", res.message);
				}
			} catch (err) {
				_notification("error", "Error", err.message);
			}
		})();
	}, [minQuantity]);

	return (
		<>
			<h4>
				<b>Stock Alert</b>
				<span
					className="form-inline"
					style={{ float: "right", fontSize: 12 }}
				>
					<label>Minimum Quantity</label>
					<select
						className="form-control ml-2"
						onChange={e => setMinQuant(e.target.value)}
						style={{ fontSize: 12 }}
					>
						<option value="10">10</option>
						<option value="20">20</option>
						<option value="30">30</option>
					</select>
				</span>
			</h4>
			<table className="table table-hover">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col">Name</th>
						<th scope="col">Category</th>
						<th scope="col">Quantity</th>
						<th scope="col">Manufacturer</th>
					</tr>
				</thead>
				<tbody>
					{products
						? products.map((product, idx) => (
								<tr key={product._id}>
									<th scope="row">{++idx}</th>
									<td>{product.name}</td>
									<td>{product.category}</td>
									<td>{product.quantity}</td>
									<td>{product.manufacturer}</td>
								</tr>
						  ))
						: null}
				</tbody>
			</table>
		</>
	);
};
