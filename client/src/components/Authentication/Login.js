import React, { useState, useEffect } from "react";
// import { Form, Input, Button, Card } from "antd";
// import { UserOutlined, LockOutlined } from "@ant-design/icons";
// import logo from "../../utils/assets/images/logo-black.svg";
// import useInputState from "../../hooks/useInputState";
import "./style.css";
import { _notification } from "../../utils/_helpers";
import { loginService } from "../../utils/services/auth";

const Login = props => {
	const [email, updateEmail] = useState("");
	const [password, updatePassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	// const [form] = Form.useForm();

	useEffect(() => {
		if (localStorage.getItem("token")) {
			props.history.push("/");
		}
	}, []);

	const handleSubmit = async e => {
		e.preventDefault();
		setIsLoading(true);
		// let err = validateFields();
		// if (!err) {
		try {
			const data = { email, password };
			const res = await loginService(data);

			if (!res.success) {
				_notification("error", "Error", res.message);
				updatePassword("");
			} else if (res.success) {
				localStorage.setItem("token", res.token);
				_notification("success", "Success", "Logged In");
				updateEmail("");
				updatePassword("");
				setTimeout(() => {
					props.history.push("/");
				}, 200);
			}
			setIsLoading(false);
		} catch (err) {
			updatePassword("");
			_notification("error", "Error", err.message);
			setIsLoading(false);
		}
		// } else {
		// 	setIsLoading(false);
		// }
		// });
	};

	return (
		<div style={{ height: "100vh", overflow: "hidden" }}>
			<h2 className="brand-logo">Shopkart</h2>
			<div
				title="Log in to your account"
				className="login-form-wrapper card p-4"
			>
				<form onSubmit={handleSubmit} className="login-form">
					<div className="form-group">
						<input
							type="email"
							className="form-control"
							id="InputEmail1"
							placeholder="Email"
							onChange={e => updateEmail(e.target.value)}
							aria-describedby="emailHelp"
							required={true}
						/>
					</div>

					<div className="form-group">
						<input
							type="password"
							className="form-control"
							id="InputPassword"
							placeholder="Password"
							onChange={e => updatePassword(e.target.value)}
							aria-describedby="passwordHelp"
							required={true}
						/>
					</div>

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
							<span hidden={isLoading}>Login</span>
						</button>
					</div>
				</form>
			</div>
			<p style={{ textAlign: "center", marginTop: 12 }}>
				Don't have an account? Contact our support
			</p>
		</div>
	);
};

export default Login;
