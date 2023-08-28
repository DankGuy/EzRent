import React, { useEffect, useState } from "react";
import {
  Badge,
  Row,
  Col,
  Spin,
  Card,
  Descriptions,
  Typography,
  Tooltip,
  Empty,
  Button,
  Modal,
  Rate,
  Avatar,
  message,
} from "antd";
import {
  DollarOutlined,
  EyeOutlined,
  StarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { supabase } from "../../../supabase-client";
import DescriptionsItem from "antd/es/descriptions/Item";
import "./rentalAgreement.css";
import EzRentIcon from "../../../images/icon.png";
import TarumtLogo from "../../../images/tarumt.png";
import html2pdf from "html2pdf.js";

function RentalAgreement() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [agentAvatar, setAgentAvatar] = useState(null);
  const [ratingAgreementInfo, setRatingAgreementInfo] = useState(null);

  const { Meta } = Card;
  const { Text } = Typography;
  const ratingDesc = ["terrible", "bad", "normal", "good", "wonderful"];

  const getAvatar = async (id) => {
    const userID = id;
    const timestamp = new Date().getTime(); // Generate a timestamp to serve as the cache-busting query parameter
    const { data } = supabase.storage
      .from("avatar")
      .getPublicUrl(`avatar-${userID}`, {
        select: "metadata",
        fileFilter: (metadata) => {
          const fileType = metadata.content_type.split("/")[1];
          return fileType === "jpg" || fileType === "png";
        },
      });

    const avatarUrlWithCacheBuster = `${data.publicUrl}?timestamp=${timestamp}`; // Append the cache-busting query parameter

    return avatarUrlWithCacheBuster;
  };

  const fetchListings = async () => {
    setLoading(true);
    const userID = (await supabase.auth.getUser()).data.user.id;

    const { data, error } = await supabase
      .from("rental_agreement")
      .select("*, postID(*), agentID(*)")
      .eq("studentID", userID);

    if (error) {
      console.log(error);
      return;
    }
    const sortedListings = sortListings(data);
    const listingsWithModalVisibility = sortedListings.map((listing) => ({
      ...listing,
      isModalVisible: false,
    }));

    setListings(listingsWithModalVisibility);
    setLoading(false);
  };

  const sortListings = (listings) => {
    const statusPriority = {
      active: 2,
      pending: 1,
      inactive: 3,
    };

    return listings.sort((a, b) => {
      const statusComparison =
        statusPriority[a.status] - statusPriority[b.status];

      if (statusComparison === 0) {
        // If statuses are equal, use localeCompare for sorting by ID
        return a.rentalAgreementID.localeCompare(b.rentalAgreementID);
      }

      return statusComparison;
    });
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
                      {rentalAgreementInfo.rentalAgreementID}
                    </Descriptions.Item>
                    <Descriptions.Item label="Date" span={3}>
                      {new Date().toJSON().slice(0, 10)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Address" span={3}>
                      {rentalAgreementInfo.postID.propertyName +
                        ", " +
                        rentalAgreementInfo.postID.propertyAddress +
                        ", " +
                        rentalAgreementInfo.postID.propertyCity +
                        " " +
                        rentalAgreementInfo.postID.propertyPostcode}
                    </Descriptions.Item>
                    <Descriptions.Item label="Commencement Date" span={2}>
                      {rentalAgreementInfo.commencementDate}
                    </Descriptions.Item>
                    <Descriptions.Item label="Expiration Date">
                      {rentalAgreementInfo.expirationDate}
                    </Descriptions.Item>
                    <Descriptions.Item label="Duration" span={3}>
                      {rentalAgreementInfo.rentalDuration.year +
                        " Year(s) " +
                        rentalAgreementInfo.rentalDuration.month +
                        " Month(s)"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Rental (/Month)">
                      {"RM" + rentalAgreementInfo.rentalPrice?.toFixed(2)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Security Deposit">
                      {"RM" +
                        rentalAgreementInfo.rentalDeposit.SecurityDeposit?.toFixed(
                          2
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Utilities Deposit">
                      {"RM" +
                        rentalAgreementInfo.rentalDeposit.UtilityDeposit?.toFixed(
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
                    Payment of rental shall be made on or before the 1st day of
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

  const handlePaymentOk = () => {
    console.log("Payment Successful");
    setIsPaymentModalVisible(false);
  };
  const handlePaymentCancel = () => {
    console.log("Payment Cancelled");
    setIsPaymentModalVisible(false);
  };

  const handleRatingOk = async (
    ratingValue,
    agentID,
    studentID,
    rentalAgreementID
  ) => {
    let ratingExist = false;
    if (ratingValue === 0) {
      message.error("Please rate the agent");
      return;
    }
    let { data: ratingExists, error: ratingExistsError } = await supabase
      .from("rating")
      .select("*")
      .eq("agent_id", agentID)
      .eq("student_id", studentID)
      .eq("rental_agreement_id", rentalAgreementID);
    if (ratingExistsError) {
      console.log(ratingExistsError);
      return;
    }
    ratingExists.length > 0 ? (ratingExist = true) : (ratingExist = false);
    if (!ratingExist) {
      let { data: rating, error } = await supabase.from("rating").insert([
        {
          rating: ratingValue,
          agent_id: agentID,
          student_id: studentID,
          rental_agreement_id: rentalAgreementID,
        },
      ]);
      if (error) {
        console.log(error);
        return;
      }
    } else {
      let { data: rating, error } = await supabase
        .from("rating")
        .update({ rating: ratingValue })
        .eq("agent_id", agentID)
        .eq("student_id", studentID)
        .eq("rental_agreement_id", rentalAgreementID);
      if (error) {
        console.log(error);
        return;
      }
    }
    message.success("Rating Successful");
    setRatingValue(0);
    setIsRatingModalVisible(false);
  };

  const handleRatingCancel = () => {
    console.log("Rating Cancelled");
    setRatingValue(0);
    setIsRatingModalVisible(false);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
            width: "100%",
          }}
        >
          <Spin size="large"></Spin>
        </div>
      ) : listings.length === 0 ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
            width: "100%",
          }}
        >
          <Empty
            description={
              <Text>
                You have not rented any properties yet. <br />
                <a href="/student/">Click here to find a property.</a>
              </Text>
            }
          />
        </div>
      ) : (
        <div>
          <Row gutter={[16, 16]}>
            {/* Add gutter for spacing between columns and rows */}
            {listings.map((listing) => (
              <>
                <Col key={listing.rentalAgreementID} xs={24} sm={12}>
                  <Card
                    bordered
                    title={listing.rentalAgreementID}
                    size="small"
                    extra={
                      <Badge
                        status={
                          listing.status === "pending"
                            ? "warning"
                            : listing.status === "active"
                            ? "success"
                            : "error"
                        }
                        text={
                          <span style={{ textTransform: "capitalize" }}>
                            {listing.status}
                          </span>
                        }
                        className="rentalAgreementBadge"
                      />
                    }
                    headStyle={{
                      backgroundColor: "#D5DEF5",
                      padding: "0.5em 1em",
                    }}
                    bodyStyle={{
                      backgroundColor: "#F0F5FF",
                      padding: "1em",
                    }}
                    actions={[
                      <Button
                        type="link"
                        onClick={() => setIsPaymentModalVisible(true)}
                        style={{
                          color: "#1890FF",
                          width: "100%",
                          height: "100%",
                        }}
                        disabled={listing.status !== "pending"}
                      >
                        <span style={{ marginRight: "5px" }}>
                          <DollarOutlined />
                        </span>
                        Pay Rental
                      </Button>,
                      <Button
                        type="link"
                        style={{
                          color: "#1890FF",
                          width: "100%",
                          height: "100%",
                        }}
                        onClick={() => {
                          const updatedListings = listings.map((l) =>
                            l.rentalAgreementID === listing.rentalAgreementID
                              ? { ...l, isModalVisible: true }
                              : l
                          );
                          setListings(updatedListings);
                        }}
                      >
                        <span style={{ marginRight: "5px" }}>
                          <EyeOutlined />
                        </span>
                        View Agreement
                      </Button>,
                      <Button
                        type="link"
                        style={{
                          color: "#1890FF",
                          width: "100%",
                          height: "100%",
                        }}
                        onClick={() => {
                          setIsRatingModalVisible(true);
                          getAvatar(listing.agentID.agent_id).then((url) =>
                            setAgentAvatar(url)
                          );
                          setRatingAgreementInfo({
                            agentID: listing.agentID.agent_id,
                            studentID: listing.studentID,
                            rentalAgreementID: listing.rentalAgreementID,
                          });
                        }}
                        disabled={listing.status === "inactive"}
                      >
                        <span style={{ marginRight: "5px" }}>
                          <StarOutlined />
                        </span>
                        Rate Agent
                      </Button>,
                    ]}
                  >
                    <Meta
                      description={
                        <div>
                          <Descriptions>
                            <DescriptionsItem label="Property Name" span={3}>
                              {listing.postID.propertyName}
                            </DescriptionsItem>
                            <DescriptionsItem
                              label="Property Address"
                              span={3}
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                              className="ellipsis-description"
                            >
                              <Tooltip
                                title={
                                  listing.postID.propertyAddress +
                                  ", " +
                                  listing.postID.propertyState
                                }
                              >
                                {listing.postID.propertyAddress +
                                  ", " +
                                  listing.postID.propertyState}
                              </Tooltip>
                            </DescriptionsItem>
                            <DescriptionsItem
                              label="Commencement Date"
                              span={3}
                            >
                              {listing.commencementDate}
                            </DescriptionsItem>
                            <DescriptionsItem label="Expiration Date" span={3}>
                              {listing.expirationDate}
                            </DescriptionsItem>
                            <DescriptionsItem
                              label="Rental Price (RM)"
                              span={3}
                            >
                              {listing.rentalPrice.toFixed(2)}
                            </DescriptionsItem>
                          </Descriptions>
                        </div>
                      }
                    />
                  </Card>
                </Col>

                {/* Modal for displaying rental agreement details */}
                <Modal
                  title="Rental Agreement Details"
                  open={listing.isModalVisible}
                  onOk={() => {
                    //download pdf
                    const modalContent =
                      document.getElementById("modal-content");
                    // Create the PDF using html2pdf.js
                    const opt = {
                      margin: 10,
                      filename: listing.rentalAgreementID + ".pdf",
                      image: { type: "jpeg", quality: 0.98 },
                      html2canvas: { scale: 2 },
                      jsPDF: {
                        unit: "mm",
                        format: "a4",
                        orientation: "portrait",
                      },
                    };

                    html2pdf().from(modalContent).set(opt).save();
                    // Update the isModalVisible property for this listing
                    const updatedListings = listings.map((l) =>
                      l.rentalAgreementID === listing.rentalAgreementID
                        ? { ...l, isModalVisible: false }
                        : l
                    );
                    setListings(updatedListings);
                  }}
                  onCancel={() => {
                    // Update the isModalVisible property for this listing
                    const updatedListings = listings.map((l) =>
                      l.rentalAgreementID === listing.rentalAgreementID
                        ? { ...l, isModalVisible: false }
                        : l
                    );
                    setListings(updatedListings);
                  }}
                  okText="Download PDF"
                  cancelText="Cancel"
                  width="80vw"
                  style={{ height: "auto" }}
                  mask={true}
                >
                  <div id="modal-content">
                    {/* Display the rental agreement details in the modal */}
                    {listing && pdfContent(listing)}
                  </div>
                </Modal>

                {/* Modal for displaying payment details */}
                <Modal
                  title="Rental Payment"
                  open={isPaymentModalVisible}
                  onOk={handlePaymentOk}
                  onCancel={handlePaymentCancel}
                  okText="Pay"
                  cancelText="Cancel"
                  width="80vw"
                  style={{ height: "auto" }}
                  maskStyle={{ opacity: 0.45 }}
                >
                  <></>
                </Modal>

                {/* Modal for displaying rating details */}
                <Modal
                  title="Rate Agent"
                  open={isRatingModalVisible}
                  onOk={() =>
                    handleRatingOk(
                      ratingValue,
                      ratingAgreementInfo.agentID,
                      ratingAgreementInfo.studentID,
                      ratingAgreementInfo.rentalAgreementID
                    )
                  }
                  onCancel={handleRatingCancel}
                  okText="Rate"
                  cancelText="Cancel"
                  width="40vw"
                  style={{ height: "auto" }}
                  maskStyle={{ opacity: 0.45 }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Avatar
                      size={85}
                      icon={<UserOutlined />}
                      src={agentAvatar}
                    />
                    <Text style={{ fontSize: "1.2rem", margin: "10px" }}>
                      <b>{listing.agentID.name}</b>
                    </Text>
                    <Text style={{ fontSize: "1rem", margin: "10px" }}>
                      How was your experience with the agent?
                    </Text>

                    <span>
                      <Rate
                        tooltips={ratingDesc}
                        value={ratingValue}
                        onChange={(value) => setRatingValue(value)}
                        style={{ fontSize: "2rem" }}
                      />
                      {ratingValue ? (
                        <span
                          className="ant-rate-text"
                          style={{ textTransform: "capitalize" }}
                        >
                          {ratingDesc[ratingValue - 1]}
                        </span>
                      ) : (
                        ""
                      )}
                    </span>
                  </div>
                </Modal>
              </>
            ))}
          </Row>
        </div>
      )}
    </>
  );
}

export default RentalAgreement;
