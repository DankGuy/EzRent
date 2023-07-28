import { Button, Modal, Steps, theme, message, Form, Input, Select, DatePicker, Radio, Divider, Card, InputNumber, Slider } from "antd";
import { useState, useRef } from "react";
import { supabase } from "../../../supabase-client";


function CreateRoommatePost({ value, onChange }) {

    const { Step } = Steps;
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});

    const [hasRentedProperty, setHasRentedProperty] = useState(false);
    const [rentedProperty, setRentedProperty] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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
            .eq('postID', value)
            .single();

        if (error) {
            message.error("Invalid property post ID");
        }
        setRentedProperty(post);
        setIsLoading(false);
    }

    const stepsData = [
        {
            title: 'Property Details',
            formRef: useRef(),
            content: <div style={{marginLeft: '5%'}}>
                <Form.Item name="rentedProperty" label="Do you have a rented property?">
                    <Radio.Group onChange={handleYesNo}>
                        <Radio value="yes">Yes</Radio>
                        <Radio value="no">No</Radio>
                    </Radio.Group>
                </Form.Item>
                {hasRentedProperty &&
                    <>
                        <Form.Item name="rentedPropertyId" label="Enter your rented property post ID">
                            <Input.Search placeholder="Rented Property ID" enterButton={true} allowClear loading={isLoading} onSearch={handleSearch} />
                        </Form.Item>
                    </>}
                <div>
                    {hasRentedProperty && rentedProperty &&


                        <Card
                            style={{ width: '50%', marginBottom: "15px" }}
                            title="Property Details"
                            headStyle={{ backgroundColor: "#fafafa" }}
                            bodyStyle={{ padding: "10px" }}
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
                        <Form.Item name="locationSelection" label="Preferred Location">
                            <Input placeholder="Location" style={{width: '30%'}}/>
                        </Form.Item>
                        <Form.Item name="propertySelection" label="Property Type">
                            <Select placeholder="All Property Type" style={{ width: '30%' }}
                                options={[
                                    { value: 'Apartment', label: 'Apartment' },
                                    { value: 'Condominium', label: 'Condominium' },
                                    { value: 'Flat', label: 'Flat' },
                                    { value: 'Terrace house', label: 'Terrace house' },
                                ]} />
                        </Form.Item>
                        <Form.Item name="budgetInput" label="Budget">
                            <InputNumber placeholder="Budget" style={{ width: '21%' }} />
                        </Form.Item>
                    </div>}
            </div>
        }
        ,

        {
            title: 'Rental Details',
            formRef: useRef(),
            content: <div style={{marginLeft: '5%'}}>

                <Form.Item name="moveInDate" label="Move-in Date">
                    <DatePicker placeholder="Move-in Date" />
                </Form.Item>
                <Form.Item name="rentDuration" label="Rent Duration">
                    <Select placeholder="Rent Duration" style={{ width: '21%' }}
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
            content: <div style={{marginLeft: '5%'}}>
                <Form.Item name="preferredAge" label="Age">
                    <Slider range step={3}  min={1} max={60} style={{ margin: '10px' }} />
                </Form.Item>
                <Form.Item name="preferredGender" label="Gender">
                    <Radio.Group>
                        <Radio value="male">Male</Radio>
                        <Radio value="female">Female</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item name="preferredRace" label= "Race">
                    <Select placeholder="Race" style={{ width: '21%' }}
                        options={[
                            { value: 'Malay', label: 'Malay' },
                            { value: 'Chinese', label: 'Chinese' },
                            { value: 'Indian', label: 'Indian' },
                            { value: 'Others', label: 'Others' }
                        ]} />
                </Form.Item>
                <Form.Item name="preferredReligion" label="Religion">
                    <Select placeholder="Religion" style={{ width: '21%' }}
                        options={[
                            { value: 'Islam', label: 'Islam' },
                            { value: 'Buddhism', label: 'Buddhism' },
                            { value: 'Christianity', label: 'Christianity' },
                            { value: 'Hinduism', label: 'Hinduism' },
                            { value: 'Others', label: 'Others' }
                        ]} />
                </Form.Item>
                <Form.Item name="studentType" label="Student Type">
                    <Radio.Group>
                        <Radio value="local">Local</Radio>
                        <Radio value="international">International</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item name="description" label="Description">
                    <Input.TextArea placeholder="Description" style={{ height: 100 }} />
                </Form.Item>
            </div>
        },
        {
            title: 'My Lifestyle',
            formRef: useRef(),
            content: <div style={{marginLeft: '5%', marginRight: '20%'}}>
                <Form.Item name="cleanliness" label="Cleanliness"> 
                    <Select placeholder="Cleanliness" style={{ width: '50%' }}
                        options={[
                            { value: 'Clean', label: 'Clean' },
                            { value: 'Average', label: 'Average' },
                            { value: 'Messy', label: 'Messy' },
                        ]} />
                </Form.Item>
                <Form.Item name="getUp" label="Get up">
                    <Select placeholder="Get up"  style={{ width: '50%' }}
                        options={[
                            { value: 'Before 6am', label: 'Before 6am' },
                            { value: 'Before 8am', label: 'Before 8am' },
                            { value: 'Before 10am', label: 'Before 10am' },
                            { value: 'After 10am', label: 'After 10am' },
                            { value: 'After 12am', label: 'After 12am' },
                        ]} />
                </Form.Item>
                <Form.Item name="goToBed" label="Go to bed">
                    <Select placeholder="Go to bed" style={{ width: '50%' }}
                        options={[
                            { value: 'Before 10pm', label: 'Before 10pm' },
                            { value: 'Before 12am', label: 'Before 12am' },
                            { value: 'After 12am', label: 'After 12am' },
                        ]} />
                </Form.Item>
                <Form.Item name="smoking" label="Smoking">
                    <Select placeholder="Smoking" style={{ width: '50%' }}
                        options={[
                            { value: 'Yes', label: 'Yes' },
                            { value: 'No', label: 'No' },
                            { value: 'Outside only', label: 'Outside only' },
                        ]} />
                </Form.Item>
                <Form.Item name="pets" label="Pets">
                    <Select placeholder="Pets" style={{ width: '50%' }}
                        options={[
                            { value: 'Yes', label: 'Yes' },
                            { value: 'No', label: 'No' },
                        ]} />
                </Form.Item>
                <Form.Item name="foodPreference" label="Food Preference">
                    <Select placeholder="Food Preference" style={{ width: '50%' }}
                        options={[
                            { value: 'Vegetarian', label: 'Vegetarian' },
                            { value: 'Non-vegetarian', label: 'Non-vegetarian' },
                            { value: 'Halal', label: 'Halal' },
                            { value: 'Non-halal', label: 'Non-halal' },
                        ]} />
                </Form.Item>
            </div>
        },
    ]

    const handleFormFinish = () => {
        const currentForm = stepsData[currentStep].formRef.current;
        currentForm.validateFields().then((values) => {
            console.log(values);
            setFormData((prev) => ({ ...prev, ...values }));
        });
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
            onCancel={() => onChange(false)}
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
                    ref={stepsData[currentStep].formRef}
                    style={{ marginTop: 20 }}
                    layout="vertical"
                    initialValues={
                        {
                            rentedProperty: 'no',
                            preferredGender: 'male',
                            preferredAge: [18, 30],
                            studentType: 'local',
                        }
                    }
                >
                    {stepsData.map((item, index) => (
                        <div key={index} style={{ display: index === currentStep ? 'block' : 'none' }}>
                            {item.content}

                            {/* Cancel button */}
                            <div style={{marginLeft: '5%'}}> 
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