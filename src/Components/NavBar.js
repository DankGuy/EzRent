import { Link, useNavigate } from "react-router-dom";
import logo from "../images/logoIcon.png";
import "./navBarCss.css";
import { supabase } from "../supabase-client";
import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { Menu } from "antd";

function NavBar() {

  const [profileSelectedKey, setProfileSelectedKey] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut().then(() => {
      navigate("/");
    });
    localStorage.removeItem("selectedKey");
  };

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let { data: student, error } = await supabase
      .from("student")
      .select("*")
      .eq("student_id", user.id);

    // console.log(student[0]);
    return student[0];
  }

  useEffect(() => {
    getUser().then((res) => {
      setUser(res);
    });
  }, []);

  const remainSelectedKey = () => {

    localStorage.setItem("selectedKey", "/student/profile/profileInformation");
    setProfileSelectedKey("/student/profile/profileInformation");
  };

  const [current, setCurrent] = useState("/student");

  const items = [
    {
      label: "Home",
      key: "/student",
    },
    {
      label: "Room Rental",
      key: "/student/roomRental",
    },
    {
      label: "Roommate",
      key: "/student/roommate",
    },
    {
      label: "Admin",
      key: "/student/admin",
    },
    {
      label: "About Us",
      key: "/student/aboutUs",
    },
    // {
    //   label: "Profile",
    //   key: "/student/profile/profileInformation",
    // },
    // {
    //   label: "Logout",
    //   key: "/",
    // },
  ];

  const handleClick = (e) => {
    setCurrent(e.key);
    navigate(e.key);
  };


  return (
    <>
      <div style={{
        display: 'flex',
      }} >
        <Link to="/student/">
          <img className="logoClass" src={logo} alt="logo" />
        </Link>
        <Menu
          onClick={handleClick}
          selectedKeys={[current]}
          items={items}
          mode="horizontal"
          style={{
            width: '100%',
            fontSize: '17px',
            // height: '65px',
            // border: '1px solid black',
            paddingBottom: '-20px',
          }}
        />

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'}}>
          <Link
            className="link"
            to="/student/profile/profileInformation"
            onClick={remainSelectedKey}
          >
            <CgProfile style={{ width: "25px", height: "auto" }} />
          </Link>
          <Link
            className="link"
            to="/"
            onClick={logout}
          >
            Logout
          </Link>
        </div>
      </div>
      {/* <div
        className="container"
        style={{ position: "fixed", top: 0, zIndex: 999 }}
      >
        <div className="nav-container">

          <nav>
            <ul className="ulClass">
              <li>
                <Link to="/student/">
                  <img className="logoClass" src={logo} alt="logo" />
                </Link>
              </li>
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
              {
                user && user.role === "admin" ? (
                  <li>
                    <Link
                      className="link"
                      to="/student/admin"
                      onClick={remainSelectedKey}

                    >
                      Admin
                    </Link>
                  </li>
                ) : null
              }
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
                    className="link"
                    to={profileSelectedKey}
                    onClick={remainSelectedKey}
                  >
                    <CgProfile style={{ width: "25px", height: "auto" }} />
                  </Link>
                </li>
                <li style={{ float: "left" }}>
                  <Link
                    className="link"
                    to="/" onClick={logout}>
                    Logout
                  </Link>
                </li>
              </div>
            </ul>
          </nav>
        </div>
      </div > */}
    </>
  );
}

export default NavBar;
