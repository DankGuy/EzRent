import { useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import { Button, Descriptions, Popconfirm, message } from "antd";
import { convertDate, getCurrentDateTime } from "../../../Components/timeUtils";
import { supabase } from "../../../supabase-client"
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';


function AppointmentDetails() {

    const location = useLocation();
    const { state } = location;
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const cancelAppointment = async () => {

        //Change supabase appointment status to cancelled
        const { data, error } = await supabase
            .from('appointment')
            .update({ status: 'Cancelled' })
            .eq('appointmentID', state.appointmentID)
            .single();

        if (error) {
            console.log(error);
            return;
        }

        //Change supabase post status to available
        const { data: data2, error: error2 } = await supabase
            .from('available_timeslot')
            .select('*')
            .eq('date', state.date)
            .eq('agentID', state.agentID.agent_id)

        if (error2) {
            console.log(error2);
            return;
        }
        console.log(data2);



        if (data2.length > 0) {

            const newTimeslot = data2.timeslot;
            console.log(newTimeslot);

            newTimeslot.push(state.timeslot);

            const { data: data3, error: error3 } = await supabase
                .from('available_timeslot')
                .update('timeslot', newTimeslot)
                .eq('date', state.date)
                .eq('agentID', state.agentID.agent_id)
                .single();

            if (error3) {
                console.log(error3);
                return;
            }
        } else {
            const { data: data3, error: error3 } = await supabase
                .from('available_timeslot')
                .insert([{ date: state.date, agentID: state.agentID.agent_id, timeslot: [state.timeslot] }])
                .single();

            if (error3) {
                console.log(error3);
                return;
            }
        }


        messageApi.loading('Cancelling appointment...', 1.5)
            .then(() => messageApi.success('Appointment cancelled successfully!', 1.5))
            .then(() => setTimeout(() => navigate('/agent/appointment'), 1500))
            .catch(() => messageApi.error('Error cancelling appointment!', 1.5));
    }

    const showButton = () => {
        if (state.status === "Valid") {

            //Get today date
            const today = dayjs();
            const formattedDate = today.format('YYYY-MM-DD');

            if (state.date > formattedDate) {
                return (
                    <>
                        {contextHolder}
                        <Popconfirm title="Are you sure to cancel this appointment?" onConfirm={() => {
                            cancelAppointment();
                        }}>

                            <Button type="primary" className="viewButton" style={{ width: '35%', marginTop: '10em' }}>Cancel Appointment</Button>
                        </Popconfirm>
                    </>
                )
            }
        }
    }

    console.log(state);

    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ width: '45%' }}>
                <Descriptions
                    title="Property Details"
                    labelStyle={{ fontWeight: "bold", width: "10%" }}
                    bordered>
                    <Descriptions.Item label="Post ID" span={3}>{state.post.postID}</Descriptions.Item>
                    <Descriptions.Item label="Name" span={3}>{state.post.propertyName}</Descriptions.Item>
                    <Descriptions.Item label="Type" span={3}>{state.post.propertyType}</Descriptions.Item>
                    <Descriptions.Item label="Location" span={3}>{state.post.propertyAddress},
                        {state.post.propertyPostcode} {state.post.propertyCity}, {state.post.propertyState}</Descriptions.Item>
                </Descriptions>
                <br />
                <Descriptions
                    title="Student Details"
                    labelStyle={{ fontWeight: "bold", width: "10%" }}
                    bordered>
                    <Descriptions.Item label="Name" span={3}>{state.studentID.name}</Descriptions.Item>
                    <Descriptions.Item label="Email" span={3}>{state.studentID.email}</Descriptions.Item>
                    <Descriptions.Item label="Contact" span={3}>{state.studentID.phone}</Descriptions.Item>
                </Descriptions>

            </div>
            <div style={{ marginLeft: '20px', width: '50%' }}>
                <Descriptions
                    title="Appointment Details"
                    labelStyle={{ fontWeight: "bold", width: "40%" }}
                    contentStyle={{ display: "inline-block" }}
                    bordered>
                    <Descriptions.Item label="Appointment ID" span={3}>{state.appointmentID}</Descriptions.Item>
                    <Descriptions.Item label="Date" span={3}>{convertDate(state.date)}</Descriptions.Item>
                    <Descriptions.Item label="Timeslot" span={3}>{state.timeslot}</Descriptions.Item>
                    <Descriptions.Item label="Status" span={3}>
                        {state.status === "Valid" ? <span style={{ color: 'green' }}>{state.status}</span> : <span style={{ color: 'red' }}>{state.status}</span>}
                    </Descriptions.Item>
                </Descriptions>
                <br />
                {showButton()}
            </div>

        </div>
    );
}
export default AppointmentDetails;