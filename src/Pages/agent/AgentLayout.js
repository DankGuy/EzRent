import { Outlet, useLocation } from "react-router-dom";
import { Button, Layout, theme, Image } from 'antd';
import { useEffect, useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import './AgentHome.css'
import Sidebar from '../../Components/SideBar'
import { supabase } from "../../supabase-client";

function AgentLayout() {

  const { Header, Content } = Layout;
  const location = useLocation();


  const [collapsed, setCollapsed] = useState(false);
  const [title, setTitle] = useState('Dashboard');

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  const handleTitle = (newTitle) => {
    switch (newTitle) {
      case '/agent':
        setTitle('Dashboard')
        break;
      case '/agent/roomRental':
        setTitle('Post Listing')
        break;
      case '/agent/appointment':
        setTitle('Appointment')
        break;
      case '/agent/rentalAgreement':
        setTitle('Rental Agreement')
        break;
      case '/agent/profile':
        setTitle('Profile')
        break;
      case '/agent/rentedProperty':
        setTitle('Rented Property')
    }
  }

  useEffect(() => {
    handleTitle(location.pathname);
  }, [location.pathname]);


  return <>

    <Layout className="agentLayout" >

      <Sidebar value={collapsed} onChange={handleCollapsed} setTitle={handleTitle} />

      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'space-between',
            marginLeft: (!collapsed ? '250px' : '110px'),
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={handleCollapsed}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <h1 style={{ display: 'block', margin: '0 auto', marginInlineStart: '0px', fontSize: '20px' }}>{title}</h1>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: "80vh",
            marginLeft: (!collapsed ? '250px' : '110px'),
            background: colorBgContainer,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  </>
}

export default AgentLayout;