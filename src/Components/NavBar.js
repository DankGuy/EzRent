import { Link } from 'react-router-dom'
import logo from "../images/logoIcon.png";
import '../css/navBarCss.css'

function NavBar() {

    return <>
        <div className='container'>
            <Link to="/student/">
                <img src={logo} alt="logo" />

            </Link>

            <div className='nav-container'>
                <nav>

                    <ul>

                        <li>
                            <Link className='link' to="/student">Home</Link>
                        </li>
                        <li>
                            <Link className='link' to="/student/roomRental">Room Rental</Link>
                        </li>
                        <li>
                            <Link className='link' to="/student/roommate">Roommate</Link>
                        </li>
                        <li>
                            <Link className='link' to="/student/aboutUs">About Us</Link>
                        </li>
                        <li style={{ float: 'right' }}>
                            <Link className='link active' to="/student/profile">Profile</Link>
                        </li>
                    </ul>
                </nav>

            </div>

        </div>
    </>
}

export default NavBar;