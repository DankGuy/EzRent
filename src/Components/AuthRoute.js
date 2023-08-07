import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { Route } from "react-router-dom";
import AgentLayout from "../Pages/agent/AgentLayout";

import AgentHome from "../Pages/agent/AgentHome";
import AgentRentedProperty from "../Pages/agent/RentedProperty/AgentRentedProperty";
import RentedPropertyDetails from "../Pages/agent/RentedProperty/RentedPropertyDetails";
import AgentProfile from "../Pages/agent/AgentProfile";
import AgentEditProfile from "../Pages/agent/Profile/EditProfile";
import AgentCreatePost from "../Pages/agent/RoomRentalPost/AgentCreatePost";
import AgentRoomRental from "../Pages/agent/RoomRentalPost/AgentRoomRental";
import AgentAppointment from "../Pages/agent/Appointment/AgentAppointment";
import AppointmentDetails from "../Pages/agent/Appointment/AppointmentDetails";
import AgentRentalAgreement from "../Pages/agent/AgentRentalAgreement";
import AgentRoomRentalPost from "../Pages/agent/RoomRentalPost/AgentRoomRentalPost";
import NotFound from "../Pages/Result/NotFound";



const AuthRoute = () => {
    const location = useLocation();

    const { auth, userSession } = useAuth();

    console.log(auth);
    return auth ? (
        <Outlet />
    ) : (
        <Navigate to={"/login"} />
    );

    // return (
    //     <>
    //         {!auth ? (
    //             <Navigate to={"/login"} />
    //         ) : (
    //             <>
    //                 <Route path="/agent/" element={<AgentLayout />}>
    //                     <Route index element={<AgentHome />} />
    //                     <Route path="rentedProperty" element={<AgentRentedProperty />} />
    //                     <Route path="rentedProperty/:id" element={<RentedPropertyDetails />} />
    //                     <Route path="profile" element={<AgentProfile />} />
    //                     <Route path="profile/editProfile" element={<AgentEditProfile />} />
    //                     <Route path="roomRental/createNewPost" element={<AgentCreatePost />} />
    //                     <Route path="roomRental" element={<AgentRoomRental />} />
    //                     <Route path="appointment" element={<AgentAppointment />} />
    //                     <Route path="appointment/:id" element={<AppointmentDetails />} />
    //                     <Route path="rentalAgreement" element={<AgentRentalAgreement />} />
    //                     <Route path="roomRental/editPost/:id" element={<AgentRoomRentalPost />} />
    //                     <Route path="roomRental/viewPost/:id" element={<AgentRoomRentalPost />} />
    //                     <Route path="*" element={<NotFound />} />
    //                 </Route>
    //                 <Route path="*" element={<NotFound />} />
    //             </>
    //         )}
    //     </>
    // );
};

export default AuthRoute;