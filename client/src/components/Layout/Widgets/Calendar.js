import React from "react";
import { Calendar } from "antd";
import "./style.css";

export default props => {
	function onPanelChange(value, mode) {
		console.log(value, mode);
	}
	return (
		<>
			<div className="site-calendar-demo-card">
				<Calendar fullscreen={false} onPanelChange={onPanelChange} />
			</div>
		</>
	);
};
