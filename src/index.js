import React from 'react';
import ReactDOM from 'react-dom/client';
import AuthPage from './Pages/Authentication/AuthPage';
import SignupCard from './Components/SignUpCard';
import ForgotPasswordCard from './Components/ForgotPasswordCard';
import UpdatePasswordCard from './Components/UpdatePasswordCard';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AgentLayout from './Pages/agent/AgentLayout';
import StudentLayout from './Pages/student/StudentLayout';
import NotFound from './Pages/Result/NotFound';
import Home from './Pages/student/Home';
import RoomRental from './Pages/student/RoomRental';
import Roommate from './Pages/student/Roommate';
import AboutUs from './Pages/student/AboutUs';
import Profile from './Pages/student/Profile';
import RoomRentalPost from './Pages/student/RoomRentalPost';
import AgentHome from './Pages/agent/AgentHome';
import AgentProfile from './Pages/agent/AgentProfile';
import AgentCreatePost from './Pages/agent/AgentCreatePost';
import AgentRoomRental from './Pages/agent/AgentRoomRental';
import AgentAppointment from './Pages/agent/AgentAppointment';
import AgentRentalAgreement from './Pages/agent/AgentRentalAgreement';
import AgentRoomRentalPost from './Pages/agent/AgentRoomRentalPost';

const root = ReactDOM.createRoot(document.getElementById('root'));

const App = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          {/* Authentication routes */}
          <Route path="/" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<SignupCard />} />
          <Route path='/forgot-password' element={<ForgotPasswordCard />} />
          <Route path='/update-password' element={<UpdatePasswordCard />} />

          {/* Student routes */}
          <Route path="/student/" element={<StudentLayout />}>
            <Route index element={<Home />} />
            <Route path="roomRental" element={<RoomRental />} />
            <Route path="roommate" element={<Roommate />} />
            <Route path="aboutUs" element={<AboutUs />} />
            <Route path="profile" element={<Profile />} />
            <Route path="roomRental/:id" element={<RoomRentalPost />} />
          </Route>

          {/* Agent routes */}
          <Route path="/agent/" element={<AgentLayout />}>
            <Route index element={<AgentHome />} />
            <Route path="profile" element={<AgentProfile />} />
            <Route path="roomRental/createNewPost" element={<AgentCreatePost />} />
            <Route path="roomRental" element={<AgentRoomRental />} />
            <Route path="appointment" element={<AgentAppointment />} />
            <Route path="rentalAgreement" element={<AgentRentalAgreement />} />
            <Route path="roomRental/editPost/:id" element={<AgentRoomRentalPost />} />
            <Route path="roomRental/viewPost/:id" element={<AgentRoomRentalPost />} />
          </Route>

          {/* 404 Not Found route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  )
}

root.render(
  <App />
);


