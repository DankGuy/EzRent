import {
  CheckOutlined,
  SwitcherOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import { Button, Space, Table, Tag } from "antd";
import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabase-client";

const columns = [
  {
    title: "Report Reason",
    dataIndex: "report_reason",
    key: "report_reason",
    render: (_, { report_reason }) => {
      return <Tag>{report_reason.toUpperCase()}</Tag>;
    },
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Reported By",
    dataIndex: "reported_by",
    key: "reported_by",
  },
  {
    title: "Post Name",
    key: "post_name",
    dataIndex: "post_name",
  },
  {
    title: "Actions",
    key: "actions",
    dataIndex: "actions",
  },
];

function PendingReports() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    let { data: reports, error } = await supabase
      .from("report")
      .select("*")
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
          let { data: post, err } = await supabase
            .from("property_post")
            .select("*")
            .eq("postID", report.postID);

          if (err) {
            console.log("error", err);
          } else {
            propertyName = post[0].propertyName;
          }

          return {
            key: index,
            report_reason: report.reportReason,
            description: report.reportDescription,
            reported_by: studentName,
            post_name: propertyName,
            actions: (
              <div style={{ display: "flex", flexDirection: "row" }}>
                <Button type="text">
                  <CheckOutlined
                    style={{ fontSize: "20px", color: "limegreen" }}
                  />
                </Button>
                <Button type="text">
                  <SwitcherOutlined
                    style={{ fontSize: "20px", color: "#1677FF" }}
                  />
                </Button>
                <Button type="text">
                  <UserDeleteOutlined
                    style={{ fontSize: "20px", color: "red" }}
                  />
                </Button>
              </div>
            ),
          };
        })
      );
      setData(newData);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return <Table columns={columns} dataSource={data} bordered />;
}

export default PendingReports;
