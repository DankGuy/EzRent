import { UserOutlined } from "@ant-design/icons";
import { Button, Row, Col, Avatar } from "antd";
import { useState } from "react";
import { supabase } from "../../../supabase-client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProfileInformation() {
  // get user information from database
  const [userInfo, setUserInfo] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);
  const getUserInfo = async () => {
    // get user id from supabase
    const userID = (await supabase.auth.getUser()).data.user.id;
    let { data: student, error } = await supabase
      .from("student")
      .select("*")
      .eq("student_id", userID);
    if (error) console.log("error", error);
    else return student[0];
  };
// ...

const getAvatar = async () => {
  const userID = (await supabase.auth.getUser()).data.user.id;
  const timestamp = new Date().getTime(); // Generate a timestamp to serve as the cache-busting query parameter
  const { data } = supabase.storage
    .from("avatar")
    .getPublicUrl(`avatar-${userID}`, {
      select: "metadata",
      fileFilter: (metadata) => {
        const fileType = metadata.content_type.split("/")[1];
        return fileType === "jpg" || fileType === "png";
      },
    });

  const avatarUrlWithCacheBuster = `${data.publicUrl}?timestamp=${timestamp}`; // Append the cache-busting query parameter

  return avatarUrlWithCacheBuster;
};

// ...

  const navigate = useNavigate();

  useEffect(() => {
    getUserInfo().then((student) => setUserInfo(student));
  }, []);

  useEffect(() => {
    let avatar = getAvatar();
    avatar.then((url) => {
      setUserAvatar(url);
    });
  }, [userInfo]);

  const editProfile = () => {
    navigate("/student/profile/editProfile");
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="avatar-div">
          <Avatar size={64} src={userAvatar} icon={<UserOutlined />} />
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <h2 style={{ textAlign: "center" }}>Personal Details</h2>
        <Row gutter={[16, 16]}>
          <Col
            flex="35%"
            style={{
              borderRight: "1px solid #f0f2f5",
            }}
          >
            <p style={{ textAlign: "right" }}>
              <b>Name: </b>
            </p>
          </Col>
          <Col flex="auto">
            <p style={{ textAlign: "left" }}>{userInfo?.name}</p>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col
            flex="35%"
            style={{
              borderRight: "1px solid #f0f2f5",
            }}
          >
            <p style={{ textAlign: "right" }}>
              <b>Gender: </b>
            </p>
          </Col>
          <Col flex="auto">
            <p style={{ textAlign: "left" }}>{userInfo?.gender}</p>
          </Col>
        </Row>
      </div>
      <div style={{ textAlign: "center" }}>
        <h2>Contact Details</h2>
        <Row gutter={[16, 16]}>
          <Col
            flex="35%"
            style={{
              borderRight: "1px solid #f0f2f5",
            }}
          >
            <p style={{ textAlign: "right" }}>
              <b>E-mail: </b>
            </p>
          </Col>
          <Col flex="auto">
            <p style={{ textAlign: "left" }}>{userInfo?.email}</p>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col
            flex="35%"
            style={{
              borderRight: "1px solid #f0f2f5",
            }}
          >
            <p style={{ textAlign: "right" }}>
              <b>Phone: </b>
            </p>
          </Col>
          <Col flex="auto">
            <p style={{ textAlign: "left" }}>{userInfo?.phone}</p>
          </Col>
        </Row>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "5vh",
        }}
      >
        <Button type="primary" style={{ width: "20%" }} onClick={editProfile}>
          Edit Profile
        </Button>
      </div>
    </>
  );
}

export default ProfileInformation;
