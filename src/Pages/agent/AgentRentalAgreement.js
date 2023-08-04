import React from "react";
import RentalAgreementDocument from "../../Components/RentalAgreementDocument";
import EzRentIcon from "../../images/icon.png";
import TarumtLogo from "../../images/tarumt.png";
import { Descriptions } from 'antd';

// Your custom component that you want to print to PDF
function pdfContent() {
  return (
    <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
      <div className="header" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 1rem",
        marginBottom: "1rem",
        flexDirection: "column",
      }}>
        <div className="logo" style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
          <img src={EzRentIcon} alt="logo" style={{ width: "60px", height: "60px", margin: "10px" }} />
          <img src={TarumtLogo} alt="tarumt-logo" style={{ width: "100px", height: "60px", margin: "10px" }} />
        </div>
        <hr style={{ width: "100%", border: "1px solid black" }} />
        <h1 style={{ textAlign: "center" }}>Rental Agreement</h1>

        <div className="content-container" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <div style={{ padding: "50px" }}>
            <div>
              <h2>Rental Details</h2>
              <Descriptions>
                <Descriptions.Item label="Referral Code" span={3}>KelvinEe-01-01</Descriptions.Item>
                <Descriptions.Item label="Date" span={3}>2021-01-01</Descriptions.Item>
                <Descriptions.Item label="Address" span={3}>12-34, PV12, No2A, Jalan Danau Saujana, Taman Danau Kota, 53300 Kuala Lumpur</Descriptions.Item>
                <Descriptions.Item label="Commencement Date" span={2}>01/01/2023</Descriptions.Item>
                <Descriptions.Item label="Expiry Date">01/01/2024</Descriptions.Item>
                <Descriptions.Item label="Duration" span={3}>1 Year(s) 0 Month(s)</Descriptions.Item>
                <Descriptions.Item label="Rental (/Month)">RM1098.00</Descriptions.Item>
                <Descriptions.Item label="Security Deposit">RM1098.00</Descriptions.Item>
                <Descriptions.Item label="Utilities Deposit">RM1098.00</Descriptions.Item>
              </Descriptions>
            </div>
            <div className="terms" style={{ width: "100%" }}>
              <h2>Terms and Conditions</h2>
              <ol>
                <li>Payment of rental shall be made on or before the 1st day of each month.</li>
                <li>Payment of rental shall be made by cash or cheque or bank transfer to the Landlord's bank account.</li>
                <li>Payment of rental shall be made by cash or cheque or bank transfer to the Landlord's bank account.</li>
                <li>Payment of rental shall be made by cash or cheque or bank transfer to the Landlord's bank account.</li>
                <li>Payment of rental shall be made by cash or cheque or bank transfer to the Landlord's bank account.</li>
                <li>Payment of rental shall be made by cash or cheque or bank transfer to the Landlord's bank account.</li>
                <li>Payment of rental shall be made by cash or cheque or bank transfer to the Landlord's bank account.</li>
              </ol>
            </div>

            <div className="signature" style={{ width: "100%", display: "flex", flexDirection: "row" }}>
              <div className="tenant-signature" style={{ marginRight: "470px" }}>
                <h3>
                  Signature by the tenant,
                </h3>
                <br />
                <br />
                <hr style={{ width: "20vw" }} />
                <p><b>Name: </b></p>
                <p><b>IC: </b></p>
                <p><b>Date: </b></p>
              </div>
              <div className="agent-signature" style={{ float: "right" }}>
                <h3>
                  Signature by the agent,
                </h3>
                <br />
                <br />
                <hr style={{ width: "20vw" }} />
                <p><b>Name: </b></p>
                <p><b>IC: </b></p>
                <p><b>Date: </b></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AgentRentalAgreement() {
  return (
    <div>
      <RentalAgreementDocument componentToPrint={pdfContent} />
    </div>
  );
}

export default AgentRentalAgreement;
