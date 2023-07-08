import { Link } from "react-router-dom";
import logo from "../images/logoIcon.png";
import "./navBarCss.css";
import { supabase } from "../supabase-client";
import { useEffect, useState } from "react";


function NavBar() {
  const logout = () => {
    localStorage.removeItem("selectedKey");
    supabase.auth.signOut();
  };

  const [profileSelectedKey, setProfileSelectedKey] = useState("");

  const remainSelectedKey = () => {
    localStorage.setItem("selectedKey", "/student/profile/profileInformation");
    setProfileSelectedKey("/student/profile/profileInformation");
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
            <ul className="ulClass">
              <li>
                <Link className="link" to="/student" onClick={remainSelectedKey}>
                  Home
                </Link>
              </li>
              <li>
                <Link className="link" to="/student/roomRental" onClick={remainSelectedKey}>
                  Room Rental
                </Link>
              </li>
              <li>
                <Link className="link" to="/student/roommate" onClick={remainSelectedKey}>
                  Roommate
                </Link>
              </li>
              <li>
                <Link className="link" to="/student/aboutUs" onClick={remainSelectedKey}>
                  About Us
                </Link>
              </li>
              <div style={{float: 'right'}}>
                <li>
                  <Link className="link active" to={profileSelectedKey} onClick={remainSelectedKey}>
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
