import { Button, Modal, DatePicker, Select, Form } from 'antd';
import { useEffect } from 'react';
import { useState } from 'react';
import { supabase } from '../supabase-client';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { message } from 'antd';


function AppointmentModalForm({ post }) {

    // console.log(post);

    const { Option } = Select;

    const [isModalOpen, setIsModalOpen] = useState(false);

    dayjs.extend(customParseFormat);

    const [availableDate, setAvailableDate] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [trigger, setTrigger] = useState(0);

    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();


    useEffect(() => {

        if (post.agent === undefined) {
            return;
        }

        console.log(post.agent.agent_id);

        getAvailableDate();
    }, [post.agent]);

    useEffect(() => {

        if (post.agent === undefined) {
            return;
        }

        setAvailableDate([]);
        getAvailableDate();
    }, [trigger]);

    //get available date from supabase
    const getAvailableDate = async () => {
        try {
            const { data, error } = await supabase
                .from('available_timeslot')
                .select('*')
                .eq('agentID', post.agent.agent_id);


            if (error) {
                console.log(error);
                return;
            }

            if (data) {
                const newDates = data.map((date) => ({
                    date: date.date,
                    times: date.timeslot // Assuming the time property is available in the `date` object
                }));

                // Update availableDate in the next render cycle
                setAvailableDate((prevAvailableDate) => {
                    const uniqueDates = [...new Set([...prevAvailableDate, ...newDates])];
                    return uniqueDates;
                });

            }
        } catch (error) {
            console.log(error);
        }
    };




    // eslint-disable-next-line arrow-body-style
    const disabledDate = (current) => {
        return (
            (current && current < dayjs().startOf('day')) ||
            !availableDate.some((avDate) => avDate.date === current.format('YYYY-MM-DD'))
        );
    };



    const onChangeDate = (date, dateString) => {
        setSelectedDate(dateString);
        form.setFieldsValue({ timeslot: null });
    };

    //default time option
    const timeslotOptions = () => {
        const defaultOption = [
            <Option disabled={true} key="1" value='08:00 - 09:00'>8:00 AM - 9:00 AM</Option>,
            <Option disabled={true} key="2" value='09:00 - 10:00'>9:00 AM - 10:00 AM</Option>,
            <Option disabled={true} key="3" value='10:00 - 11:00'>10:00 AM - 11:00 AM</Option>,
            <Option disabled={true} key="4" value='11:00 - 12:00'>11:00 AM - 12:00 PM</Option>,
            <Option disabled={true} key="5" value='12:00 - 13:00'>12:00 PM - 1:00 PM</Option>,
            <Option disabled={true} key="6" value='13:00 - 14:00'>1:00 PM - 2:00 PM</Option>,
            <Option disabled={true} key="7" value='14:00 - 15:00'>2:00 PM - 3:00 PM</Option>,
            <Option disabled={true} key="8" value='15:00 - 16:00'>3:00 PM - 4:00 PM</Option>,
            <Option disabled={true} key="9" value='16:00 - 17:00'>4:00 PM - 5:00 PM</Option>,
            <Option disabled={true} key="10" value='17:00 - 18:00'>5:00 PM - 6:00 PM</Option>,
            <Option disabled={true} key="11" value='18:00 - 19:00'>6:00 PM - 7:00 PM</Option>,
            <Option disabled={true} key="12" value='19:00 - 20:00'>7:00 PM - 8:00 PM</Option>,
            <Option disabled={true} key="13" value='20:00 - 21:00'>8:00 PM - 9:00 PM</Option>,
            <Option disabled={true} key="14" value='21:00 - 22:00'>9:00 PM - 10:00 PM</Option>,
            
           
        ]

        const selectedDateTimeslot = availableDate.find((date) => date.date === dayjs(selectedDate, 'DD-MM-YYYY').format('YYYY-MM-DD'));

        if (selectedDateTimeslot) {
            //if the selected date timeslot is in the default option, set disabled to false
            selectedDateTimeslot.times.map((time) => {

                const index = defaultOption.findIndex((option) => option.props.value === time);
                if (index !== -1) {
                    defaultOption[index] = <Option key={index + 1} value={time}>{defaultOption[index].props.children}</Option>
                }
            }
            )

            return defaultOption
        }
        return defaultOption;
    }

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };



    const onFinish = async (values) => {
        console.log(values["date"].format('YYYY-MM-DD'));
        console.log(values["timeslot"]);

        //Get auth id from supabase
        const userID = (await supabase.auth.getUser()).data.user.id;


        //Store the appointment date and time in supabase
        const { data, error } = await supabase
            .from('appointment')
            .insert([
                {
                    date: values["date"].format('YYYY-MM-DD'),
                    timeslot: values["timeslot"],
                    studentID: userID,
                    agentID: post.agent.agent_id,
                    postID: post.postID,
                },
            ]);

        if (error) {
            console.log(error);
            return;
        }

        //Delete available timeslot in supabase
        const { data: data2, error: eData2 } = await supabase
            .from('available_timeslot')
            .select('*')
            .eq('agentID', post.agent.agent_id)
            .eq('date', values["date"].format('YYYY-MM-DD'))
            .single();

        if (eData2) {
            console.log(eData2);
            return;
        }

        if (data2) {

            const newArray = data2.timeslot.filter(item => item !== values["timeslot"]);

            if (newArray.length === 0) {
                const { data: data4, error: eData4 } = await supabase
                    .from('available_timeslot')
                    .delete()
                    .eq('agentID', post.agent.agent_id)
                    .eq('date', values["date"].format('YYYY-MM-DD'));

                if (eData4) {
                    console.log(eData4);
                    return;
                }
            } else {

                const { data: data3, error: eData3 } = await supabase
                    .from('available_timeslot')
                    .update({ timeslot: newArray })
                    .eq('agentID', post.agent.agent_id)
                    .eq('date', values["date"].format('YYYY-MM-DD'));

                if (eData3) {
                    console.log(eData3);
                    return;
                }


            }
        }



        //pop loading and success message
        messageApi.loading('Booking appointment...', 1.5)
            .then(() => messageApi.success('Appointment booked successfully!', 1.5));

        //reset form and close modal
        form.resetFields();
        setIsModalOpen(false);

        //set trigger to refresh the page
        setTrigger((prev) => prev + 1);

    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return <>
        <Button
            onClick={showModal}
            type="primary"
            style={{ width: '80%', margin: '0px' }}
            className='viewButton'>Book Appointment</Button>

        <Modal
            title="Book appointment for room viewing"
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
        >

            <Form
                form={form}
                name="basic"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                initialValues={
                    {
                        date: null,
                        timeslot: null,
                    }
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ flex: '1' }}>
                        <Form.Item
                            name={'date'}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select your appointment date!',
                                }
                            ]}
                        >
                            <DatePicker
                                format="DD-MM-YYYY"
                                disabledDate={disabledDate}
                                mode='date'
                                onChange={onChangeDate}
                            />
                        </Form.Item>

                        <Form.Item
                            name={'timeslot'}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select your appointment time!',
                                }
                            ]}
                        >

                            <Select
                                style={{ width: '50%' }}
                                placeholder="Select time"
                            >
                                {timeslotOptions()}
                            </Select>
                        </Form.Item>

                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
                        <Form.Item>
                            <Button htmlType='reset' onClick={handleCancel} className='viewButton' style={{ marginRight: '20px' }} type="primary" >
                                Cancel
                            </Button>
                        </Form.Item>

                        <Form.Item>
                            {contextHolder}
                            <Button htmlType='submit' className="viewButton" type="primary">
                                Submit
                            </Button>
                        </Form.Item>
                    </div>
                </div>
            </Form>
        </Modal >


    </>

}

export default AppointmentModalForm;