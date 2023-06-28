import { Link } from "react-router-dom";
import logo from "../images/logoIcon.png";
import "../css/navBarCss.css";
import { supabase } from "../supabase-client";

function NavBar() {
  const logout = () => {
    supabase.auth.signOut();
  };

  return (
    <>
      <div
        className="container"
        style={{ position: "fixed", top: 0, zIndex: 999 }}
      >
        <Link to="/student/">
          <img className="logoClass" src={logo} alt="logo" />
        </Link>

        <div className="nav-container">
          <nav>
            <ul>
              <li>
                <Link className="link" to="/student">
                  Home
                </Link>
              </li>
              <li>
                <Link className="link" to="/student/roomRental">
                  Room Rental
                </Link>
              </li>
              <li>
                <Link className="link" to="/student/roommate">
                  Roommate
                </Link>
              </li>
              <li>
                <Link className="link" to="/student/aboutUs">
                  About Us
                </Link>
              </li>
              <div style={{float: 'right'}}>
                <li>
                  <Link className="link active" to="/student/profile">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link className="link active" to="/" onClick={logout}>
                    Logout
                  </Link>
                </li>
              </div>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}

export default NavBar;
