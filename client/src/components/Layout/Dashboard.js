import React, { useEffect, useState } from "react";
import { Row, Col, Card, Checkbox, Input } from "antd";

import PageTitle from "./PageTitle";
import "./style.css";
import { DashCards } from "./DashCards";

export default props => {
	return (
		<>
			<div className="dashboard-section">
				{/* <PageTitle title="Dashboard" /> */}
				<div className="sub-components">
					<Row gutter={[16, 16]}>
						<Col span={24}>
							<DashCards />
						</Col>
					</Row>
				</div>
			</div>
		</>
	);
};
