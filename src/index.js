import React from "react";
import ReactDOM from "react-dom/client";
import AuthPage from "./Pages/Authentication/AuthPage";
import SignupCard from "./Components/SignUpCard";
import ForgotPasswordCard from "./Components/ForgotPasswordCard";
import UpdatePasswordCard from "./Components/UpdatePasswordCard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AgentLayout from "./Pages/agent/AgentLayout";
import StudentLayout from "./Pages/student/StudentLayout";
import NotFound from "./Pages/Result/NotFound";
import Home from "./Pages/student/Home";
import RoomRental from "./Pages/student/roomRental/RoomRental";
import Roommate from "./Pages/student/roommate/Roommate";
import AboutUs from "./Pages/student/AboutUs";
import Profile from "./Pages/student/Profile";
import ProfileInformation from "./Pages/student/profile/ProfileInformation";
import PaymentMethods from "./Pages/student/profile/PaymentMethods";
import RentalPayment from "./Pages/student/profile/RentalPayment";
import Appointments from "./Pages/student/profile/Appointments";
import RentalAgreement from "./Pages/student/profile/RentalAgreement";
import EditProfile from "./Pages/student/profile/EditProfile";
import RoomRentalPost from "./Pages/student/roomRental/RoomRentalPost";
import AgentHome from "./Pages/agent/AgentHome";
import AgentProfile from "./Pages/agent/AgentProfile";
import AgentEditProfile from "./Pages/agent/Profile/EditProfile";
import AgentCreatePost from "./Pages/agent/RoomRentalPost/AgentCreatePost";
import AgentRoomRental from "./Pages/agent/RoomRentalPost/AgentRoomRental";
import AgentAppointment from "./Pages/agent/AgentAppointment";
import AgentRentalAgreement from "./Pages/agent/AgentRentalAgreement";
import AgentRoomRentalPost from "./Pages/agent/RoomRentalPost/AgentRoomRentalPost";
import { supabase } from "./supabase-client";
import { useState, useEffect } from "react";
import AppointmentDetails from "./Pages/agent/Appointment/AppointmentDetails";
import StudentAppointmentDetails from "./Pages/student/profile/StudentAppointmentDetails";
import AuthRoute from "./Components/AuthRoute";
import AuthProvider, { useAuth } from "./context/AuthProvider";
import LoginCard from "./Components/LoginCard";
import App from "./App";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
