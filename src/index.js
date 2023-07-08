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
import AgentCreatePost from "./Pages/agent/RoomRentalPost/AgentCreatePost";
import AgentRoomRental from "./Pages/agent/RoomRentalPost/AgentRoomRental";
import AgentAppointment from "./Pages/agent/AgentAppointment";
import AgentRentalAgreement from "./Pages/agent/AgentRentalAgreement";
import AgentRoomRentalPost from "./Pages/agent/RoomRentalPost/AgentRoomRentalPost";
import { supabase } from "./supabase-client";
import { useState, useEffect } from "react";
import AppointmentDetails from "./Pages/agent/Appointment/AppointmentDetails";
import StudentAppointmentDetails from "./Pages/student/profile/StudentAppointmentDetails";

const root = ReactDOM.createRoot(document.getElementById("root"));

const App = () => {

  const [userType, setUserType] = useState("");

  async function getUserMetadata() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user.user_metadata;
  }

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        getUserMetadata().then((res) => {
          setUserType(res.userType)
          // console.log(res.userType)
        });
        
      }
    });
  }, []);


  const userTypeRoutes = () => {
    if (userType === "agent") {
        return (
          <>
          <Route path="/agent/" element={<AgentLayout />}>
            <Route index element={<AgentHome />} />
            <Route path="profile" element={<AgentProfile />} />
            <Route
              path="roomRental/createNewPost"
              element={<AgentCreatePost />}
            />
            <Route path="roomRental" element={<AgentRoomRental />} />
            <Route path="appointment" element={<AgentAppointment />} />
            <Route path="appointment/:id" element={<AppointmentDetails />} />
            <Route path="rentalAgreement" element={<AgentRentalAgreement />} />
            <Route
              path="roomRental/editPost/:id"
              element={<AgentRoomRentalPost />}
            />
            <Route
              path="roomRental/viewPost/:id"
              element={<AgentRoomRentalPost />}
            />
          </Route>
          </>
        );
    } else if (userType === "student") {

      return (
        <>
          <Route path="/student/" element={<StudentLayout />}>
            <Route index element={<Home />} />
            <Route path="roomRental" element={<RoomRental />} />
            <Route path="roommate" element={<Roommate />} />
            <Route path="aboutUs" element={<AboutUs />} />
            <Route path="/student/profile/" element={<Profile />}>
              <Route path="profileInformation" element={<ProfileInformation />}/>
              <Route path="paymentMethods" element={<PaymentMethods />} />
              <Route path="rentalPayment" element={<RentalPayment />} />

              <Route path="appointments" element={<Appointments />} />
              <Route path="appointments/:id" element={<StudentAppointmentDetails />} />
              <Route path="rentalAgreement" element={<RentalAgreement />} />
              <Route path="editProfile" element={<EditProfile />} />
            </Route>
            <Route path="roomRental/:id" element={<RoomRentalPost />} />
          </Route>
        </>
      );
    }
  };

  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          {/* Authentication routes */}
          <Route path="/" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<SignupCard />} />
          <Route path="/forgot-password" element={<ForgotPasswordCard />} />
          <Route path="/update-password" element={<UpdatePasswordCard />} />
          
          {userTypeRoutes()}

          {/* 404 Not Found route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
};

root.render(<App />);
