import {
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { Button, Space, Table, Tag, Modal, Input, Select, message, Image, Descriptions, Divider, Row, Col } from "antd";
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../../supabase-client";
import { formatDateTime } from "../../../Components/timeUtils";
import Carousel from "react-multi-carousel";
import GenerateLog from "../../../Components/GenerateLog";
import Typography from "antd/es/typography/Typography";


function PendingReports() {
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [selectionType, setSelectionType] = useState("checkbox");
  const [selectedReportIDs, setSelectedReportIDs] = useState([]);
  const searchInput = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState();
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [selectedAction, setSelectedAction] = useState(null);
  const [placement, SetPlacement] = useState('bottomRight');

  const [propertyImages, setPropertyImages] = useState();
  const [roomImages, setRoomImages] = useState({});
  const [loadingImages, setLoadingImages] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [userID, setUserID] = useState("");

  const getUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserID(user.id);
      }
    } catch (error) {
      console.log("Error fetching user:", error);
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  const viewPost = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    setSearchText("");
    confirm();
  };

  const getColumnSearchProps = (dataIndex, placeholder) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{ padding: 8 }}
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
      >
        <Input
          ref={searchInput}
          placeholder={placeholder}
          value={selectedKeys[0]}
          onChange={(e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
          }}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />

        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>

          <Button
            onClick={() => handleReset(clearFilters, confirm)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "black" : undefined }} />
    ),
    onFilter: (value, record) => {
      return record[dataIndex]
        ? record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase())
        : "";
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const resolve = async (reportID) => {
    let status = true;
    for (let i = 0; i < reportID.length; i++) {
      const { data, error } = await supabase
        .from("report")
        .update({ reportStatus: "Resolved" })
        .eq("reportID", reportID[i]);
      if (error) {
        status = false;
        console.log("error", error);
      }
      else {
        GenerateLog("resolve_report", reportID[i], userID);
      }
    }
    if (status) {
      message.success("Report resolved successfully");
      setFetchTrigger((prevTrigger) => prevTrigger + 1);
    }
  };

  const handleResolve = async () => {
    if (selectedReportIDs.length === 0) {
      message.error("Please select at least one report");
      return;
    }
    await resolve(selectedReportIDs);
  };

  const action = async (value, reportIDArr) => {
    let status = true;
    for (let i = 0; i < reportIDArr.length; i++) {
      if (value === "deactivate_post") {
        let postID;
        const { data: report, reportError } = await supabase
          .from('report')
          .select('postID')
          .eq('reportID', reportIDArr[i])
        if (reportError) {
          console.log("report error", reportError);
          status = false;
        } else {
          postID = report[0].postID;
        }

        const { data: post, error } = await supabase
          .from('property_post')
          .update({ propertyStatus: { stage: "rejected", status: "inactive" } })
          .eq('postID', postID)
        if (error) {
          console.log("post error", error);
          status = false;
        } else {
          GenerateLog("deactivate_post", postID, userID);
        }
      }
      else {
        let agentID, postID;

        const { data: report, error } = await supabase
          .from('report')
          .select('postID')
          .eq('reportID', reportIDArr[i])
        if (error) {
          console.log("error", error);
        } else {
          postID = report[i].postID;
        }

        const { data: post, postError } = await supabase
          .from('property_post')
          .select('propertyAgentID')
          .eq('postID', postID)
        if (error) {
          console.log("error", postError);
        } else {
          agentID = post[i].propertyAgentID;
        }

        const { data: agent, agentError } = await supabase
          .from('agent')
          .update({ account_status: 'FALSE' })
          .eq('agent_id', agentID)
        if (error) {
          console.log("error", agentError);
        } else {
          GenerateLog("deactivate_account", agentID, userID);
        }
      }
    }
    if (status) {
      handleResolve(reportIDArr);
    }
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedReportIDs(selectedRows.map((row) => row.report_id));
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  const fetchData = async () => {
    let { data: reports, error } = await supabase
      .from("report")
      .select("*, property_post(*)")
      .eq("reportStatus", "Pending");
    if (error) {
      console.log("error", error);
    } else {
      const newData = await Promise.all(
        reports.map(async (report, index) => {
          let studentName;
          let { data: student, error } = await supabase
            .from("student")
            .select("*")
            .eq("student_id", report.reportedBy);

          if (error) {
            console.log("error", error);
          } else {
            studentName = student[0].name;
          }

          let propertyName;
          let postOwner;

          let { data: post, err } = await supabase
            .from("property_post")
            .select("*")
            .eq("postID", report.postID);

          if (err) {
            console.log("error", err);
          } else {
            propertyName = post[0].propertyName;

            let { data: agent, error } = await supabase
              .from("agent")
              .select("*")
              .eq("agent_id", post[0].propertyAgentID);

            if (error) {
              console.log("error", error);
            }
            postOwner = agent[0].name;
          }

          return {
            key: index,
            report_id: report.reportID ? report.reportID : "N/A",
            report_reason: report.reportReason ? report.reportReason : "N/A",
            description: report.reportDescription ? report.reportDescription : "N/A",
            reported_by: studentName ? studentName : "N/A",
            post_owner: postOwner ? postOwner : "N/A",
            post_name: propertyName ? propertyName : "N/A",
            view: (
              <Button
                type="text"
                onClick={() => {
                  viewPost();
                  setModalData(report.property_post);
                  getImages(report.property_post);
                }}
                style={{ padding: "0px" }}
              >
                <EyeOutlined style={{ fontSize: "20px", color: "#6643b5" }} />              
                </Button>
            ),
          };
        })
      );
      setData(newData);
      setTableLoading(false);
    }
  };

  const handleAction = async (value) => {
    if (selectedReportIDs.length === 0) {
      message.error("Please select at least one report");
      return;
    }
    await action(value, selectedReportIDs);
  }

  useEffect(() => {
    fetchData();
  }, [fetchTrigger]);

  const columns = [
    {
      title: "Report Reason",
      dataIndex: "report_reason",
      key: "report_reason",
      filters: [
        {
          text: 'Incorrect or inaccurate information',
          value: 'Incorrect or inaccurate information',
        },
        {
          text: 'Unresponsive or suspicious poster',
          value: 'Unresponsive or suspicious poster',
        },
        {
          text: 'Safety and security concerns',
          value: 'Safety and security concerns',
        },
        {
          text: "Discriminatory or offensive content",
          value: "Discriminatory or offensive content",
        },
        {
          text: 'Other Issues',
          value: 'Other issues',
        }
      ],
      onFilter: (value, record) => record.report_reason.indexOf(value) === 0,

      render: (_, { report_reason }) => {
        return <Tag>{report_reason.toUpperCase()}</Tag>;
      },
      width: "28%",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "25%",
    },
    {
      title: "Reported By",
      dataIndex: "reported_by",
      key: "reported_by",
      ...getColumnSearchProps("reported_by", "Search by student name"),
      width: "15%",

    },
    {
      title: "Post Owner",
      dataIndex: "post_owner",
      key: "post_owner",
      ...getColumnSearchProps("post_owner", "Search by agent name"),
      width: "15%",
    },
    {
      title: "Property Name",
      key: "post_name",
      dataIndex: "post_name",
      ...getColumnSearchProps("post_name", "Search by property name"),
      width: "15%",
    },
    {
      title: "View",
      key: "view",
      dataIndex: "view",
      onclick: () => {
        setIsModalOpen(true);
      },
      width: "6%",
    },
  ];

  //Modal 
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
      slidesToSlide: 1, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
      slidesToSlide: 1, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };

  const statusColor = () => {
    if (modalData?.propertyStatus.stage === "pending") {
      return "blue";
    } else if (modalData?.propertyStatus?.stage === "approved") {
      return "green";
    } else if (modalData?.propertyStatus?.stage === "rejected") {
      return "red";
    } else if (modalData?.propertyStatus?.stage === "drafted") {
      return "orange";
    }
  };

  const fieldsetStyle = {
    border: "1px solid #d9d9d9",
    borderRadius: "5px",
    padding: "10px",
    marginTop: "20px",
  };

  const legendStyle = {
    width: "auto",
    borderBottom: "none",
    marginLeft: "20px",
    marginBottom: "0px",
  };

  const descriptionLabelStyle = {
    color: "black",
  };

  const descriptionContentStyle = {
    color: "black",
    border: "1px solid #d9d9d9",
    borderRadius: "5px",
    padding: "4px 11px",
  };

  const getImages = async (post) => {
    setLoadingImages(true);

    // Get all images from supabase storage with id = postID
    const { data: propertyData, error: propertyError } = await supabase.storage
      .from("post")
      .list(`${post.postID}/Property`);

    if (propertyData) {
      setPropertyImages(propertyData);
    }

    // Create an array of room numbers
    const roomNumbers = Array.from(
      { length: post.propertyRoomNumber },
      (_, i) => i + 1
    );

    // Map over the room numbers and retrieve room images for each
    await Promise.all(
      roomNumbers.map(async (roomNumber) => {
        const roomType = post.propertyRoomDetails[roomNumber].roomType;

        const { data: roomData, error: roomError } = await supabase.storage
          .from("post")
          .list(`${post.postID}/${roomType}`);

        if (roomData) {
          setRoomImages((prevState) => {
            const updatedState = { ...prevState };
            updatedState[roomType] = roomData;
            return updatedState;
          });
        }

        if (roomError) {
          console.log(roomError);
        }
      })
    );

    setLoadingImages(false);
  };

  const displayImages = (modalData) => {
    if (loadingImages) {
      return <p style={{ fontFamily: "arial" }}>Loading images...</p>;
    }

    if (propertyImages === undefined || propertyImages.length === 0) {
      return <p style={{ fontFamily: "arial" }}>No images available</p>;
    }

    return propertyImages.map((image) => {
      const publicURL = `https://exsvuquqspmbrtyjdpyc.supabase.co/storage/v1/object/public/post/${modalData?.postID}/Property/${image.name}`;

      return (
        <Image
          width={"auto"}
          height={200}
          key={image.id}
          src={publicURL}
          alt={image.name}
        />
      );
    });
  };

  const displayRoomImages = (roomType) => {
    const images = roomImages[roomType];

    if (loadingImages) {
      return <p>Loading room images...</p>;
    }

    if (images === undefined || images.length === 0) {
      return <p>No images available</p>;
    }

    if (images && images.length > 0) {
      return images.map((image) => {
        const publicURL = `https://exsvuquqspmbrtyjdpyc.supabase.co/storage/v1/object/public/post/${modalData?.postID}/${roomType}/${image.name}`;

        return (
          <Image
            width={"auto"}
            height={100}
            key={image.id}
            src={publicURL}
            alt={image.name}
          />
        );
      });
    }

    return null;
  };

  const roomDetailForm = (index) => {
    const roomType = modalData?.propertyRoomDetails[index]?.roomType;
    const roomSize = modalData?.propertyRoomDetails[index]?.roomSquareFeet;
    const maxTenant = modalData?.propertyRoomDetails[index]?.maxTenant;
    const roomFurnish = modalData?.propertyRoomDetails[index]?.roomFurnish;

    const roomFurnishLabelArray = [];
    const roomFurnishQuantityArray = [];

    for (const [key, value] of Object.entries(roomFurnish)) {
      roomFurnishLabelArray.push(key);
      roomFurnishQuantityArray.push(value);
    }

    return (
      <div key={index}>
        <Divider orientation="left">Room {index}</Divider>

        <div
          style={{
            marginBottom: "20px",
            marginLeft: "20px",
          }}
        >
          <Image.PreviewGroup>
            <Carousel responsive={responsive}>
              {displayRoomImages(roomType)}
            </Carousel>
          </Image.PreviewGroup>
        </div>

        <Descriptions
          layout="vertical"
          labelStyle={descriptionLabelStyle}
          contentStyle={descriptionContentStyle}
          colon={false}
          className="postDetails"
        >
          <Descriptions.Item label="Room Type">{roomType}</Descriptions.Item>
          <Descriptions.Item label="Room Size (sq.ft.)">
            {roomSize}
          </Descriptions.Item>
          <Descriptions.Item label="Maximum Tenant">
            {maxTenant}
          </Descriptions.Item>
        </Descriptions>

        <Row>
          <Col span={6}>
            <span>Room Furnish</span>
          </Col>
        </Row>
        <Row style={{ marginTop: "10px" }}>
          {roomFurnishLabelArray.map((furnish, index) => (
            <Col span={6} key={index}>
              <span>
                &#8226; {furnish} ({roomFurnishQuantityArray[index]})
              </span>
            </Col>
          ))}
        </Row>
      </div>
    );
  };


  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Typography.Title level={3}>Pending Reports</Typography.Title>
      <Table
        key={fetchTrigger}
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        bordered
        pagination={{ pageSize: 5 }}
        tableLayout="fixed"
        loading={tableLoading}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", flexDirection: "row", alignSelf: "flex-end", marginBottom: "20px", marginRight: "0" }}>

          <Button type="primary" style={{
            width: "10vw",
            height: "auto",
            margin: "10px",
            fontSize: "1.1rem",
            borderRadius: "0px",
            textAlign: "center",
            fontWeight: "500",
          }}
            onClick={
              handleResolve
            }
          >
            Resolve
          </Button>

          <Select
            placeholder="Deactivate"
            placement={placement}
            value={selectedAction}
            onSelect={(value) => {
              handleAction(value);
              setSelectedAction(null);
            }}
            size="large"
            style={{
              width: "11vw",
              height: "auto",
              margin: "10px",
              fontSize: "1.1rem",
              textAlign: "center",
              fontWeight: "500",
              // borderRadius: "0px",
            }}
            className="deactivate-select"
            options={[
              {
                value: 'deactivate_post',
                label: 'Deactivate Post',
              },
              {
                value: 'deactivate_account',
                label: 'Deactivate Account',
              },
            ]}
          />
        </div>
      </div>
      <div>
        <Modal
          title={"View Post"}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          width={1000}
          // maxHeight={500}
          // scrollable={true}
          style={{
            maxHeight: "80vh",
          }}
          bodyStyle={{
            // maxHeight: "80vh",
            overflowY: "auto",
            overflow: "wrap"
          }}
        >
          <fieldset style={fieldsetStyle}>
            <legend style={legendStyle}>Post Details</legend>
            <Image.PreviewGroup>
              <Carousel responsive={responsive}>
                {displayImages(modalData)}
              </Carousel>
            </Image.PreviewGroup>
            <Descriptions
              layout="vertical"
              labelStyle={descriptionLabelStyle}
              contentStyle={descriptionContentStyle}
              colon={false}
              className="postDetails"
            >
              <Descriptions.Item label="Post ID">
                {modalData?.postID}
              </Descriptions.Item>
              <Descriptions.Item label="Post Date">
                {formatDateTime(modalData?.postDate)}
              </Descriptions.Item>
              <Descriptions.Item label="Last Modified Date">
                {formatDateTime(modalData?.lastModifiedDate)}
              </Descriptions.Item>
              <Descriptions.Item
                label="Post Status"
                contentStyle={{
                  color: statusColor(),
                  textTransform: "capitalize",
                }}
              >
                {modalData?.propertyStatus?.stage}
              </Descriptions.Item>
            </Descriptions>
          </fieldset>
          <fieldset style={fieldsetStyle}>
            <legend style={legendStyle}>Property Details</legend>
            <Descriptions
              layout="vertical"
              labelStyle={descriptionLabelStyle}
              contentStyle={descriptionContentStyle}
              colon={false}
              className="postDetails"
            >
              <Descriptions.Item label="Property Name" span={3}>
                {modalData?.propertyName}
              </Descriptions.Item>
              <Descriptions.Item label="Property Address">
                {modalData?.propertyAddress}
              </Descriptions.Item>
              <Descriptions.Item label="Property Postcode">
                {modalData?.propertyPostcode}
              </Descriptions.Item>
              <Descriptions.Item label="Property City">
                {modalData?.propertyCity}
              </Descriptions.Item>
              <Descriptions.Item label="Property State">
                {modalData?.propertyState}
              </Descriptions.Item>
              <Descriptions.Item label="Property Built-Up Size (sq.ft.)">
                {modalData?.propertySquareFeet}
              </Descriptions.Item>
              <Descriptions.Item label="Property Type">
                {modalData?.propertyType}
              </Descriptions.Item>
            </Descriptions>
          </fieldset>
          <fieldset style={fieldsetStyle}>
            <legend style={legendStyle}>Unit/Room Details</legend>

            <Descriptions
              layout="vertical"
              labelStyle={descriptionLabelStyle}
              contentStyle={descriptionContentStyle}
              colon={false}
              className="postDetails"
            >
              <Descriptions.Item label="Property Category">
                {modalData?.propertyCategory}
              </Descriptions.Item>
              {modalData?.propertyCategory === "Room" ? (
                <>
                  <Descriptions.Item label="Property Room Number">
                    {modalData?.propertyRoomNumber}
                  </Descriptions.Item>
                </>
              ) : null}
              <Descriptions.Item
                label={
                  modalData?.propertyCategory === "Room"
                    ? "Room Rental Price (RM)"
                    : "Unit Rental Price (RM)"
                }
              >
                {modalData?.propertyPrice}
              </Descriptions.Item>
            </Descriptions>
            {modalData?.propertyCategory === "Room"
              ? roomDetailForm(1)
              : Array.from(
                { length: modalData?.propertyRoomNumber },
                (v, i) => i + 1
              ).map((roomNumber) => roomDetailForm(roomNumber))}
          </fieldset>
          <fieldset style={fieldsetStyle}>
            <legend style={legendStyle}>Property Furnish</legend>
            <Row>
              {modalData?.propertyFurnish?.map((furnish, index) => (
                <Col span={6} key={index}>
                  <span>&#8226; {furnish}</span>
                </Col>
              ))}
            </Row>
          </fieldset>
          <fieldset style={fieldsetStyle}>
            <legend style={legendStyle}>Property Facilities</legend>
            <Row>
              {modalData?.propertyFacility?.map((facility, index) => (
                <Col span={6} key={index}>
                  <span>&#8226; {facility}</span>
                </Col>
              ))}
            </Row>
          </fieldset>
          <fieldset style={fieldsetStyle}>
            <legend style={legendStyle}>Property Description</legend>
            {modalData?.propertyDescription ? (
              <p>{modalData?.propertyDescription}</p>
            ) : (
              <p>No description provided</p>
            )}
          </fieldset>
        </Modal>

      </div>
    </div>
  );
}

export default PendingReports;
