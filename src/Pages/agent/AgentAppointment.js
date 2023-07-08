import { DatePicker, Row, Col, Checkbox, Button, Divider, message, Table, Tabs, Tag } from "antd";
import moment from "moment";
import { useState } from "react";
import { supabase } from "../../supabase-client";
import { useEffect } from "react";
import "./AgentAppointment.css";
import { AiOutlineZoomIn } from 'react-icons/ai'
import { Link } from "react-router-dom";
import dayjs from "dayjs";


function AgentAppointment() {

    const [checkedList, setCheckedList] = useState(null);
    const [isEditBtnDisabled, setIsEditBtnDisabled] = useState(true);
    const [isCheckBoxDisabled, setIsCheckBoxDisabled] = useState(true);
    const [indeterminate, setIndeterminate] = useState(true);
    const [checkAll, setCheckAll] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [defaultOptions, setDefaultOptions] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [isCheckedAll, setIsCheckedAll] = useState(false);



    useEffect(() => {
        getOptions();
    }, []);

    useEffect(() => {
        // console.log(checkedList);
        getOptions();
    }, [selectedDate]);



    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < moment().endOf('day');

    }

    const onChangeDate = (date, dateString) => {
        console.log(date, dateString);
        if (!date) { //cancel date selection
            setIsEditBtnDisabled(true);
            setCheckedList(null);
            setIsEditBtnDisabled(true);
            setIsEdit(false);
            setIsCheckBoxDisabled(true);
            // setIsCheckBoxDisabled(true);
            return;
        }
        setIsEditBtnDisabled(false);
        //Convert the date to the format of YYYY-MM-DD
        setSelectedDate(date.format('YYYY-MM-DD'));
        setIsEditBtnDisabled(false);
        // setIsCheckBoxDisabled(false);

    }



    const onChange = (list) => {
        setCheckedList(list);
        setIndeterminate(!!list.length && list.length < defaultOptions.length);
        setCheckAll(list.length === defaultOptions.length);
    };

    const onCheckAllChange = (e) => {
        setCheckedList(e.target.checked ? defaultOptions : []);
        setIndeterminate(false);
        setCheckAll(e.target.checked);
        setIsCheckedAll(!isCheckedAll);
    };

    async function getOptions() {
        const options = [
            '08:00 - 09:00',
            '09:00 - 10:00',
            '10:00 - 11:00',
            '11:00 - 12:00',
            '12:00 - 13:00',
            '13:00 - 14:00',
            '14:00 - 15:00',
            '15:00 - 16:00',
            '16:00 - 17:00',
            '17:00 - 18:00',
            '18:00 - 19:00',
            '19:00 - 20:00',
            '20:00 - 21:00',
            '21:00 - 22:00',
        ];

        if (!selectedDate) {
            setDefaultOptions(options);
            return options;
        }

        const userID = (await supabase.auth.getUser()).data.user.id;

        console.log(userID);

        //Get the available time slot from the supabase with the selected date and agent id
        const { data, error } = await supabase
            .from('available_timeslot')
            .select('timeslot')
            .eq('agentID', userID)
            .eq('date', selectedDate);

        if (error) {
            console.log(error);
            return;
        }

        console.log(data);

        const newOptions = [];

        if (data.length > 0) {
            data.forEach((timeslots) => {

                if (timeslots) {
                    timeslots.timeslot.forEach((timeslot) => {
                        console.log(timeslot);
                        const index = options.findIndex((option) => option === timeslot);
                        console.log(index);

                        if (index > -1) {
                            newOptions.push(timeslot);

                        }
                    });
                }
            });
            setCheckedList(newOptions);
        }
        else {
            setCheckedList(null);
        }
    }


    async function saveTimeslot() {
        const userID = (await supabase.auth.getUser()).data.user.id;

        const { data, error } = await supabase
            .from('available_timeslot')
            .select('timeslotID')
            .eq('agentID', userID)
            .eq('date', selectedDate);

        if (error) {
            console.log(error);
            return;
        }

        console.log(data);

        if (data.length > 0) {
            const { data, error } = await supabase
                .from('available_timeslot')
                .update({ timeslot: checkedList })
                .eq('agentID', userID)
                .eq('date', selectedDate);

            if (error) {
                console.log(error);
                return;
            }

            console.log(data);
        }
        else {
            const { data, error } = await supabase
                .from('available_timeslot')
                .insert([{ agentID: userID, date: selectedDate, timeslot: checkedList }]);
            if (error) {
                console.log(error);
                return;
            }

            console.log(data);
        }

        message.success('Timeslot saved successfully');
        setIsEdit(false);
        setIsCheckBoxDisabled(true);
        setIsEditBtnDisabled(false);
    }


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
            .eq('agentID', userID)
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

            //If the appointment date is exceed today, it is active appointment
            //dont use moment
            if (new Date(appointment.date) >= new Date()) {
                actData.push({
                    key: index,
                    date: appointment.date,
                    timeslot: appointment.timeslot,
                    propertyName: appointment.postID.propertyName,
                    propertyAddress: address,
                    status: appointment.status,
                    studentName: appointment.student.name,
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
                    studentName: appointment.student.name,
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
            width: '4%',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            sorter: {
                compare: (a, b) => new Date(a.date) - new Date(b.date),
                multiple: 3,
            },
            render: (text, record) => dayjs(record.date).format('DD-MM-YYYY'),
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
            width: '30%',
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
            title: 'Student Name',
            dataIndex: 'studentName',
            key: 'studentName',
            sorter: {
                compare: (a, b) => a.studentName.localeCompare(b.studentName),
                multiple: 2,
            },
            width: '10%',

        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => {
                return (
                    <Link to={`/agent/appointment/${record.appointmentID}`} state={record}>
                        <AiOutlineZoomIn size={20} style={{ cursor: 'pointer' }} />
                    </Link>
                )
                
            },
            width: '5%',
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





    return <>

        <h1>Set Available Timeslot</h1>
        <div style={{ height: '300px', display: 'flex' }}>
            <div style={{ width: '70%', height: '300px' }}>
                <h3>Select Date</h3>
                <DatePicker
                    format='DD-MM-YYYY'
                    disabledDate={disabledDate}
                    onChange={onChangeDate}
                    style={{ width: '80%' }}
                />
            </div>
            <Divider type="vertical" style={{ border: '1px solid #d9d9d9', height: 'auto' }} />

            <div style={{ display: 'flex', flexDirection: 'column', marginRight: '20%', marginLeft: '20px' }}>
                <div style={{ width: '100%', height: '300px' }} className="timeslotOptions">
                    <h3>Available Timeslot</h3>
                    <Checkbox.Group className="timeslotCheckbox" options={defaultOptions} value={checkedList} onChange={onChange} disabled={isCheckBoxDisabled} />
                </div>

                <div style={{ width: '100%', height: '300px', marginTop: '20px' }}>

                    {isEdit ?
                        <div className="buttonRow">

                            <Row>
                                <Col span={4}>
                                    <Button
                                        type="primary"
                                        className="viewButton"
                                        style={{ width: '100%' }}
                                        onClick={saveTimeslot} >
                                        Save
                                    </Button>
                                </Col>
                                <Col span={5} offset={1} >
                                    <Checkbox className="check-all-checkbox" indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll} disabled={isCheckBoxDisabled}>
                                        {isCheckedAll ? 'Uncheck all' : 'Check all'}
                                    </Checkbox>
                                </Col>

                            </Row>
                        </div> : <Row>
                            <Col span={4} style={{ display: 'flex', alignItems: 'center' }}>
                                <Button
                                    type="primary"
                                    className="viewButton"
                                    style={{ width: '100%' }}
                                    disabled={isEditBtnDisabled}
                                    onClick={() => {
                                        setIsEdit(true)
                                        setIsCheckBoxDisabled(false);
                                    }}>Edit</Button>
                            </Col>
                        </Row>}
                </div>
            </div>
        </div>

        <div style={{ marginTop: '20px' }}>
            <h3>Appointment</h3>
            <Tabs defaultActiveKey="1" items={items} />
        </div>


    </>
}

export default AgentAppointment;