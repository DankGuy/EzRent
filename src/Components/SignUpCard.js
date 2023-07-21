// import loginBg from "../images/loginBg.jpeg";
import loginBg from "../images/loginBg.jpg";
import { Button, Form, Input, Select, message, Radio } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase-client";
import "./auth.css";

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: {
      span: 10,
    },
    sm: {
      span: 10,
    },
  },
  wrapperCol: {
    xs: {
      span: 18,
    },
    sm: {
      span: 14,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
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
        if (error) throw error;
      } else {
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
              company: formData.company,
            },
          },
        });
        emailIsTaken = data.user && data.user.identities?.length === 0;
        if (error) throw error;

        message.success("Please check your email for confirmation link!");
        window.location.href = "/login";
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
        minHeight: "100vh",
        height: "auto",
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
        className="signup-card"
        style={{
          backgroundColor: "#f0f2f5",
          height: "auto",
          width: "40%",
          marginTop: "40px",
          marginBottom: "40px",
          marginLeft: "0",
          marginRight: "0",
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
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
          style={{
            maxWidth: "81%",
            marginBottom: "10px",
          }}
          scrollToFirstError
          colon={true}
        >
          <h1 style={{ textAlign: "center" }}>Sign Up</h1>
          <Form.Item name="user-type" label="User Type">
            <Radio.Group onChange={handleUserChange} defaultValue={"student"}>
              <Radio value={"student"} defaultChecked>
                Student
              </Radio>
              <Radio value={"agent"}>Agent</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: "Please input your name!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="E-mail"
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
            <Input />
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
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
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
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
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
            <Input
              style={{
                width: "100%",
              }}
            />
          </Form.Item>

          {isAgent && (
            <Form.Item
              name="company"
              label="Company"
              rules={[
                {
                  required: true,
                  message: "Please input your company name!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          )}

          <Form.Item
            name="gender"
            label="Gender"
            rules={[
              {
                required: true,
                message: "Please select gender!",
              },
            ]}
          >
            <Radio.Group name="gender">
              <Radio value={"Male"}>Male</Radio>
              <Radio value={"Female"}>Female</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" style={{
              width: "50%",
            }}>
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
    </div>
  );
}

export default SignUpCard;
