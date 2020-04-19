import React from "react";

export default props => {
	return (
		<div class="form-inline">
			<button type="button" className="btn btn-primary">
				Add Product
			</button>
			<input
				type="text"
				className="form-control ml-4"
				id="InputSearch"
				aria-describedby="inputHelp"
				placeholder="Search Product"
			></input>
		</div>
	);
};
