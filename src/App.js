import React, { useState } from "react";
import Login from "../src/Pages/authentication/Login";
import SignUp from "../src/Pages/authentication/SignUp";
import ForgotPassword from "../src/Pages/authentication/ForgotPassword";
import UpdatePassword from "../src/Pages/authentication/UpdatePassword";
import { Routes, Route, Navigate } from "react-router-dom";
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
import AgentAppointment from "./Pages/agent/Appointment/AgentAppointment";
import AgentRentalAgreement from "./Pages/agent/AgentRentalAgreement";
import AgentRoomRentalPost from "./Pages/agent/RoomRentalPost/AgentRoomRentalPost";
import AgentRentedProperty from "./Pages/agent/RentedProperty/AgentRentedProperty";
import AppointmentDetails from "./Pages/agent/Appointment/AppointmentDetails";
import StudentAppointmentDetails from "./Pages/student/profile/StudentAppointmentDetails";
import AuthRoute from "./Components/AuthRoute";
import AuthProvider, { useAuth } from "./context/AuthProvider";
import RentedPropertyDetails from "./Pages/agent/RentedProperty/RentedPropertyDetails";
import MyListings from "./Pages/student/roommate/MyListings";
import ListingPostDetails from "./Pages/student/roommate/ListingPostDetails";
import RoommatePost from "./Pages/student/roommate/RoommatePost";
import RoommateRequest from "./Pages/student/roommate/RoommateRequest";

import { supabase } from "./supabase-client";
import { useEffect } from "react";
import MyRequest from "./Pages/student/roommate/MyRequest";
import Loading from "./Pages/Result/Loading";

function App() {
    const { userSession, auth } = useAuth();

    console.log(userSession);
    console.log(auth);
    const [agentStatus, setAgentStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const getAgentStatus = async (userSession) => {
        setIsLoading(true);
        let { data: agentStatus, error: agentStatusError } = await supabase
            .from("agent")
            .select("account_status")
            .eq("agent_id", userSession.user.id)

        console.log(agentStatus);

        if (agentStatusError) {
            console.log(agentStatusError);
        }
        else {
            if (agentStatus.length > 0) {
                // setAgentStatus(agentStatus[0].account_status);
                return agentStatus[0].account_status;
            }

        }

    };

    useEffect(() => {
        if (userSession) {
            getAgentStatus(userSession).then((status) => {
                console.log(status);
                setAgentStatus(status);
                setIsLoading(false);
            });

        }
    }, [userSession]);

    useEffect(() => {
        if (agentStatus === false && userSession && userSession.user.user_metadata.userType === "agent") {
            console.log(agentStatus)
            supabase.auth.signOut();
        }
    }, [agentStatus, userSession]);


    const userTypeRoutes = () => {
        if (userSession && auth) {
            if (userSession.user.user_metadata.userType === "agent" && agentStatus) {
                return (
                    <>

                        <Route path="/" element={<Navigate to="/agent" />} />
                        <Route path="/login" element={<Navigate to="/agent" />} />
                        <Route path="/signup" element={<Navigate to="/agent" />} />
                        <Route path="/forgot-password" element={<Navigate to="/agent" />} />
                        <Route path="/update-password" element={<Navigate to="/agent" />} />

                        <Route path="/agent/" element={<AgentLayout />}>
                            <Route index element={<AgentHome />} />
                            <Route path="rentedProperty" element={<AgentRentedProperty />} />
                            <Route path="rentedProperty/:id" element={<RentedPropertyDetails />} />
                            <Route path="profile" element={<AgentProfile />} />
                            <Route path="profile/editProfile" element={<AgentEditProfile />} />
                            <Route path="roomRental/createNewPost" element={<AgentCreatePost />} />
                            <Route path="roomRental" element={<AgentRoomRental />} />
                            <Route path="appointment" element={<AgentAppointment />} />
                            <Route path="appointment/:id" element={<AppointmentDetails />} />
                            <Route path="rentalAgreement" element={<AgentRentalAgreement />} />
                            <Route path="roomRental/editPost/:id" element={<AgentRoomRentalPost />} />
                            <Route path="roomRental/viewPost/:id" element={<AgentRoomRentalPost />} />
                            <Route path="*" element={<NotFound />} />
                        </Route>
                        <Route path="*" element={<NotFound />} />
                    </>
                );
            } else if (userSession.user.user_metadata.userType === "student") {
                return (
                    <>

                        <Route path="/" element={<Navigate to="/student" />} />
                        <Route path="/login" element={<Navigate to="/student" />} />
                        <Route path="/signup" element={<Navigate to="/student" />} />
                        <Route path="/forgot-password" element={<Navigate to="/student" />} />
                        <Route path="/update-password" element={<Navigate to="/student" />} />

                        <Route path="/student/" element={<StudentLayout />}>
                            <Route index element={<Home />} />
                            <Route path="roomRental" element={<RoomRental />} />
                            <Route path="roommate" element={<Roommate />} />
                            <Route path="roommate/myListings" element={<MyListings />} />
                            <Route path="roommate/myListings/request/:id" element={<RoommateRequest />} />
                            <Route path="roommate/myListings/:id" element={<ListingPostDetails />} />
                            <Route path="roommate/myRequest" element={<MyRequest />} />
                            <Route path="roommate/post/:id" element={<RoommatePost />} />
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
        <>
            {isLoading ? (
                <Loading /> // Show loading component
            ) : (
                <Routes>
                    {userTypeRoutes()}
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/update-password" element={<UpdatePassword />} />
                    <Route path="*" element={<NotFound />} />
                    <Route path="/" element={<Login />} />
                </Routes>
            )}
        </>
    );
}

export default App;