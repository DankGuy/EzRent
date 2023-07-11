import { UserOutlined } from "@ant-design/icons";
import { Button, Row, Col, Avatar, Rate } from "antd";
import { useState } from "react";
import { supabase } from "../../supabase-client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AgentProfile() {
  // get user information from database
  const [userInfo, setUserInfo] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);
  const getUserInfo = async () => {
    // get user id from supabase
    const userID = (await supabase.auth.getUser()).data.user.id;
    let { data: agent, error } = await supabase
      .from("agent")
      .select("*")
      .eq("agent_id", userID);
    if (error) console.log("error", error);
    else return agent[0];
  };
  const getAvatar = async () => {
    const userID = (await supabase.auth.getUser()).data.user.id;
    const { data } = supabase.storage
      .from("avatar")
      .getPublicUrl(`avatar-${userID}`, {
        select: "metadata",
        fileFilter: (metadata) => {
          const fileType = metadata.content_type.split("/")[1];
          return fileType === "jpg" || fileType === "png";
        },
      });
    console.log(data.publicUrl);
    return data;
  };

  const navigate = useNavigate();

  useEffect(() => {
    getUserInfo().then((agent) => setUserInfo(agent));
    // getAvatar().then((data) => setUserAvatar(data.publicUrl));
  }, []);

  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);

  const editProfile = () => {
    navigate("/agent/Profile/EditProfile");
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div className="avatar-div">
          <Avatar size={64} icon={<UserOutlined />} />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          marginTop: "5vh",
        }}
      >
        <div className="rate-div">
          <Rate disabled allowHalf defaultValue={3.7} />
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
        <h2>Business Info</h2>
        <Row gutter={[16, 16]}>
          <Col
            flex="35%"
            style={{
              borderRight: "1px solid #f0f2f5",
            }}
          >
            <p style={{ textAlign: "right" }}>
              <b>Company Name: </b>
            </p>
          </Col>
          <Col flex="auto">
            <p style={{ textAlign: "left" }}>{userInfo?.company}</p>
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
              <b>Properties Rented Out: </b>
            </p>
          </Col>
          <Col flex="auto">
            <p style={{ textAlign: "left" }}>{userInfo?.properties_rented_out}</p>
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

export default AgentProfile;
