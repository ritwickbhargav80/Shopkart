import React, { useState } from "react";

export default props => {
	const [name, setName] = useState("");
	const [category, setCategory] = useState("");
	const [weight, setWeight] = useState("");
	const [mfdDate, setMfgDate] = useState("");
	const [expDate, setExpDate] = useState("");
	const [price, setPrice] = useState("");
	const [discount, setDiscount] = useState("");
	const [quantity, setQuantity] = useState("");
	const [mfg, setMfg] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = e => {};

	return (
		<>
			<form onSubmit={handleSubmit}>
				<div className="row">
					<div className="col-md-6">
						<div className="form-group">
							<label>Product Name</label>
							<input
								type="text"
								className="form-control"
								onChange={e => setName(e.target.value)}
								required={true}
							/>
						</div>
					</div>

					<div className="col-md-6">
						<div className="form-group">
							<label>Product Category</label>
							<input
								type="text"
								className="form-control"
								onChange={e => setCategory(e.target.value)}
								required={true}
							/>
						</div>
					</div>
					<div className="col-md-6">
						<div className="form-group">
							<label>Product Weight</label>
							<input
								type="text"
								className="form-control"
								onChange={e => setWeight(e.target.value)}
								required={true}
							/>
						</div>
					</div>
					<div className="col-md-6">
						<div className="form-group">
							<label>Product Price</label>
							<input
								type="text"
								className="form-control"
								onChange={e => setPrice(e.target.value)}
								required={true}
							/>
						</div>
					</div>
					<div className="col-md-6">
						<div className="form-group">
							<label>Product Discount</label>
							<input
								type="number"
								className="form-control"
								onChange={e => setDiscount(e.target.value)}
								required={true}
							/>
						</div>
					</div>
					<div className="col-md-6">
						<div className="form-group">
							<label>Product Quantity</label>
							<input
								type="number"
								className="form-control"
								onChange={e => setQuantity(e.target.value)}
								required={true}
							/>
						</div>
					</div>
					<div className="col-md-6">
						<div className="form-group">
							<label>Manufacturing Date</label>
							<input
								type="date"
								className="form-control"
								onChange={e => setMfg(e.target.value)}
								required={true}
							/>
						</div>
					</div>
					<div className="col-md-6">
						<div className="form-group">
							<label>Expiration Date</label>
							<input
								type="date"
								className="form-control"
								onChange={e => setExpDate(e.target.value)}
								required={true}
							/>
						</div>
					</div>

					<div className="col-md-6">
						<div className="form-group pb-0 mb-0 mt-4">
							<button
								className="btn btn-primary login-form-button"
								// loading={isLoading}
								disabled={isLoading}
							>
								<div
									hidden={!isLoading}
									className="spinner-border spinner-border-sm text-light"
									role="status"
								>
									<span className="sr-only">Loading...</span>
								</div>
								<span hidden={isLoading}>Add Product</span>
							</button>
						</div>
					</div>
				</div>
			</form>
		</>
	);
};
