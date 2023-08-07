import { Link, useNavigate } from "react-router-dom";
import logo from "../images/logoIcon.png";
import "./navBarCss.css";
import { supabase } from "../supabase-client";
import { useEffect, useState } from "react";

function NavBar() {
  
  

  const [profileSelectedKey, setProfileSelectedKey] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("selectedKey");
    navigate("/");
  };

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let { data: student, error } = await supabase
      .from("student")
      .select("*")
      .eq("student_id", user.id);
    return student[0];
  }

  useEffect(() => {
    setUser(getUser());
  }, []);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const res = await user;
        const role = res.role;
        console.log(role);
        if (role === "admin") {
          document.getElementsByClassName("adminLink")[0].style.display =
            "block";
        }
      }
    };
    fetchUserRole();
  }, [user]);

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
                <Link
                  className="link"
                  to="/student"
                  onClick={remainSelectedKey}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className="link"
                  to="/student/roomRental"
                  onClick={remainSelectedKey}
                >
                  Room Rental
                </Link>
              </li>
              <li>
                <Link
                  className="link"
                  to="/student/roommate"
                  onClick={remainSelectedKey}
                >
                  Roommate
                </Link>
              </li>
              <li className="adminLink" style={{ display: "none" }}>
                <Link
                  className="link"
                  to="/student/admin"
                  onClick={remainSelectedKey}
                >
                  Admin
                </Link>
              </li>
              <li>
                <Link
                  className="link"
                  to="/student/aboutUs"
                  onClick={remainSelectedKey}
                >
                  About Us
                </Link>
              </li>
              <div style={{ float: "right" }}>
                <li style={{ float: "left" }}>
                  <Link
                    className="link active"
                    to={profileSelectedKey}
                    onClick={remainSelectedKey}
                  >
                    Profile
                  </Link>
                </li>
                <li style={{ float: "left" }}>
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
