import loginBg from "../images/loginBg.jpeg";
import { Button, Form, Input, Select, message } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase-client";

const { Option } = Select;
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
  let userType = null;
  const handleUserChange = (value) => {
    userType = value;
    console.log(userType);
  };

  const formData = {
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
  };

  const [isHovered, setIsHovered] = useState(false);
  const hoverStyle = {
    color: isHovered ? "#430f58" : "#6643b5",
  };

  const signUp = async () => {
    try {
      // signup account
      // the account created will be stored into respective table based on userType using Trigger in Supabase
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

      if (error) throw error;

      // send email confirmation
      alert("Please check your email for confirmation link!");
      window.location.href = "/login";
    } catch (error) {
      message.error(error.error_description || error.message);
    }
  };

  const [form] = Form.useForm();

  const onFinish = (value) => {
    formData.name = value.name;
    formData.email = value.email;
    formData.password = value.password;
    formData.phone = value.prefix + value.phone;
    formData.gender = value.gender;
    console.log(formData.phone);
    signUp();
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle initialValue={"60"}>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="60">+60</Option>
      </Select>
    </Form.Item>
  );

  return (
    <div
      className="signup-container"
      style={{
        height: "auto",
        width: "98.93vw",
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
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
          style={{
            maxWidth: "81%",
            marginBottom: "10px",
          }}
          scrollToFirstError
          colon={false}
        >
          <h1 style={{ textAlign: "center" }}>Sign Up</h1>
          <Form.Item
            name="user-type"
            label="User Type"
            rules={[
              {
                required: true,
                message: "Please select user type!",
              },
            ]}
          >
            <Select
              placeholder="Select your user type"
              onChange={handleUserChange}
              options={[
                {
                  value: "student",
                  label: "Student",
                },
                {
                  value: "agent",
                  label: "Agent",
                },
              ]}
            />
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
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
              {
                validator(_, value) {
                  if (
                    (userType === "student" &&
                      value.includes("@student.tarc.edu.my")) ||
                    value.length === 0 ||
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
                    value.length === 0 ||
                    ((value.length === 9 || value.length === 10) &&
                      value.match(/^[0-9]+$/))
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
              addonBefore={prefixSelector}
              style={{
                width: "100%",
              }}
            />
          </Form.Item>

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
            <Select placeholder="select your gender">
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
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
