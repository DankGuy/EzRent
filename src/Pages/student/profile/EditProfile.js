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

  const [form] = Form.useForm();

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
    let { data: student, error } = await supabase
      .from("student")
      .select("*")
      .eq("student_id", userID);
    if (error) console.log("error", error);
    else return student[0];
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

    //delete image first
    const { error: deleteError } = await supabase.storage
      .from("avatar")
      .remove([`avatar-${userInfo?.student_id}`]);
    if (deleteError) {
      message.error(deleteError.message);
    }

    const { data, error } = await supabase.storage
      .from("avatar")
      .upload(`avatar-${userInfo?.student_id}`, file);
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
      .from("student")
      .update({
        name: formData?.name,
        gender: formData?.gender,
        phone: formData?.phone,
      })
      .eq("student_id", userInfo?.student_id);
    if (error) {
      message.error(error.message);
    } else {
      message.success("User information updated successfully");
      navigate("/student/profile/profileInformation");
    }
  };
  const cancelSubmit = () => {
    navigate("/student/profile/profileInformation");
  };

  // update userInfo state on page load
  useEffect(() => {
    getUserInfo().then((student) => {
      setUserInfo(student);

      form.setFieldValue("name", student?.name);
      form.setFieldValue("gender", student?.gender);
      form.setFieldValue("phone", student?.phone);
    });
  }, []);

  // update formData state when userInfo state changes (happens after the getUserInfo() function is called
  useEffect(() => {
    setFormData({
      name: userInfo?.name,
      gender: userInfo?.gender,
      email: userInfo?.email,
      phone: userInfo?.phone,
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
        <Form
          layout="horizontal"
          onFinish={onFinish}
          form={form}
          labelAlign="right"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }} >

          <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            marginTop: '2vh'
          }} >

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
            <fieldset
              style={{
                width: '500px',
                border: '1px solid #D9D9D9',
                padding: '10px',
                borderRadius: '10px',
                marginBottom: '20px',
                // display: 'flex',
                // flexDirection: 'column',
                // alignItems: 'center',
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
              <Form.Item
                label={<span style={{ fontWeight: 'bold' }}>Name</span>}
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
                label={<span style={{ fontWeight: 'bold' }}>Gender</span>}
                name="gender"  // Add the name attribute here
                rules={[
                  {
                    required: true,
                  },
                ]}
              >

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
                {/* </div> */}
              </Form.Item>
            </fieldset>

            <fieldset
              style={{
                width: '500px',
                border: '1px solid #D9D9D9',
                padding: '10px',
                borderRadius: '10px',
                marginBottom: '20px',
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

              <Form.Item label={<span style={{ fontWeight: 'bold' }}>Email</span>}>
                <Input value={formData?.email} disabled />
              </Form.Item>

              <Form.Item
                label={<span style={{ fontWeight: 'bold' }}>Phone Number</span>}
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
            </fieldset>

            <Form.Item>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Button type="default" htmlType="button" onClick={cancelSubmit} className="viewButton">
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" className="viewButton">
                  Save
                </Button>
              </div>
            </Form.Item>
          </div>
        </Form >
      </div >
    </>
  );
}

export default EditProfile;
