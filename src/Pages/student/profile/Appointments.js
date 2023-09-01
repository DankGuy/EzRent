import { App, Table, Tabs, Tag, Tooltip } from "antd";
import { useState } from "react";
import { supabase } from "../../../supabase-client";
import { useEffect } from "react";
import { AiOutlineZoomIn } from 'react-icons/ai'
import { Link } from "react-router-dom";
import dayjs from 'dayjs';
import { getDateOnly } from "../../../Components/timeUtils";

function Appointments() {

    const [historyData, setHistoryData] = useState([]);
    const [activeData, setActiveData] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    async function getData() {
        const userID = (await supabase.auth.getUser()).data.user.id;

        const { data, error } = await supabase
            .from('appointment')
            .select('*, postID(*), student(*), agentID(*)')
            .eq('studentID', userID)
            .order('date', { ascending: false });

        if (error) {
            console.log(error);
            return;
        }

        console.log(data);

        const actData = [];
        const hisData = [];


        data.forEach((appointment, index) => {

            const address = `${appointment.postID.propertyAddress}, ${appointment.postID.propertyPostcode} ${appointment.postID.propertyCity}, ${appointment.postID.propertyState}`;


            if (new Date(appointment.date) >= new Date()) {
                actData.push({
                    key: index,
                    date: appointment.date,
                    timeslot: appointment.timeslot,
                    propertyName: appointment.postID.propertyName,
                    propertyAddress: address,
                    status: appointment.status,
                    agentName: appointment.agentID.name,
                    appointmentID: appointment.appointmentID,
                    post: appointment.postID,
                    studentID: appointment.student,
                    agentID: appointment.agentID,
                });
            }
            else {
                hisData.push({
                    key: index,
                    date: appointment.date,
                    timeslot: appointment.timeslot,
                    propertyName: appointment.postID.propertyName,
                    propertyAddress: address,
                    status: appointment.status,
                    agentName: appointment.agentID.name,
                    appointmentID: appointment.appointmentID,
                    post: appointment.postID,
                    studentID: appointment.student,
                    agentID: appointment.agentID,
                });
            }
        });

        setActiveData(actData);
        setHistoryData(hisData);
    }


    //Table
    const columns = [
        {
            title: 'No.',
            dataIndex: 'no',
            key: 'no',
            render: (text, record, index) => index + 1,
            width: '6%',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            sorter: {
                compare: (a, b) => new Date(a.date) - new Date(b.date),
                multiple: 3,
            },
            render: (text, record) => getDateOnly(text),
            width: '10%',
        },
        {
            title: 'Timeslot',
            dataIndex: 'timeslot',
            key: 'timeslot',
            width: '11%',
            sorter: {
                compare: (a, b) => a.timeslot.localeCompare(b.timeslot),
                multiple: 1,
            },

        },
        {
            title: 'Property Name',
            dataIndex: 'propertyName',
            key: 'propertyName',
            sorter: {
                compare: (a, b) => a.propertyName.localeCompare(b.propertyName),
                multiple: 2,
            },
            width: '20%',
        },
        {
            title: 'Property Address',
            dataIndex: 'propertyAddress',
            key: 'propertyAddress',
            width: '25%',
            ellipsis: {
                showTitle: false,
            },
            render: (address) => (
                <Tooltip placement="topLeft" title={address}>
                    {address}
                </Tooltip>
            ),

        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => {
                if (record.status === 'Valid') {
                    return <Tag color="green">{record.status}</Tag>;
                }
                else if (record.status === 'Cancelled') {
                    return <Tag color="red">{record.status}</Tag>;
                }
            },
            width: '10%',
        },
        {
            title: 'Agent Name',
            dataIndex: 'agentName',
            key: 'agentName',
            width: '15%',
            sorter: {
                compare: (a, b) => a.agentName.localeCompare(b.agentName),
                multiple: 1,
            },
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => {
                return (
                    <Link to={`/student/profile/appointments/${record.appointmentID}`} state={record}>
                        <AiOutlineZoomIn size={20} style={{ cursor: 'pointer' }} />
                    </Link>
                )

            },
            width: '8%',
        },
    ];


    const items = [
        {
            key: '1',
            label: 'Active',
            children:
                <Table
                    columns={columns}
                    dataSource={activeData}
                    bordered={true}
                    pagination={{ pageSize: 5 }}
                />
        },
        {
            key: '2',
            label: 'History',
            children:
                <Table
                    columns={columns}
                    dataSource={historyData}
                    bordered={true}
                    pagination={{ pageSize: 5 }}
                />
        },
    ];





    return (
        <div style={{ marginTop: '20px' }}>
            <h3>Appointment</h3>
            <Tabs defaultActiveKey="1" items={items} />
        </div>
    )
}

export default Appointments;