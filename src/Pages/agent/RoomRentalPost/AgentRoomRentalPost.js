import { useState, useEffect, Fragment } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload, message, Form, Row, Col, Input, Radio, Select, InputNumber, Checkbox, Button, Popconfirm, Divider, Tooltip } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import "./AgentRoomRentalPost.css"
import FurnishTypeSelection from '../../../Components/FurnishTypeSelection';
import { getCurrentDateTime } from '../../../Components/timeUtils';
import { supabase, postCodeSupabase } from '../../../supabase-client';
import { RiInformationFill } from 'react-icons/ri';


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
    const [propertyCity, setPropertyCity] = useState(post.propertyCity);
    const [roomNum, setRoomNum] = useState(post.propertyRoomNumber);

    const [pFurnishType, setPFurnishType] = useState(post.propertyFurnishType);
    const [pFurnishChecklist, setPFurnishChecklist] = useState(post.propertyFurnish);

    const [isRoom, setIsRoom] = useState(post.propertyCategory === 'Room' ? true : false);
    const [fileList, setFileList] = useState([]);


    const [roomFileList, setRoomFileList] = useState({});
    const handleRoomChange = (index, { fileList: newFileList }) => {
        setRoomFileList(prev => ({ ...prev, [index]: newFileList }));
    };


    useEffect(() => {
        window.scrollTo(0, 0);

    }, [isView])


    //Get the image list from supabase storage and set it to fileList
    useEffect(() => {
        const fetchPropertyImages = async () => {
            const { data: images, error } = await supabase
                .storage
                .from('post')
                .list(`${post.postID}/Property`);

            if (error) {
                console.log(error)
            } else {
                const urls = images.map(image => {
                    return {
                        uid: image.id,
                        name: image.name,
                        status: 'done',
                        url: `https://exsvuquqspmbrtyjdpyc.supabase.co/storage/v1/object/public/post/${post.postID}/Property/${image.name}`
                    }
                })
                setFileList(urls)
            }

            //set fields value
            form.setFieldsValue({ propertyImage: fileList })
        }


        const setRoomDetails = () => {
            const roomDetails = post.propertyRoomDetails;

            //iterate through the roomNum and set initial value for roomSquareFeet, roomType and roomFurnish
            Array.from({ length: roomNum }, (_, i) => i + 1).forEach((index) => {
                form.setFieldsValue({ [`roomSquareFeet${index}`]: roomDetails[index].roomSquareFeet })
                form.setFieldsValue({ [`roomType${index}`]: roomDetails[index].roomType })

                const roomFurnish = roomDetails[index].roomFurnish;

                const roomFurnishArray = [];

                for (const [key, value] of Object.entries(roomFurnish)) {
                    roomFurnishArray.push(key);
                    form.setFieldsValue({ [`roomFurnish${index}_${key}`]: value })
                }

                form.setFieldsValue({ [`roomFurnish${index}`]: roomFurnishArray })
            }
            )

            //set the checkedItems
            const checkedItems = {};

            Array.from({ length: roomNum }, (_, i) => i + 1).forEach((index) => {
                const roomFurnishArray = form.getFieldValue(`roomFurnish${index}`);

                const checkedItem = roomFurnishArray.map((item) => {
                    return item
                })

                checkedItems[index] = checkedItem;
            }
            )

            setCheckedItems(checkedItems);

        }

        const fetchRoomImages = async () => {
            //iterate through the roomdetails and get room type
            Array.from({ length: roomNum }, (_, i) => i + 1).forEach(async (index) => {
                const roomType = post.propertyRoomDetails[index].roomType;

                console.log(roomType);
                console.log(post.postID);

                const { data: images, error } = await supabase
                    .storage
                    .from('post')
                    .list(`${post.postID}/${roomType}`);

                if (error) {
                    console.log(error)
                } else {
                    console.log(images)
                    const urls = images.map(image => {
                        return {
                            uid: image.id,
                            name: image.name,
                            status: 'done',
                            url: `https://exsvuquqspmbrtyjdpyc.supabase.co/storage/v1/object/public/post/${post.postID}/${roomType}/${image.name}`
                        }
                    })

                    console.log(urls)

                    setRoomFileList(prev => ({ ...prev, [index]: urls }))

                }


            }
            )

            //Iterate and set fields value
            Array.from({ length: roomNum }, (_, i) => i + 1).forEach((index) => {
                form.setFieldsValue({ [`roomImage${index}`]: roomFileList[index] })
            }
            )


        }

        fetchPropertyImages();
        setRoomDetails();
        fetchRoomImages();

        console.log(roomFileList)

    }, [])



    useEffect(() => {
        console.log(roomFileList)
    }, [roomFileList])




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

    // useEffect(() => {
    //     //iterate through the roomNum and set initial value for roomSquareFeet
    //     Array.from({ length: roomNum }, (_, i) => i + 1).forEach((index) => {
    //         form.setFieldsValue({ [`roomSquareFeet${index}`]: 1 })
    //     }
    //     )

    // }, [roomNum])


    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const beforeUploadProperty = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }

        //Check if the file name already exists in the fileList
        const isDuplicate = fileList.some((item) => item.name === file.name);

        if (isDuplicate) {
            message.error('File name already exists!');
        }

        const value = isJpgOrPng && isLt2M && !isDuplicate;
        return value || Upload.LIST_IGNORE;
    };



    const beforeUploadRoom = (index) => (file) => {
        console.log(file)
        console.log(index)


        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }

        //Check if the file name already exists in the roomFileList of the index

        const isDuplicate = roomFileList[index]?.some((item) => item.name === file.name);


        if (isDuplicate) {
            message.error('File name already exists!');
        }

        const value = isJpgOrPng && isLt2M && !isDuplicate;
        return value || Upload.LIST_IGNORE;
    };

    const roomDetailForm = (index) => {
        return (
            <div key={index}>
                <Divider orientation="left" style={{ borderColor: '#d9d9d9' }} >Room {index}</Divider>
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
                            name={`roomImage${index}`}
                            label="Room Image"
                            rules={[
                                {
                                    validator: () => {
                                        if (roomFileList[index]?.length === 0) {
                                            return Promise.reject('Please upload at least one image!');
                                        }
                                        return Promise.resolve();
                                    }
                                }
                            ]}
                        >
                            <Upload
                                listType="picture-card"
                                fileList={roomFileList[index]}
                                onPreview={handlePreview}
                                onChange={handleRoomChange.bind(this, index)}
                                multiple={true}
                                beforeUpload={beforeUploadRoom(index)}
                                customRequest={dummyRequest}
                            >
                                {roomFileList[index]?.length >= 10 ? null : uploadButton}
                            </Upload>

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
                                                    furnishings present in your room and enter the quantity."
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

    const [checkedItems, setCheckedItems] = useState({});

    const handleCheckboxChange = (index, value) => {
        if (checkedItems[index] && checkedItems[index].includes(value)) {
            // Remove the checked item from the array
            const updatedItems = {
                ...checkedItems,
                [index]: checkedItems[index].filter((item) => item !== value),
            };
            setCheckedItems(updatedItems);
        } else {
            // Set the checked item to the given index
            const updatedItems = {
                ...checkedItems,
                [index]: checkedItems[index] ? [...checkedItems[index], value] : [value],
            };
            setCheckedItems(updatedItems);
        }
    };

    const renderedRoomFurnish = (index) => {
        const renderedRoomFurnish = roomFurnishOption.map((item) => {
            const inputName = `roomFurnish${index}_${item.value}`;

            return (
                <Fragment key={`${item.value}${index}`}>
                    <Col
                        span={7}
                        style={{
                            border: '1px solid #d9d9d9',
                            borderRadius: '5px',
                            marginBottom: '10px',
                            marginRight: '40px',
                            padding: '5px',
                            width: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            height: '40px',
                        }}
                    >
                        <Checkbox
                            value={item.value}
                            checked={checkedItems[index] && checkedItems[index].includes(item.value)}
                            onChange={() => handleCheckboxChange(index, item.value)}
                        >
                            {item.label}
                        </Checkbox>

                        {checkedItems[index] && checkedItems[index].includes(item.value) && (
                            <Form.Item
                                name={inputName}
                                style={{
                                    marginBottom: '0px',
                                }}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter the quantity!',
                                    },
                                ]}
                            >
                                <InputNumber
                                    placeholder="Quantity"
                                    min={1}
                                    max={3}
                                    bordered={false}
                                    style={{
                                        width: '50%',
                                        borderBottom: '1px solid #d9d9d9',
                                        marginBottom: '0px',
                                    }}
                                />
                            </Form.Item>
                        )}
                    </Col>
                </Fragment>
            );
        });

        return renderedRoomFurnish;
    };



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

    const deleteAllImages = async (id) => {
        // Get all folders in supabase storage
        const { data: folders, error: folderError } = await supabase.storage
            .from('post')
            .list(`${id}`);

        if (folderError) {
            console.log(folderError);
        }

        console.log(folders);

        // Iterate the folders and delete all the files in each folder
        for (const folder of folders) {
            const folderName = folder.name;

            const { data: files, error: fileError } = await supabase.storage
                .from('post')
                .list(`${id}/${folderName}`);

            if (fileError) {
                console.log(fileError);
            }

            console.log(files);

            for (const file of files) {
                const filename = file.name;

                const { data, error } = await supabase.storage
                    .from('post')
                    .remove([`${id}/${folderName}/${filename}`]);

                if (error) {
                    console.log(error);
                    return;
                }
            }
        }
    };



    //Funtion to upload propertyImage to supabase storage
    const uploadImage = async (e, id) => {
        console.log(id);

        console.log(fileList);

        try {

            // Get all folders in supabase storage
            const { data: folders, error: folderError } = await supabase.storage
                .from('post')
                .list(`${id}`);

            if (folderError) {
                console.log(folderError);
            }

            console.log(folders);

            // Iterate the folders and delete all the files in each folder
            for (const folder of folders) {
                const folderName = folder.name;

                const { data: files, error: fileError } = await supabase.storage
                    .from('post')
                    .list(`${id}/${folderName}`);

                if (fileError) {
                    console.log(fileError);
                }

                console.log(files);

                for (const file of files) {
                    const filename = file.name;

                    const { data, error } = await supabase.storage
                        .from('post')
                        .remove([`${id}/${folderName}/${filename}`]);

                    if (error) {
                        console.log(error);
                        return;
                    }
                }
            }

            // Get the length of the image array and upload the images to supabase storage
            for (const image of fileList) {
                const { data, error } = await supabase.storage
                    .from('post')
                    .upload(`${id}/Property/${image.name}`, image.originFileObj, {
                        cacheControl: '3600',
                        upsert: false,
                    });

                if (error) {
                    console.log(error);
                    return;
                }
            }

            

            // Upload room images
            for (const index of Array.from({ length: roomNum }, (_, i) => i + 1)) {
                const roomType = e[`roomType${index}`];


                if (roomFileList[index].length > 0) {
                    for (const image of roomFileList[index]) {
                        const { data, error } = await supabase.storage
                            .from('post')
                            .upload(`${id}/${roomType}/${image.name}`, image.originFileObj, {
                                cacheControl: '3600',
                                upsert: false,
                            });

                        if (error) {
                            console.log(error);
                            return;
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error);
            // Handle any other unexpected errors
        }
    };






    const onFinish = async (e) => {

        console.log(fileList);
        console.log(e);
        console.log(e["propertyName"])

        let propertyState = '';
        let propertyCity = '';

        const { data, error } = await postCodeSupabase
            .from('malaysia_postcode')
            .select('postcode, post_office, state_code, state(state_name)')
            .eq('postcode', e["propertyPostcode"])
            .limit(1);

        if (error) {
            console.log(error)
            return;
        }

        if (data.length == 1) {
            propertyState = data[0].state.state_name;
            propertyCity = data[0].post_office;
        }
        const dateTime = getCurrentDateTime();

        const userID = (await supabase.auth.getUser()).data.user.id;

        const roomDetails = {};

        //iterate and push the value into the array
        Array.from({ length: roomNum }, (_, i) => i + 1).forEach((index) => {

            const roomFurnishArray = e[`roomFurnish${index}`];
            const roomType = e[`roomType${index}`];
            const roomSquareFeet = e[`roomSquareFeet${index}`];

            const roomFurnishQuantites = {};

            roomFurnishArray.forEach((furnish) => {
                const furnishQuantity = e[`roomFurnish${index}_${furnish}`];
                roomFurnishQuantites[furnish] = furnishQuantity;
            });

            roomDetails[index] = {
                roomType: roomType,
                roomSquareFeet: roomSquareFeet,
                roomFurnish: roomFurnishQuantites,
            }

        }
        )

        console.log(roomDetails)

        const { data: postData, error: postError } = await supabase
            .from('property_post')
            .update(
                {
                    postDate: dateTime,
                    postType: 'Property',
                    propertyType: e["propertyType"],
                    propertyName: e["propertyName"],
                    propertyPrice: e["rentalPrice"],
                    propertySquareFeet: e["propertyBuiltupSize"],
                    propertyFurnish: e["propertyFurnish"],
                    propertyFurnishType: e["propertyFurnishType"],
                    propertyFacility: e["propertyFacility"],
                    propertyAgentID: userID,
                    propertyAddress: e["propertyAddress"],
                    propertyCity: propertyCity,
                    propertyPostcode: e["propertyPostcode"],
                    propertyState: propertyState,
                    propertyCategory: e["propertyCategory"],
                    propertyDescription: e["propertyDescription"],
                    lastModifiedDate: dateTime,
                    propertyRoomNumber: e["propertyRoomNumber"],
                    propertyRoomDetails: roomDetails,
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


            uploadImage(e, post.postID);


            messageApi.loading('Editing post...', 3);

            setTimeout(() => {
                messageApi.success('Edit successful. You will be redirected to the previous page within 1 second...', 1);

                setTimeout(() => {
                    navigate("/agent/roomRental");
                }, 1000);
            }, 3000);

        }
    }

    const onFinishFailed = (e) => {
        //display error message
        messageApi.error('Please fill in all the required fields!');

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

        //Delete images from storage
        deleteAllImages(post.postID);

        messageApi.open({
            type: 'success',
            content: 'Delete successful. You will be redirected to previous page within 3 seconds...',
        });

        setTimeout(() => {
            navigate("/agent/roomRental")
        }, 3000);
    }

    const handleButtonCancel = () => {
        form.resetFields();
        navigate("/agent/roomRental");
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
                    <Button className='viewButton' style={{ marginRight: '20px', width: '100px' }} type="primary" onClick={handleButtonCancel} >
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
                alt="Property Image"
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
                propertyName: post.propertyName,
                propertyAddress: post.propertyAddress,
                propertyPostcode: post.propertyPostcode,
                propertyBuiltupSize: post.propertySquareFeet,
                propertyType: post.propertyType,
                propertyCategory: post.propertyCategory,
                propertyRoomNumber: post.propertyRoomNumber,
                rentalPrice: post.propertyPrice,
                propertyFurnishType: post.propertyFurnishType,
                propertyFurnish: post.propertyFurnish,
                propertyFacility: post.propertyFacility,
                propertyDescription: post.propertyDescription,

            }}
        >
            <fieldset
                style={{
                    border: '1px solid #d9d9d9',
                    borderRadius: '5px',
                    padding: '10px',
                }}
            >
                <legend style={{ width: 'auto', borderBottom: 'none', marginLeft: '20px', marginBottom: '0px' }}>Property Details</legend>
                <Row>
                    <Col span={24}>
                        <Form.Item
                            name="propertyImage"
                            label="Property Image"
                            //rules to validate if the filelist is empty
                            rules={[
                                {
                                    validator: () => {
                                        if (fileList.length === 0) {
                                            return Promise.reject('Please upload at least one image!');
                                        }
                                        return Promise.resolve();
                                    }
                                }
                            ]}
                        >
                            <Upload
                                listType="picture-card"
                                fileList={fileList}
                                onPreview={handlePreview}
                                onChange={handleChange}
                                multiple={true}
                                beforeUpload={beforeUploadProperty}
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
                            <InputNumber min={1} max={10000} style={{ width: '100%' }} />
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
                    {/* <Col span={6} offset={1}>
                        <Form.Item required='true' name="propertyFurnishType" label='Property Furnish Type' rules={[
                            {
                                required: true,
                                message: 'Please choose the property furnish type!',
                            },
                        ]}>
                            <FurnishTypeSelection value={post.propertyFurnishType} bordered={true} />
                        </Form.Item>
                    </Col> */}
                </Row>
            </fieldset>
            <fieldset
                style={{ border: '1px solid #d9d9d9', padding: '10px', borderRadius: '10px', marginTop: '20px' }}
            >
                <legend style={{ width: 'auto', borderBottom: 'none', marginLeft: '20px', marginBottom: '0px' }}>Unit/Room Details</legend>
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
                style={{ border: '1px solid #d9d9d9', padding: '10px', borderRadius: '10px', marginTop: '20px' }}
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
                style={{ border: '1px solid #d9d9d9', padding: '10px', borderRadius: '10px', marginTop: '20px' }}
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
                style={{ border: '1px solid #d9d9d9', padding: '10px', borderRadius: '10px', marginTop: '20px' }}
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
        </Form>
        {showButton()}


    </>
}

export default AgentRoomRentalPost;