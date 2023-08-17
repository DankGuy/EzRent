import { Badge, Breadcrumb, Button, Col, Popconfirm, Row, Table, Tabs, Tooltip, message } from "antd";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../../../supabase-client";
import { getDateOnly } from "../../../Components/timeUtils";
import { MdOutlineDeleteOutline } from "react-icons/md";


function RoommateRequest() {

    const location = useLocation();
    const { listingID } = location.state;

    console.log(listingID);

    const [requestDetails, setRequestDetails] = useState([]);
    const [currentRoommateDetails, setCurrentRoommateDetails] = useState([]);

    const [selectedPostIDs, setSelectedPostIDs] = useState([]);
    const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);

    const [fetchTrigger, setFetchTrigger] = useState(0);

    const [activeKey, setActiveKey] = useState("1");

    const [hasRentalAgreement, setHasRentalAgreement] = useState(false);

    useEffect(() => {
        getHasRentalAgreement();
        getRequestDetails();
        getCurrentRoommateDetails();

    }, []);

    useEffect(() => {
        getHasRentalAgreement();
        getRequestDetails();
        getCurrentRoommateDetails();

    }, [fetchTrigger]);

    const getHasRentalAgreement = async () => {
        const { data, error } = await supabase
            .from('roommate_post')
            .select('rentalAgreementID')
            .eq('postID', listingID);

        if (error) {
            console.log(error);
            return;
        }

        console.log(data);

        if (data[0].rentalAgreementID !== null) {
            setHasRentalAgreement(true);
        } else {
            setHasRentalAgreement(false);
        }
    }

    const getCurrentRoommateDetails = async () => {
        const { data, error } = await supabase
            .from('roommate_request')
            .select('*, student(*), roommate_post(*)')
            .eq('postID', listingID)
            .order('requestedDateTime', { ascending: false })
            .eq('requestStatus', 'Approved');

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
                roomType: element.roomType,
                action: <Popconfirm
                    title="Are you sure to remove this roommate?"
                    onConfirm={() => handleRemove(element.requestID)}
                    okText="Yes"
                    cancelText="No"
                >
                    <span>
                        <MdOutlineDeleteOutline size={25} color="red" style={{ cursor: 'pointer' }} />
                    </span>
                </Popconfirm>,
            });
        });

        setCurrentRoommateDetails(tableData);
    }

    const handleRemove = async (requestID) => {
        let { data, error } = await supabase
            .from("roommate_request")
            .update({ requestStatus: "Rejected" })
            .eq("requestID", requestID);
        if (error) {
            console.log("error", error);
            return;
        }
        message.success("Roommate removed successfully");
        setFetchTrigger((prevTrigger) => prevTrigger + 1);
    }



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
                roomType: element.roomType,
            });
        });

        setRequestDetails(tableData);
    }


    const requestColumn = [
        {
            title: 'Student Name',
            dataIndex: 'studentName',
            key: 'studentName',
            width: '15%',
            sorter: (a, b) => a.studentName.localeCompare(b.studentName),
        },
        {
            title: 'Student Email',
            dataIndex: 'studentEmail',
            key: 'studentEmail',
            width: '25%',
        },
        {
            title: 'Student Phone',
            dataIndex: 'studentPhone',
            key: 'studentPhone',
            width: '15%',
        },
        {
            title: 'Room Type',
            dataIndex: 'roomType',
            key: 'roomType',
            width: '10%',
        }
        ,
        {
            title: 'Request Date',
            dataIndex: 'requestDate',
            key: 'requestDate',
            width: '15%',
            sorter: (a, b) => a.requestDate.localeCompare(b.requestDate),
        },
        {
            title: 'Message',
            dataIndex: 'message',
            key: 'message',
            width: '30%',
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

    const currentRoommateColumn = [
        {
            title: 'Student Name',
            dataIndex: 'studentName',
            key: 'studentName',
            width: '15%',
            sorter: (a, b) => a.studentName.localeCompare(b.studentName),
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
            title: 'Room Type',
            dataIndex: 'roomType',
            key: 'roomType',
            width: '10%',
        }
        ,
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: '10%',
        }
    ];



    // rowSelection object indicates the need for row selection
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedPostIDs(selectedRows.map((row) => row.key));
            setSelectedRoomTypes(selectedRows.map((row) => row.roomType));
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

        //Get the maximum tenant allowed
        if (hasRentalAgreement) {
            let { data, error } = await supabase
                .from('roommate_post')
                .select('*, rental_agreement(*, postID(*))')
                .eq('postID', listingID);

            if (error) {
                console.log(error);
                return;
            }

            console.log(data);
            console.log(data[0].rental_agreement.occupantID.length);

            console.log(data[0].rental_agreement.postID.propertyRoomDetails[1].maxTenant);

            //Do validation for each room type
            const roomTypeCounts = selectedRoomTypes.reduce((acc, curr) => {
                acc[curr] = (acc[curr] || 0) + 1;
                return acc;
            }, {});

            console.log(roomTypeCounts);
            // {Array.from({ length: post.propertyRoomNumber }, (_, i) => i + 1).map((roomNumber) => {


            const idArray = [];
            Array.from({ length: data[0].rental_agreement.postID.propertyRoomNumber }, (_, i) => i + 1).map((roomNumber) => {
                // console.log(data[0].rental_agreement.postID.propertyRoomDetails[roomNumber].roomType);

                const roomType = data[0].rental_agreement.postID.propertyRoomDetails[roomNumber].roomType;

                const maxTenant = data[0].rental_agreement.postID.propertyRoomDetails[roomNumber].maxTenant;

                const selectedTenant = roomTypeCounts[roomType];

                const currentOccupant = data[0].rental_agreement.occupantID.length;

                console.log(roomType);
                console.log(maxTenant);
                console.log(selectedTenant);
                console.log(currentOccupant);

                if (currentOccupant >= maxTenant) {
                    message.error("The maximum tenant allowed has been reached");
                    return;
                } else {
                    if (currentOccupant + selectedTenant > maxTenant) {
                        message.error("The selected tenant(s) will exceed the maximum tenant allowed");
                        return;
                    }
                }

                //Get the postID that has same room type
                const sameRoomTypePostID = selectedPostIDs.filter((postID) => {
                    return selectedRoomTypes[selectedPostIDs.indexOf(postID)] === roomType;
                });

                console.log(sameRoomTypePostID);

                idArray.push(sameRoomTypePostID);
            });

            if (idArray.flat().length !== 0) {
                await approvePost(idArray.flat());
            }
        } else {
            await approvePost(selectedPostIDs);
        }
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
            //Get the studentID
            let { data: data4, error: error4 } = await supabase
                .from("roommate_request")
                .select("studentID")
                .eq("requestID", postIDArr[i])
                .single();
                
            if (error4) {
                console.log("error", error4);
                return;
            }   

            console.log(data4);

            //to check no duplicated
            if (!occupantID.includes(data4.studentID)) {
                occupantID.push(data4.studentID);
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

    const items = [
        {
            key: "1",
            label: "Current Roommate",
            children:
                <Table
                    columns={
                        hasRentalAgreement ? currentRoommateColumn : currentRoommateColumn.filter((column) => column.key !== 'roomType')
                    }
                    dataSource={currentRoommateDetails}
                    bordered={true}
                    pagination={{ pageSize: 5 }}
                />
        },
        {
            key: "2",
            label: (<>
                <span>Roommate Request</span>
                {requestDetails.length > 0 &&
                    <span style={{
                        marginLeft: "10px",
                        backgroundColor: "#ff4d4f",
                        color: "#ffffff",
                        fontSize: "12px",
                        fontWeight: "normal",
                        lineHeight: "20px",
                        boxShadow: "0 0 0 1px #ffffff",
                        borderRadius: "10px",
                        minWidth: "20px",
                        height: "20px",
                        zIndex: "auto",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        transition: "background 0.2s",
                        display: "inline-block",
                        padding: "0 6px",
                        position: "relative",
                        top: "-5px",
                        left: "-5px",
                    }} >
                        {requestDetails.length}
                    </span>}
            </>),
            children:
                <Table
                    columns={
                        hasRentalAgreement ? requestColumn : requestColumn.filter((column) => column.key !== 'roomType')
                    }
                    dataSource={requestDetails}
                    bordered={true}
                    pagination={{ pageSize: 5 }}
                    rowSelection={{
                        type: 'checkbox',
                        ...rowSelection,
                    }}
                />
        },
    ];

    const onChange = (activeKey) => {
        setActiveKey(activeKey);
    };


    return (
        <>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "white",
                    margin: "2.5% 1% 10px 1%",
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
                            { title: 'Roomate' },
                        ]}
                    />
                </div>


                <Row>
                    <Col span={18} style={{ marginLeft: '1%' }}>
                        <h1>Listing Roomate</h1>
                    </Col>
                </Row>


                <div style={{
                    marginTop: "2%",
                    marginLeft: "1%",
                }}>
                    <Tabs
                        defaultActiveKey="1"
                        items={items}
                        onChange={onChange}
                        activeKey={activeKey}
                        tabBarStyle={{ fontWeight: "bold" }}
                    />
                </div>



                {activeKey === "2" &&
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
                }




            </div>
        </>
    );
}

export default RoommateRequest;