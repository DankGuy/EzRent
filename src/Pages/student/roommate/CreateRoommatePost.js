import { Button, Modal, Steps, theme, message, Form, Input, Select, DatePicker } from "antd";
import { useState, useRef } from "react";


function CreateRoommatePost({ value, onChange }) {

    const { Step } = Steps;
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});

    const stepsData = [
        {
            title: 'Location & Property Details',
            formRef: useRef(),
            content: <div>
                <Form.Item name="locationSelection" label="Select your preferable location">
                    <Input placeholder="Location" />
                </Form.Item>
                <Form.Item name="propertySelection" label="Select your preferable property type">
                    <Select placeholder="All Property Type" 
                        options={[
                            { value: 'Apartment', label: 'Apartment' },
                            { value: 'Condominium', label: 'Condominium' },
                            { value: 'Flat', label: 'Flat' },
                            { value: 'Terrace house', label: 'Terrace house' },
                        ]} />
                </Form.Item>
            </div>
        },
        {
            title: 'Rental Details',
            formRef: useRef(),
            content: <div>
                <Form.Item name="budgetInput" label="Enter your budget (RM)">
                    <Input placeholder="Budget" />
                </Form.Item>
                <Form.Item name="moveInDate" label="Select your preferable move in month">
                    <DatePicker placeholder="Move-in Date" picker="month"/>
                </Form.Item>
                <Form.Item name="rentDuration" label="Select your preferable rent duration">
                    <Select placeholder="Rent Duration" options={[
                        { value: '3 months', label: '3 months' },
                        { value: '6 months', label: '6 months' },
                        { value: '12 months', label: '12 months' },
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