import NavBar from '../../Components/NavBar'
import { Outlet } from "react-router-dom";


function StudentLayout() {

    return <>
        <NavBar />
        <Outlet />
    </>
}

export default StudentLayout;