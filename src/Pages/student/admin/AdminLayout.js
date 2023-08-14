import AdminSideBar from "../../../Components/AdminSideBar";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FlagOutlined,
  AuditOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Button } from "antd";
import { useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { MdOutlineDashboard } from 'react-icons/md'

const { Header, Content, Sider } = Layout;

function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedAdminKey, setSelectedAdminKey] = useState("");
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("selectedAdminKey", "/student/admin/");
    const storedKey = localStorage.getItem("selectedAdminKey");
    if (storedKey) {
      setSelectedAdminKey(storedKey);
      navigate(storedKey);
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
      case "/student/admin/":
        setTitle("Dashboard");
        break;
      case "/student/admin/pendingPosts":
        setTitle("Pending Posts");
        break;
      case "/student/admin/pendingReports":
        setTitle("Pending Reports");
        break;
      case "/student/admin/activityLog":
        setTitle("Activity Log");
        break;
    }
  };

  const navigate = useNavigate();

  return (
    <>
      <div className="adminLayout" style={{ marginTop: "20px" }}>
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
              top: "100",
              height: "100%",
              zIndex: "1001",
            }}
          >
            <Menu
              onClick={({ key }) => {
                navigate(key);
                setSelectedAdminKey(key);
                localStorage.setItem("selectedAdminKey", key);
                handleTitle(key);
              }}
              style={{
                backgroundColor: "#d5def5",
                height: "100%",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
              }}
              theme="light"
              mode="inline"
              defaultSelectedKeys={["/student/admin/"]}
              selectedKeys={[selectedAdminKey]}
              items={[
                {
                  label: "Dashboard",
                  key: "/student/admin/",
                  icon: <MdOutlineDashboard style={{ width: '25px', height: 'auto' }} />,
                  style: {
                    marginTop: "15px",
                  },
                },
                {
                  label: "Pending Posts",
                  key: "/student/admin/pendingPosts",
                  icon: <AuditOutlined style={{ fontSize: '25px' }} />,
                },
                {
                  label: "Pending Reports",
                  key: "/student/admin/pendingReports",
                  icon: <FlagOutlined style={{ fontSize: '25px' }} />,
                },
                {
                  label: "Activity Log",
                  key: "/student/admin/activityLog",
                  icon: <HistoryOutlined style={{ fontSize: '25px' }} />,
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
    </>
  );
}

export default AdminLayout;
