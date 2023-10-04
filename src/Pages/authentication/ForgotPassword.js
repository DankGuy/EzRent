import ForgotpwBg from "../../images/forgotpwBg.jpg";
import { Link } from "react-router-dom";
import { supabase } from "../../supabase-client";
import { InfoCircleOutlined, UserOutlined } from "@ant-design/icons";
import { Input, Tooltip, Form, Button, message } from "antd";
import { useState } from "react";

function ForgotPasswordCard() {
  const [isHovered, setIsHovered] = useState(false);
  const hoverStyle = {
    color: isHovered ? "#430f58" : "#6643b5",
  };
  const fontFamily = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'";


  const [email, setEmail] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "https://ez-rent.vercel.app//update-password",
      });
      if (error) throw error;
      message.success("Password recovery email has been sent!");

      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
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
        backgroundColor: "#ffffff",
        padding: "0",
        margin: "0",
      }}
    >
      <div
        style={{
          height: "100vh",
          maxHeight: "100vh",
          width: "55vw",
          backgroundImage: `url(${ForgotpwBg})`,
          backgroundSize: "55vw 100vh",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
      <div
        className="forgotpw-card"
        style={{
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
          padding: "20px",
          overflow: "auto",
          maxWidth: "100%",
        }}
      >
        <Form
          style={{
            maxWidth: "25vw",
            marginBottom: "10px",
          }}
        >
          <h1 style={{ textAlign: "center" }}>Forgot Password</h1>
          <p style={{ textAlign: "center" }}>
            Enter your email address and we will send you a link to reset your
            password.
          </p>

          <Form.Item
            style={{
              textAlign: "center",
              width: "100%",
            }}
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
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  backgroundColor: "#0062D1",
                  borderColor: "#0062D1",
                  marginTop: "5px",
                  width: "25vw",
                  fontSize: "1.2rem",
                  height: "auto",
                }}
                onClick={handleSubmit}
              >
                Send Reset Link
              </Button>
            </Form.Item>
          </Form.Item>
        </Form>
        <Link
          to="/login"
          style={hoverStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <span style={{ fontFamily: fontFamily }}>
            Back to Login
          </span>
        </Link>
      </div>
    </div>
  );
}

export default ForgotPasswordCard;
