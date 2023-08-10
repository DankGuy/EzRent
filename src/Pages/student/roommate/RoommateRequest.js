import { Breadcrumb, Button, Col, Row, Table, Tooltip, message } from "antd";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../../../supabase-client";
import { getDateOnly } from "../../../Components/timeUtils";

function RoommateRequest() {

    const location = useLocation();
    const { listingID } = location.state;

    console.log(listingID);

    const [requestDetails, setRequestDetails] = useState([]);

    const [selectedPostIDs, setSelectedPostIDs] = useState([]);

    const [fetchTrigger, setFetchTrigger] = useState(0);


    useEffect(() => {
        getRequestDetails();

    }, []);

    useEffect(() => {
        getRequestDetails();
    }, [fetchTrigger]);


    const getRequestDetails = async () => {
        const { data, error } = await supabase
            .from('roommate_request')
            .select('*, student(*), roommate_post(*)')
            .eq('postID', listingID)
            .order('requestedDateTime', { ascending: false })
            .eq('requestStatus', 'Pending');

        if (error) {
            console.log(error);
            return;
        }

        console.log(data);

        const tableData = [];

        data.forEach((element) => {
            tableData.push({
                key: element.requestID,
                studentName: element.student.name,
                studentEmail: element.student.email,
                studentPhone: element.student.phone,
                requestDate: getDateOnly(element.requestedDateTime),
                message: element.message == null ? "-" : element.message,
            });
        });

        setRequestDetails(tableData);
    }


    const columns = [
        {
            title: 'Student Name',
            dataIndex: 'studentName',
            key: 'studentName',
            width: '15%',
        },
        {
            title: 'Student Email',
            dataIndex: 'studentEmail',
            key: 'studentEmail',
            width: '20%',
        },
        {
            title: 'Student Phone',
            dataIndex: 'studentPhone',
            key: 'studentPhone',
            width: '10%',
        },
        {
            title: 'Request Date',
            dataIndex: 'requestDate',
            key: 'requestDate',
            width: '10%',
        },
        {
            title: 'Message',
            dataIndex: 'message',
            key: 'message',
            width: '45%',
            ellipsis: {
                showTitle: false,
            },
            render: (message) => (
                <Tooltip placement="topLeft" title={message}>
                    <div style={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {message}
                    </div>
                </Tooltip>
            ),
        },
    ];


    // rowSelection object indicates the need for row selection
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedPostIDs(selectedRows.map((row) => row.key));
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
    };

    const handleApproveClick = async () => {
        if (selectedPostIDs.length === 0) {
            message.error("Please select at least one post to approve");
            return;
        }
        await approvePost(selectedPostIDs);
        // add fetch trigger to rerender the table
        setFetchTrigger((prevTrigger) => prevTrigger + 1);
    };

    const handleRejectClick = async () => {
        if (selectedPostIDs.length === 0) {
            message.error("Please select at least one post to reject");
            return;
        }
        await rejectPost(selectedPostIDs);
        // add fetch trigger to rerender the table
        setFetchTrigger((prevTrigger) => prevTrigger + 1);
    };


    const approvePost = async (postIDArr) => {
        let approveStatus = true;
        for (let i = 0; i < postIDArr.length; i++) {
            let { data, error } = await supabase
                .from("roommate_request")
                .update({ requestStatus: "Approved" })
                .eq("requestID", postIDArr[i]);
            if (error) {
                console.log("error", error);
                approveStatus = false;
            }

        }
        if (approveStatus) {
            message.success("Post(s) approved successfully");
            setSelectedPostIDs([]);

            //add occupant details if the post is rented out
            addOccupant(postIDArr);
        }
    };

    const addOccupant = async (postIDArr) => {
        //Get roommate post ID from request ID
        let { data, error } = await supabase
            .from("roommate_request")
            .select("postID")
            .eq("requestID", postIDArr[0]);

        if (error) {
            console.log("error", error);
            return;
        }

        console.log(data);

        //Get the rental agreement ID from the roommate post ID
        let { data: data2, error: error2 } = await supabase
            .from("roommate_post")
            .select("rentalAgreementID")
            .eq("postID", data[0].postID);

        if (error2) {
            console.log("error", error2);
            return;
        }

        console.log(data2);

        //Check if the rental agreement ID is null
        if (data2[0].rentalAgreementID === null) {
            return
        }

        //Get the occupant ID from the rental agreement ID
        let { data: data3, error: error3 } = await supabase
            .from("rental_agreement")
            .select("occupantID")
            .eq("rentalAgreementID", data2[0].rentalAgreementID);

        if (error3) {
            console.log("error", error3);
            return;
        }

        console.log(data3);

        let occupantID = data3[0].occupantID;

        // Push the new occupant into the occupant array
        for (let i = 0; i < postIDArr.length; i++) {
            if (!occupantID.includes(postIDArr[i])) {
                occupantID.push(postIDArr[i]);
            }
        }


        console.log(occupantID);

        //Update the occupant array
        let { data: data4, error: error4 } = await supabase
            .from("rental_agreement")
            .update({ occupantID: occupantID })
            .eq("rentalAgreementID", data2[0].rentalAgreementID);

        if (error4) {
            console.log("error", error4);
            return;
        }

    };

    const rejectPost = async (postIDArr) => {
        let rejectStatus = true;
        for (let i = 0; i < postIDArr.length; i++) {
            let { data, error } = await supabase
                .from("roommate_request")
                .update({ requestStatus: "Rejected" })
                .eq("requestID", postIDArr[i]);
            if (error) {
                console.log("error", error);
                rejectStatus = false;
            }

        }
        if (rejectStatus) {
            message.success("Post(s) rejected successfully");
            setSelectedPostIDs([]);
        }
    };


    return (
        <>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "white",
                    margin: "10px 1% 10px 1%",
                    height: "calc(100vh - 70px)",
                    padding: "0 2em",
                }}
            >
                <div style={{ width: '50%', marginLeft: '1%' }}>
                    <Breadcrumb style={{ margin: '16px 0', fontWeight: '500' }}
                        items={[
                            { href: '/student', title: 'Home' },
                            { href: '/student/roommate', title: 'Roommate' },
                            { href: '/student/roommate/myListings', title: 'My Listings' },
                            { title: 'Request' },
                        ]}
                    />
                </div>


                <Row>
                    <Col span={18} style={{ marginLeft: '1%' }}>
                        <h1>Listing Request</h1>
                    </Col>
                </Row>


                <Table
                    columns={columns}
                    dataSource={requestDetails}
                    bordered={true}
                    pagination={{ pageSize: 5 }}
                    rowSelection={{
                        type: 'checkbox',
                        ...rowSelection,
                    }}
                />

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div
                        style={{
                            width: "30%",
                            display: "flex",
                            flexDirection: "row",
                            alignSelf: "flex-end",
                        }}
                    >
                        <Button
                            type="primary"
                            style={{
                                width: "40%",
                                height: "auto",
                                margin: "10px",
                                fontSize: "1.1rem",
                            }}
                            onClick={handleApproveClick}
                        >
                            Approve
                        </Button>
                        <Button
                            type="primary"
                            danger
                            style={{
                                width: "40%",
                                height: "auto",
                                margin: "10px",
                                fontSize: "1.1rem",
                            }}
                            onClick={handleRejectClick}
                        >
                            Reject
                        </Button>
                    </div>
                </div>



            </div>
        </>
    );
}

export default RoommateRequest;