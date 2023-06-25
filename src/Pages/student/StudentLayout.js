import RoomRental from './RoomRental'
import Roommate from './Roommate'
import AboutUs from './AboutUs'
import Profile from './Profile'
import NavBar from '../../Components/NavBar'
import RoomRentalPost from './RoomRentalPost'
import Home from './Home'
import { Routes, Route } from "react-router-dom";


function StudentLayout() {
    return <>
        <NavBar />

        <Routes>
            <Route path="/student/" element={<Home />} />
            <Route path="/student/roomRental" element={<RoomRental />}>
            </Route>
            <Route path="/student/roommate" element={<Roommate />} />
            <Route path="/student/aboutUs" element={<AboutUs />} />
            <Route path="/student/profile" element={<Profile />} />
            <Route path="/student/roomRental/:id" element={<RoomRentalPost />} />
        </Routes>
    </>
}

export default StudentLayout;