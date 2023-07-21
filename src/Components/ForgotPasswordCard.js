// import loginBg from "../images/loginBg.jpeg";
import loginBg from "../images/loginBg.jpg";
import { Link } from "react-router-dom";
import { supabase } from "../supabase-client";
import { InfoCircleOutlined, UserOutlined } from "@ant-design/icons";
import { Input, Tooltip, Form, Button, message } from "antd";
import { useState } from "react";

function ForgotPasswordCard() {
  const [isHovered, setIsHovered] = useState(false);
  const hoverStyle = {
    color: isHovered ? "#430f58" : "#6643b5",
  };

  const [email, setEmail] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:3000/update-password",
      });
      if (error) throw error;
      message.success("Password recovery email has been sent!");
    } catch (error) {
      message.error(error.error_description || error.message);
    }
  }

  return (
    <div
      className="forgotpw-container"
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `url(${loginBg}) no-repeat fixed`,
        backgroundSize: "cover",
        padding: "0",
        margin: "0",
      }}
    >
      <div
        className="forgotpw-card"
        style={{
          backgroundColor: "#f0f2f5",
          height: "auto",
          width: "40%",
          marginTop: "50px",
          marginBottom: "50px",
          marginLeft: "0",
          marginRight: "0",
          padding: "0",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
          boxShadow: "6px 6px 6px rgba(0, 0, 0, 0.2)",
          padding: "20px",
          borderRadius: "10px",
          opacity: "0.95",
          overflow: "auto",
          maxWidthL: "100%",
        }}
      >
        <Form
          style={{
            maxWidth: 800,
            marginBottom: "10px",
          }}
        >
          <h1 style={{ textAlign: "center" }}>Forgot Password</h1>
          <p style={{ textAlign: "center" }}>
            Enter your email address and we will send you a link to reset your
            password.
          </p>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
              {
                type: "email",
                message: "Please enter a valid email address!",
              },
            ]}
          >
            <Input
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              placeholder="Enter your email"
              suffix={
                <Tooltip title="email@domain.com">
                  <InfoCircleOutlined
                    style={{
                      color: "rgba(0,0,0,.45)",
                    }}
                  />
                </Tooltip>
              }
            />
          </Form.Item>
          <Form.Item
            style={{
              textAlign: "center",
              width: "100%",
            }}
          >
            <Button type="primary" htmlType="submit" onClick={handleSubmit}>
              Send Reset Link
            </Button>
          </Form.Item>
        </Form>
        <Link
          to="/login"
          style={hoverStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default ForgotPasswordCard;
