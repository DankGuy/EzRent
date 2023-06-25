import { Outlet } from "react-router-dom";

import { Button, Layout, theme, Image } from 'antd';
import { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

import './AgentHome.css'

import Sidebar from '../../Components/SideBar'


function AgentLayout(){

    const { Header, Content } = Layout;

    const [collapsed, setCollapsed] = useState(false);
    const [title, setTitle] = useState('');
  
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
          setTitle('Room Rental Post')
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
      }
    }


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
                  marginLeft: (!collapsed? '250px' : '110px'),
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
                  marginLeft: (!collapsed? '250px' : '110px'),
                  background: colorBgContainer,
                }}
              >
                <Outlet/>
              </Content>
            </Layout>
          </Layout>
    </>
}

export default AgentLayout;