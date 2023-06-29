import { Outlet, useLocation } from "react-router-dom";
import { Button, Layout, theme, Image } from 'antd';
import { useEffect, useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import './AgentHome.css'
import Sidebar from '../../Components/SideBar'

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
        localStorage.setItem('navbarTitle', "Dashboard");
        break;
      case '/agent/roomRental':
        setTitle('Room Rental Post')
        localStorage.setItem('navbarTitle', "Room Rental Post");
        break;
      case '/agent/appointment':
        setTitle('Appointment')
        localStorage.setItem('navbarTitle', "Appointment");
        break;
      case '/agent/rentalAgreement':
        setTitle('Rental Agreement')
        localStorage.setItem('navbarTitle', "Rental Agreement");
        break;
      case '/agent/profile':
        setTitle('Profile')
        localStorage.setItem('navbarTitle', "Profile");
        break;
    }
  }

  useEffect(() => {
    const savedTitle = localStorage.getItem('navbarTitle'); // Retrieve the saved title from localStorage
    if (savedTitle) {
      setTitle(savedTitle);
    }
  }, [location.pathname]);


  return <>

    <Layout>

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
            minHeight: 280,
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