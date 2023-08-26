import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import { supabase } from "../../../supabase-client";
import GenerateLog from "../../../Components/GenerateLog";

function UserActivation() {
  const [tableData, setTableData] = useState([]);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [selectionType, setSelectionType] = useState("checkbox");
  const [selectedAgentID, setSelectedAgentID] = useState([]);

  const fetchData = async () => {
    const { data: agent, agentError } = await supabase
      .from("agent")
      .select("*")
      .eq("account_status", false);

    if (agentError) {
      console.log("agentError", agentError);
    } else {
      const tableDataMap = await Promise.all(
        agent.map(async (agent) => {
          let { data: log, logError } = await supabase
            .from("activity_log")
            .select("*")
            .eq("target", agent.agent_id)
            .eq("action", "deactivate_account");

          if (logError) {
            console.log("logError", logError);
          } else {
            log.sort((a, b) => {
              return new Date(b.date) - new Date(a.date);
            });
          }

          return {
            key: agent.agent_id,
            agent_ID: agent.agent_id ? agent.agent_id : "N/A",
            agent_name: agent.name ? agent.name : "N/A",
            deactivated_date: log[0] ? log[0].date : "N/A",
            deactivated_by: log[0] ? log[0].managed_by : "N/A",
          };
        })
      );
      setTableData(tableDataMap);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchTrigger]);


  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedAgentID(selectedRows.map((row) => row.agent_ID));
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  const activateUser = async (agentID) => {
    let status = true;
    for (let i = 0; i < agentID.length; i++) {
      const { data, error } = await supabase
        .from("agent")
        .update({ account_status: true })
        .eq("agent_id", agentID[i]);

      if (error) {
        status = false;
        console.log("error", error);
      } else {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        GenerateLog("activate_account", agentID[i], user.id);
      }
    }
    if (status) {
      message.success("User(s) activated successfully");
      setFetchTrigger((prevTrigger) => prevTrigger + 1);
    }
  };

  const handleActivate = async () => {
    if (selectedAgentID.length === 0) {
      message.error("Please select at least one user to activate.");
      return;
    }
    await activateUser(selectedAgentID);
  };

  const columns = [
    {
      key: "agent_ID",
      title: "Agent ID",
      dataIndex: "agent_ID",
      sorter: (a, b) => {
        // Compare the length first
        const lengthComparison = a.agent_ID.length - b.agent_ID.length;

        // If lengths are the same, sort alphabetically by the property_category value
        if (lengthComparison === 0) {
          return a.agent_ID.localeCompare(b.agent_ID);
        }

        return lengthComparison;
      },
    },
    {
      key: "agent_name",
      title: "Agent Name",
      dataIndex: "agent_name",
      sorter: (a, b) => {
        // Compare the length first
        const lengthComparison = a.agent_name.length - b.agent_name.length;

        // If lengths are the same, sort alphabetically by the property_category value
        if (lengthComparison === 0) {
          return a.agent_name.localeCompare(b.agent_name);
        }

        return lengthComparison;
      },
    },
    {
      key: "deactivated_date",
      title: "Deactivated Date",
      dataIndex: "deactivated_date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      key: "deactivated_by",
      title: "Deactivated By",
      dataIndex: "deactivated_by",
      sorter: (a, b) => {
        // Compare the length first
        const lengthComparison =
          a.deactivated_by.length - b.deactivated_by.length;

        // If lengths are the same, sort alphabetically by the property_category value
        if (lengthComparison === 0) {
          return a.deactivated_by.localeCompare(b.deactivated_by);
        }

        return lengthComparison;
      },
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Table
        key={fetchTrigger}
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={tableData}
        bordered
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignSelf: "flex-end",
            marginBottom: "20px",
            marginRight: "0",
          }}
        >
          <Button
            type="primary"
            style={{
              width: "auto",
              height: "auto",
              margin: "10px",
              fontSize: "1.1rem",
            }}
            onClick={handleActivate}
          >
            Activate User
          </Button>
        </div>
      </div>
    </div>
  );
}

export default UserActivation;
