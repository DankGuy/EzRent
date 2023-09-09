import { Button } from "antd";
import loginBg from "../../images/loginBg.jpg";
import { Form, Input, Tooltip, message, Radio } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabase-client";
import { InfoCircleOutlined } from "@ant-design/icons";
import "./auth.css";
import { useAuth } from "../../context/AuthProvider";
// import { NavigateHomePage } from "./navigateHomePage";

function LoginCard() {
  const [isHoveredForgot, setIsHoveredForgot] = useState(false);
  const [isHoveredSignup, setIsHoveredSignup] = useState(false);


  const [isReady, setIsReady] = useState(true);


  const { userSession, auth } = useAuth();

  const navigate = useNavigate();


  // useEffect(() => {
  //   if (auth === true) {
  //     if (userSession?.user.user_metadata.userType === "agent") {
  //       navigate("/agent");
  //     } else if (userSession?.user.user_metadata.userType === "student") {
  //       navigate("/student");
  //     }
  //   } 

  //   setIsReady(true);

  // }, [auth, userSession]);

  const hoverStyleForgot = {
    color: isHoveredForgot ? "#430f58" : "#6643b5",

  };
  const hoverStyleSignUp = {
    color: isHoveredSignup ? "#430f58" : "#6643b5",
  };

  const fontFamily = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'";


  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  function handleChange(e) {
    setFormData(() => ({ ...formData, [e.target.name]: e.target.value }));
  }

  async function handleSubmit() {
    try {
      const {
        data: { user, session },
        error,
      } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) throw error;

      if (user && session) {
        if (user.user_metadata.userType === "agent") {
          let { data: agentData, error } = await supabase
            .from("agent")
            .select("*")
            .eq('agent_id', user.id);
          if (error) {
            console.log("error", error);
          }
          else {
            if (agentData[0].account_status === false) {
              // const { error } = await supabase.auth.signOut();
              message.error("Your account is deactivated. Please contact admin for assistance.");
              // navigate("/login");
            }
            else {
              localStorage.setItem("selectedKey", "/agent");
              navigate("/agent");
            }
          }
        } else if (user.user_metadata.userType === "student") {
          localStorage.setItem(
            "selectedKey",
            "/student/profile/profileInformation"
          );
          navigate("/student");
        }
      }
    } catch (error) {
      message.error(error.error_description || error.message);
    }
  }

  return (
    <>{isReady &&
      <div
        className="login-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0",
          background: "rgb(255,255,255)",
          maxHeight: "100vh",
          maxWidth: "100vw",
        }}
      >
        <div
          style={{
            height: "100vh",
            maxHeight: "100vh",
            width: "55vw",
            backgroundImage: `url(${loginBg})`,
            backgroundSize: "55vw 100vh",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>

        <div
          className="login-card"
          style={{
            backgroundColor: "#FFFFFF",
            height: "60vh",
            width: "45vw",
            maxWidth: "500px",
            maxHeight: "100vh",
            margin: "0",
            padding: "0",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
            padding: "20px",
            borderRadius: "10px",
            opacity: "0.9",
          }}
        >
          <Form
            className="login-form"
            name="basic"
            wrapperCol={{
              span: 24,
            }}
            style={{
              maxWidth: 800,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={handleSubmit}
          >
            <h1 style={{ textAlign: "center", fontSize: "2rem" }}>
              Hi, <br /> Welcome Back!{" "}
            </h1>
            <Form.Item className="emailInput" style={{ width: "100%" }}>
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

            <Form.Item name="password">
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

            <Form.Item style={{ display: "flex", justifyContent: "center" }}>
              <Button
                type="primary"
                className="loginButton"
                block
                style={{
                  width: "22.5vw",
                  fontSize: "1.2rem",
                  height: "auto",
                  backgroundColor: "#0062D1",
                  borderColor: "#0062D1",
                }}
                htmlType="submit"
              >
                Login
              </Button>
            </Form.Item>
          </Form>

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
              <span style={{ fontFamily: fontFamily }}>Forgot password?</span>
            </Link>
          </p>
          <p>
            <Link
              to="/signup"
              style={hoverStyleSignUp}
              onMouseEnter={() => setIsHoveredSignup(true)}
              onMouseLeave={() => setIsHoveredSignup(false)}
            >
              <span style={{ fontFamily: fontFamily }}>Don't have an account? Sign up here!</span>
            </Link>
          </p>
        </div>
      </div>
    }</>
  );
}

export default LoginCard;
