import { Link, useNavigate } from "react-router-dom";
import logo from "../images/logoIcon.png";
import "./navBarCss.css";
import { supabase } from "../supabase-client";
import { useEffect, useState } from "react";
import { Avatar, Dropdown, Menu } from "antd";
import { UserOutlined, LogoutOutlined, DownOutlined } from "@ant-design/icons";
import { RiAdminLine } from "react-icons/ri";

function NavBar() {

  const [profileSelectedKey, setProfileSelectedKey] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null);
  const [userName, setUserName] = useState(null);


  const logout = async () => {
    await supabase.auth.signOut().then(() => {
      navigate("/");
    });
    localStorage.removeItem("selectedKey");
    localStorage.removeItem("selectedStudentKey");
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
      setUserName(res.name);
    });

    if (localStorage.getItem("selectedKey")) {
      setProfileSelectedKey(localStorage.getItem("selectedKey"));
    } else {
      setProfileSelectedKey("/student/profile/profileInformation");
    }

    if (localStorage.getItem("selectedStudentKey")) {
      setCurrent(localStorage.getItem("selectedStudentKey"));
    } else {
      setCurrent("/student");
    }

    const getAvatar = async () => {

      const userID = (await supabase.auth.getUser()).data.user.id;

      const { data } = await supabase.storage
        .from("avatar")
        .getPublicUrl(`avatar-${userID}`, {
          select: "metadata",
          fileFilter: (metadata) => {
            const fileType = metadata.content_type.split("/")[1];
            return fileType === "jpg" || fileType === "png";
          },
        })


      return data;
    };

    getAvatar().then((data) => {
      setAvatar(data.publicUrl);
    });


  }, []);

  const remainSelectedKey = () => {

    localStorage.setItem("selectedKey", "/student/profile/profileInformation");
    localStorage.setItem("selectedStudentKey", "/student/profile/profileInformation");
    setProfileSelectedKey("/student/profile/profileInformation");
    setCurrent(null);
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
      label: "About Us",
      key: "/student/aboutUs",
    },
  ];



  const handleClick = (e) => {
    setCurrent(e.key);
    localStorage.setItem("selectedStudentKey", e.key);
    navigate(e.key);
  };

  const dropdownItems = [
    {
      label: "My Profile",
      key: "/student/profile/profileInformation",
      icon: <UserOutlined style={{ fontSize: '15px' }} />,
    },
    {
      label: "Logout",
      key: "/",
      icon: <LogoutOutlined style={{ fontSize: '15px' }} />,
    },
  ];

  if (user?.role === "admin") {
    dropdownItems.splice(1, 0, {
      label: "Admin",
      key: "/student/admin",
      icon: <RiAdminLine style={{ fontSize: '15px' }} />,
    });
  }

  return (
    <>
      <div style={{ position: 'fixed', width: '100%', top: 0, zIndex: 1000 }} className="navBarClass">
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
              paddingBottom: '-20px',
              paddingTop: '10px',
            }}
          />

          <div style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            cursor: 'pointer',
          }}>

            <Dropdown
              menu={{
                items: dropdownItems,
                onClick: ({ key }) => {
                  if (key === "/") {
                    logout();
                  } else {
                    navigate(key);
                    setCurrent(key);
                    localStorage.setItem("selectedStudentKey", key);
                  }
                }
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                <Avatar size={30} src={avatar} icon={<UserOutlined />} />
                <span style={{ marginLeft: '10px', marginRight: '10px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                  {userName}
                </span>
                <DownOutlined />
              </span>
            </Dropdown>
          </div>
        </div>
      </div>
    </>
  );
}

export default NavBar;
