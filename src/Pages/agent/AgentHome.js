import { Card, Col, Row, Space, Statistic } from "antd";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase-client";
import { convertDate, getDateOnly } from "../../Components/timeUtils";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { BiTimer } from "react-icons/bi";
import { MdOutlineInsertDriveFile, MdPendingActions } from "react-icons/md";
import { BsArrowRightCircle } from "react-icons/bs";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import CountUp from 'react-countup';


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const formatter = (value) => <CountUp end={value} separator="," />;


function AgentHome() {
    const [appointments, setAppointments] = useState([]);

    const [activePost, setActivePost] = useState(0);
    const [pendingPost, setPendingPost] = useState(0);

    const [rentedPost, setRentedPost] = useState({});
    const [totalRentedPost, setTotalRentedPost] = useState(0);

    useEffect(() => {
        const fetchAppointments = async () => {
            const userID = (await supabase.auth.getUser()).data.user.id;
            const todayDate = getFormattedDate();

            const { data, error } = await supabase
                .from('appointment')
                .select('*, postID(*), studentID(*), agentID(*)')
                .eq('agentID', userID)
                .eq('status', 'Valid')
                .order('date', { ascending: true })
                .order('timeslot', { ascending: true })
                .gte('date', todayDate);

            if (error) {
                console.log(error);
                return;
            }

            console.log(data);

            setAppointments(data);
        }

        const fetchActivePost = async () => {
            const userID = (await supabase.auth.getUser()).data.user.id;

            const { data, error } = await supabase
                .from('property_post')
                .select('*')
                .eq('propertyAgentID', userID)
                .contains('propertyStatus', { status: 'active' });

            if (error) {
                console.log(error);
                return;
            }

            console.log(data);

            console.log(data.length);

            setActivePost(data.length);
        }

        const fetchPendingPost = async () => {
            const userID = (await supabase.auth.getUser()).data.user.id;

            const { data, error } = await supabase
                .from('property_post')
                .select('*')
                .eq('propertyAgentID', userID)
                .contains('propertyStatus', {
                    status: 'inactive',
                    stage: 'pending'
                });

            if (error) {
                console.log(error);
                return;
            }

            console.log(data);

            console.log(data.length);

            setPendingPost(data.length);
        }

        const fetchRentedPost = async () => {
            const userID = (await supabase.auth.getUser()).data.user.id;

            //get the current year
            const today = new Date();
            const year = today.getFullYear();



            const { data, error } = await supabase
                .from('rental_agreement')
                .select('*')
                .eq('agentID', userID);

            if (error) {
                console.log(error);
                return;
            }

            console.log(data);

            setTotalRentedPost(data.length);

            // Create an object to store the count of posts for each month
            const monthCounts = {};

            // Iterate through the data array and count posts for each month
            data.forEach(record => {

                //validate if the record is current year

                if (record.rentalAgreementID.split("-")[3] === year.toString()) {

                    // Get the month from the record
                    const month = record.rentalAgreementID.split('-')[2]; // Extract the month

                    if (month) {
                        // Increment the count for that month
                        monthCounts[month] = (monthCounts[month] || 0) + 1;
                    }
                }

            });

            console.log(monthCounts);

            setRentedPost(monthCounts);

        }

        fetchAppointments();
        fetchActivePost();
        fetchPendingPost();
        fetchRentedPost();

    }, []);

    function getFormattedDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }


    const showAppointments = () => {
        let isFirstAppointment = true;

        const appointmentElements = appointments.slice(0, 3).map((appointment, index) => {
            const currentDate = getDateOnly(appointment.date);

            const previousDate = index > 0 ? getDateOnly(appointments[index - 1].date) : null;

            const renderDate = isFirstAppointment || currentDate !== previousDate;
            isFirstAppointment = false;

            return (
                <Fragment key={appointment.appointmentID}>
                    {renderDate && (
                        <span style={{ marginLeft: '10px', fontWeight: 'bold', color: '#6b6b6b' }}>
                            {currentDate}
                        </span>
                    )}
                    <Link
                        to={`/agent/appointment/${appointment.appointmentID}`}
                        style={{ color: 'black' }}
                        state={appointment}
                    >
                        <Card
                            hoverable
                            key={appointment.appointmentID}
                            style={{
                                width: '100%',
                                marginBottom: '10px',
                                backgroundColor: 'rgb(240, 245, 255)',
                            }}
                            bodyStyle={{ padding: '10px' }}
                        >
                            <Row>
                                <Col span={12} style={{ fontWeight: 'bold', color: '#6b6b6b' }}>
                                    {appointment.timeslot}
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>{appointment.studentID.name}</Col>
                                <Col span={12}>{appointment.postID.propertyName}</Col>
                            </Row>
                        </Card>
                    </Link>
                </Fragment>
            );
        });

        return (
            <div>
                {appointmentElements}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
                    <Link
                        to="/agent/appointment"
                        style={{
                            color: '#6b6b6b',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginTop: '10px',
                            textDecoration: 'none',
                            cursor: 'pointer',
                            transition: 'transform 0.2s, color 0.2s, box-shadow 0.2s', // Add transitions for multiple properties
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)'; // Scale up on hover
                            e.currentTarget.style.color = 'black'; // Change text color on hover
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)'; // Reset scale on hover out
                            e.currentTarget.style.color = '#6b6b6b'; // Reset text color on hover out
                        }}
                    >
                        <BsArrowRightCircle size={25} style={{ marginBottom: '5px' }} />
                        <span style={{ fontWeight: 'bold' }}>
                            View All
                        </span>
                    </Link>
                </div>


            </div>
        );
    }




    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Octobor', 'November', 'December'];


    const graphData = {
        labels,
        datasets: [
            {
                label: 'Number of Rented Properties',
                data: labels.map(month => rentedPost[month] || 0), // Use the monthCounts object
                backgroundColor: 'rgba(133, 148, 228)',

            },
        ],
    };



    const graphOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: `Rented Properties in ${new Date().getFullYear()}`
            },
        },
        scale: {
            ticks: {
                precision: 0
            }
        }
    };



    return (
        <Space
            direction="vertical"
        >
            <Space direction="horizontal">
                <Card
                    hoverable
                    bodyStyle={
                        {
                            paddingLeft: '10px',
                        }
                    }>
                    <Space direction="horizontal">
                        <MdOutlineInsertDriveFile size={30}
                            style={{
                                marginLeft: '10px',
                                color: 'green',
                                backgroundColor: "rgba(0,255,0,0.25)",
                                borderRadius: 20,
                                padding: 5
                            }}
                        />
                        <Statistic
                            title="Active Post"
                            value={activePost}
                            style={{ textAlign: 'center' }}
                            formatter={formatter}
                        />
                    </Space>
                </Card>

                <Card hoverable bodyStyle={{ paddingLeft: '10px' }}>
                    <Space direction="horizontal">
                        <MdPendingActions size={30}
                            style={{
                                marginLeft: '10px',
                                color: 'orange',
                                backgroundColor: "rgba(255,165,0,0.25)",
                                borderRadius: 20,
                                padding: 5,
                            }} />
                        <Statistic
                            title="Pending Post"
                            value={pendingPost}
                            style={{ textAlign: 'center' }}
                            formatter={formatter}
                        />
                    </Space>
                </Card>

                <Card hoverable bodyStyle={{ paddingLeft: '10px' }}>
                    <Space direction="horizontal">
                        <MdOutlineInsertDriveFile size={30}
                            style={{
                                marginLeft: '10px',
                                color: 'blue',
                                backgroundColor: "rgba(0,0,255,0.25)",
                                borderRadius: 20,
                                padding: 5
                            }}
                        />
                        <Statistic
                            title="Rented Post"
                            value={totalRentedPost}
                            style={{ textAlign: 'center' }}
                            formatter={formatter}
                        />
                    </Space>
                </Card>
            </Space>

            <Space style={{ marginTop: '10px' }} direction="horizontal">
                <Card style={{ width: 500 }} bodyStyle={{ padding: '0px 20px 0px 20px' }} hoverable>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            margin: '10px',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                color: '#6b6b6b',
                            }}
                        >
                            <h3>Upcoming Appointments</h3>
                            <BiTimer size={25} style={{ marginLeft: '20px' }} />
                        </div>
                    </div>

                    <div>
                        {showAppointments()}
                    </div>
                </Card>

                <Card style={{ width: 600, height: 300, marginLeft: '30px' }} hoverable>
                    <Bar
                        options={graphOptions}
                        data={graphData}
                    />
                </Card>

            </Space>
        </Space>
    );
}

export default AgentHome;
