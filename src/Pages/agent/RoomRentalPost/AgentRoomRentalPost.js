import { useState, useEffect } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload, message, Form, Row, Col, Input, Radio, Select, InputNumber, Checkbox, Button, Popconfirm } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { createClient } from '@supabase/supabase-js';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import "./AgentRoomRentalPost.css"
import FurnishTypeSelection from '../../../Components/FurnishTypeSelection';
import { getCurrentDateTime } from '../../../Components/timeUtils';


function AgentRoomRentalPost() {
    const location = useLocation();
    const { post, isView } = location.state;

    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [postCode, setPostCode] = useState({
        value: '',
    });

    const [propertyState, setPropertyState] = useState(post.propertyState);

    const [isRoom, setIsRoom] = useState(true)

    const addressSupabase = createClient(
        'https://fhqfbbomaerfhpitvmbd.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZocWZiYm9tYWVyZmhwaXR2bWJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc1MjU1NTksImV4cCI6MjAwMzEwMTU1OX0.fjGeF-l21A-HgQSAvV_gMXufFJ1IGujp5Web3kvkdvI'
    );

    const supabase = createClient(
        'https://exsvuquqspmbrtyjdpyc.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4c3Z1cXVxc3BtYnJ0eWpkcHljIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODYyNzMxNDgsImV4cCI6MjAwMTg0OTE0OH0.vtMaXrTWDAluG_A-68pvQlSQ6GAskzADYfOonmCXPoo'
    );

    const [fileList, setFileList] = useState([]);


    useEffect(() => {
        window.scrollTo(0, 0);

    }, [isView])


    //Get the image list from supabase storage and set it to fileList
    useEffect(() => {
        const fetchImages = async () => {
            const { data: images, error } = await supabase
                .storage
                .from('post')
                .list(`${post.postID}`);

            if (error) {
                console.log(error)
            } else {
                const urls = images.map(image => {
                    return {
                        uid: image.id,
                        name: image.name,
                        status: 'done',
                        url: `https://exsvuquqspmbrtyjdpyc.supabase.co/storage/v1/object/public/post/${post.postID}/${image.name}`
                    }
                })
                setFileList(urls)
            }
        }
        fetchImages()
    }, [])







    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );



    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }

        const value = isJpgOrPng && isLt2M;
        return value || Upload.LIST_IGNORE;
    };

    const roomType = () => {
        return (
            <>
                <Col span={4} offset={1}>
                    <Form.Item name="roomType" label="Room Type" required rules={[
                        {
                            required: true,
                            message: 'Please choose the room type!',
                        },
                    ]}>
                        <Select placeholder="All Room Type" options={[
                            { value: 'Master Room', label: 'Master Room' },
                            { value: 'Medium Room', label: 'Medium Room' },
                            { value: 'Small Room', label: 'Small Room' },
                        ]} />
                    </Form.Item>
                </Col>
                <Col span={4} offset={1}>
                    <Form.Item name="roomSquareFeet" label="Room Square Feet (sq.ft.)" required>
                        <InputNumber min={1} max={1000} style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
            </>
        )
    }

    const roomNumber = () => {
        return (
            <>
                <Col span={4} offset={1}>
                    <Form.Item name="masterRoomNum" label="Master Room Number">
                        <InputNumber min={0} max={2} />
                    </Form.Item>
                </Col>
                <Col span={4} offset={1}>
                    <Form.Item name="mediumRoomNum" label="Medium Room Number">
                        <InputNumber min={0} max={2} />
                    </Form.Item>
                </Col>
                <Col span={4} offset={1}>
                    <Form.Item name="smallRoomNum" label="Small Room Number">
                        <InputNumber min={0} max={2} />
                    </Form.Item>
                </Col>
            </>
        )
    }

    const furnishOption = [
        { label: "Air-conditioner", value: "Air-conditioner" },
        { label: "Clothes hanger stand", value: "Clothes hanger stand" },
        { label: "Refrigerator", value: "Refrigerator" },
        { label: "Sofa", value: "Sofa" },
        { label: "Study desk and table", value: "Study desk and table" },
        { label: "Wardrobe", value: "Wardrobe" },
        { label: "Water dispenser", value: "Water dispenser" },
        { label: "Water heater", value: "Water heater" },
        { label: "Washing machine", value: "Washing machine" },
        { label: "WiFi", value: "WiFi" },
    ];


    const facilityOption = [
        { label: "24-hours security", value: "24-hours security" },
        { label: "Badminton court", value: "Badminton court" },
        { label: "Basketball court", value: "Basketball court" },
        { label: "Cafeteria", value: "Cafeteria" },
        { label: "Football court", value: "Football court" },
        { label: "Smiwimng pool", value: "Smiwimng pool" },
        { label: "Gym room", value: "Gym room" },
        { label: "Jogging track", value: "Jogging track" },
        { label: "Mini market", value: "Mini market" },
        { label: "Parking area", value: "Parking area" },
        { label: "Playground", value: "Playground" },
        { label: "Table tennis court", value: "Table tennis court" },
        { label: "Wadding pool", value: "Wadding pool" },
    ];

    const renderedItem = (items) => {
        const renderedItemOption = items.map((item) => {
            return (
                <Col span={6} key={item.value}>
                    <Checkbox value={item.value}>{item.label}</Checkbox>
                </Col>
            )
        })
        return renderedItemOption
    }

    const validatePostcode = (value) => {
        if (value.length == 0) {
            setPropertyState('');
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter valid xxxpostcode!',
            }
        }
        else {
            setPropertyState(value[0].state.state_name);
            return {
                validateStatus: 'success',
                errorMsg: null,
            }
        }
    }

    const handlePostCode = async (e) => {
        const value = e.target.value;

        if (value.length === 0) {
            setPostCode({
                validateStatus: 'error',
                errorMsg: 'Please enter the property postcode!',
            });
            setPropertyState('');
            return;
        } else {
            const postcodeRegex = /^\d{5}$/;
            const format = postcodeRegex.test(value);

            if (!format) {
                setPostCode({
                    validateStatus: 'error',
                    errorMsg: 'Incorrect format!',
                });
                setPropertyState('');
            } else {
                const { data, error } = await addressSupabase
                    .from('malaysia_postcode')
                    .select('postcode, state_code, state(state_name)')
                    .eq('postcode', e.target.value);

                if (error) {
                    console.log(error)
                    return;
                }

                const validationResult = validatePostcode(data);
                setPostCode({
                    ...validationResult,
                    value,
                });

                if (validationResult.validateStatus === 'success') {
                    setPropertyState(data[0].state.state_name);
                } else {
                    setPropertyState('');
                }
            }
        }
    };

    const updatePostImage = async (postID, images) => {
        //Get all images from supabase storage
        const { data: allData, error: allError } = await supabase
            .storage
            .from('post')
            .list(`${postID}/`);

        if (allError) {
            console.log("Error failed: " + allError)
        }

        allData.forEach(async (data) => {
            await supabase
                .storage
                .from('post')
                .remove([`${postID}/${data.name}`]);
        })

        //Upload new images to supabase storage
        images.fileList.forEach(async (image) => {
            const { data, error } = await supabase
                .storage
                .from('post')
                .upload(`${postID}/${image.name}`, image.originFileObj, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (error) {
                console.log("Error failed: " + error)
            }
        }
        )

    }


    const onFinish = async (e) => {
        let {
            propertyAddress, propertyBuiltupSize, propertyCategory,
            propertyCity, propertyDescription, propertyFacility,
            propertyFurnish, propertyFurnishType, propertyImage,
            propertyName, propertyPostcode, propertyRental,
            propertyState, propertyType, roomSquareFeet,
            roomType, masterRoomNum, mediumRoomNum, smallRoomNum } = e;

        const { data, error } = await addressSupabase
            .from('malaysia_postcode')
            .select('postcode, state_code, state(state_name)')
            .eq('postcode', propertyPostcode);

        if (data.length > 1) {
            propertyState = data[0].state.state_name;
        }


        const dateTime = getCurrentDateTime();

        let roomnumber = [];
        if (masterRoomNum === undefined) {
            roomnumber = null
        }
        else {
            roomnumber = [{ masterRoomNum }, { mediumRoomNum }, { smallRoomNum }];
        }

        console.log("Update successfully")
        const { data: postData, error: postError } = await supabase
            .from('property_post')
            .update(
                {
                    postType: 'Property',
                    propertyType: propertyType,
                    propertyPrice: propertyRental,
                    propertySquareFeet: propertyBuiltupSize,
                    propertyFurnish: propertyFurnish,
                    propertyFacility: propertyFacility,
                    propertyAgentID: '3f4ac7e4-272b-4b91-bcce-19184ca174ed',
                    propertyAddress: `${propertyAddress},${propertyPostcode},${propertyCity},${propertyState}`,
                    propertyState: propertyState,
                    propertyFurnishType: propertyFurnishType,
                    propertyCategory: propertyCategory,
                    propertyRoomType: roomType,
                    propertyRoomNumber: roomnumber,
                    propertyRoomSquareFeet: roomSquareFeet,
                    propertyDescription: propertyDescription,
                    lastModifiedDate: dateTime,
                })
            .eq('postID', post.postID);

        if (postError) {
            console.log("Error failed: " + postError)
            messageApi.open({
                type: 'error',
                content: 'An error occurred during edit',
            });
        }
        else {

            updatePostImage(post.postID, propertyImage);

            messageApi.open({
                type: 'success',
                content: 'Edit successful. You will be redirected to previous page within 3 seconds...',
            });

            setTimeout(() => {
                navigate("/agent/roomRental")
            }, 3000);
        }



    }

    const onFinishFailed = (e) => {
        console.log(e)
    }


    const deletePost = async () => {
        const { data, error } = await supabase
            .from('property_post')
            .delete()
            .eq('postID', post.postID)

        if (error) {
            console.log(error)
        }

        messageApi.open({
            type: 'success',
            content: 'Delete successful. You will be redirected to previous page within 3 seconds...',
        });

        setTimeout(() => {
            navigate("/agent/roomRental")
        }, 3000);
    }

    const showButton = () => {
        if (isView) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                    <Link to={`/agent/roomRental/editPost/${post.postID}`} state={{ post, isView: false }}>
                        <Button className='viewButton' style={{ marginRight: '20px', width: '100px' }} type="primary" >
                            Edit
                        </Button>
                    </Link>
                    <Popconfirm
                        title="Are you sure you want to delete this post?"
                        onConfirm={() => {
                            deletePost();
                        }}
                    >
                        {contextHolder}
                        <Button className="viewButton" style={{ width: '100px' }} type="primary">
                            Delete
                        </Button>
                    </Popconfirm>
                </div>
            )
        }
        else {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                    <Button className='viewButton' style={{ marginRight: '20px', width: '100px' }} type="primary" onClick={() => { form.resetFields() }} >
                        Cancel
                    </Button>

                    <Popconfirm
                        title="Title"
                        description="Are you sure you want to make changes?"
                        onConfirm={() => {
                            form.submit();
                        }}
                    >
                        {contextHolder}
                        <Button className="viewButton" style={{ width: '100px' }} type="primary">
                            Edit
                        </Button>
                    </Popconfirm>
                </div>
            )
        }
    }

    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    return <>
        {isView ? <h1>View Post</h1> : <h1>Edit Post</h1>}

        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
            <img
                alt="example"
                style={{
                    width: '100%',
                }}
                src={previewImage}
            />
        </Modal>


        <Form
            layout='vertical'
            size='middle'
            disabled={isView}
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={{
                propertyFurnishType: post.propertyFurnishType,
                propertyCategory: post.propertyCategory,
                masterRoomNum: (!post.propertyRoomNumber ? 1 : post.propertyRoomNumber[0]),
                mediumRoomNum: (!post.propertyRoomNumber ? 1 : post.propertyRoomNumber[1]),
                smallRoomNum: (!post.propertyRoomNumber ? 1 : post.propertyRoomNumber[2]),
                propertyRental: post.propertyPrice,
                roomSquareFeet: post.propertyRoomSquareFeet,
                propertyDescription: post.propertyDescription,
                propertyType: post.propertyType,
                roomType: post.propertyRoomType,
                propertyName: post.propertyName,
                propertyAddress: post.propertyAddress,
                propertyCity: post.propertyCity,
                propertyPostcode: post.propertyPostcode,
                propertyBuiltupSize: post.propertySquareFeet,
                propertyFurnish: post.propertyFurnish,
                propertyFacility: post.propertyFacility,
            }}
        >
            <Row>
                <Col span={24}>
                    <Form.Item name="propertyImage" label="Property Image">
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                            multiple={true}
                            beforeUpload={beforeUpload}
                            customRequest={dummyRequest}
                        >
                            {fileList.length >= 10 ? null : uploadButton}
                        </Upload>

                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Form.Item required='true' name="propertyName" label='Property Name' rules={[
                        {
                            required: true,
                            message: 'Please enter the property name!',
                        },
                    ]}>
                        <Input disabled={true} placeholder='Enter your property name here' style={{ width: '50%' }} />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={7}>
                    <Form.Item required='true' name="propertyAddress" label='Property Address' rules={[
                        {
                            required: true,
                            message: 'Please enter the property address!',
                        },
                    ]}>
                        <Input placeholder='Enter property address here' style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={4} offset={1}>
                    <Form.Item required='true' name="propertyCity" label='Property City' rules={[
                        {
                            required: true,
                            message: 'Please enter the property city!',
                        },
                    ]}>
                        <Input placeholder='Enter property city here' style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={4} offset={1}>
                    <Form.Item required='true' name="propertyPostcode" label='Property Postcode' help={postCode.errorMsg} validateStatus={postCode.validateStatus} rules={[
                        {
                            required: true,
                            message: 'Please enter the property postcode!',
                        },
                    ]}>
                        <Input placeholder='Postcode' maxLength={5} style={{ width: '100%' }} onChange={handlePostCode} value={postCode.value} />
                    </Form.Item>
                </Col>
                <Col span={5} offset={1}>
                    <Form.Item name="propertyState" label='Property State'>
                        {/* <Input value={propertyState} disabled={false} display={propertyState}  /> */}
                        <div style={{ paddingLeft: '10px', border: '1px solid #d9d9d9', width: 'auto', height: '30px', borderRadius: '5px', display: 'flex', alignItems: 'center' }}>{propertyState}</div>
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={6} >
                    <Form.Item required='true' name="propertyBuiltupSize" label='Property Built-up Size (sq.ft.)' rules={[
                        {
                            required: true,
                            message: 'Please enter the property built-up size!',
                        },
                    ]}>
                        <Input placeholder='Built-up size (sq.ft.)' style={{ width: '100%' }} />
                    </Form.Item>
                </Col>

                <Col span={6} offset={1}>
                    <Form.Item required='true' name="propertyType" label='Property Type' rules={[
                        {
                            required: true,
                            message: 'Please choose the property type!',
                        },
                    ]}>
                        <Select placeholder="All Property Type" options={[
                            { value: 'Apartment', label: 'Apartment' },
                            { value: 'Condominium', label: 'Condominium' },
                            { value: 'Flat', label: 'Flat' },
                            { value: 'Terrace house', label: 'Terrace house' },
                        ]} />
                    </Form.Item>
                </Col>
                <Col span={6} offset={1}>
                    <Form.Item required='true' name="propertyFurnishType" label='Property Furnish Type' rules={[
                        {
                            required: true,
                            message: 'Please choose the property furnish type!',
                        },
                    ]}>
                        <FurnishTypeSelection value={post.propertyFurnishType} bordered={true} />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={4}>
                    <Form.Item
                        name="propertyCategory"
                        label='Property Category'
                        rules={[
                            {
                                required: true,
                                message: 'Please choose one category!',
                            },
                        ]}>
                        <Radio.Group onChange={() => { setIsRoom(!isRoom) }} disabled={true}>
                            <Radio value='Room'>Room</Radio>
                            <Radio value='Unit'>Unit</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                {isRoom ? roomType() : roomNumber()}
            </Row>
            <Row>
                <Col span={24}>
                    <Form.Item
                        name="propertyRental"
                        label="Property Rental (RM)"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the property rental!',
                            },
                        ]}>
                        <InputNumber min={0} max={5000} style={{ width: '20%' }} />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Form.Item
                        name="propertyFurnish"
                        label="Property Furnish"
                    >
                        <Checkbox.Group
                            style={{
                                width: '100%',
                            }}
                        >
                            <Row>
                                {renderedItem(furnishOption)}
                            </Row>


                        </Checkbox.Group>
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Form.Item
                        name="propertyFacility"
                        label="Property Facility"
                    >
                        <Checkbox.Group
                            style={{
                                width: '100%',
                            }}
                        // options={furnishOption}
                        >
                            <Row>
                                {renderedItem(facilityOption)}
                            </Row>
                        </Checkbox.Group>
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={20}>
                    <Form.Item name="propertyDescription" label="Other description">
                        <TextArea maxLength={1000} style={{ resize: 'none', height: 'auto' }} allowClear={true} autoSize={true} placeholder='Enter other description here...' />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
        {showButton()}


    </>
}

export default AgentRoomRentalPost;