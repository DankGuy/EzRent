// import loginBg from "../images/loginBg.jpeg";
import loginBg from "../images/loginBg.jpg";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase-client";
import { InfoCircleOutlined, UserOutlined } from "@ant-design/icons";
import { Input, Tooltip, Form, Button, Spin, message } from "antd";
import { useState, useEffect } from "react";

function ForgotPasswordCard() {
  const [isHovered, setIsHovered] = useState(false);
  const hoverStyle = {
    color: isHovered ? "#430f58" : "#6643b5",
  };

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 8,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 16,
      },
    },
  };

  async function getEmail() {
    const { data, error } = await supabase.auth.getSession();

    console.log(data);
    if (error) {
      // Handle error case
      message.error(error.error_description || error.message);
    } 
    
    if (data.session) {
      // Handle success case
      setEmail(data.session.user.email);
      setIsLoading(false);
    }
  }

  let password;
  function handleChange(e) {
    password = e.target.value;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: password,
      });
      if (error) throw error;
      message.success("Password updated!");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
        
    } catch (error) {
      message.error(error.error_description || error.message);
    }
  }

  useEffect(() => {
    getEmail();
  }, []);

  if (isLoading) {
    return (
      <Spin
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    );
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
          maxWidth: "100%",
        }}
      >
        <Form
          style={{
            maxWidth: "65%",
            marginBottom: "10px",
          }}
          {...formItemLayout}
        >
          <h1 style={{ textAlign: "center" }}>Update Password</h1>

          <Form.Item label="Email" name="email" initialValue={email}>
            <Input
              disabled
              prefix={<UserOutlined className="site-form-item-icon" />}
              suffix={
                <Tooltip title={email}>
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
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
              {
                validator(_, value) {
                  if (
                    (value.length >= 8 &&
                      value.match(
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
                      )) ||
                    value.length === 0
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The password must be at least 8 characters, one uppercase letter, one lowercase letter and one number!"
                    )
                  );
                },
              },
            ]}
            hasFeedback
          >
            <Input.Password onChange={handleChange} />
          </Form.Item>

          <Form.Item style={{ display: "flex", justifyContent: "center" }}>
            <Button
              type="primary"
              htmlType="submit"
              onClick={handleSubmit}
              style={{ width: "300px" }}
            >
              Update Password
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
