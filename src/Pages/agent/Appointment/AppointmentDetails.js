import { useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import { Descriptions } from "antd";


function AppointmentDetails() {

    const location = useLocation();
    const { state } = location;

    console.log(state);

    return (
        <div style={{display:'flex', flexDirection: 'row'}}>
            <div style={{width: '50%'}}>
                <Descriptions
                    title="Appointment Details"
                    labelStyle={{ fontWeight: "bold", width: "40%" }}
                    contentStyle={{ display: "inline-block" }}
                    bordered>
                    <Descriptions.Item label="Appointment ID" span={3}>{state.appointmentID}</Descriptions.Item>
                    <Descriptions.Item label="Student Name" span={3}>{state.studentID.name}</Descriptions.Item>
                    <Descriptions.Item label="Student Email" span={3}>{state.studentID.email}</Descriptions.Item>
                    <Descriptions.Item label="Student Contact" span={3}>{state.studentID.phone}</Descriptions.Item>

                    <Descriptions.Item label="Agent Name" span={3}>{state.agentID.name}</Descriptions.Item>
                    <Descriptions.Item label="Agent Email" span={3}>{state.agentID.email}</Descriptions.Item>
                    <Descriptions.Item label="Agent Contact" span={3}>{state.agentID.phone}</Descriptions.Item>

                    <Descriptions.Item label="Appointment Date" span={3}>{state.date}</Descriptions.Item>
                    <Descriptions.Item label="Appointment Time" span={3}>{state.timeslot}</Descriptions.Item>
                    <Descriptions.Item label="Appointment Status" span={3}>{state.status}</Descriptions.Item>
                </Descriptions>
            </div>
            <div style={{marginLeft: '20px', width: '50%'}}>
                <Descriptions title="Property Details" bordered>
                    <Descriptions.Item label="Property ID" span={3}>{state.post.postID}</Descriptions.Item>
                    <Descriptions.Item label="Property Name" span={3}>{state.post.propertyName}</Descriptions.Item>
                    <Descriptions.Item label="Property Type" span={3}>{state.post.propertyType}</Descriptions.Item>
                    <Descriptions.Item label="Property Address" span={3}>{state.post.propertyAddress}</Descriptions.Item>
                    <Descriptions.Item label="Property City" span={3}>{state.post.propertyCity}</Descriptions.Item>
                    <Descriptions.Item label="Property Postcode" span={3}>{state.post.propertyPostcode}</Descriptions.Item>
                    <Descriptions.Item label="Property State" span={3}>{state.post.propertyState}</Descriptions.Item>
                </Descriptions>
            </div>

        </div>
    );
}
export default AppointmentDetails;