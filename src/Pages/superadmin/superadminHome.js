import React, { useRef, useState } from "react";
import {
  Button,
  Input,
  Table,
  Space,
  Menu,
  Typography,
  Tabs,
  message,
  Card,
} from "antd";
import {
  SearchOutlined,
  LogoutOutlined,
  ToolOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { supabase } from "../../supabase-client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function SuperadminHome() {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [admin, setAdmin] = useState([]);
  const [student, setStudent] = useState([]);
  const searchInput = useRef(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [selectedAdmin, setSelectedAdmin] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState([]);
  const [selectionType, setSelectionType] = useState("checkbox");
  const [adminLoading, setAdminLoading] = useState(true);
  const [studentLoading, setStudentLoading] = useState(true);
  const navigate = useNavigate();
  const { Title } = Typography;

  const navItems = [
    {
      label: <span style={{ color: "red" }}>Logout</span>,
      key: "logout",
      icon: (
        <span style={{ color: "red" }}>
          <LogoutOutlined />
        </span>
      ),
    },
  ];

  const logout = async () => {
    await supabase.auth.signOut().then(() => {
      navigate("/");
    });
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
            className="filter-button"
          >
            Search
          </Button>

          <Button
            onClick={() => handleReset(clearFilters, confirm)}
            size="small"
            className="filter-button"
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

  const studRowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedStudent(selectedRows.map((row) => row.student_id));
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  const adminRowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedAdmin(selectedRows.map((row) => row.student_id));
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  const fetchAdmin = async () => {
    setAdminLoading(true);
    let { data: admins, error } = await supabase
      .from("student")
      .select("*")
      .eq("role", "admin");

    if (error) {
      console.log(error);
      return;
    }
    const tableDataMap = await Promise.all(
      admins.map(async (admin) => {
        return {
          key: admin.student_id,
          student_id: admin.student_id,
          name: admin.name,
          email: admin.email,
        };
      })
    );
    setAdmin(tableDataMap);
    setAdminLoading(false);
  };

  const fetchStudent = async () => {
    setStudentLoading(true);
    let { data: students, error } = await supabase
      .from("student")
      .select("*")
      .eq("role", "student");

    if (error) {
      console.log(error);
      return;
    }
    const tableDataMap = await Promise.all(
      students.map(async (student) => {
        return {
          key: student.student_id,
          student_id: student.student_id,
          name: student.name,
          email: student.email,
        };
      })
    );
    setStudent(tableDataMap);
    setStudentLoading(false);
  };

  const grantAdmin = async () => {
    let status = true;
    for (let i = 0; i < selectedStudent.length; i++) {
      const { error } = await supabase
        .from("student")
        .update({ role: "admin" })
        .eq("student_id", selectedStudent[i]);

      if (error) {
        console.log(error);
        status = false;
      }
    }
    if (status) {
      message.success("Successfully granted admin access!");
      setFetchTrigger(fetchTrigger + 1);
    }
  };

  const removeAdmin = async () => {
    let status = true;
    for (let i = 0; i < selectedAdmin.length; i++) {
      const { error } = await supabase

        .from("student")
        .update({ role: "student" })
        .eq("student_id", selectedAdmin[i]);

      if (error) {
        console.log(error);
        status = false;
      }
    }
    if (status) {
      message.success("Successfully removed admin access!");
      setFetchTrigger(fetchTrigger + 1);
    }
  };

  useEffect(() => {
    fetchAdmin();
    fetchStudent();
  }, [fetchTrigger]);

  const columns = [
    {
      key: "student_id",
      title: "Student ID",
      dataIndex: "student_id",
      width: "33.33%",
      ...getColumnSearchProps("student_id", "Search Student ID"),
    },
    {
      key: "name",
      title: "Name",
      dataIndex: "name",
      width: "33.33%",
      ...getColumnSearchProps("name", "Search Name"),
    },
    {
      key: "email",
      title: "Email",
      dataIndex: "email",
      width: "33.33%",
      ...getColumnSearchProps("email", "Search Email"),
    },
  ];

  const items = [
    {
      key: "1",
      label: "Admins",
      icon: <ToolOutlined />,
      children: (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Table
            key={fetchTrigger}
            columns={columns}
            dataSource={admin}
            bordered
            rowSelection={{
              type: selectionType,
              ...adminRowSelection,
            }}
            loading={adminLoading}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Button
              danger
              style={{ fontSize: "1rem", height: "auto" }}
              onClick={removeAdmin}
            >
              Remove Admin
            </Button>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "Students",
      icon: <UserOutlined />,
      children: (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Table
            key={fetchTrigger}
            columns={columns}
            dataSource={student}
            bordered
            rowSelection={{
              type: selectionType,
              ...studRowSelection,
            }}
            loading={studentLoading}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Button
              type="primary"
              style={{ fontSize: "1rem", height: "auto" }}
              onClick={grantAdmin}
            >
              Grant Admin
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <Menu
        mode="horizontal"
        style={{ display: "flex", justifyContent: "flex-end" }}
        items={navItems}
        onClick={logout}
      />
      <Card style={{ marginTop: "20px", height: "90vh" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "30px",
            width: "100%",
            height: "100%",
            marginTop: "2em",
          }}
        >
          <div
            style={{ width: "80%", display: "flex", flexDirection: "column" }}
          >
            <Title level={3}>Admin Management</Title>
            <Tabs items={items} defaultActiveKey="1" />
          </div>
        </div>
      </Card>
    </>
  );
}

export default SuperadminHome;
