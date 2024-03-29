import { Breadcrumb, Col, Row, Table, Tabs, Tag } from 'antd';
import { useState, useEffect } from 'react';
import { supabase } from '../../../supabase-client';
import { getDateOnly } from '../../../Components/timeUtils';
import { EyeOutlined } from '@ant-design/icons';

function MyRequest() {

    const [activeRequest, setActiveRequest] = useState([]);
    const [historyRequest, setHistoryRequest] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getRequest();

    }, []);


    const getRequest = async () => {
        setLoading(true);
        const userID = (await supabase.auth.getUser()).data.user.id;

        const { data, error } = await supabase
            .from('roommate_request')
            .select('*, roommate_post(*, student(*)), roomID(*)')
            .eq('studentID', userID)
            .order('requestedDateTime', { ascending: false });


        if (error) {
            console.log(error);
        }

        console.log(data);

        const currentData = [];
        const historyData = [];

        data.forEach((element, index) => {
            if (element.requestStatus === 'Approved') {
                currentData.push({
                    key: index,
                    postID: element.postID,
                    postOwnerName: element.roommate_post.student.name,
                    postOwnerEmail: element.roommate_post.student.email,
                    requestedDate: element.requestedDateTime,
                    status: element.requestStatus,
                    roomIndex: element.roomID? element.roomID.roomID.split('_')[1] : 'N/A',
                    roomType: element.roomID? element.roomID.roomType : 'N/A',
                });
            } else {
                historyData.push({
                    key: index,
                    postID: element.postID,
                    postOwnerName:  element.roommate_post.student.name,
                    postOwnerEmail: element.roommate_post.student.email,
                    requestedDate: element.requestedDateTime,
                    status: element.requestStatus,
                    roomIndex: element.roomID? element.roomID.roomID.split('_')[1] : 'N/A',
                    roomType: element.roomID? element.roomID.roomType : 'N/A',
                });
            }
        });

        setActiveRequest(currentData);
        setHistoryRequest(historyData);
        setLoading(false);
    }

    const openLinkInNewTab = (url, stateData, event) => {
        console.log(stateData)
        event.preventDefault();
        const serializedState = JSON.stringify(stateData);
        window.open(`${url}?state=${encodeURIComponent(serializedState)}`, '_blank');
    };

    const requestColumn = [
        {
            title: 'Post Owner Name',
            dataIndex: 'postOwnerName',
            key: 'postOwnerName',
            width: '20%',
        }
        ,
        {
            title: 'Post Owner Email',
            dataIndex: 'postOwnerEmail',
            key: 'postOwnerEmail',
            width: '30%',
        }
        ,
        {
            title: 'Room Index',
            dataIndex: 'roomIndex',
            key: 'roomIndex',
            width: '10%',
        }
        ,
        {
            title: 'Room Type',
            dataIndex: 'roomType',
            key: 'roomType',
            width: '10%',
        }
        ,
        {
            title: 'Requested Date',
            dataIndex: 'requestedDate',
            key: 'requestedDate',
            render: (text) => {
                return <p>{getDateOnly(text)}</p>
            },
            width: '20%',
        }
        ,
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text) => {
                if (text === 'Approved') {
                    return <Tag color="green">{text}</Tag>
                }
                else if (text === 'Rejected') {
                    return <Tag color="red">{text}</Tag>
                }
                else {
                    return <Tag color="orange">{text}</Tag>
                }
            },
            width: '10%',
        }
        ,
        {
            title: <p style={{ textAlign: 'center' }}>Action</p>,
            dataIndex: 'action',
            key: 'action',
            width: '10%',
            render: (text, record) => {
                return (
                    <EyeOutlined
                        // size={20}
                        style={{ cursor: 'pointer', display: 'block', margin: 'auto', color: '#6643b5', fontSize: '20px' }}
                        onClick={(e) => openLinkInNewTab(`/student/roommate/post/${record.postID}`, record.postID, e)}
                    />
                )

            },
        }
    ];

    const items = [
        {
            key: '1',
            label: 'Active',
            children:
                <Table
                    columns={requestColumn}
                    dataSource={activeRequest}
                    bordered={true}
                    pagination={false}
                    loading={loading}
                />
        },
        {
            key: '2',
            label: 'History',
            children:
                <Table
                    columns={requestColumn}
                    dataSource={historyRequest}
                    bordered={true}
                    pagination={{ pageSize: 5 }}
                    loading={loading}
                />
        }
    ];


    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "white",
                margin: "2.5% 1% 10px 1%",
                height: "calc(100vh - 50px)",
                padding: "0 2em",
            }}
        >
            <div style={{ width: '50%', marginLeft: '1%' }}>
                <Breadcrumb style={{ margin: '16px 0', fontWeight: '500' }}
                    items={[
                        { href: '/student', title: 'Home' },
                        { href: '/student/roommate', title: 'Roommate' },
                        { title: 'My Requests' },
                    ]}
                />
            </div>

            <Row>
                <Col span={18} style={{ marginLeft: '1%' }}>
                    <h1>My Requests</h1>
                </Col>
            </Row>

            <div
                style={{
                    marginTop: '1%',
                    marginLeft: '1%',
                }}
            >
                <Tabs
                    defaultActiveKey="1"
                    items={items}
                    tabBarStyle={{ fontWeight: '500' }}
                />

            </div>


        </div>
    )
}

export default MyRequest;