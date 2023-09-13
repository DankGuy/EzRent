import { Fragment } from "react";
import { supabase } from "../../../supabase-client";
import { useState, useEffect } from "react";
import { Button, Modal, Table, Tooltip, Descriptions, Tag, Typography } from "antd";
import { getDateOnly } from "../../../Components/timeUtils";
import { Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useRef } from "react";
import RentedPropertyDetails from "./RentedPropertyDetails";
import EzRentIcon from "../../../images/icon.png";
import TarumtLogo from "../../../images/tarumt.png";
import html2pdf from "html2pdf.js";

function AgentRentedProperty() {
  const [properties, setProperties] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTenant, setModalTenant] = useState([]);
  const [modalOccupant, setModalOccupant] = useState([]);

  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const [rentalAgreementInfo, setRentalAgreementInfo] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      const userID = (await supabase.auth.getUser()).data.user.id;

      const { data, error } = await supabase
        .from("rental_agreement")
        .select("* , postID(*), studentID(*), agentID(*)")
        .eq("agentID", userID);

      const tableData = [];

      data.forEach((element) => {
        console.log(element);

        const rentalDuration = () => {
          if (element.rentalDuration.year === 0) {
            return element.rentalDuration.month + " month(s)";
          } else if (element.rentalDuration.month === 0) {
            return element.rentalDuration.year + " year(s)";
          } else {
            return (
              element.rentalDuration.year +
              " year(s) " +
              element.rentalDuration.month +
              " month(s)"
            );
          }
        };

        //combine address, postcode, city, state into one string
        const address =
          element.postID.propertyAddress +
          ", " +
          element.postID.propertyPostcode +
          " " +
          element.postID.propertyCity +
          ", " +
          element.postID.propertyState;

        tableData.push({
          key: element.rentalAgreementID,
          post: element,
          rentalAgreementID: element.rentalAgreementID,
          propertyName: element.postID.propertyName,
          propertyAddress: address,
          duration: rentalDuration(),
          tenantName: element.studentID.name,
          commencementDate: element.commencementDate,
          status: element.status,
          student: element.studentID,
          occupant: element.occupantID,
        });
      });

      setProperties(tableData);
      setLoading(false);
    };

    fetchProperties();
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

  const handleModalChange = (record) => {
    console.log(record);

    setModalTenant(record.student);
    setModalOccupant(record.occupant);

    setIsModalOpen(true);
  };

  const onChangeModal = (value) => {
    setIsModalOpen(value);
  };

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

  function renderStatus(status) {

    if (status === "pending") {
      return <Tag color="orange">Pending</Tag>;
    } else if (status === "active") {
      return <Tag color="green">Active</Tag>;
    } else if (status === "inactive") {
      return <Tag color="red">Inactive</Tag>;
    }

  };


  const columns = [
    {
      title: "Rental Agreement ID",
      dataIndex: "rentalAgreementID",
      key: "rentalAgreementID",
      fixed: "left",
      ...getColumnSearchProps(
        "rentalAgreementID",
        "Search Rental Agreement ID"
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (rentalAgreementID) => (
        <div
          onClick={() => viewRentalAgreement(rentalAgreementID)}
          style={{ cursor: "pointer", color: "#1890ff" }}
        >
          <Tooltip placement="topLeft" title={rentalAgreementID}>
            {rentalAgreementID}
          </Tooltip>
        </div>
      ),
      className: "postIDcolumn",
      width: "20%",
      sorter: (a, b) => a.rentalAgreementID.localeCompare(b.rentalAgreementID),
    },
    {
      title: "Property Name",
      dataIndex: "propertyName",
      key: "propertyName",
      ...getColumnSearchProps("propertyName", "Search Property Name"),
      sorter: (a, b) => a.propertyName.localeCompare(b.propertyName),
      ellipsis: {
        showTitle: false,
      },
      render: (propertyName) => (
        <Tooltip placement="topLeft" title={propertyName}>
          {propertyName}
        </Tooltip>
      ),
      width: "15%",
    },
    {
      title: "Property Address",
      dataIndex: "propertyAddress",
      key: "propertyAddress",
      sorter: (a, b) => a.propertyAddress.localeCompare(b.propertyAddress),
      ellipsis: {
        showTitle: false,
      },
      render: (address) => (
        <Tooltip placement="topLeft" title={address}>
          {address}
        </Tooltip>
      ),
      width: "20%",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      sorter: (a, b) => a.duration.localeCompare(b.duration),
      width: "15%",
    },
    {
      title: "Tenant Name",
      dataIndex: "tenantName",
      key: "tenantName",
      sorter: (a, b) => a.tenantName.localeCompare(b.tenantName),
      ...getColumnSearchProps("tenantName", "Search Tenant Name"),
      ellipsis: {
        showTitle: false,
      },
      render: (tenantName, record) => (
        <>
          {/* <Tooltip placement="topLeft" title={tenantName}> */}
          <div
            onClick={() => handleModalChange(record)}
            style={{ cursor: "pointer", color: "#1890ff" }}
          >
            {tenantName}
          </div>
          {/* </Tooltip> */}
        </>
      ),
      width: "15%",
    },
    {
      title: "Commencement Date",
      dataIndex: "commencementDate",
      key: "commencementDate",
      sorter: (a, b) => (new Date(a.commencementDate) - new Date(b.commencementDate)),
      render: (commencementDate) => <p>{getDateOnly(commencementDate)}</p>,
      width: "15%",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      width: "10%",
      render: (status) => (
        <>
          {renderStatus(status)}
        </>
      ),
    },
  ];

  return (
    <Fragment>
      <div>
        <Typography.Title level={3}>Rented Property</Typography.Title>
        <Table
          columns={columns}
          dataSource={properties}
          bordered={true}
          pagination={{ pageSize: 5}}
          className="propertyTable"
          scroll={{ x: 1700 }}
          tableLayout="fixed"
          size="middle"
          loading={loading}
        />
      </div>

      <RentedPropertyDetails
        value={isModalOpen}
        onChange={onChangeModal}
        occupantsID={modalOccupant}
        tenant={modalTenant}
      />
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
    </Fragment>
  );
}

export default AgentRentedProperty;
