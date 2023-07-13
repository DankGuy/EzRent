import { useState, useEffect } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload, message, Form, Row, Col, Input, Radio, Select, InputNumber, Checkbox, Button, Divider, Tooltip } from 'antd';
import FurnishTypeSelection from '../../../Components/FurnishTypeSelection';
import TextArea from 'antd/es/input/TextArea';
import { useNavigate } from 'react-router-dom';
import { getCurrentDateTime } from '../../../Components/timeUtils';
import { supabase, postCodeSupabase } from '../../../supabase-client';
import { RiInformationFill } from 'react-icons/ri';

function AgentCreatePost() {

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [postCode, setPostCode] = useState({
        value: '',
    });

    const [propertyState, setPropertyState] = useState('');
    const [propertyCity, setPropertyCity] = useState('');
    const [roomNum, setRoomNum] = useState(1);

    const [pFurnishType, setPFurnishType] = useState(null);
    const [pFurnishChecklist, setPFurnishChecklist] = useState([]);


    const [isRoom, setIsRoom] = useState(false)

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

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


    const [form] = Form.useForm();

    const furnishOption = [

        { label: "Clothes hanger", value: "Clothes hanger" },
        { label: "Clothes rack", value: "Clothes rack" },
        { label: "Refrigerator", value: "Refrigerator" },
        { label: "Dining table", value: "Dining table" },
        { label: "Shoe rack", value: "Shoe rack" },
        { label: "Sofa", value: "Sofa" },
        { label: "Television", value: "Television" },
        { label: "Water dispenser", value: "Water dispenser" },
        { label: "Water heater", value: "Water heater" },
        { label: "Washing machine", value: "Washing machine" },
        { label: "WiFi", value: "WiFi" },
    ];

    const roomFurnishOption = [
        { label: "Air-conditioner", value: "Air-conditioner" },
        { label: "Bed", value: "Bed" },
        { label: "Bed frame", value: "Bed frame" },
        { label: "Blanket", value: "Blanket" },
        { label: "Pillow", value: "Pillow" },
        { label: "Study desk", value: "Study desk" },
        { label: "Study chair", value: "Study chair" },
        { label: "Wardrobe", value: "Wardrobe" },
        { label: "Window curtain", value: "Window curtain" },
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


    useEffect(() => {
        console.log(pFurnishType)
        if (pFurnishType === 'Unfurnished') {
            form.setFieldsValue({ propertyFurnish: [] })
            setPFurnishChecklist([])
        } else if (pFurnishType === 'Fully Furnished') {
            form.setFieldsValue({ propertyFurnish: furnishOption.map((item) => item.value) })
            setPFurnishChecklist(furnishOption)
        } else if (pFurnishType === 'Partially Furnished') {
            form.setFieldsValue({ propertyFurnish: ['Refrigerator', 'Washing machine', 'Water heater'] })
            setPFurnishChecklist(['Refrigerator', 'Washing Machine', 'Water Heater'])
        }
    }, [pFurnishType])

    useEffect(() => {
        console.log(pFurnishChecklist)
        if (pFurnishChecklist.length === 0) {
            console.log('unfurnished')
            form.setFieldsValue({ propertyFurnishType: 'Unfurnished' })
            setPFurnishType('Unfurnished')
        } else if (pFurnishChecklist.length === furnishOption.length) {
            console.log('fully furnished')
            form.setFieldsValue({ propertyFurnishType: 'Fully Furnished' })
            setPFurnishType('Fully Furnished')
        } else {
            console.log('partially furnished')
            form.setFieldsValue({ propertyFurnishType: 'Partially Furnished' })
            setPFurnishType('Partially Furnished')
        }
    }, [pFurnishChecklist])

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

    const roomDetailForm = (index) => {
        return (
            <div key={index}>
                <Divider orientation="left" style={{ borderColor: 'gray' }} >Room {index}</Divider>
                <Row>
                    <Col span={4}>
                        <Form.Item name={`roomType${index}`} label="Room Type" required rules={[
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
                        <Form.Item name={`roomSquareFeet${index}`} label="Room Square Feet (sq.ft.)" required>
                            <InputNumber min={1} max={1000} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item
                            name={`roomFurnish${index}`}
                            label={
                                <div style={{ display: 'flex' }}>
                                    <span>Room Furnish</span>
                                    <Tooltip
                                        title="Room Furnish: Select checkboxes to indicate the 
                                                    furnishings present in your room. Tick all that apply 
                                                    to showcase your room's setup"
                                        placement='right'
                                        overlayStyle={{ maxWidth: '400px' }}
                                    >
                                        <div>
                                            <RiInformationFill style={{ marginLeft: '5px', color: 'gray' }} />
                                        </div>
                                    </Tooltip>
                                </div>
                            }
                            required={true}>
                            <Checkbox.Group
                                style={{
                                    width: '100%',
                                }}
                            >
                                <Row >
                                    {renderedRoomFurnish(index)}
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>
                    </Col>
                </Row>
            </div>
        )
    }


    const renderedFurnishOption = () => {

        let disabled = false;
        if (pFurnishType === 'Fully Furnished' || pFurnishType === 'Partially Furnished') {
            disabled = true;
        }

        const renderedFurnishOption = furnishOption.map((item) => {

            if (item.value === 'Refrigerator' || item.value === 'Washing machine' || item.value === 'Water heater') {

                return (
                    <Col span={6} key={item.value}
                    >
                        <Checkbox style={{
                            border: '1px solid #d9d9d9',
                            borderRadius: '5px',
                            marginBottom: '10px',
                            padding: '5px',
                            width: '80%',

                        }} value={item.value} disabled={disabled}>{item.label}</Checkbox>
                    </Col>
                )
            } else {
                return (
                    <Col span={6} key={item.value}
                    >
                        <Checkbox
                            style={{
                                width: '80%',
                                border: '1px solid #d9d9d9',
                                borderRadius: '5px',
                                marginBottom: '10px',
                                padding: '5px',
                            }}
                            value={item.value} >{item.label}</Checkbox>
                    </Col>
                )
            }

        })
        return renderedFurnishOption
    }

    const [checkedItems, setCheckedItems] = useState([]);

    const handleCheckboxChange = (value) => {
        if (checkedItems.includes(value)) {
            setCheckedItems(checkedItems.filter(item => item !== value));
        } else {
            setCheckedItems([...checkedItems, value]);
        }
    };


    const renderedRoomFurnish = (index) => {
        const renderedRoomFurnish = roomFurnishOption.map((item) => {
            return (
                <div key={`${item.value}${index}`}>
                    <Col span={4} 
                        style={{
                            border: '1px solid #d9d9d9',
                            borderRadius: '5px',
                            marginBottom: '10px',
                            padding: '5px',

                        }}>
                        <Checkbox
                            value={item.value}
                            checked={checkedItems.includes(item.value)}
                            onChange={() => handleCheckboxChange(item.value)}
                        >
                            {item.label}
                        </Checkbox>

                    </Col>
                    <Col span={2} key={item.value}>
                        {checkedItems.includes(item.value) &&
                            <InputNumber min={1} max={3} style={{ width: '50%' }} defaultValue={1} />
                        }
                    </Col>
                </div>

            )
        })
        return renderedRoomFurnish
    }



    const renderedFacility = () => {
        const renderedItemOption = facilityOption.map((item) => {

            return (
                <Col span={6} key={item.value}
                >
                    <Checkbox
                        style={{
                            width: '80%',
                            border: '1px solid #d9d9d9',
                            borderRadius: '5px',
                            marginBottom: '10px',
                            padding: '5px',

                        }} value={item.value} >{item.label}</Checkbox>
                </Col>
            )
        })
        return renderedItemOption
    }

    const handlePFurnishType = (value) => {
        setPFurnishType(value);
    };


    const handlePFurnishChecklist = (values) => {
        console.log(values)
        setPFurnishChecklist(values)
    }

    const validatePostcode = (value) => {
        if (value.length == 0) {
            setPropertyState('');
            setPropertyCity('');
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter valid postcode!',
            }
        }
        else {
            setPropertyState(value[0].state.state_name);
            setPropertyCity(value[0].state.post_office);
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
            setPropertyCity('');
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
                setPropertyCity('');
            } else {
                const { data, error } = await postCodeSupabase
                    .from('malaysia_postcode')
                    .select('postcode, post_office, state_code, state(state_name)')
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
                    setPropertyCity(data[0].post_office);
                } else {
                    setPropertyState('');
                    setPropertyCity('');
                }
            }
        }
    };

    //Funtion to upload propertyImage to supabase storage
    const uploadImage = async (e, id) => {

        //Get the length of the image array and upload the image to supabase storage
        e.fileList.forEach(async (image) => {
            const { data, error } = await supabase.storage
                .from('post')
                .upload(`${id}/${image.name}`, image.originFileObj, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (error) {
                console.log(error)
                return;
            }
        }
        )

    }



    const onFinish = async (e) => {

        console.log(e);
        console.log(e["propertyName"])
        let {
            propertyAddress, propertyBuiltupSize, propertyCategory,
            propertyCity, propertyDescription, propertyFacility,
            propertyFurnish, propertyFurnishType, propertyImage,
            propertyName, propertyPostcode, propertyRental,
            propertyState, propertyType, roomSquareFeet,
            roomType, masterRoomNum, mediumRoomNum, smallRoomNum } = e;

        const { data, error } = await postCodeSupabase
            .from('malaysia_postcode')
            .select('postcode, state_code, state(state_name)')
            .eq('postcode', propertyPostcode);

        if (error) {
            console.log(error)
            return;
        }

        if (data.length > 1) {
            propertyState = data[0].state.state_name;
        }
        const dateTime = getCurrentDateTime();

        const userID = (await supabase.auth.getUser()).data.user.id;

        // const { data: postData, error: postError } = await supabase
        //     .from('property_post')
        //     .insert([
        //         {
        //             postDate: dateTime,
        //             postType: 'Property',
        //             propertyType: propertyType,
        //             propertyName: propertyName,
        //             propertyPrice: propertyRental,
        //             propertySquareFeet: propertyBuiltupSize,
        //             propertyFurnish: propertyFurnish,
        //             propertyFacility: propertyFacility,
        //             propertyAgentID: userID,
        //             propertyAddress: propertyAddress,
        //             propertyCity: propertyCity,
        //             propertyPostcode: propertyPostcode,
        //             propertyState: propertyState,
        //             propertyFurnishType: propertyFurnishType,
        //             propertyCategory: propertyCategory,
        //             propertyRoomType: roomType,
        //             propertyRoomNumber: roomnumber,
        //             propertyRoomSquareFeet: roomSquareFeet,
        //             propertyDescription: propertyDescription,
        //             lastModifiedDate: dateTime,
        //         },
        //     ])
        //     .select('postID');

        // if (postError) {
        //     console.log(postError)
        // } else {
        //     if (postData && postData.length > 0) {
        //         uploadImage(propertyImage, postData[0].postID);
        //     } else {
        //         console.log("No data returned after insert");
        //     }
        // }


        // setIsButtonDisabled(true);

        // messageApi.open({
        //     type: 'success',
        //     content: 'Create successful. You will be redirected to the previous page within 3 seconds...',
        // });

        // setTimeout(() => {
        //     navigate("/agent/roomRental")
        // }, 3000);
    }

    const onFinishFailed = (e) => {
        console.log(e)
    }

    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };


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
            form={form}
            layout='vertical'
            size='middle'
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            scrollToFirstError={true}
            initialValues={{
                // propertyState: propertyState,
                propertyImage: null,
                propertyName: null,
                propertyAddress: null,
                propertyPostcode: null,
                propertyBuiltupSize: 1,
                propertyType: null,
                propertyCategory: 'Unit',
                propertyRoomNumber: 1,
                rentalPrice: 1,
                propertyFurnishType: null,
                propertyFurnish: pFurnishChecklist,
                propertyFacility: null,
                propertyDescription: null,
                roomSquareFeet: 1,
                roomType: null,
                roomFurnish: null,

            }}
        >

            <Row>
                <Col span={24}>
                    <Form.Item
                        name="propertyImage"
                        label="Property Image"
                        rules={[
                            {
                                required: true,
                                message: 'Please upload at least one image!',
                            },
                        ]}


                    >
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
            <fieldset
                style={{ border: '1px solid gray', padding: '10px', borderRadius: '10px' }}
            >
                <legend style={{ width: 'auto', borderBottom: 'none', marginLeft: '20px', marginBottom: '0px' }}>Property Details</legend>
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
                        <Form.Item required='true' name="propertyPostcode" label='Property Postcode' help={postCode.errorMsg} validateStatus={postCode.validateStatus} rules={[
                            {
                                required: true,
                                message: 'Please enter the property postcode!',
                            },
                        ]}>
                            <Input placeholder='Postcode' maxLength={5} style={{ width: '100%' }} onChange={handlePostCode} value={postCode.value} />
                        </Form.Item>
                    </Col>

                    <Col span={4} offset={1}>
                        <Form.Item name="propertyCity" label='Property City'>
                            <div style={{ paddingLeft: '10px', border: '1px solid #d9d9d9', width: 'auto', height: '30px', borderRadius: '5px', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{propertyCity}</div>
                        </Form.Item>
                    </Col>

                    <Col span={5} offset={1}>
                        <Form.Item name="propertyState" label='Property State'>
                            <div style={{ paddingLeft: '10px', border: '1px solid #d9d9d9', width: 'auto', height: '30px', borderRadius: '5px', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{propertyState}</div>
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

                </Row>
            </fieldset>

            <fieldset
                style={{ border: '1px solid gray', padding: '10px', borderRadius: '10px', marginTop: '20px' }}
            >
                <legend style={{ width: 'auto', borderBottom: 'none', marginLeft: '20px', marginBottom: '0px' }}>Unit/Room Details</legend>
                <Row>
                    <Col span={6}>
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
                                <Radio value='Unit'>Unit</Radio>
                                <Radio value='Room'>Room</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    {!isRoom ?
                        <Col span={6} offset={1}>
                            <Form.Item
                                name="propertyRoomNumber"
                                label='Property Room Number'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter the room number!',
                                    },
                                ]}>
                                <InputNumber
                                    min={1}
                                    max={10}
                                    style={{ width: '60%' }}
                                    onChange={(value) => { setRoomNum(value) }}
                                    value={roomNum}
                                />
                            </Form.Item>
                        </Col>

                        : null}

                    <Col span={4} offset={1}>
                        <Form.Item
                            name="rentalPrice"
                            label={isRoom ? 'Room Rental Price (RM)' : 'Unit Rental Price (RM)'}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter the rental price!',
                                },
                            ]}>

                            <InputNumber min={1} max={5000} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                {isRoom ? roomDetailForm(1) : Array.from({ length: roomNum }, (_, i) => roomDetailForm(i + 1))}
            </fieldset>
            <fieldset
                style={{ border: '1px solid gray', padding: '10px', borderRadius: '10px', marginTop: '20px' }}
            >
                <legend style={{ width: 'auto', borderBottom: 'none', marginLeft: '20px', marginBottom: '0px' }}>Property Furnish</legend>
                <Row>
                    <Col span={6}>
                        <Form.Item
                            required='true'
                            name="propertyFurnishType"
                            label={
                                <>
                                    <span>Property Furnish Type</span>
                                    <Tooltip
                                        title={
                                            <>
                                                <p>Property Furnish: Choose the appropriate furnishing type for the property.</p>
                                                <ul style={{ marginInlineStart: '-20px' }}>
                                                    <li>Unfurnished: No furnishings provided.</li>
                                                    <li>Partially Furnished: Essential furnishings included.</li>
                                                    <li>Fully Furnished: All furnishings provided.</li>
                                                </ul>
                                            </>

                                        }
                                        placement='right'
                                        overlayStyle={{ maxWidth: '1000px' }}
                                    >
                                        <div>
                                            <RiInformationFill style={{ marginLeft: '5px', color: 'gray' }} />
                                        </div>
                                    </Tooltip>
                                </>
                            }
                            rules={[
                                {
                                    required: true,
                                    message: 'Please choose the property furnish type!',
                                },
                            ]}>
                            <FurnishTypeSelection style={{ width: '70%' }} bordered={true} value={pFurnishType} onChange={handlePFurnishType} />
                        </Form.Item>
                    </Col>

                </Row>

                <Row>
                    <Col span={24}>
                        <Form.Item
                            name="propertyFurnish"
                        >
                            <Checkbox.Group
                                value={pFurnishChecklist}
                                onChange={handlePFurnishChecklist}
                            >
                                <Row >
                                    {renderedFurnishOption()}
                                </Row>


                            </Checkbox.Group>
                        </Form.Item>
                    </Col>
                </Row>
            </fieldset>
            <fieldset
                style={{ border: '1px solid gray', padding: '10px', borderRadius: '10px', marginTop: '20px' }}
            >
                <legend style={{ width: 'auto', borderBottom: 'none', marginLeft: '20px', marginBottom: '0px' }}>Property Facility</legend>
                <Row>
                    <Col span={24}>
                        <Form.Item
                            name="propertyFacility"
                        >
                            <Checkbox.Group>
                                <Row>
                                    {renderedFacility()}
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>
                    </Col>
                </Row>
            </fieldset>
            <fieldset
                style={{ border: '1px solid gray', padding: '10px', borderRadius: '10px', marginTop: '20px' }}
            >
                <legend style={{ width: 'auto', borderBottom: 'none', marginLeft: '20px', marginBottom: '0px' }}>Additional description</legend>

                <Row>
                    <Col span={20}>
                        <Form.Item name="propertyDescription">
                            <TextArea maxLength={1000} style={{ resize: 'none', height: '100px' }} allowClear={true} autoSize={true} placeholder='Enter other description here...' />
                        </Form.Item>
                    </Col>
                </Row>

                <Row style={{ marginTop: '0px' }}>
                    <Col span={20}>
                        <p style={{ fontStyle: 'italic' }}>*Please enter any additional description or information about the property.
                            This could include specific details, special features, or any other relevant
                            information you would like to highlight. Feel free to provide as much detail as
                            possible to help potential tenants get a better understanding of the property.</p>
                    </Col>
                </Row>
            </fieldset>

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