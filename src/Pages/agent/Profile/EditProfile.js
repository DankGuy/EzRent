import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, message, Upload, Select, Form, Input } from "antd";
import { useState } from "react";
import { supabase } from "../../../supabase-client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const navigate = useNavigate();
  const { Option } = Select;

  const [formData, setFormData] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState();
  const [avatarUrl, setAvatarUrl] = useState();

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  // get user information from database
  const getUserInfo = async () => {
    const userID = (await supabase.auth.getUser()).data.user.id;
    let { data: agent, error } = await supabase
      .from("agent")
      .select("*")
      .eq("agent_id", userID);
    if (error) console.log("error", error);
    else return agent[0];
  };

  // handle image upload
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  // checks if the image uploaded is in the correct format and smaller than 2mb
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
    }
    const value = isJpgOrPng && isLt2M;
    return value || Upload.LIST_IGNORE;
  };
  const handleChange = (info) => {
    setAvatar(info.file.originFileObj);
    getBase64(info.file.originFileObj, (imageUrl) => setAvatarUrl(imageUrl))
  };
  // upload image to database
  const uploadImage = async (file) => {
    const { data, error } = await supabase.storage
      .from("avatar")
      .upload(`avatar-${userInfo?.agent_id}`, file, {
        upsert: true,
      });
    if (error) {
      message.error(error.message);
    } else {
      message.success("Image uploaded successfully");
    }
  };

  // handle form submission
  const onFinish = (value) => {
    if (avatar) {
      uploadImage(avatar);
    }
    editProfile();
  };
  const editProfile = async () => {
    // update user information
    const { data, error } = await supabase
      .from("agent")
      .update({
        name: formData?.name,
        gender: formData?.gender,
        phone: formData?.phone,
        company: formData?.company,
      })
      .eq("agent_id", userInfo?.agent_id);
    if (error) {
      message.error(error.message);
    } else {
      message.success("User information updated successfully");
      navigate("/agent/profile/");
    }
  };
  const cancelSubmit = () => {
    navigate("/agent/profile/");
  };

  // update userInfo state on page load
  useEffect(() => {
    getUserInfo().then((agent) => setUserInfo(agent));
  }, []);

  // update formData state when userInfo state changes (happens after the getUserInfo() function is called
  useEffect(() => {
    setFormData({
      name: userInfo?.name,
      gender: userInfo?.gender,
      email: userInfo?.email,
      phone: userInfo?.phone,
      company: userInfo?.company,
    });
  }, [userInfo]);

  // update formData state when user changes input
  const handleInfoChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        <Form layout="vertical" onFinish={onFinish} style={{
          width: "30%"
        }}>
          <Form.Item>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div>
                <Upload
                  name="avatar"
                  listType="picture-circle"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                >
                  {avatar ? (
                    <img
                      src={avatarUrl}
                      alt="avatar"
                      style={{
                        width: "100%",
                      }}
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </div>
            </div>
          </Form.Item>
          <h2 style={{ textAlign: "center" }}>Personal Details</h2>

          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your name!",
              },
            ]}
          >
            <Input onChange={handleInfoChange} name="name" />
          </Form.Item>

          <Form.Item
            label="Gender"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <Select
                name="gender"
                placeholder="select your gender"
                value={formData?.gender}
                onChange={(value) =>
                  handleInfoChange({ target: { name: "gender", value } })
                }
              >
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
                <Option value="Other">Other</Option>
              </Select>
            </div>
          </Form.Item>

          <h2 style={{ textAlign: "center" }}>Contact Details</h2>
          <Form.Item label="E-mail">
            <Input value={formData?.email} disabled />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              {
                required: true,
                message: "Please input your phone number!",
              },
              {
                validator(_, value) {
                  if (
                    (value ?? "").length === 0 ||
                    (((value ?? "").length === 10 ||
                      (value ?? "").length === 11) &&
                      (value ?? "").match(/^[0-9]+$/))
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The phone number is invalid!")
                  );
                },
              },
            ]}
          >
            <Input
              onChange={handleInfoChange}
              name="phone"
            />
          </Form.Item>

          <h2 style={{ textAlign: "center" }}>Company Details</h2>
          <Form.Item label="Company">
            <Input value={formData?.company} />
          </Form.Item>


          <Form.Item>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Button type="default" htmlType="button" onClick={cancelSubmit}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}

export default EditProfile;
