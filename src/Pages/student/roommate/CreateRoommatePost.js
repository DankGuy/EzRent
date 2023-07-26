import { Button, Modal, Steps, theme, message, Form, Input, Select, DatePicker, Radio, Divider, Card, InputNumber } from "antd";
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
            title: 'Rented Property Details',
            formRef: useRef(),
            content: <div>
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
                            headStyle={{backgroundColor: "#fafafa"}}
                            bodyStyle={{padding: "10px"}}
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
            </div>
        }
        ,
       
        {
            title: 'Rental Details',
            formRef: useRef(),
            content: <div>
                {/* <Form.Item name="budgetInput" label="Enter your budget (RM)">
                    <InputNumber placeholder="Budget" style={{ width: '21%' }} />
                </Form.Item> */}
                <Form.Item name="moveInDate" label="Select your preferable move in month">
                    <DatePicker placeholder="Move-in Date"  />
                </Form.Item>
                <Form.Item name="rentDuration" label="Select your preferable rent duration">
                    <Select placeholder="Rent Duration" style={{width: '21%'}}
                    options={[
                        { value: '3 months', label: '3 months' },
                        { value: '6 months', label: '6 months' },
                        { value: '12 months', label: '12 months' },
                        { value: '24 months', label: '24 months'}
                    ]} />
                </Form.Item>
            </div>
        },
        {
            title: 'Roommate Preferences',
            formRef: useRef(),
            content: <div>
                <Form.Item name="preferredGender" label="Preferred gender">
                    <Radio.Group>
                        <Radio value="male">Male</Radio>
                        <Radio value="female">Female</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item name="description" label="Description">
                    <Input.TextArea placeholder="Description" />
                </Form.Item>
            </div>
        },
        //  {
        //     title: 'Location & Property Details',
        //     formRef: useRef(),
        //     content: <div>
        //         <Form.Item name="locationSelection" label="Select your preferable location">
        //             <Input placeholder="Location" />
        //         </Form.Item>
        //         <Form.Item name="propertySelection" label="Select your preferable property type">
        //             <Select placeholder="All Property Type"
        //                 options={[
        //                     { value: 'Apartment', label: 'Apartment' },
        //                     { value: 'Condominium', label: 'Condominium' },
        //                     { value: 'Flat', label: 'Flat' },
        //                     { value: 'Terrace house', label: 'Terrace house' },
        //                 ]} />
        //         </Form.Item>
        //     </div>
        // },
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

    // let firstStep = (<><div>
    //     {/* create a form */}
    //     <Form.Item name="locationSelection">
    //         <Input placeholder="Location" />
    //     </Form.Item>
    //     <Form.Item name="propertySelection">
    //         <Select placeholder="All Property Type"

    //             options={[
    //                 { value: 'Apartment', label: 'Apartment' },
    //                 { value: 'Condominium', label: 'Condominium' },
    //                 { value: 'Flat', label: 'Flat' },
    //                 { value: 'Terrace house', label: 'Terrace house' },
    //             ]} />
    //     </Form.Item>
    // </div></>)

    // let secondStep = (<><div>
    //     <Form.Item name="budgetInput">
    //         <Input placeholder="Budget" />
    //     </Form.Item>
    //     <Form.Item name="moveInDate">
    //         <DatePicker placeholder="Move-in Date" />
    //     </Form.Item>
    //     <Form.Item name="rentDuration">
    //         <Select placeholder="Rent Duration" options={[
    //             { value: '3 months', label: '3 months' },
    //             { value: '6 months', label: '6 months' },
    //             { value: '12 months', label: '12 months' },
    //         ]} />
    //     </Form.Item>

    // </div></>)


    return <>

        <Modal
            title="Create Roommate Post"
            open={value}
            footer={null}
            onCancel={() => onChange(false)}
            width={800}
        >

            <div>
                <Steps current={currentStep}>
                    {stepsData.map((item, index) => (
                        <Step key={index} title={item.title} />
                    )
                    )}
                </Steps>

                <Form
                    onFinish={handleFormFinish}
                    ref={stepsData[currentStep].formRef}
                    style={{ marginTop: 20 }}
                    layout="vertical"
                    initialValues={
                        {
                            rentedProperty: 'no',
                            preferredGender: 'male',
                        }
                    }
                >
                    {stepsData.map((item, index) => (
                        <div key={index} style={{ display: index === currentStep ? 'block' : 'none' }}>
                            {item.content}

                            {/* Cancel button */}
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
                    ))}
                </Form>
            </div>

        </Modal>
    </>
}

export default CreateRoommatePost;