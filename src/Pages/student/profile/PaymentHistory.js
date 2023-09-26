import React, { useState, useRef } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Descriptions,
  Tooltip,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useEffect } from "react";
import { supabase } from "../../../supabase-client";
import EzRentIcon from "../../../images/icon.png";
import TarumtLogo from "../../../images/tarumt.png";
import html2pdf from "html2pdf.js";
import Typography from "antd/es/typography/Typography";
import { getDateOnly } from "../../../Components/timeUtils";

function PaymentHistory() {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [loading, setLoading] = useState(true);
  const searchInput = useRef(null);

  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const [rentalAgreementInfo, setRentalAgreementInfo] = useState(null);

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

  const viewRentalAgreement = async (rentalAgreementID) => {
    setIsRentalModalOpen(true);
    let { data: rentalAgreementInfo, error } = await supabase
      .from("rental_agreement")
      .select("* , postID(*), studentID(*), agentID(*)")
      .eq("rentalAgreementID", rentalAgreementID)
      .single();

    setRentalAgreementInfo(rentalAgreementInfo);
  };

  function pdfContent(rentalAgreementInfo) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 1rem",
            marginBottom: "1rem",
            flexDirection: "column",
          }}
        >
          <div
            className="logo"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={EzRentIcon}
              alt="logo"
              style={{ height: "150px", margin: "10px" }}
            />
            <img
              src={TarumtLogo}
              alt="tarumt-logo"
              style={{ margin: "10px" }}
            />
          </div>
          <hr style={{ width: "100%", border: "1px solid black" }} />
          <h1 style={{ textAlign: "center", fontSize: "1rem" }}>
            Rental Agreement
          </h1>

          <div
            className="content-container"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              maxWidth: "80%",
            }}
          >
            <div style={{ padding: "10px" }}>
              <div>
                <h2 style={{ fontSize: "1rem", marginLeft: "30px" }}>
                  Rental Details
                </h2>
                <div style={{ margin: "30px" }}>
                  <Descriptions size="small">
                    <Descriptions.Item label="Referral Code" span={3}>
                      {rentalAgreementInfo?.rentalAgreementID}
                    </Descriptions.Item>
                    <Descriptions.Item label="Date" span={3}>
                      {rentalAgreementInfo?.generatedDate}
                    </Descriptions.Item>
                    <Descriptions.Item label="Address" span={3}>
                      {rentalAgreementInfo?.postID.propertyName +
                        ", " +
                        rentalAgreementInfo?.postID.propertyAddress +
                        ", " +
                        rentalAgreementInfo?.postID.propertyCity +
                        " " +
                        rentalAgreementInfo?.postID.propertyPostcode}
                    </Descriptions.Item>
                    <Descriptions.Item label="Commencement Date" span={2}>
                      {rentalAgreementInfo?.commencementDate}
                    </Descriptions.Item>
                    <Descriptions.Item label="Expiration Date">
                      {rentalAgreementInfo?.expirationDate}
                    </Descriptions.Item>
                    <Descriptions.Item label="Duration" span={3}>
                      {rentalAgreementInfo?.rentalDuration.year +
                        " Year(s) " +
                        rentalAgreementInfo?.rentalDuration.month +
                        " Month(s)"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Rental (/Month)">
                      {"RM" + rentalAgreementInfo?.rentalPrice?.toFixed(2)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Security Deposit">
                      {"RM" +
                        rentalAgreementInfo?.rentalDeposit.SecurityDeposit?.toFixed(
                          2
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Utilities Deposit">
                      {"RM" +
                        rentalAgreementInfo?.rentalDeposit.UtilityDeposit?.toFixed(
                          2
                        )}
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              </div>
              <div
                className="terms"
                style={{ width: "90%", marginLeft: "30px" }}
              >
                <h2 style={{ fontSize: "1rem" }}>Terms and Conditions</h2>
                <ol>
                  <li>
                    Payment of rental shall be made on or before the 10th day of
                    each month.
                  </li>
                  <li>
                    A security deposit has been collected. This deposit is
                    intended to cover any damages beyond normal wear and tear.
                    The deposit will be refunded within 7 days of the lease
                    termination, less any deductions for damages or outstanding
                    charges.
                  </li>
                  <li>
                    The tenant is responsible for maintaining the property in a
                    clean and orderly condition. Regular cleaning, minor
                    repairs, and yard maintenance are expected.
                  </li>
                  <li>
                    Any alterations or modifications to the property must
                    receive written approval from the landlord. The tenant is
                    responsible for promptly reporting any necessary repairs,
                    and the landlord will address them in a timely manner.
                  </li>
                  <li>
                    Quiet hours are observed from 12am to 6am. Excessive noise
                    that disturbs neighbors is prohibited at all times.
                  </li>
                  <li>
                    Smoking is strictly prohibited inside the rental unit. Any
                    activities that result in strong or lingering odors are also
                    prohibited.
                  </li>
                  <li>
                    Either party must provide written notice to terminate the
                    lease. Renewal terms will be discussed prior to the lease
                    expiration.
                  </li>
                </ol>
              </div>

              <div
                className="signature"
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  marginLeft: "30px",
                }}
              >
                <div
                  className="tenant-signature"
                  style={{ marginRight: "300px", fontSize: "0.8rem" }}
                >
                  <h3>Signature by the tenant,</h3>
                  <br />
                  <hr style={{ width: "10vw" }} />
                  <p>
                    <b>Name: </b>
                  </p>
                  <p>
                    <b>IC: </b>
                  </p>
                  <p>
                    <b>Date: </b>
                  </p>
                </div>
                <div
                  className="agent-signature"
                  style={{ float: "right", fontSize: "0.8rem" }}
                >
                  <h3>Signature by the agent,</h3>
                  <br />
                  <hr style={{ width: "10vw" }} />
                  <p>
                    <b>Name: </b>
                  </p>
                  <p>
                    <b>IC: </b>
                  </p>
                  <p>
                    <b>Date: </b>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const fetchData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let { data: payments, error } = await supabase
      .from("payment")
      .select(`*, agent(*)`)
      .eq("paid_by", user.id)
      .order("payment_date", { ascending: false });

    if (error) {
      console.log(error);
    } else {
      const newData = payments.map((payment, index) => {
        return {
          key: index,
          payment_id: payment.payment_id,
          rental_agreement_id: payment.rental_agreement_id,
          payment_amount: payment.payment_amount.toFixed(2),
          payment_date: payment.payment_date,
          payment_method: payment.payment_method,
          paid_to: payment.agent.name,
        };
      });
      setData(newData);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: "Payment ID",
      dataIndex: "payment_id",
      key: "payment_id",
      ...getColumnSearchProps("payment_id"),
      ellipsis: {
        showTitle: false,
      },
      render: (payment_id) => (
        <Tooltip placement="topLeft" title={payment_id}>
          {payment_id}
        </Tooltip>
      ),
      width: "20%",
    },
    {
      title: "Rental Agreement ID",
      dataIndex: "rental_agreement_id",
      key: "rental_agreement_id",
      ellipsis: {
        showTitle: false,
      },
      render: (rental_agreement_id) => (
        <div
          onClick={() => viewRentalAgreement(rental_agreement_id)}
          style={{ cursor: "pointer", color: "#6643b5" }}
        >
          <Tooltip placement="topLeft" title={rental_agreement_id}>
            {rental_agreement_id}
          </Tooltip>
        </div>
      ),
      sorter: (a, b) =>
        a.rental_agreement_id.localeCompare(b.rental_agreement_id),
      sortDirections: ["descend", "ascend"],
      width: "25%",
    },
    {
      title: "Payment Amount (RM)",
      dataIndex: "payment_amount",
      key: "payment_amount",
      sorter: (a, b) => a.payment_amount - b.payment_amount,
      sortDirections: ["descend", "ascend"],
      render : (payment_amount) => (
        <span style={{textAlign: 'center'}}>{payment_amount}</span>
      ),
      width: "18%",
    },
    {
      title: "Payment Date",
      dataIndex: "payment_date",
      key: "payment_date",
      sorter: (a, b) => new Date(a.payment_date) - new Date(b.payment_date),
      render: (text, record) => getDateOnly(text),
      sortDirections: ["descend", "ascend"],
      width: "12%",
    },
    {
      title: "Payment Method",
      dataIndex: "payment_method",
      key: "payment_method",
      filters: [
        {
          text: "Card Payment",
          value: "card",
        },
        {
          text: "Online Banking (FPX)",
          value: "fpx",
        },
      ],
      onFilter: (value, record) => record.payment_method.indexOf(value) === 0,
      render: (payment_method) => (
        <>
          {payment_method === "card" ? (
            <span>Card Payment</span>
          ) : (
            <span>Online Banking (FPX)</span>
          )}
        </>
      ),
      width: "15%",
    },
    {
      title: "Paid To",
      dataIndex: "paid_to",
      key: "paid_to",
      ...getColumnSearchProps("paid_to"),
      ellipsis: {
        showTitle: false,
      },
      render: (paid_to) => (
        <Tooltip placement="topLeft" title={paid_to}>
          {paid_to}
        </Tooltip>
      ),
      width: "10%",
      
    },
  ];

  return (
    <div>
      <Typography.Title level={3}>Payment History</Typography.Title>
      <Table columns={columns} dataSource={data} bordered loading={loading} />
      <Modal
        open={isRentalModalOpen}
        onCancel={() => setIsRentalModalOpen(false)}
        onOk={() => {
          //download pdf
          const modalContent = document.getElementById("modal-content");
          // Create the PDF using html2pdf.js
          const opt = {
            margin: 10,
            filename: rentalAgreementInfo.rentalAgreementID + ".pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          };

          html2pdf().from(modalContent).set(opt).save();
          // setIsModalVisible(false);
        }}
        okText="Download PDF"
        cancelText="Cancel"
        width="80vw"
        style={{ height: "auto" }}
      >
        <div id="modal-content">{pdfContent(rentalAgreementInfo)}</div>
      </Modal>
    </div>
  );
}

export default PaymentHistory;
