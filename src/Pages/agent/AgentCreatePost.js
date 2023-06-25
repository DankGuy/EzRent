import { useState, useEffect } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload, message, Form, Row, Col, Input, Radio, Select, InputNumber, Checkbox, Button } from 'antd';
import StateSelection from '../../Components/StateSelection';
import FurnishTypeSelection from '../../Components/FurnishTypeSelection';
import TextArea from 'antd/es/input/TextArea';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

function AgentCreatePost() {

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [postCode, setPostCode] = useState({
        value: '',
    });

    const [propertyState, setPropertyState] = useState('');

    const [isRoom, setIsRoom] = useState(true)

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const addressSupabase = createClient(
        'https://fhqfbbomaerfhpitvmbd.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZocWZiYm9tYWVyZmhwaXR2bWJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc1MjU1NTksImV4cCI6MjAwMzEwMTU1OX0.fjGeF-l21A-HgQSAvV_gMXufFJ1IGujp5Web3kvkdvI'
    );

    const supabase = createClient(
        'https://exsvuquqspmbrtyjdpyc.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4c3Z1cXVxc3BtYnJ0eWpkcHljIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODYyNzMxNDgsImV4cCI6MjAwMTg0OTE0OH0.vtMaXrTWDAluG_A-68pvQlSQ6GAskzADYfOonmCXPoo'
    );

    const [fileList, setFileList] = useState([]);
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
        console.log(value)
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
        console.log(value)
        if (value.length == 0) {
            setPropertyState('');
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter valid xxxpostcode!',
            }
        }
        else {
            console.log(value[0].state.state_name);
            console.log(typeof (value[0].state.state_name))
            setPropertyState(value[0].state.state_name);
            console.log(propertyState)
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
                    console.log(propertyState)
                } else {
                    setPropertyState('');
                }
            }
        }
    };

    const onFinish = async (e) => {
        let {
            propertyAddress, propertyBuiltupSize, propertyCategory,
            propertyCity, propertyDescription, propertyFacility,
            propertyFurnish, propertyFurnishType, propertyImage,
            propertyName, propertyPostcode, propertyRental,
            propertyState, propertyType, roomSquareFeet,
            roomType, masterRoomNum, mediumRoomNum, smallRoomNum } = e;

        console.log(propertyFacility)
        console.log(e);

        const { data, error } = await addressSupabase
            .from('malaysia_postcode')
            .select('postcode, state_code, state(state_name)')
            .eq('postcode', propertyPostcode);

        if (data.length > 1) {
            propertyState = data[0].state.state_name;
            console.log(propertyState)
        }

        //Get current date and time
        const dateObj = new Date();
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const currentDate = `${year}-${month}-${day}`;
        // setCurrentDate(`${year}-${month}-${day}`);

        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        const seconds = String(dateObj.getSeconds()).padStart(2, '0');
        const currentTime = `${hours}:${minutes}:${seconds}`;
        // setCurrentTime(`${hours}:${minutes}:${seconds}`);

        console.log(currentDate)
        console.log(currentTime)

        let roomnumber = [];
        if (masterRoomNum === undefined) {
            roomnumber = null
        }
        else {
            roomnumber = [{ masterRoomNum }, { mediumRoomNum }, { smallRoomNum }];
        }

        const { data: postData, error: postError } = await supabase
            .from('property_post')
            .insert([
                {
                    postDate: currentDate,
                    postTime: currentTime,
                    postType: 'Property',
                    propertyType: propertyType,
                    propertyName: propertyName,
                    propertyPrice: propertyRental,
                    propertySquareFeet: propertyBuiltupSize,
                    propertyFurnish: propertyFurnish,
                    propertyFacility: propertyFacility,
                    propertyAgentID: '3f4ac7e4-272b-4b91-bcce-19184ca174ed',
                    propertyAddress: propertyAddress,
                    propertyCity: propertyCity,
                    propertyPostcode: propertyPostcode,
                    propertyState: propertyState,
                    propertyFurnishType: propertyFurnishType,
                    propertyCategory: propertyCategory,
                    propertyRoomType: roomType,
                    propertyRoomNumber: roomnumber,
                    propertyRoomSquareFeet: roomSquareFeet,
                    propertyDescription: propertyDescription,
                },
            ]);

        if (postError) {
            console.log(postError)
        }

        setIsButtonDisabled(true);

        messageApi.open({
            type: 'success',
            content: 'Create successful. You will be redirected to the previous page within 3 seconds...',
        });

        setTimeout(() => {
            navigate("/agent/roomRental")
        }, 3000);


    }

    const onFinishFailed = (e) => {
        console.log(e)
    }

    return <>
        <h1>Create new post</h1>


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
            name='halo'
            size='middle'
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={{
                // propertyState: propertyState,
                propertyFurnishType: null,
                propertyCategory: 'Room',
                masterRoomNum: 1,
                mediumRoomNum: 1,
                smallRoomNum: 1,
                propertyRental: 0,
                roomSquareFeet: 1,
                propertyDescription: null,
                propertyType: null,
                roomType: null,
            }}
        >
            <Row>
                <Col span={24}>
                    <Form.Item name="propertyImage" label="Property Image">
                        <Upload
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                            multiple={true}
                            beforeUpload={beforeUpload}

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
                        <Input placeholder='Enter your property name here' style={{ width: '50%' }} />
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
                        <div style={{ paddingLeft: '10px', border: '1px solid #d9d9d9', width: '50%', height: '30px', borderRadius: '5px', display: 'flex', alignItems: 'center' }}>{propertyState}</div>
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
                        <FurnishTypeSelection bordered={true} />
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
                        <Radio.Group onChange={() => { setIsRoom(!isRoom) }}>
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
                        // options={furnishOption}
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
                        <TextArea maxLength={1000} style={{ resize: 'none', height: '100px' }} allowClear={true} autoSize={true} placeholder='Enter other description here...' />
                    </Form.Item>
                </Col>
            </Row>

            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                <Form.Item>
                    <Button htmlType='reset' className='viewButton' style={{ marginRight: '20px' }} type="primary" >
                        Cancel
                    </Button>
                </Form.Item>

                <Form.Item>
                    {contextHolder}

                    <Button htmlType='submit' className="viewButton" type="primary" disabled={isButtonDisabled}>
                        Submit
                    </Button>
                </Form.Item>
            </div>
        </Form>

    </>
}

export default AgentCreatePost;