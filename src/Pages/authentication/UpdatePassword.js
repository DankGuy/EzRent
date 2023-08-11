import updateBg from "../../images/updateBg.jpg";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabase-client";
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
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 24,
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
        backgroundColor: "#FFFFFF",
        minHeight: "100vh",
        maxWidth: "100vw",
        height: "auto",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0",
        margin: "0",
      }}
    >
      <div
        className="forgotpw-card"
        style={{
          height: "auto",
          width: "50vw",
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
            maxWidth: "81%",
            marginBottom: "10px",
            width: "100%",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
          {...formItemLayout}
        >
          <h1 style={{ textAlign: "center" }}>Update Password</h1>

          <Form.Item name="email" initialValue={email}>
            <Input
              disabled
              suffix={
                <Tooltip title={email}>
                  <InfoCircleOutlined
                    style={{
                      color: "rgba(0,0,0,.45)",
                    }}
                  />
                </Tooltip>
              }
              style={{
                width: "25vw",
                background: "white",
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
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
            <Input.Password onChange={handleChange} style={{
              width: "25vw",
            }}
              placeholder="Enter your new password"
            />
          </Form.Item>

          <Form.Item style={{ display: "flex", justifyContent: "center" }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: "#0062D1",
                borderColor: "#0062D1",
                marginTop: "5px",
                width: "20vw",
                fontSize: "1.2rem",
                height: "auto",
              }}
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
      <div
        style={{
          height: "100vh",
          maxHeight: "100vh",
          width: "55vw",
          backgroundImage: `url(${updateBg})`,
          backgroundSize: "50vw 100vh",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
    </div>
  );
}

export default ForgotPasswordCard;
