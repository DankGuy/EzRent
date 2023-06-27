import { UserOutlined } from "@ant-design/icons";
import { Button, Row, Col, Avatar } from "antd";
import { useState } from "react";
import { supabase } from "../../../supabase-client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProfileInformation() {
  // get user information from database
  const [userInfo, setUserInfo] = useState(null);
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
  const navigate = useNavigate();

  useEffect(() => {
    getUserInfo().then((student) => setUserInfo(student));
  }, []);

  const editProfile = () => {
    navigate("/student/profile/editProfile");
  };
  //   const getBase64 = (img, callback) => {
  //     const reader = new FileReader();
  //     reader.addEventListener("load", () => callback(reader.result));
  //     reader.readAsDataURL(img);
  //   };

  //   // checks if the image uploaded is in the correct format and smaller than 2mb
  //   const beforeUpload = (file) => {
  //     const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  //     if (!isJpgOrPng) {
  //       message.error("You can only upload JPG/PNG file!");
  //     }
  //     const isLt2M = file.size / 1024 / 1024 < 2;
  //     if (!isLt2M) {
  //       message.error("Image must be smaller than 2MB!");
  //     }
  //     return isJpgOrPng && isLt2M;
  //   };

  //   const [loading, setLoading] = useState(false);
  //   const [imageUrl, setImageUrl] = useState();
  //   const handleChange = (info) => {
  //     if (info.file.status === "uploading") {
  //       setLoading(true);
  //       return;
  //     }
  //     if (info.file.status === "done") {
  //       // Get this url from response in real world.
  //       getBase64(info.file.originFileObj, (url) => {
  //         setLoading(false);
  //         setImageUrl(url);
  //       });
  //     }
  //   };

  //   const uploadButton = (
  //     <div>
  //       {loading ? <LoadingOutlined /> : <PlusOutlined />}
  //       <div
  //         style={{
  //           marginTop: 8,
  //         }}
  //       >
  //         Upload
  //       </div>
  //     </div>
  //   );

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
          <Avatar size={64} icon={<UserOutlined />} />
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
