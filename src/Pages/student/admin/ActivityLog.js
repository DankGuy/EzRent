import React, { useState, useRef } from "react";
import { Table, Button, Input, Space, Tag, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useEffect } from "react";
import moment from 'moment';
import { supabase } from "../../../supabase-client";

function ActivityLog() {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [loading, setLoading] = useState(true);
  const searchInput = useRef(null);

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
  const fetchData = async () => {
    let { data: activity_log, error } = await supabase
      .from("activity_log")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.log("error", error);
    } else {
      const newData = await Promise.all(
        activity_log.map(async (log, index) => {
          let adminName, category;

          let { data: admin, adminError } = await supabase
            .from("student")
            .select("name")
            .eq("student_id", log.managed_by);

          if (adminError) {
            console.log("adminError", adminError);
          } else {
            adminName = admin[0]?.name || "";
          }

          let { data: post, postError } = await supabase
            .from("property_post")
            .select("*")
            .eq("postID", log.target);

          if (!postError && post.length > 0) {
            category = "post";
          }

          let { data: report, reportError } = await supabase
            .from("report")
            .select("*")
            .eq("reportID", log.target);

          if (!reportError && report.length > 0) {
            category = "report";
          }

          let { data: account, accountError } = await supabase
            .from("agent")
            .select("*")
            .eq("agent_id", log.target);

          if (!accountError && account.length > 0) {
            category = "account";
          }

          return {
            key: index,
            managed_by: adminName,
            action: log.action,
            category: category,
            target: log.target,
            date: log.date,
          };
        })
      );
      setData(newData);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: "Managed By",
      dataIndex: "managed_by",
      key: "managed_by",
      ...getColumnSearchProps("managed_by", "Search Admin Name"),
      width: "20%",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      filters: [
        {
          text: "Approve Post",
          value: "approve_post",
        },
        {
          text: "Reject Post",
          value: "reject_post",
        },
        {
          text: "Resolve Report",
          value: "resolve_report",
        },
        {
          text: "Deactivate Post",
          value: "deactivate_post",
        },
        {
          text: "Deactivate Account",
          value: "deactivate_account",
        },
        {
          text: "Activate Account",
          value: "activate_account",
        },
      ],
      onFilter: (value, record) => record.action.indexOf(value) === 0,
      render: (text) => {
        let color;
        if (text === "approve_post") {
          color = "green";
        } else if (text === "reject_post") {
          color = "red";
        } else if (text === "resolve_report") {
          color = "green";
        } else if (text === "deactivate_post") {
          color = "red";
        } else if (text === "deactivate_account") {
          color = "red";
        } else if (text === "activate_account") {
          color = "green";
        }
        return <Tag color={color}>{text.toUpperCase()}</Tag>;
      },
      width: "15%",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      filters: [
        {
          text: "Post",
          value: "post",
        },
        {
          text: "Report",
          value: "report",
        },
        {
          text: "Account",
          value: "account",
        },
      ],
      onFilter: (value, record) => record.category.indexOf(value) === 0,
      render: (text) => {
        return <span style={{ textTransform: 'capitalize' }}>{text}</span>;
      },
      width: "15%",
    },
    {
      title: "Target",
      dataIndex: "target",
      key: "target",
      ...getColumnSearchProps("target", "Search Target"),
      width: "30%",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      sortDirections: ["descend", "ascend"],
      width: "20%",
      render: (date) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  return (
    <div>
      <Typography.Title level={3}>Activity Log</Typography.Title>
      <Table
        columns={columns}
        dataSource={data} 
        pagination={{ pageSize: 10 }}
        tableLayout="fixed"
        bordered 
        loading={loading} />
    </div>
  );
}
export default ActivityLog;
