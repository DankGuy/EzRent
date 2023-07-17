import { Button } from "antd";
import loginBg from "../images/loginBg.jpeg";
import { Form, Input, Tooltip, message } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase-client";
import { InfoCircleOutlined, UserOutlined } from "@ant-design/icons";
import "./auth.css";

function LoginCard(props) {
  const [isHoveredForgot, setIsHoveredForgot] = useState(false);
  const [isHoveredSignup, setIsHoveredSignup] = useState(false);
  const hoverStyleForgot = {
    color: isHoveredForgot ? "#430f58" : "#6643b5",
  };
  const hoverStyleSignUp = {
    color: isHoveredSignup ? "#430f58" : "#6643b5",
  };

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  function handleChange(e) {
    setFormData(() => ({ ...formData, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { data : {user, session}, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) throw error;
      
      if (user && session) {
        if (user.user_metadata.userType === "agent") {
          localStorage.setItem("selectedKey", "/agent");
          window.location.href = "/agent";
        }
        else if (user.user_metadata.userType === "student") {
          localStorage.setItem("selectedKey", "/student/profile/profileInformation");
          // window.location.href = "/student";
          navigate("/student");
        }
      }

    } catch (error) {
      message.error(error.error_description || error.message);
    }
  }
  return (
    <div
      className="login-container"
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `url(${loginBg}) no-repeat`,
        backgroundSize: "cover",
      }}
    >
      <div
        className="login-card"
        style={{
          backgroundColor: "#f0f2f5",
          height: "auto",
          width: "40%",
          margin: "0",
          padding: "0",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
          boxShadow: "6px 6px 6px rgba(0, 0, 0, 0.2)",
          padding: "20px",
          borderRadius: "10px",
          opacity: "0.95",
        }}
      >
        <Form
          className="login-form"
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 800,
          }}
          initialValues={{
            remember: true,
          }}
          autoComplete="off"
        >
          <h1 style={{ textAlign: "center" }}>Login</h1>
          <Form.Item label="Email" className="emailInput">
            <Input
              name="email"
              onChange={handleChange}
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

          <Form.Item label="Password" name="password">
            <Input.Password
              className="passwordInput"
              name="password"
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
            style={{
              marginBottom: 0,
            }}
          ></Form.Item>
        </Form>
        <Button
          type="primary"
          block
          style={{ width: "80%", fontSize: "1.2rem", height: "auto" }}
          onClick={handleSubmit}
        >
          Login
        </Button>

        <p
          style={{
            marginBottom: -5,
          }}
        >
          <Link
            to="/forgot-password"
            style={hoverStyleForgot}
            onMouseEnter={() => setIsHoveredForgot(true)}
            onMouseLeave={() => setIsHoveredForgot(false)}
          >
            Forgot your password?
          </Link>
        </p>
        <p>
          <Link
            to="/signup"
            style={hoverStyleSignUp}
            onMouseEnter={() => setIsHoveredSignup(true)}
            onMouseLeave={() => setIsHoveredSignup(false)}
          >
            Don't have an account? Sign up here!
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginCard;
