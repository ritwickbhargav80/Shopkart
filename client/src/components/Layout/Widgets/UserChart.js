import React, { PureComponent } from "react";
import { PieChart, Pie, Sector, Cell } from "recharts";

import { userCountService } from "../../../utils/services/stats";

// const data = [
// 	{ name: "Group A", value: 400 },
// 	{ name: "Group B", value: 300 },
// 	{ name: "Group C", value: 300 },
// 	{ name: "Group D", value: 200 }
// ];
const COLORS = ["#0088FE", "#FFBB28"];

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default class Example extends PureComponent {
	state = {
		users: {
			active: null,
			all: null
		},
		data: []
	};

	componentDidMount() {
		(async () => {
			const res = await userCountService();
			if (res.success) {
				this.setState({
					users: { active: res.count, all: res.totalCount }
				});
				this.setState({
					data: [
						{
							name: "Active Users",
							value: this.state.users.active
						},
						{
							name: "Non-Active Users",
							value:
								this.state.users.all - this.state.users.active
						}
					]
				});
			}
		})();
	}

	static jsfiddleUrl = "https://jsfiddle.net/alidingling/3Leoa7f4/";

	render() {
		return (
			<PieChart width={200} height={100} onMouseEnter={this.onPieEnter}>
				<Pie
					data={this.state.data}
					cx="60%"
					cy="95%"
					label
					startAngle={180}
					endAngle={0}
					innerRadius={60}
					outerRadius={80}
					fill="#8884d8"
					paddingAngle={5}
					dataKey="value"
				>
					{this.state.data
						? this.state.data.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={COLORS[index % COLORS.length]}
								/>
						  ))
						: null}
				</Pie>
			</PieChart>
		);
	}
}
