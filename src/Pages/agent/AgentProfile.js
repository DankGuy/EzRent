import { UserOutlined } from "@ant-design/icons";
import { Button, Row, Col, Avatar, Rate, Descriptions } from "antd";
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
    getUserInfo().then((agent) => setUserInfo(agent));
  }, []);

  useEffect(() => {
    let avatar = getAvatar();
    avatar.then((url) => {
      setUserAvatar(url);
    });
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
          // flexDirection: "column",
        }}
      >
        <div className="avatar-div">
          <Avatar size={64} src={userAvatar} icon={<UserOutlined />} />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          marginTop: "5vh",
          width: "100%",
        }}
      >
        <div className="rate-div">
          <Rate disabled allowHalf defaultValue={3.7} />
        </div>

        <fieldset
          style={{
            width: '600px',
            border: '1px solid #D9D9D9',
            padding: '10px',
            borderRadius: '10px',
            marginBottom: '20px',
            marginTop: '20px',
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
              width: '200px',
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
            width: '600px',
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
            Business Info
          </legend>

          <Descriptions
            labelStyle={{
              color: 'black',
              padding: '4px 11px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: '200px',
            }}
            contentStyle={{
              color: 'black',
              border: '1px solid #d9d9d9',
              padding: '4px 11px',
            }}
          // colon={false}
          >
            <Descriptions.Item label="Company Name" span={3}>{userInfo?.company}</Descriptions.Item>
            <Descriptions.Item label="Properties Rented Out" span={3}>{userInfo?.properties_rented_out}</Descriptions.Item>
          </Descriptions>

        </fieldset>


        <fieldset
          style={{
            width: '600px',
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
            Contact Details
          </legend>
          <Descriptions
            labelStyle={{
              color: 'black',
              padding: '4px 11px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: '200px',
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
        <Button type="primary" style={{ width: "20%" }} onClick={editProfile} className="viewButton">
          Edit Profile
        </Button>
      </div>

    </>
  );
}

export default AgentProfile;
