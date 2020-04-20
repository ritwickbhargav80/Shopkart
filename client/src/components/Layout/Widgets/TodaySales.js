import React, { PureComponent } from "react";
import {
	BarChart,
	Bar,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip
} from "recharts";

import { getTodaySalesService } from "../../../utils/services/stats";
import { _notification } from "../../../utils/_helpers";

export default class Example extends PureComponent {
	state = {
		data: [],
		isLoading: true
	};

	componentDidMount() {
		(async () => {
			try {
				const res = await getTodaySalesService();
				if (res.success) {
					res.products.products.map(pr => {
						return this.setState({
							data: [
								...this.state.data,
								{ name: pr.productName, quantity: pr.quantity }
							]
						});
					});
				} else {
					_notification("error", "Error", res.message);
				}
				this.setState({ isLoading: false });
			} catch (err) {
				this.setState({ isLoading: false });
				_notification("error", "Error", err.message);
			}
		})();
	}

	render() {
		return (
			<>
				<div
					hidden={!this.state.isLoading}
					className="spinner-border spinner-border-sm text-primary mx-auto my-auto"
					role="status"
				>
					<span className="sr-only">Loading...</span>
				</div>
				<BarChart width={360} height={136} data={this.state.data}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="name" />
					<YAxis />
					<Tooltip />
					{/* <Legend /> */}
					<Bar dataKey="quantity" fill="#4285F4" />
				</BarChart>
			</>
		);
	}
}
