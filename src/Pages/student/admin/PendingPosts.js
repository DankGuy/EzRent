import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, Modal, Descriptions, Divider, Row, Col, Image } from "antd";
import React, { useRef, useState, useEffect, Fragment } from "react";
import Highlighter from "react-highlight-words";
import { supabase } from "../../../supabase-client";
import { formatDateTime } from "../../../Components/timeUtils";
import Carousel from "react-multi-carousel";


function PendingPosts() {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [selectionType, setSelectionType] = useState("checkbox");
  const [selectedPostIDs, setSelectedPostIDs] = useState([]);
  const [posts, setPosts] = useState([]);
  const searchInput = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState();
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const [propertyImages, setPropertyImages] = useState();
  const [roomImages, setRoomImages] = useState({});
  const [loadingImages, setLoadingImages] = useState(false);



  const viewPost = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const fetchData = async () => {
    let { data: property_post, error } = await supabase
      .from("property_post")
      .select("*")
      .eq("propertyStatus->>stage", "pending");
    if (error) {
      console.log("error", error);
    } else {
      const newData = property_post.map((post, index) => ({
        key: index,
        post_ID: post.postID,
        agent_ID: post.propertyAgentID,
        agent_rating: "4.5",
        property_name: post.propertyName,
        price: post.propertyPrice,
        action: (
          <Button
            type="link"
            onClick={() => {
              viewPost(post.post_ID);
              setModalData(post);
              getImages(post);
              console.log(post);
            }}
          >
            <EyeOutlined style={{ fontSize: "20px" }} />
          </Button>
        ),
      }));
      setData(newData);
    }
  };

  const getPosts = async () => {
    let { data: property_post, error } = await supabase
      .from("property_post")
      .select("*")
      .eq("propertyStatus->>stage", "pending");
    if (error) {
      console.log("error", error);
    } else {
      setPosts(property_post);
    }
  };

  const approvePost = async (postIDArr) => {
    for (let i = 0; i < postIDArr.length; i++) {
      let { data: property_post, error } = await supabase
        .from("property_post")
        .update({ propertyStatus: { stage: "approved", status: "active" } })
        .eq("postID", postIDArr[i]);
      if (error) {
        console.log("error", error);
      }
    }
  };

  const rejectPost = async (postIDArr) => {
    for (let i = 0; i < postIDArr.length; i++) {
      let { data: property_post, error } = await supabase
        .from("property_post")
        .update({ propertyStatus: { stage: "rejected", status: "inactive" } })
        .eq("postID", postIDArr[i]);
      if (error) {
        console.log("error", error);
      }
    }
  };

  const handleApproveClick = async () => {
    await approvePost(selectedPostIDs);
    // add fetch trigger to rerender the table
    setFetchTrigger((prevTrigger) => prevTrigger + 1);
  };

  const handleRejectClick = async () => {
    await rejectPost(selectedPostIDs);
    // add fetch trigger to rerender the table
    setFetchTrigger((prevTrigger) => prevTrigger + 1);
  };

  useEffect(() => {
    fetchData();
    getPosts();
  }, [fetchTrigger]);

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

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              handleReset(clearFilters, confirm);
            }}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedPostIDs(selectedRows.map((row) => row.post_ID));
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  const columns = [
    {
      title: "Post ID",
      dataIndex: "post_ID",
      key: "post_ID",
      width: "22.33%",
      ...getColumnSearchProps("post_ID"),
    },
    {
      title: "Agent ID",
      dataIndex: "agent_ID",
      key: "agent_ID",
      width: "22.33%",
      ...getColumnSearchProps("agent_ID"),
    },
    {
      title: "Agent Rating",
      dataIndex: "agent_rating",
      key: "agent_rating",
      width: "15%",
      ...getColumnSearchProps("agent_rating"),
      sorter: (a, b) => a.agent_rating - b.agent_rating,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Property Name",
      dataIndex: "property_name",
      key: "property_name",
      width: "22.33%",
      ...getColumnSearchProps("property_name"),
    },
    {
      title: "Price (RM)",
      dataIndex: "price",
      key: "price",
      width: "10%",
      ...getColumnSearchProps("price"),
      sorter: (a, b) => a.price - b.price,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: "8%",
    },
  ];

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
      slidesToSlide: 1 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
      slidesToSlide: 1 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    }
  };

  const statusColor = () => {
    if (modalData?.propertyStatus.stage === 'pending') {
      return 'blue'
    } else if (modalData?.propertyStatus?.stage === 'approved') {
      return 'green'
    } else if (modalData?.propertyStatus?.stage === 'rejected') {
      return 'red'
    } else if (modalData?.propertyStatus?.stage === 'drafted') {
      return 'orange'
    }
  }

  const fieldsetStyle = {
    border: '1px solid #d9d9d9',
    borderRadius: '5px',
    padding: '10px',
    marginTop: '20px',
  }

  const legendStyle = {
    width: 'auto',
    borderBottom: 'none',
    marginLeft: '20px',
    marginBottom: '0px',
  }

  const descriptionLabelStyle = {
    color: 'black',
  }


  const descriptionContentStyle = {
    color: 'black',
    border: '1px solid #d9d9d9',
    borderRadius: '5px',
    padding: '4px 11px',
  }

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
    const roomNumbers = Array.from({ length: post.propertyRoomNumber }, (_, i) => i + 1);

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
      return <p style={{ fontFamily: 'arial' }}>Loading images...</p>;
    }

    if (propertyImages === undefined || propertyImages.length === 0) {
      return <p style={{ fontFamily: 'arial' }}>No images available</p>;
    }

    return propertyImages.map((image) => {
      const publicURL = `https://exsvuquqspmbrtyjdpyc.supabase.co/storage/v1/object/public/post/${modalData?.postID}/Property/${image.name}`;

      return (
        <Image width={"auto"} height={200} key={image.id} src={publicURL} alt={image.name} />
      )
    })
  }

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
          <Image width={"auto"} height={100} key={image.id} src={publicURL} alt={image.name} />
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
            marginBottom: '20px',
            marginLeft: '20px',
          }}
        >
          <Image.PreviewGroup>
            <Carousel responsive={responsive}>
              {displayRoomImages(roomType)}
            </Carousel>
          </Image.PreviewGroup>
        </div>

        <Descriptions layout='vertical'
          labelStyle={descriptionLabelStyle}
          contentStyle={descriptionContentStyle}
          colon={false}
          className='postDetails'
        >

          <Descriptions.Item label="Room Type">{roomType}</Descriptions.Item>
          <Descriptions.Item label="Room Size (sq.ft.)">{roomSize}</Descriptions.Item>
          <Descriptions.Item label="Maximum Tenant">{maxTenant}</Descriptions.Item>
        </Descriptions>


        <Row>
          <Col span={6}>
            <span>Room Furnish</span>
          </Col>
        </Row>
        <Row style={{ marginTop: '10px' }}>
          {roomFurnishLabelArray.map((furnish, index) => (
            <Col span={6} key={index}>
              <span>&#8226; {furnish} ({roomFurnishQuantityArray[index]})</span>
            </Col>
          ))}
        </Row>
      </div>
    )
  }





  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        bordered
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
      <Modal
        title={"Post ID: " + modalData?.postID}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
      >
        <p>{modalData?.propertyName}</p>

        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>
            Post Details
          </legend>
          <Image.PreviewGroup>
            <Carousel responsive={responsive}>
              {displayImages(modalData)}
            </Carousel>
          </Image.PreviewGroup>
          <Descriptions
            layout='vertical'
            labelStyle={descriptionLabelStyle}
            contentStyle={descriptionContentStyle}
            colon={false}
            className='postDetails'
          >
            <Descriptions.Item label="Post ID">{modalData?.postID}</Descriptions.Item>
            <Descriptions.Item label="Post Date">{formatDateTime(modalData?.postDate)}</Descriptions.Item>
            <Descriptions.Item label="Last Modified Date"> {formatDateTime(modalData?.lastModifiedDate)}</Descriptions.Item>
            <Descriptions.Item
              label="Post Status"
              contentStyle={{
                color: statusColor(),
                textTransform: 'capitalize',
              }}
            >
              {modalData?.propertyStatus?.stage}
            </Descriptions.Item>
          </Descriptions>
        </fieldset>
        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>
            Property Details
          </legend>
          <Descriptions
            layout='vertical'
            labelStyle={descriptionLabelStyle}
            contentStyle={descriptionContentStyle}
            colon={false}
            className='postDetails'
          >
            <Descriptions.Item label="Property Name" span={3}>{modalData?.propertyName}</Descriptions.Item>
            <Descriptions.Item label="Property Address">{modalData?.propertyAddress}</Descriptions.Item>
            <Descriptions.Item label="Property Postcode">{modalData?.propertyPostcode}</Descriptions.Item>
            <Descriptions.Item label="Property City">{modalData?.propertyCity}</Descriptions.Item>
            <Descriptions.Item label="Property State">{modalData?.propertyState}</Descriptions.Item>
            <Descriptions.Item label="Property Built-Up Size (sq.ft.)">{modalData?.propertySquareFeet}</Descriptions.Item>
            <Descriptions.Item label="Property Type">{modalData?.propertyType}</Descriptions.Item>
          </Descriptions>
        </fieldset>
        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>
            Unit/Room Details
          </legend>

          <Descriptions
            layout='vertical'
            labelStyle={descriptionLabelStyle}
            contentStyle={descriptionContentStyle}
            colon={false}
            className='postDetails'
          >
            <Descriptions.Item label="Property Category">{modalData?.propertyCategory}</Descriptions.Item>
            {modalData?.propertyCategory === 'Room' ? (
              <>
                <Descriptions.Item label="Property Room Number">{modalData?.propertyRoomNumber}</Descriptions.Item>
              </>
            ) : null}
            <Descriptions.Item label={modalData?.propertyCategory === 'Room' ? 'Room Rental Price (RM)' : 'Unit Rental Price (RM)'}>
              {modalData?.propertyPrice}
            </Descriptions.Item>
          </Descriptions>
          {modalData?.propertyCategory === 'Room' ?
            roomDetailForm(1) : Array.from({ length: modalData?.propertyRoomNumber }, (v, i) => i + 1).map((roomNumber) => roomDetailForm(roomNumber))
          }
        </fieldset>
        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>
            Property Furnish
          </legend>
          <Row>
            {modalData?.propertyFurnish?.map((furnish, index) => (
              <Col span={6} key={index}>
                <span>&#8226; {furnish}</span>
              </Col>
            ))}
          </Row>
        </fieldset>
        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>
            Property Facilities
          </legend>
          <Row>
            {modalData?.propertyFacility?.map((facility, index) => (
              <Col span={6} key={index}>
                <span>&#8226; {facility}</span>
              </Col>
            ))}
          </Row>
        </fieldset>
        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>
            Property Description
          </legend>
          {modalData?.propertyDescription
            ? <p>{modalData?.propertyDescription}</p>
            : <p>No description provided</p>
          }
        </fieldset>
      </Modal>
    </div>
  );
}

export default PendingPosts;