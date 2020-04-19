import React from "react";

export default props => {
	let { product, idx } = props;
	return (
		<tr key={product._id}>
			<th scope="row">{++idx}</th>
			<td>{product.name}</td>
			<td>{product.category}</td>
			<td>{product.price}</td>
			<td>{product.quantity}</td>
			<td>{new Date(product.manufacturingDate).toDateString()}</td>
			<td>{new Date(product.expirationDate).toDateString()}</td>
			<td>{product.manufacturer}</td>
		</tr>
	);
};
