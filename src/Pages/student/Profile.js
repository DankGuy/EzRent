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
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

const { Header, Content, Sider } = Layout;

function Profile() {
  const [collapsed, setCollapsed] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedKey, setSelectedKey] = useState("");
  const location = useLocation();

  useEffect(() => {
    const storedKey = localStorage.getItem('selectedKey');
    if (storedKey) {
      setSelectedKey(storedKey);
    }

  }, []);

  useEffect(() => {
    handleTitle(location.pathname);
  }, [location.pathname]);



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
    <div style={{ marginTop: "8.55vh" }}>
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
              setSelectedKey(key);
              localStorage.setItem('selectedKey', key);
              handleTitle(key);
            }}
            style={{
              backgroundColor: "#d5def5",
              height: "100%",
              overflowY: "auto",
            }}
            theme="light"
            mode="inline"
            defaultSelectedKeys={["/student/profile/profileInformation"]}
            selectedKeys={[selectedKey]}
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
              zIndex: "99",
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
            <span
              style={{
                fontSize: "20px",
                marginLeft: "10px",
                color: "black",
              }}
            >
              {title}
            </span>
          </Header>
          <Content
            style={{
              margin: "100px 16px 10px",
              paddingBottom: 70,
              overflow: "auto",
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
        </Layout>
      </Layout>
    </div>
  );
}

export default Profile;
