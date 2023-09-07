// import loginBg from "../images/loginBg.jpeg";
import signupBg from "../../images/signupBg.jpg";
import { Button, Form, Input, Select, message, Radio } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabase-client";
import "./auth.css";

const { Option } = Select;
const formItemLayout = {
  wrapperCol: {
    xs: {
      span: 18,
    },
    sm: {
      span: 24,
    },
  },
};

function SignUpCard() {
  const [userType, setUserType] = useState("student");
  const [isAgent, setIsAgent] = useState(false);

  const handleUserChange = (value) => {
    setUserType(value.target.value);
  };

  useEffect(() => {
    if (userType === "student") {
      setIsAgent(false);
    } else if (userType === "agent") {
      setIsAgent(true);
    }
  }, [userType]);

  const formData = {
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    company: "",
  };

  const [isHovered, setIsHovered] = useState(false);
  const hoverStyle = {
    color: isHovered ? "#430f58" : "#6643b5",
  };

  const signUp = async () => {
    let emailIsTaken = false;
    try {
      // signup account
      // the account created will be stored into respective table based on userType using Trigger in Supabase
      if (userType === "student") {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          options: {
            data: {
              userType: userType,
              name: formData.name,
              phone: formData.phone,
              gender: formData.gender,
            },
          },
        });
        // Currently the response of signUp returns a fake user object instead of an error.
        // For now we check the identities object which would be empty if a user already exits.
        emailIsTaken = data.user && data.user.identities?.length === 0;
        if (emailIsTaken) {
          message.error("Email is already taken!");
        }
        if (error) throw error;

        if (!emailIsTaken) {
          message.success("Please check your email for confirmation link!");

          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              userType: userType,
              name: formData.name,
              phone: formData.phone,
              gender: formData.gender,
              company: formData.company,
            },
          },
        });
        emailIsTaken = data.user && data.user.identities?.length === 0;
        if (emailIsTaken) {
          message.error("Email is already taken!");
        }
        if (error) throw error;

        if (!emailIsTaken) {
          message.success("Please check your email for confirmation link!");

          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        }
      }
    } catch (error) {
      message.error(error.error_description ?? error.message);
    }
  };

  const [form] = Form.useForm();

  const onFinish = (value) => {
    formData.name = value.name;
    formData.email = value.email;
    formData.password = value.password;
    formData.phone = value.phone;
    formData.gender = value.gender;
    formData.company = value.company ?? "";
    signUp();
  };

  return (
    <div
      className="signup-container"
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
        className="signup-card"
        style={{
          backgroundColor: "#FFFFFF",
          height: "auto",
          width: "35vw",
          marginTop: "40px",
          marginBottom: "40px",
          marginLeft: "0",
          marginRight: "0",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
          padding: "20px",
          borderRadius: "10px",
          overflow: "auto",
          maxWidth: "100%",
        }}
      >
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
          style={{
            maxWidth: "81%",
            marginBottom: "10px",
            width: "100%",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
          scrollToFirstError
          colon={true}
        >
          <h1 style={{ textAlign: "center" }}>Sign Up</h1>
          <Form.Item name="user-type" className="radioItem">
            <Radio.Group onChange={handleUserChange} defaultValue={"student"}>
              <Radio value={"student"} defaultChecked>
                Student
              </Radio>
              <Radio value={"agent"}>Agent</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your name!",
              },
            ]}
          >
            <Input placeholder="Name" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                message: "The input is not valid e-mail!",
              },
              {
                required: true,
                message: "Please input your e-mail!",
              },
              {
                validator(_, value) {
                  if (
                    (userType === "student" &&
                      (value ?? "").includes("@student.tarc.edu.my")) ||
                    (value ?? "").length === 0 ||
                    userType !== "student"
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Please use tarc student email!")
                  );
                },
              },
            ]}
          >
            <Input placeholder="E-mail" />
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
                    ((value ?? "").length >= 8 &&
                      (value ?? "").match(
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
                      )) ||
                    (value ?? "").length === 0
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
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item
            name="confirm"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The new password that you entered do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm Password" />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              {
                required: true,
                message: "Please input your phone number!",
              },
              {
                validator(_, value) {
                  if (
                    (value ?? "").length === 0 ||
                    (((value ?? "").length === 10 ||
                      (value ?? "").length === 11) &&
                      (value ?? "").match(/^[0-9]+$/))
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The phone number is invalid!")
                  );
                },
              },
            ]}
          >
            <Input placeholder="Phone Number" />
          </Form.Item>

          {isAgent && (
            <Form.Item
              name="company"
              rules={[
                {
                  required: true,
                  message: "Please input your company name!",
                },
              ]}
            >
              <Input placeholder="Company Name" />
            </Form.Item>
          )}

          <Form.Item
            name="gender"
            rules={[
              {
                required: true,
                message: "Please select gender!",
              },
            ]}
            initialValue="Male"
          >
            <Radio.Group name="gender" className="radioItem">
              <Radio value={"Male"}>Male</Radio>
              <Radio value={"Female"}>Female</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item>
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
              Register
            </Button>
          </Form.Item>
        </Form>
        <Link
          to="/login"
          style={hoverStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Already have an account? Login here
        </Link>
      </div>
      <div
        style={{
          height: "100vh",
          maxHeight: "100vh",
          width: "55vw",
          backgroundImage: `url(${signupBg})`,
          backgroundSize: "55vw 100vh",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
    </div>
  );
}

export default SignUpCard;
