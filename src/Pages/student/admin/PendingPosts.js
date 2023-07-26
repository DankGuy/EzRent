import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";
import React, { useRef, useState, useEffect } from "react";
import Highlighter from "react-highlight-words";
import { supabase } from "../../../supabase-client";

function PendingPosts() {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [selectionType, setSelectionType] = useState("checkbox");
  const [selectedPostIDs, setSelectedPostIDs] = useState([]);
  const [posts, setPosts] = useState([]);
  const searchInput = useRef(null);

  const viewPost = () => {
    // modal view post
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
          <Button type="link" onClick={viewPost(post.postID)}>
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
  }

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

  const handleApproveClick = () => {
    approvePost(selectedPostIDs);
  };

  const handleRejectClick = () => {
    rejectPost(selectedPostIDs);
  };

  useEffect(() => {
    fetchData();
    getPosts();
  }, []);

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
    </div>
  );
}

export default PendingPosts;
