import { Breadcrumb, Button, Col, Popconfirm, Row, Table, Tabs, Tooltip, message } from "antd";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../../../supabase-client";
import { getDateOnly } from "../../../Components/timeUtils";
import { MdOutlineDeleteOutline } from "react-icons/md";


function RoommateRequest() {

    const location = useLocation();
    const { listingID } = location.state;
    const [requestDetails, setRequestDetails] = useState([]);
    const [currentRoommateDetails, setCurrentRoommateDetails] = useState([]);
    const [currentListingStatus, setCurrentListingStatus] = useState([]);
    const [selectedPostIDs, setSelectedPostIDs] = useState([]);
    const [selectedRoomIDs, setSelectedRoomIDs] = useState([]);
    const [fetchTrigger, setFetchTrigger] = useState(0);
    const [activeKey, setActiveKey] = useState("1");
    const [hasRentalAgreement, setHasRentalAgreement] = useState(false);
    const [roomDetailsLoading, setRoomDetailsLoading] = useState(false);
    const [roomRequestLoading, setRoomRequestLoading] = useState(false);
    const [currentRoommateLoading, setCurrentRoommateLoading] = useState(false);

    useEffect(() => {
        getHasRentalAgreement();
        getRequestDetails();
        getCurrentRoommateDetails();

    }, []);

    useEffect(() => {
        getHasRentalAgreement();
        getRequestDetails();
        getCurrentRoommateDetails();

        setSelectedPostIDs([]);
        setSelectedRoomIDs([]);

    }, [fetchTrigger]);

    const getHasRentalAgreement = async () => {
        setRoomDetailsLoading(true);
        const { data, error } = await supabase
            .from('roommate_post')
            .select('rentalAgreementID(*)')
            .eq('postID', listingID);

        if (error) {
            console.log(error);
            return;
        }

        console.log(data);

        if (data[0].rentalAgreementID !== null) {
            setHasRentalAgreement(true);

            //Get the current listing status
            console.log(data[0].rentalAgreementID.postID);

            const { data: data2, error: error2 } = await supabase
                .from('property_room')
                .select('*')
                .eq('propertyPostID', data[0].rentalAgreementID.postID)
                .order('roomID', { ascending: true });

            if (error2) {
                console.log(error2);
                return;
            }

            const currentListingStatusData = [];

            data2.forEach((element) => {
                currentListingStatusData.push({
                    key: element.roomID,
                    roomIndex: element.roomID.split("_")[1],
                    roomType: element.roomType,
                    maxTenant: element.maxTenant,
                    availableSpace: element.availableSpace,
                });
            });

            setCurrentListingStatus(currentListingStatusData);
            setRoomDetailsLoading(false);
        } else {
            setHasRentalAgreement(false);
            setRoomDetailsLoading(false);
        }
    }

    const getCurrentRoommateDetails = async () => {
        setCurrentRoommateLoading(true);
        const { data, error } = await supabase
            .from('roommate_request')
            .select('*, student(*), roommate_post(*), roomID(*)')
            .eq('postID', listingID)
            .order('requestedDateTime', { ascending: false })
            .eq('requestStatus', 'Approved');

        if (error) {
            console.log(error);
            return;
        }

        const tableData = [];

        data.forEach((element) => {
            tableData.push({
                key: element.requestID,
                studentName: element.student.name,
                studentEmail: element.student.email,
                studentPhone: element.student.phone,
                roomIndex: element.roomID.roomID.split("_")[1],
                roomType: element.roomID.roomType,
                action: <Popconfirm
                    title="Are you sure to remove this roommate?"
                    onConfirm={() => handleRemove(element.requestID, element.studentID)}
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
        setCurrentRoommateLoading(false);
    }

    const handleRemove = async (requestID, studentID) => {
        let { error } = await supabase
            .from("roommate_request")
            .update({ requestStatus: "Rejected" })
            .eq("requestID", requestID);
        if (error) {
            console.log("error", error);
            return;
        }

        await updateAvailableSpace(requestID, "remove");

        await removeOccupant(requestID, studentID);

        message.success("Roommate removed successfully");
        setFetchTrigger((prevTrigger) => prevTrigger + 1);
    }

    const removeOccupant = async (requestID, studentID) => {
        //Get roommate post ID from request ID
        let { data, error } = await supabase
            .from("roommate_request")
            .select("postID")
            .eq("requestID", requestID);

        if (error) {
            console.log("error", error);
            return;
        }

        //Get the rental agreement ID from the roommate post ID
        let { data: data2, error: error2 } = await supabase
            .from("roommate_post")
            .select("*, rentalAgreementID(*)")
            .eq("postID", data[0].postID);

        if (error2) {
            console.log("error", error2);
            return;
        }

        const occupantID = data2[0].rentalAgreementID.occupantID;

        //Remove the student ID from the occupant array
        const newOccupantID = occupantID.filter((id) => id !== studentID);

        //Update the occupant array
        let { error: error3 } = await supabase
            .from("rental_agreement")
            .update({ occupantID: newOccupantID })
            .eq("rentalAgreementID", data2[0].rentalAgreementID.rentalAgreementID);

        if (error3) {
            console.log("error", error3);
            return;
        }
    }




    const getRequestDetails = async () => {
        setRoomRequestLoading(true);
        const { data, error } = await supabase
            .from('roommate_request')
            .select('*, student(*), roommate_post(*), roomID(*)')
            .eq('postID', listingID)
            .order('requestedDateTime', { ascending: false })
            .eq('requestStatus', 'Pending');

        if (error) {
            console.log(error);
            return;
        }

        const tableData = [];

        data.forEach((element) => {
            tableData.push({
                key: element.requestID,
                studentName: element.student.name,
                studentEmail: element.student.email,
                studentPhone: element.student.phone,
                requestDate: getDateOnly(element.requestedDateTime),
                message: element.message == null ? "-" : element.message,
                roomIndex: element.roomID.roomID.split("_")[1],
                roomType: element.roomID.roomType,
                roomID: element.roomID.roomID,
            });
        });

        setRequestDetails(tableData);
        setRoomRequestLoading(false);
    }


    const requestColumn = [
        {
            title: 'Student Name',
            dataIndex: 'studentName',
            key: 'studentName',
            width: '15%',
            sorter: (a, b) => a.studentName.localeCompare(b.studentName),
            ellipsis: {
                showTitle: false,
            },
            render: (studentName) => (
                <Tooltip placement="topLeft" title={studentName}>
                    <div style={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {studentName}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: 'Student Email',
            dataIndex: 'studentEmail',
            key: 'studentEmail',
            width: '25%',
            ellipsis: {
                showTitle: false,
            },
            render: (studentEmail) => (
                <Tooltip placement="topLeft" title={studentEmail}>
                    <div style={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {studentEmail}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: 'Student Phone',
            dataIndex: 'studentPhone',
            key: 'studentPhone',
            width: '15%',
        },
        {
            title: 'Room Index',
            dataIndex: 'roomIndex',
            key: 'roomIndex',
            width: '12%',
            sorter: (a, b) => a.roomIndex - b.roomIndex,
        }
        ,
        {
            title: 'Room Type',
            dataIndex: 'roomType',
            key: 'roomType',
            width: '15%',
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
            ellipsis: {
                showTitle: false,
            },
            render: (studentName) => (
                <Tooltip placement="topLeft" title={studentName}>
                    <div style={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {studentName}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: 'Student Email',
            dataIndex: 'studentEmail',
            key: 'studentEmail',
            width: '20%',
            ellipsis: {
                showTitle: false,
            },
            render: (studentEmail) => (
                <Tooltip placement="topLeft" title={studentEmail}>
                    <div style={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {studentEmail}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: 'Student Phone',
            dataIndex: 'studentPhone',
            key: 'studentPhone',
            width: '10%',
        },
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
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: '10%',
        }
    ];

    const currentListingStatusColumn = [
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
            title: 'Max Tenant',
            dataIndex: 'maxTenant',
            key: 'maxTenant',
            width: '10%',
        }
        ,
        {
            title: 'Available Space',
            dataIndex: 'availableSpace',
            key: 'availableSpace',
            width: '10%',
        }
    ];




    // rowSelection object indicates the need for row selection
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedPostIDs(selectedRows.map((row) => row.key));
            setSelectedRoomIDs(selectedRows.map((row) => row.roomID));
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
            const roommatePostID = listingID;
            const { data, error } = await supabase
                .from('roommate_post')
                .select('*, rental_agreement(*)')
                .eq('postID', roommatePostID)
                .single();

            if (error) {
                console.log(error);
                return;
            }
            const propertyPostID = data.rental_agreement.postID;
            const roomTypeCounts = selectedRoomIDs.reduce((acc, curr) => {
                acc[curr] = (acc[curr] || 0) + 1;
                return acc;
            }, {});

            const { data: data2, error: error2 } = await supabase
                .from('property_room')
                .select('*')
                .eq('propertyPostID', propertyPostID)
                .order('roomID', { ascending: true });

            if (error2) {
                console.log(error2);
                return;
            }
            const idArray = [];

            async function processRoomTypes() {
                for (const roomID of Object.keys(roomTypeCounts)) {
                    const { data: data3, error: error3 } = await supabase
                        .from('property_room')
                        .select('*')
                        .eq('roomID', roomID)
                        .single();

                    if (error3) {
                        console.log(error3);
                        continue; // Continue to the next iteration if there's an error.
                    }

                    const availableSpace = data3.availableSpace;

                    if (availableSpace === 0) {
                        message.error(`The maximum tenant for ${data3.roomType} has been reached`);
                        continue; // Continue to the next iteration.
                    } else {
                        if (availableSpace < roomTypeCounts[roomID]) {
                            message.error(`The selected tenant for ${data3.roomType} is more than the available space`);
                            continue; // Continue to the next iteration.
                        }
                    }
                    // Get the postID that has the same room type
                    const sameRoomTypePostID = selectedPostIDs.filter((postID) => {
                        return selectedRoomIDs[selectedPostIDs.indexOf(postID)] === roomID;
                    });
                    idArray.push(sameRoomTypePostID);
                }
                if (idArray.length === 0) {
                    return;
                }
                await approvePost(idArray.flat());
                setFetchTrigger((prevTrigger) => prevTrigger + 1);
            }
            processRoomTypes();
        } else {
            await approvePost(selectedPostIDs);
            setFetchTrigger((prevTrigger) => prevTrigger + 1);
        }
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

            await updateAvailableSpace(postIDArr[i], "add");
        }
        if (approveStatus) {
            message.success("Post(s) approved successfully");
            setSelectedPostIDs([]);

            //add occupant details if the post is rented out
            await addOccupant(postIDArr);
        }
    };

    const updateAvailableSpace = async (postID, action) => {
        //Get the roomID
        let { data, error } = await supabase
            .from("roommate_request")
            .select("roomID")
            .eq("requestID", postID);

        if (error) {
            console.log("error", error);
            return;
        }

        console.log(data);

        //Get the available space
        let { data: data2, error: error2 } = await supabase
            .from("property_room")
            .select("availableSpace")
            .eq("roomID", data[0].roomID);

        if (error2) {
            console.log("error", error2);
            return;
        }

        console.log(data2);

        let availableSpace = data2[0].availableSpace;

        if (action === "add") {
            availableSpace = availableSpace - 1;
        } else {
            availableSpace = availableSpace + 1;
        }

        //Update the available space
        let { data: data3, error: error3 } = await supabase
            .from("property_room")
            .update({ availableSpace: availableSpace })
            .eq("roomID", data[0].roomID);

        if (error3) {
            console.log("error", error3);
            return;
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

        //Get the rental agreement ID from the roommate post ID
        let { data: data2, error: error2 } = await supabase
            .from("roommate_post")
            .select("rentalAgreementID")
            .eq("postID", data[0].postID);

        if (error2) {
            console.log("error", error2);
            return;
        }

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

        let occupantID = data3[0].occupantID;

        if (occupantID === null) {
            occupantID = [];
        }

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
            //to check no duplicated
            if (!occupantID.includes(data4.studentID)) {
                occupantID.push(data4.studentID);
            }

        }
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

    const handleRejectClick = async () => {
        if (selectedPostIDs.length === 0) {
            message.error("Please select at least one post to reject");
            return;
        }
        await rejectPost(selectedPostIDs);
        // add fetch trigger to rerender the table
        setFetchTrigger((prevTrigger) => prevTrigger + 1);
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
                    loading={currentRoommateLoading}
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
                        hasRentalAgreement ? requestColumn : requestColumn.filter((column) => column.key !== 'roomIndex' && column.key !== 'roomType')
                    }
                    dataSource={requestDetails}
                    bordered={true}
                    pagination={{ pageSize: 5 }}
                    rowSelection={{
                        type: 'checkbox',
                        ...rowSelection,
                    }}
                    scroll={{ x: 1400 }}
                    loading={roomRequestLoading}
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
                    height: "auto",
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

                {hasRentalAgreement &&
                    <div
                        style={{
                            marginTop: "2%",
                            marginLeft: "1%",
                        }} >
                        <Table
                            columns={currentListingStatusColumn}
                            dataSource={currentListingStatus}
                            bordered={true}
                            pagination={false}
                            loading={roomDetailsLoading}
                        />
                    </div>
                }



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
                                className="viewButton"
                                style={{
                                    width: "auto",
                                    height: "auto",
                                    marginTop: "20px",
                                    marginRight: "10px",
                                    marginBottom: "10px",
                                    fontSize: "1.1rem",
                                    borderRadius: "0px",
                                    backgroundColor: "#6643b5",
                                    fontWeight: "500",
                                }}
                                onClick={handleApproveClick}
                            >
                                Approve
                            </Button>
                            <Button
                                type="primary"
                                danger
                                className="rejectButton"
                                style={{
                                    width: 100,
                                    height: "auto",
                                    marginTop: "20px",  
                                    marginRight: "10px",
                                    marginBottom: "10px",
                                    fontSize: "1.1rem",
                                    borderRadius: "0px",
                                    fontWeight: "500",
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