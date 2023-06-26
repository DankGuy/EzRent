import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CreditCardOutlined,
  DollarOutlined,
  ScheduleOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Button } from "antd";
import { useState } from "react";
import React from "react";
import { useEffect } from "react";
import { Routes, Route, useNavigate, Outlet } from "react-router-dom";
import ProfileInformation from "./profile/ProfileInformation";
import PaymentMethods from "./profile/PaymentMethods";
import RentalPayment from "./profile/RentalPayment";
import Appointments from "./profile/Appointments";
import RentalAgreement from "./profile/RentalAgreement";

const { Header, Content, Footer, Sider } = Layout;

function Profile() {
  const [collapsed, setCollapsed] = useState(false);
  const [title, setTitle] = useState("");

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleTitle = (newTitle) => {
    switch (newTitle) {
      case "/student/profile/profileInformation":
        setTitle("Profile Information");
        break;
      case "/student/profile/paymentMethods":
        setTitle("Payment Methods");
        break;
      case "/student/profile/rentalPayment":
        setTitle("Rental Payment");
        break;
      case "/student/profile/appointments":
        setTitle("Appointments");
        break;
      case "/student/profile/rentalAgreement":
        setTitle("Rental Agreement");
        break;
    }
  };

  const navigate = useNavigate();
  return (
    <div style={{ marginTop: "8.5vh" }}>
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          collapsedWidth={90}
          width={220}
          style={{
            position: "fixed",
            left: "0",
            height: "100%",
            zIndex: "100",
          }}
        >
          <div className="demo-logo-vertical" />
          <Menu
            onClick={({ key }) => {
              navigate(key);
              handleTitle(key);
            }}
            style={{
              backgroundColor: "#d5def5",
              height: "100%",
              overflowY: "auto",
            }}
            theme="light"
            mode="inline"
            defaultSelectedKeys={["0"]}
            items={[
              {
                label: "Profile Information",
                key: "/student/profile/profileInformation",
                icon: <UserOutlined />,
              },
              {
                label: "Payment Methods",
                key: "/student/profile/paymentMethods",
                icon: <CreditCardOutlined />,
              },
              {
                label: "Rental Payment",
                key: "/student/profile/rentalPayment",
                icon: <DollarOutlined />,
              },
              {
                label: "Appointments",
                key: "/student/profile/appointments",
                icon: <ScheduleOutlined />,
              },
              {
                label: "Rental Agreement",
                key: "/student/profile/rentalAgreement",
                icon: <SolutionOutlined />,
              },
            ]}
          />
        </Sider>
        <Layout
          style={{
            marginLeft: collapsed ? 90 : 220,
          }}
        >
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
              position: "fixed",
              width: "100%",
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            {title}
          </Header>
          <Content
            style={{
              margin: "100px 16px 24px",
            }}
          >
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
              }}
            >
              <h1
                style={{
                  display: "block",
                  margin: "0 auto",
                  marginInlineStart: "0px",
                  fontSize: "20px",
                }}
              ></h1>
              <Outlet />
            </div>
          </Content>
          <Footer
            style={{
              textAlign: "center",
            }}
          >
            EzRent
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
}

export default Profile;
