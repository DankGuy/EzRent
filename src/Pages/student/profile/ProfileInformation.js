import { UserOutlined } from "@ant-design/icons";
import { Button, Row, Col, Avatar, Descriptions } from "antd";
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

  const getAvatar = async () => {
    const userID = (await supabase.auth.getUser()).data.user.id;
    // to speed up the process, browser will use cached data instead of fetching from the server
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

  const navigate = useNavigate();

  useEffect(() => {
    getUserInfo().then((student) => setUserInfo(student));
    getAvatar().then((url) => {
      setUserAvatar(url);
    });
  }, []);

  // useEffect(() => {
  //   let avatar = getAvatar();
  //   avatar.then((url) => {
  //     setUserAvatar(url);
  //   });
  // }, [userInfo]);

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

      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        marginTop: '2vh'
      }} >
        <fieldset
          style={{
            width: '500px',
            border: '1px solid #D9D9D9',
            padding: '10px',
            borderRadius: '10px',
            marginBottom: '20px',
            display: 'flex',        
            flexDirection: 'column',  
            alignItems: 'center',     
          }}
        >
          <legend
            style={{
              width: 'auto',
              borderBottom: 'none',
              marginBottom: '0px',
              fontWeight: 'bold',
              textAlign: 'center',  
            }}
          >
            Personal Details
          </legend>
          <Descriptions
            labelStyle={{
              color: 'black',
              padding: '4px 11px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: '100px',
            }}
            contentStyle={{
              color: 'black',
              border: '1px solid #d9d9d9',
              // borderRadius: '5px',
              padding: '4px 11px',
            }}
          // colon={false}
          >
            <Descriptions.Item label="Name" span={3}>{userInfo?.name}</Descriptions.Item>
            <Descriptions.Item label="Gender" span={3}>{userInfo?.gender}</Descriptions.Item>
          </Descriptions>
        </fieldset>

        <fieldset
          style={{
            width: '500px',
            border: '1px solid #D9D9D9',
            padding: '10px',
            borderRadius: '10px',
            marginBottom: '20px',
            display: 'flex',          
            flexDirection: 'column',  
            alignItems: 'center',    
          }}
        >
          <legend
            style={{
              width: 'auto',
              borderBottom: 'none',
              marginBottom: '0px',
              fontWeight: 'bold',
              textAlign: 'center',  
            }}
          >
            Personal Details
          </legend>
          <Descriptions
            labelStyle={{
              color: 'black',
              padding: '4px 11px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: '100px',
            }}
            contentStyle={{
              color: 'black',
              border: '1px solid #d9d9d9',
              // borderRadius: '5px',
              padding: '4px 11px',
            }}
          // colon={false}
          >
            <Descriptions.Item label="E-mail" span={3}>{userInfo?.email}</Descriptions.Item>
            <Descriptions.Item label="Phone" span={3}>{userInfo?.phone} </Descriptions.Item>
          </Descriptions>
        </fieldset>

        <Button type="primary" style={{ width: "20%", marginTop: '5vh' }} onClick={editProfile} className="viewButton">
          Edit Profile
        </Button>
      </div>




      {/* <div style={{ textAlign: "center" }}>
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
      > */}

      {/* </div> */}
    </>
  );
}

export default ProfileInformation;
