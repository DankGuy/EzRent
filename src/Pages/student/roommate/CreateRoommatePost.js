import { Button, Modal, Steps, theme, message, Form, Input, Select, DatePicker } from "antd";
import { useState, useRef } from "react";
import { StepsForm } from "@ant-design/pro-components";
import { lang } from "moment/moment";


function CreateRoommatePost({ value, onChange }) {


    const formRef = useRef();

    const waitTime = (time = 100) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(true);
          }, time);
        });
      };

    let firstStep = (<><div>
        <Form.Item name="locationSelection">
            <Input placeholder="Location" />
        </Form.Item>
        <Form.Item name="propertySelection">
            <Select placeholder="All Property Type"
            
                options={[
                    { value: 'Apartment', label: 'Apartment' },
                    { value: 'Condominium', label: 'Condominium' },
                    { value: 'Flat', label: 'Flat' },
                    { value: 'Terrace house', label: 'Terrace house' },
                ]} />
        </Form.Item>
    </div></>)

    let secondStep = (<><div>
        <Form.Item name="budgetInput">
            <Input placeholder="Budget" />
        </Form.Item>
        <Form.Item name="moveInDate">
            <DatePicker placeholder="Move-in Date" />
        </Form.Item>
        <Form.Item name="rentDuration">
            <Select placeholder="Rent Duration" options={[
                { value: '3 months', label: '3 months' },
                { value: '6 months', label: '6 months' },
                { value: '12 months', label: '12 months' },
            ]} />
        </Form.Item>
    </div></>)






    return <>

        <Modal
            title="Create Roommate Post"
            open={value}
            footer={null}
            onCancel={() => onChange(false)}
            width={800}
        >
            <StepsForm
                formRef={formRef}
                onFinish={async (values) => {
                    await waitTime(1000);
                    message.success('Create successfully');
                    console.log(values);
                }}
                formProps={{
                    validateMessages: {
                        required: 'This field is required',
                    },
                    lang: 'english',
                }}
                // stepsProps={{
                //     size: 'small',
                // }}
                //change button word to english
                submitter={{
                    render: (_, dom) => dom.pop(),
                    submitButtonProps: {
                        children: 'Create',
                        style: {
                            float: 'right',
                            marginRight: '5%',
                        },
                    },
                }}

            >
                <StepsForm.StepForm
                    name="locationAndProperty"
                    title="Location and Property Details"
                    //change button word to english
                    
                >
                    <Form.Item name="locationSelection">
                        <Input placeholder="Location" />
                    </Form.Item>
                    <Form.Item name="propertySelection">
                        <Select placeholder="All Property Type"
                        

                            options={[
                                { value: 'Apartment', label: 'Apartment' },
                                { value: 'Condominium', label: 'Condominium' },
                                { value: 'Flat', label: 'Flat' },
                                { value: 'Terrace house', label: 'Terrace house' },
                            ]} />
                    </Form.Item>

                </StepsForm.StepForm>
                <StepsForm.StepForm
                    name="RentalDetails"
                    title="Rental Details"
                >
                    <Form.Item name="budgetInput">
                        <Input placeholder="Budget" />
                    </Form.Item>
                    <Form.Item name="moveInDate">
                        <DatePicker placeholder="Move-in Date" />
                    </Form.Item>
                    <Form.Item name="rentDuration">
                        <Select placeholder="Rent Duration" options={[
                            { value: '3 months', label: '3 months' },
                            { value: '6 months', label: '6 months' },
                            { value: '12 months', label: '12 months' },
                        ]} />
                    </Form.Item>
                </StepsForm.StepForm>
            </StepsForm>


        </Modal>
    </>
}

export default CreateRoommatePost;