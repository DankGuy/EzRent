import { Button, Modal, Steps, theme, message, Form, Input, Select, DatePicker, Radio, Divider, Card, InputNumber, Slider, Row, Col, Tooltip } from "antd";
import { useState, useRef } from "react";
import { supabase } from "../../../supabase-client";
import { getCurrentDateTime } from "../../../Components/timeUtils";
import { useEffect } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { RiInformationFill } from "react-icons/ri";


function CreateRoommatePost({ value, onModalChange, onTrigger }) {

    const { Step } = Steps;
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});

    const [hasRentedProperty, setHasRentedProperty] = useState(false);
    const [rentedProperty, setRentedProperty] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [selectedValues, setSelectedValues] = useState([]);
    const [inputValue, setInputValue] = useState('');


    const [form] = Form.useForm();
    const inputRef = useRef(null);

    // useEffect(() => {
    //     console.log("Selected values:", selectedValues);
    // }, [selectedValues]);


    const handleYesNo = (e) => {
        if (e.target.value === 'yes') {
            setHasRentedProperty(true);
        } else {
            setHasRentedProperty(false);
        }
    }

    const handleSearch = async (value) => {
        setIsLoading(true);

        //Get post details from database
        const { data: post, error } = await supabase
            .from('rental_agreement')
            .select('*, postID(*)')
            .eq('rentalAgreementID', value)
            .single();

        if (error) {
            message.error("Invalid rental agreement ID");
        }
        setRentedProperty(post);
        setIsLoading(false);
    }

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleInputKeyPress = (event) => {
        if (event.key === 'Enter' && inputValue.trim() !== '') {
            const trimmedValue = inputValue.trim();
            setSelectedValues(prevValues => [...prevValues, trimmedValue]);
            setInputValue('');
            form.setFieldValue('locationSelection', '');
            inputRef.current.focus({ cursor: 'end' });
        }
    };

    useEffect(() => {
        console.log("Inside useEffect - selectedValues:", selectedValues);
    }, [selectedValues]);

    // useEffect(() => {
    //     console.log("Inside useEffect - INPUT VALUE:", inputValue);
    // }, [inputValue]);


    const handleRemoveValue = (value) => {
        console.log("Removing value:", value);
        setSelectedValues(selectedValues.filter((v) => v !== value));
    };

    const stepsData = [
        {
            title: 'Property Details',
            formRef: useRef(),
            content: <div style={{ marginLeft: '5%' }}>
                <Form.Item name="rentedProperty" label="Do you have a rented property?">
                    <Radio.Group onChange={handleYesNo}>
                        <Radio value="yes">Yes</Radio>
                        <Radio value="no">No</Radio>
                    </Radio.Group>
                </Form.Item>
                {hasRentedProperty &&
                    <>
                        <Form.Item name="rentalAgreementID" label="Enter your rental agreement ID">
                            <Input.Search placeholder="Rental Agreement ID" enterButton={true} allowClear loading={isLoading} onSearch={handleSearch} />
                        </Form.Item>
                    </>}
                <div>
                    {hasRentedProperty && rentedProperty &&


                        <Card
                            style={{ width: '50%', marginBottom: "15px" }}
                            title="Property Details"
                            headStyle={{ backgroundColor: "#fafafa", borderBottom: "1px solid #e8e8e8" }}
                            bodyStyle={{ padding: "2px 0 2px 10px" }}
                        >
                            <p>Property Name: {rentedProperty.postID.propertyName}</p>
                            <p>Property Address: {rentedProperty.postID.propertyAddress}, {rentedProperty.postID.propertyPostcode}, {rentedProperty.postID.propertyCity}, {rentedProperty.postID.propertyState}</p>
                        </Card>
                    }
                    {
                        hasRentedProperty && !rentedProperty &&
                        <div>
                            <h3>No Results Found...</h3>
                        </div>
                    }
                </div>
                {!hasRentedProperty &&
                    <div>
                        <Row>
                            <Col span={12}>

                                <Form.Item 
                                    name="locationSelection" 
                                    label={
                                        <>
                                            <span>Preferred Location(s)</span>
                                            <Tooltip
                                                title={
                                                    <>
                                                        <p>You can input multiple preferred locations by pressing 'Enter' after typing each one.</p>
                                                    </>
        
                                                }
                                                placement='right'
                                                overlayStyle={{ maxWidth: '300px' }}
                                            >
                                                <div>
                                                    <RiInformationFill style={{ marginLeft: '5px', color: 'gray' }} />
                                                </div>
                                            </Tooltip>
                                        </>
                                    }
                                    style={{ marginBottom: '0px' }}>

                                    <Input
                                        // placeholder="Location"
                                        value={inputValue}
                                        style={{ width: '80%' }}
                                        onPressEnter={handleInputKeyPress}
                                        onChange={handleInputChange}
                                        ref={inputRef}
                                    />
                                </Form.Item>
                                {selectedValues.map((v) => (
                                    <span key={v} style={{
                                        display: 'inline-flex',  // Use flex display to align items vertically
                                        alignItems: 'center',    // Align items vertically centered
                                        margin: '3px',
                                        padding: '3px 5px',
                                        border: '1px solid #ccc',
                                        borderRadius: '3px',
                                        backgroundColor: '#f0f0f0',
                                    }}>
                                        {v}
                                        <MdOutlineCancel onClick={() => handleRemoveValue(v)} style={{ cursor: 'pointer', marginLeft: '5px' }} />
                                    </span>

                                ))}

                            </Col>
                            <Col span={12}>
                                <Form.Item name="propertySelection" label="Property Type">
                                    <Select placeholder="Select" style={{ width: '50%' }}
                                        options={[
                                            { value: 'Apartment', label: 'Apartment' },
                                            { value: 'Condominium', label: 'Condominium' },
                                            { value: 'Flat', label: 'Flat' },
                                            { value: 'Terrace house', label: 'Terrace house' },
                                        ]} />
                                </Form.Item>

                            </Col>
                        </Row>
                        <Row>

                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item name="budgetInput" label="Budget (RM)">
                                    <InputNumber placeholder="Budget" style={{ width: '50%' }} min={0} />
                                </Form.Item>

                            </Col>
                        </Row>
                    </div>}
            </div>
        }
        ,

        {
            title: 'Rental Details',
            formRef: useRef(),
            content: <div style={{ marginLeft: '5%' }}>

                <Form.Item name="moveInDate" label="Move-in Date">
                    <DatePicker placeholder="Select" />
                </Form.Item>
                <Form.Item name="rentDuration" label="Rent Duration">
                    <Select placeholder="Select" style={{ width: '21%' }}
                        options={[
                            { value: '3 months', label: '3 months' },
                            { value: '6 months', label: '6 months' },
                            { value: '12 months', label: '12 months' },
                            { value: '24 months', label: '24 months' }
                        ]} />
                </Form.Item>
            </div>
        },
        {
            title: 'Roommate Preferences',
            formRef: useRef(),
            content: <div style={{ marginLeft: '5%' }}>
                <Form.Item name="preferredAge" label="Age">
                    <Slider range step={3} min={1} max={60} style={{ margin: '10px' }} />
                </Form.Item>
                <Row>
                    <Col span={12}>
                        <Form.Item name="preferredGender" label="Gender">
                            <Radio.Group>
                                <Radio value="Male">Male</Radio>
                                <Radio value="Female">Female</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="studentType" label="Student Type">
                            <Radio.Group>
                                <Radio value="Local">Local</Radio>
                                <Radio value="International">International</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item name="preferredRace" label="Race">
                            <Select placeholder="Select" style={{ width: '50%' }}
                                options={[
                                    { value: 'Malay', label: 'Malay' },
                                    { value: 'Chinese', label: 'Chinese' },
                                    { value: 'Indian', label: 'Indian' },
                                    { value: 'Others', label: 'Others' }
                                ]} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="preferredReligion" label="Religion">
                            <Select placeholder="Select" style={{ width: '50%' }}
                                options={[
                                    { value: 'Islam', label: 'Islam' },
                                    { value: 'Buddhism', label: 'Buddhism' },
                                    { value: 'Christianity', label: 'Christianity' },
                                    { value: 'Hinduism', label: 'Hinduism' },
                                    { value: 'Others', label: 'Others' }
                                ]} />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item name="description" label="Description">
                    <Input.TextArea placeholder="Description" style={{ height: 100 }} />
                </Form.Item>
            </div>
        },
        {
            title: 'My Lifestyle',
            formRef: useRef(),
            content: <div style={{ marginLeft: '5%', marginRight: '5%' }}>
                <Row>
                    <Col span={12}>
                        <Form.Item name="cleanliness" label="My Cleanliness">
                            <Select placeholder="Select" style={{ width: '50%' }}
                                options={[
                                    { value: 'Clean', label: 'Clean' },
                                    { value: 'Average', label: 'Average' },
                                    { value: 'Messy', label: 'Messy' },
                                ]} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="smoking" label="Smoking">
                            <Select placeholder="Select" style={{ width: '50%' }}
                                options={[
                                    { value: 'Yes', label: 'Yes' },
                                    { value: 'No', label: 'No' },
                                    { value: 'Outside only', label: 'Outside only' },
                                ]} />
                        </Form.Item>

                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item name="getUp" label="Get up">
                            <Select placeholder="Select" style={{ width: '50%' }}
                                options={[
                                    { value: 'Before 6am', label: 'Before 6am' },
                                    { value: 'Before 8am', label: 'Before 8am' },
                                    { value: 'Before 10am', label: 'Before 10am' },
                                    { value: 'After 10am', label: 'After 10am' },
                                    { value: 'After 12am', label: 'After 12am' },
                                ]} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="goToBed" label="Go to bed">
                            <Select placeholder="Select" style={{ width: '50%' }}
                                options={[
                                    { value: 'Before 10pm', label: 'Before 10pm' },
                                    { value: 'Before 12am', label: 'Before 12am' },
                                    { value: 'After 12am', label: 'After 12am' },
                                ]} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item name="pets" label="Pets">
                            <Select placeholder="Select" style={{ width: '50%' }}
                                options={[
                                    { value: 'Yes', label: 'Yes' },
                                    { value: 'No', label: 'No' },
                                ]} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="foodPreference" label="Food Preference">
                            <Select placeholder="Select" style={{ width: '50%' }}
                                options={[
                                    { value: 'Vegetarian', label: 'Vegetarian' },
                                    { value: 'Non-vegetarian', label: 'Non-vegetarian' },
                                    { value: 'Halal', label: 'Halal' },
                                    { value: 'Non-halal', label: 'Non-halal' },
                                ]} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item name="guests" label="Overnight Guests">
                            <Select placeholder="Select" style={{ width: '50%' }}

                                options={[
                                    { value: 'Never', label: 'Never' },
                                    { value: 'Rarely', label: 'Rarely' },
                                    { value: 'Occasionally', label: 'Occasionally' },
                                    { value: 'Frequently', label: 'Frequently' },
                                ]} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="party" label="Party Habits">
                            <Select placeholder="Select" style={{ width: '50%' }}
                                options={[
                                    { value: 'Rarely', label: 'Rarely' },
                                    { value: 'Occasionally', label: 'Occasionally' },
                                    { value: 'Frequently', label: 'Frequently' },
                                ]} />
                        </Form.Item>
                    </Col>
                </Row>


            </div>
        },
    ]


    const handleTrigger = () => {
        console.log("Triggered");
        onTrigger();
    }

    const insertPost = async (values) => {
        const currentDate = getCurrentDateTime();
        const userID = (await supabase.auth.getUser()).data.user.id;

        try {
            const { data, error } = await supabase
                .from('roommate_post')
                .insert([
                    {
                        postDate: currentDate,
                        lastModifiedDate: currentDate,
                        postType: 'roommate',
                        moveInDate: values.moveInDate,
                        roommate: {
                            age: values.preferredAge,
                            gender: values.preferredGender,
                            studentType: values.studentType,
                            race: values.preferredRace,
                            religion: values.preferredReligion,
                            description: values.description,
                        },
                        myLifestyle: {
                            cleanliness: values.cleanliness,
                            smoking: values.smoking,
                            getUp: values.getUp,
                            goToBed: values.goToBed,
                            pets: values.pets,
                            foodPreference: values.foodPreference,
                            guests: values.guests,
                            party: values.party,
                        },
                        moveInDate: values.moveInDate,
                        duration: values.rentDuration,
                        location: (values.rentalAgreementID) ? [] : selectedValues,
                        propertyType: (values.rentalAgreementID) ? null : values.propertySelection,
                        budget: (values.rentalAgreementID) ? null : values.budgetInput,
                        rentalAgreementID: (values.rentalAgreementID) ? values.rentalAgreementID : null,
                        studentID: userID,
                    },
                ]);

            if (error) {
                throw error;
            }

            message.success("Post created successfully");

        } catch (error) {
            message.error(error.message);
        }
    }


    const validate = async (values) => {
        const userID = (await supabase.auth.getUser()).data.user.id;

        const { data: post, error } = await supabase
            .from('roommate_post')
            .select('*')
            .eq('studentID', userID)
            .eq('rentalAgreementID', values.rentalAgreementID)

        if (error) {
            console.log(error);
            return;
        }

        console.log("Post:", post);
        if (post.length > 0) {
            message.error("You have already posted a roommate post for this rental agreement");
            return true;
        }

        console.log("Selected values:", selectedValues);
        const { data: post2, error2 } = await supabase
            .from('roommate_post')
            .select('*')
            .eq('studentID', userID)
            .is('rentalAgreementID', null);

        if (error2) {
            console.log(error2);
            return;
        }

        console.log("Post2:", post2);
        let hasMatchingLocation = false; // Initialize the variable

        post2.forEach((post) => {
            if (post.location.length === selectedValues.length &&
                post.location.every(element => selectedValues.includes(element))) {
                hasMatchingLocation = true; // Set the variable to true if the condition is met
            }
        });

        if (hasMatchingLocation) {
            message.error("You have already posted a roommate post with the same location");
            return true;
        }
        return false;
    }

    const handleCloseModal = () => {
        onModalChange(false);
    }

    const handleFormFinish = async (e) => {
        e.preventDefault();
        console.log("Form finished");
        const currentForm = stepsData[currentStep].formRef.current;

        try {
            const values = await currentForm.validateFields();
            setFormData((prev) => ({ ...prev, ...values }));

            // validate to ensure that the user has not reposted the same post
            const hasSamePost = await validate(values);

            if (!hasSamePost) {
                await insertPost(values);
            }

            currentForm.resetFields();
            handleTrigger();
            handleCloseModal();
            setCurrentStep(0);
            setHasRentedProperty(false);
            setRentedProperty(null);
            setSelectedValues([]);


        } catch (error) {
            console.error("Error:", error);
        }
    };


    const handleNextStep = () => {
        const currentForm = stepsData[currentStep].formRef.current;
        currentForm.validateFields().then((values) => {
            setFormData((prev) => ({ ...prev, ...values }));
            setCurrentStep((prev) => prev + 1);
        });
    };

    return <>

        <Modal
            title="Create Roommate Post"
            open={value}
            footer={null}
            onCancel={() => onModalChange(false)}
            width={800}
            bodyStyle={{ height: 500, overflowX: 'hidden', overflowY: 'scroll', paddingRight: '10px', paddingTop: '10px' }}
        >

            <div>
                <Steps
                    current={currentStep}
                    size="default"
                    direction="horizontal"
                    progressDot
                    items={stepsData.map((item) => ({ title: item.title }))}
                />

                <Form
                    onFinish={handleFormFinish}
                    form={form}
                    ref={stepsData[currentStep].formRef}
                    style={{ marginTop: 20 }}
                    layout="vertical"
                    initialValues={
                        {
                            rentedProperty: 'no',
                            preferredGender: 'Male',
                            preferredAge: [18, 30],
                            studentType: 'Local',
                        }
                    }
                >
                    {stepsData.map((item, index) => (
                        <div key={index} style={{ display: index === currentStep ? 'block' : 'none' }}>
                            {item.content}

                            {/* Cancel button */}
                            <div style={{ marginLeft: '5%' }}>
                                {index !== 0 &&
                                    <Button
                                        style={{ marginRight: 10 }}
                                        onClick={() => setCurrentStep((prev) => prev - 1)}
                                    >
                                        Back
                                    </Button>
                                }

                                <Button
                                    type="primary"
                                    disabled={
                                        index === 0 && hasRentedProperty && !rentedProperty ? true : false
                                    }
                                    onClick={index === stepsData.length - 1 ? handleFormFinish : handleNextStep}
                                >
                                    {index === stepsData.length - 1 ? 'Submit' : 'Next'}
                                </Button>
                            </div>
                        </div>
                    ))}
                </Form>
            </div>

        </Modal>
    </>
}

export default CreateRoommatePost;