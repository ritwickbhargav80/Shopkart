import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
// import logo from "../../utils/assets/images/logo-black.svg";
// import useInputState from "../../hooks/useInputState";
import "./style.css";
import { _notification } from "../../utils/_helpers";
import { loginService } from "../../utils/services/auth";

const Login = props => {
	const [email, updateEmail] = useState("");
	const [password, updatePassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [form] = Form.useForm();

	useEffect(() => {
		form.setFieldsValue({
			email,
			password
		});
		if (localStorage.getItem("token")) {
			props.history.push("/");
		}
	}, []);

	const handleSubmit = e => {
		e.preventDefault();
		setIsLoading(true);

		props.form.validateFields(async (err, values) => {
			if (!err) {
				try {
					const data = { email, password };
					const res = await loginService(data);

					if (res.error) {
						_notification("error", "Error", res.message);
						updatePassword("");
					} else if (res.res.message === "success") {
						const { role, _id } = res.res.data;
						localStorage.setItem("role", role);
						localStorage.setItem("user_id", _id);
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
			} else {
				setIsLoading(false);
			}
		});
	};

	return (
		<div style={{ height: "100vh", overflow: "hidden" }}>
			<h2 className="brand-logo">Shopkart</h2>
			{/* <img src={logo} width={160} className="vidgyor-logo" alt="" /> */}
			<Card title="Log in to your account" className="login-form-wrapper">
				<Form
					form={form}
					onSubmit={handleSubmit}
					className="login-form"
				>
					<Form.Item
						rules={[
							{
								type: "email",
								required: true,
								message: "Please input your email!"
							}
						]}
					>
						<Input
							prefix={
								<UserOutlined
									style={{ color: "rgba(0,0,0,.25)" }}
								/>
							}
							type="email"
							placeholder="Email"
							onChange={e =>
								updateEmail(e.target.value.toLowerCase())
							}
						/>
					</Form.Item>
					<Form.Item
						rules={[
							{
								required: true,
								message: "Please input your Password!"
							}
						]}
					>
						<Input.Password
							prefix={
								<LockOutlined
									style={{ color: "rgba(0,0,0,.25)" }}
								/>
							}
							type="password"
							placeholder="Password"
							onChange={e => updatePassword(e.target.value)}
						/>
					</Form.Item>
					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							className="login-form-button"
							loading={isLoading}
						>
							Log in
						</Button>

						{/* <Divider />
						<Link to="/signup">Create an account!</Link>
						<Link
							className="login-form-forgot"
							to="/forgot-password"
						>
							Forgot password?
						</Link> */}
					</Form.Item>
				</Form>
			</Card>
			<p style={{ textAlign: "center", marginTop: 12 }}>
				Don't have an account? Contact our support
			</p>
		</div>
	);
};

export default Login;
