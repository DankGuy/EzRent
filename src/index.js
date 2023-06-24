import React from 'react';
import ReactDOM from 'react-dom/client';
import AuthPage from './Pages/Authentication/AuthPage';
import SignupCard from './Components/SignUpCard';
import ForgotPasswordCard from './Components/ForgotPasswordCard';
import UpdatePasswordCard from './Components/UpdatePasswordCard';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from './Pages/student/Home'
import RoomRental from './Pages/student/RoomRental'
import Roommate from './Pages/student/Roommate'
import AboutUs from './Pages/student/AboutUs'
import Profile from './Pages/student/Profile'
import NavBar from './Components/NavBar'
import RoomRentalPost from './Pages/student/RoomRentalPost'
import AgentHome from './Pages/agent/AgentHome'
import { Button, Layout, Menu, theme, Image } from 'antd';
import { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

import './Pages/agent/AgentHome.css'


import AgentAppointment from './Pages/agent/AgentAppointment'
import AgentProfile from './Pages/agent/AgentProfile'
import AgentRoomRental from './Pages/agent/AgentRoomRental'
import AgentRentalAgreement from './Pages/agent/AgentRentalAgreement'
import Sidebar from './Components/SideBar'
import AgentCreatePost from './Pages/agent/AgentCreatePost'


const root = ReactDOM.createRoot(document.getElementById('root'));



const App = () => {

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

  return (
<React.StrictMode>
    <BrowserRouter>
      <>
      
      
      
      
      
      
          
      {/* Authentication */}
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<SignupCard />} />
        <Route path='/forgot-password' element={<ForgotPasswordCard />} />
        <Route path='/update-password' element={<UpdatePasswordCard />} />
      </Routes>




      {/* student */}
      {/* <NavBar />

      <Routes>
        <Route path="/student/" element={<Home />} />
        <Route path="/student/roomRental" element={<RoomRental />}>
        </Route>
        <Route path="/student/roommate" element={<Roommate />} />
        <Route path="/student/aboutUs" element={<AboutUs />} />
        <Route path="/student/profile" element={<Profile />} />
        <Route path="/student/roomRental/:id" element={<RoomRentalPost />} />
      </Routes> */}


      {/* Agent */}

      {/* <Layout>
            <Sidebar value={collapsed} onChange={handleCollapsed} setTitle={handleTitle} />

            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                        display: 'flex',
                        justifyContent: 'space-between'
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
                    <h1 style={{ display: 'block', margin: '0 auto', marginInlineStart: '0px', fontSize:'20px' }}>{title}</h1>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                    }}
                >
                    <Routes>
                        <Route path="/agent/" element={<AgentHome />} />
                        <Route path="/agent/profile" element={<AgentProfile />}>
                        </Route>
                        <Route path="/agent/roomRental" element={<AgentRoomRental />} />
                        <Route path="/agent/roomRental/createNewPost" element={<AgentCreatePost />} />
                        <Route path="/agent/appointment" element={<AgentAppointment />} />
                        <Route path="/agent/rentalAgreement" element={<AgentRentalAgreement />} />
                    </Routes>
                </Content>
            </Layout>
        </Layout> */}

      
      </>


    </BrowserRouter>
  </React.StrictMode>
  )
}

root.render(
  
  <App/>
);


