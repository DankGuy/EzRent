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
import AdminDashboard from "./Pages/student/admin/AdminDashboard";
import AdminLayout from "./Pages/student/admin/AdminLayout";
import PendingPosts from "./Pages/student/admin/PendingPosts";
import PendingReports from "./Pages/student/admin/PendingReports";
import ActivityLog from "./Pages/student/admin/ActivityLog";

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
import AgentRentedProperty from "./Pages/agent/AgentRentedProperty";
import { supabase } from "./supabase-client";
import { useState, useEffect } from "react";
import AppointmentDetails from "./Pages/agent/Appointment/AppointmentDetails";
import StudentAppointmentDetails from "./Pages/student/profile/StudentAppointmentDetails";
import AuthRoute from "./Components/AuthRoute";
import AuthProvider, { useAuth } from "./context/AuthProvider";
import LoginCard from "./Components/LoginCard";

import NotFoundRed from "./Pages/Result/NotFoundRed";
import NotFoundGreen from "./Pages/Result/NotFoundGreen";
import NotFoundYellow from "./Pages/Result/NotFoundYellow";
import NotFoundBlue from "./Pages/Result/NotFoundBlue";

function App() {
    const { user, userSession } = useAuth();  
    const userTypeRoutes = () => {
        if (user && userSession) {
            if (user.user_metadata.userType === "agent") {
                return (
                    <>
                        <Route path="/agent/" element={<AgentLayout />}>
                            <Route index element={<AgentHome />} />
                            <Route path="rentedProperty" element={<AgentRentedProperty />} />
                            <Route path="profile" element={<AgentProfile />} />
                            <Route path="profile/editProfile" element={<AgentEditProfile />}/>
                            <Route path="roomRental/createNewPost" element={<AgentCreatePost />}/>
                            <Route path="roomRental" element={<AgentRoomRental />} />
                            <Route path="appointment" element={<AgentAppointment />} />
                            <Route path="appointment/:id" element={<AppointmentDetails />} />
                            <Route path="rentalAgreement" element={<AgentRentalAgreement />} />
                            <Route path="roomRental/editPost/:id"element={<AgentRoomRentalPost />}/>
                            <Route path="roomRental/viewPost/:id" element={<AgentRoomRentalPost />}/>
                            <Route path="*" element={<NotFound />} />
                        </Route>
                        <Route path="*" element={<NotFound />} />
                    </>
                );
            } else if (user.user_metadata.userType === "student") {
                return (
                    <>
                        <Route path="/student" element={<StudentLayout />}>
                            <Route index element={<Home />} />
                            <Route path="roomRental" element={<RoomRental />} />
                            <Route path="roommate" element={<Roommate />} />
                            <Route path="aboutUs" element={<AboutUs />} />

                            <Route path="/student/admin/" element={<AdminLayout />}>
                                <Route index element={<AdminDashboard />} />
                                <Route path="pendingPosts" element={<PendingPosts />} />
                                <Route path="pendingPosts" element={<PendingPosts />} />
                                <Route path="pendingReports" element={<PendingReports />} />
                                <Route path="activityLog" element={<ActivityLog />} />
                            </Route>

                            <Route path="/student/profile/" element={<Profile />}>
                                <Route
                                    path="profileInformation"
                                    element={<ProfileInformation />}
                                />
                                <Route path="paymentMethods" element={<PaymentMethods />} />
                                <Route path="rentalPayment" element={<RentalPayment />} />

                                <Route path="appointments" element={<Appointments />} />
                                <Route
                                    path="appointments/:id"
                                    element={<StudentAppointmentDetails />}
                                />
                                <Route path="rentalAgreement" element={<RentalAgreement />} />
                                <Route path="editProfile" element={<EditProfile />} />
                            </Route>
                            <Route path="roomRental/:id" element={<RoomRentalPost />} />
                            <Route path="*" element={<NotFound />} />
                        </Route>
                        <Route path="*" element={<NotFound />} />
                    </>
                );
            }
        }
    };

    return (
        <Routes>
            {/* Authentication routes */}
            <Route element={<AuthRoute />} />

            {userTypeRoutes()}

            <Route path="/signup" element={<SignupCard />} />
            <Route path="/login" element={<LoginCard />} />
            <Route path="/forgot-password" element={<ForgotPasswordCard />} />
            <Route path="/update-password" element={<UpdatePasswordCard />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<LoginCard />} />
            {/* <Route path="*" element={<NotFound />} /> */}

            {/* 404 Not Found route */}
        </Routes>
    );
}

export default App;