import React, { useState, useEffect } from "react";
import EzRentIcon from "../../images/icon.png";
import TarumtLogo from "../../images/tarumt.png";
import { Descriptions, Input, Form, DatePicker, InputNumber, Divider, AutoComplete, Avatar, List, Button, message, Modal } from 'antd';
import { AudioOutlined } from '@ant-design/icons';
import { useLocation } from "react-router-dom";
import { supabase } from "../../supabase-client";
import moment from 'moment';
import html2pdf from 'html2pdf.js';


function AgentRentalAgreement() {
  const location = useLocation();
  const { post } = location.state;
  const [form] = Form.useForm();

  const [postInfo, setPostInfo] = useState(null);
  const [agentName, setAgentName] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [tenant, setTenant] = useState([]);
  const [options, setOptions] = useState([]);
  const [tenantAvatar, setTenantAvatar] = useState(null);
  const [rentalAgreementInfo, setRentalAgreementInfo] = useState(null);
  const [trimmedAgentName, setTrimmedAgentName] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);

  function pdfContent(rentalAgreementInfo) {
    return (
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
        <div className="header" style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 1rem",
          marginBottom: "1rem",
          flexDirection: "column",
        }}>
          <div className="logo" style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <img src={EzRentIcon} alt="logo" style={{ height: "150px", margin: "10px" }} />
            <img src={TarumtLogo} alt="tarumt-logo" style={{ margin: "10px" }} />
          </div>
          <hr style={{ width: "100%", border: "1px solid black" }} />
          <h1 style={{ textAlign: "center", fontSize: "1rem" }}>Rental Agreement</h1>

          <div className="content-container" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", maxWidth: "80%" }}>
            <div style={{ padding: "10px" }}>
              <div>
                <h2 style={{ fontSize: "1rem", marginLeft: "30px"}}>Rental Details</h2>
                <div style={{ margin: "30px" }}>
                <Descriptions size="small">
                  <Descriptions.Item label="Referral Code" span={3}>{rentalAgreementInfo.rentalAgreementID}</Descriptions.Item>
                  <Descriptions.Item label="Date" span={3}>{new Date().toJSON().slice(0, 10)}</Descriptions.Item>
                  <Descriptions.Item label="Address" span={3}>{postInfo.propertyName + ", " + postInfo.propertyAddress + ", " + postInfo.propertyCity + " " + postInfo.propertyPostcode}</Descriptions.Item>
                  <Descriptions.Item label="Commencement Date" span={2}>{rentalAgreementInfo.commencementDate}</Descriptions.Item>
                  <Descriptions.Item label="Expiration Date">{rentalAgreementInfo.expirationDate}</Descriptions.Item>
                  <Descriptions.Item label="Duration" span={3}>{rentalAgreementInfo.rentalDuration.year + " Year(s) " + rentalAgreementInfo.rentalDuration.month + " Month(s)"}</Descriptions.Item>
                  <Descriptions.Item label="Rental (/Month)">{"RM" + (rentalAgreementInfo.rentalPrice).toFixed(2)}</Descriptions.Item>
                  <Descriptions.Item label="Security Deposit">{"RM" + (rentalAgreementInfo.rentalDeposit.SecurityDeposit).toFixed(2)}</Descriptions.Item>
                  <Descriptions.Item label="Utilities Deposit">{"RM" + (rentalAgreementInfo.rentalDeposit.UtilityDeposit).toFixed(2)}</Descriptions.Item>
                </Descriptions>

                </div>
              </div>
              <div className="terms" style={{ width: "90%", marginLeft: "30px" }}>
                <h2 style={{ fontSize: "1rem" }}>Terms and Conditions</h2>
                <ol>
                  <li>Payment of rental shall be made on or before the 1st day of each month.</li>
                  <li>A security deposit has been collected. This deposit is intended to cover any damages beyond normal wear and tear. The deposit will be refunded within 7 days of the lease termination, less any deductions for damages or outstanding charges.</li>
                  <li>The tenant is responsible for maintaining the property in a clean and orderly condition. Regular cleaning, minor repairs, and yard maintenance are expected.</li>
                  <li>Any alterations or modifications to the property must receive written approval from the landlord. The tenant is responsible for promptly reporting any necessary repairs, and the landlord will address them in a timely manner.</li>
                  <li>Quiet hours are observed from 12am to 6am. Excessive noise that disturbs neighbors is prohibited at all times.</li>
                  <li>Smoking is strictly prohibited inside the rental unit. Any activities that result in strong or lingering odors are also prohibited.</li>
                  <li>Either party must provide written notice to terminate the lease. Renewal terms will be discussed prior to the lease expiration.</li>
                </ol>
              </div>

              <div className="signature" style={{ width: "100%", display: "flex", flexDirection: "row", marginLeft: "30px" }}>
                <div className="tenant-signature" style={{ marginRight: "300px", fontSize: "0.8rem" }}>
                  <h3>
                    Signature by the tenant,
                  </h3>
                  <br />
                  <hr style={{ width: "10vw" }} />
                  <p><b>Name: </b></p>
                  <p><b>IC: </b></p>
                  <p><b>Date: </b></p>
                </div>
                <div className="agent-signature" style={{ float: "right", fontSize: "0.8rem" }}>
                  <h3>
                    Signature by the agent,
                  </h3>
                  <br />
                  <hr style={{ width: "10vw" }} />
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getAvatar = async (tenantID) => {
    const userID = tenantID;
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

  useEffect(() => {
    if (tenant.length > 0) {
      let avatar = getAvatar(tenant[0].student_id);
      avatar.then((url) => {
        setTenantAvatar(url);
      });
    }
  }, [tenant]);

  const { Search } = Input;
  const suffix = (
    <AudioOutlined
      style={{
        fontSize: 16,
        color: '#1677ff',
      }}
    />
  );

  const onSearch = async (value) => {
    let { data: users, error } = await supabase
      .from('student')
      .select('*')
      .ilike('name', `%${value}%`) // Use ilike for case-insensitive searching
      .limit(10); // Limit the number of results

    if (error) {
      console.log(error)
    }

    if (users?.length > 0) {
      const userOptions = users.map(user => ({
        value: user.email,
        label: `${user.name} (${user.email})`,
        data: user
      }));
      setOptions(userOptions);
    }
  };

  const handleDurationChange = (value, field) => {
    const startDate = form.getFieldValue('date-picker');
    const years = field === 'duration' ? value : form.getFieldValue('duration');
    const months = field === 'durationMonths' ? value : form.getFieldValue('durationMonths');

    const calculatedEndDate = moment(startDate)
      .add(years, 'years')
      .add(months, 'months');

    setEndDate(calculatedEndDate);
    form.setFieldsValue({
      'end-date-picker': calculatedEndDate,
    });
  };

  const updateEndDate = () => {
    const startDate = form.getFieldValue('date-picker');
    const years = form.getFieldValue('duration') || 0;
    const months = form.getFieldValue('durationMonths') || 0;

    if (startDate) {
      const calculatedEndDate = moment(startDate)
        .add(years, 'years')
        .add(months, 'months');

      // Calculate the maximum possible day in the end month
      const maxDayInEndMonth = calculatedEndDate.clone().endOf('month').date();

      // Check if the start day is greater than the maximum possible day in the end month
      if (startDate.date() > maxDayInEndMonth) {
        // If yes, set the end date to the maximum possible day in the end month
        calculatedEndDate.date(maxDayInEndMonth);
      } else {
        // If no, keep the same day as the start day
        calculatedEndDate.date(startDate.date());
      }

      setEndDate(calculatedEndDate);
      form.setFieldsValue({
        'end-date-picker': calculatedEndDate,
      });
    }
  };

  const disabledDate = current => {
    return current && current < moment().startOf('day');
  };

  const config = {
    rules: [
      {
        type: 'object',
        required: true,
        message: 'Please select date!',
      },
    ],
  };
  const durationConfig = {
    rules: [
      {
        type: 'number',
        required: true,
        message: 'Please input year!',
      },
      {
        validator: (_, value) => {
          if (value <= 0 && value !== null) {
            return Promise.reject(new Error('Please input at least 1 year!'));
          }
          return Promise.resolve();
        },
      }
    ],
  };
  const tenantConfig = {
    rules: [
      {
        type: 'object',
        required: true,
        message: 'Please select tenant!',
      }
    ],
  };

  const onFinish = async (fieldsValue) => {
    let count;
    let exist;
    let { data: rentalAgreement, error } = await supabase
      .from('rental_agreement')
      .select('*')
      .eq('agentID', postInfo.propertyAgentID)

    if (error) {
      console.log(error)
    }
    else {
      count = rentalAgreement.length;
    }

    let { data: rental, error: rentalError } = await supabase
      .from('rental_agreement')
      .select('*')
      .eq('postID', postInfo.postID)

    if (rentalError) {
      console.log(rentalError)
    }
    else {
      if (rental.length > 0) {
        exist = true;
      }
      else {
        exist = false;
      }
    }

    const values = {
      'rentalAgreementID': trimmedAgentName + "-" + fieldsValue['date-picker'].format('DD-MMMM-YYYY') + "-" + (count + 1),
      'postID': postInfo.postID,
      'agentID': postInfo.propertyAgentID,
      'rentalPrice': postInfo.propertyPrice,
      'commencementDate': fieldsValue['date-picker'].format('YYYY-MM-DD'),
      'rentalDuration': {
        "year": fieldsValue['durationYears'],
        "month": fieldsValue['durationMonths'],
      },
      'studentID': tenant[0].student_id,
      'rentalDeposit': {
        "UtilityDeposit": Number(postInfo.propertyPrice * 2.5),
        "SecurityDeposit": Number(postInfo.propertyPrice * 0.1),
      },
      'status': "pending",
      'expirationDate': fieldsValue['end-date-picker'].format('YYYY-MM-DD'),
    };
    setRentalAgreementInfo(values);
    setIsModalVisible(true);

    if (!exist) {
      let { data: addRental, error: addRentalError } = await supabase
        .from('rental_agreement')
        .insert([
          {
            rentalAgreementID: values['rentalAgreementID'],
            postID: values['postID'],
            agentID: values['agentID'],
            rentalPrice: values['rentalPrice'],
            commencementDate: values['commencementDate'],
            rentalDuration: values['rentalDuration'],
            studentID: values['studentID'],
            rentalDeposit: values['rentalDeposit'],
            status: values['status'],
            expirationDate: values['expirationDate'],
          }])

      if (addRentalError) {
        console.log(addRentalError);
      } else {
        pdfContent(values);

        let { data: post, error: postError } = await supabase
          .from('property_post')
          .update({ propertyStatus: {
            stage: "rented",
            status: "inactive",
          } })
          .eq('postID', postInfo.postID)

        if (postError) {
          console.log(postError);
        }
        else {
          message.success("Rental Agreement generated successfully!");
        }
      }
    }
    else {
      message.error("Rental Agreement already exist!");
    }
  };

  const getAgentDetails = async () => {
    try {
      let { data: agent, error } = await supabase
        .from('agent')
        .select('name')
        .eq('agent_id', postInfo.propertyAgentID)

      setAgentName(agent[0].name);
      setTrimmedAgentName(agent[0].name.replace(/\s/g, ''));
    }
    catch (error) {
    }
  }

  useEffect(() => {
    setPostInfo(post);
  }, [post]);

  useEffect(() => {
    getAgentDetails();
  }, [postInfo]);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div className="propertyDetails" style={{ margin: "10px", padding: "5px" }}>
          <Descriptions bordered title="Property Details" size="medium">
            <Descriptions.Item label="Property Name" span={3}>{postInfo?.propertyName}</Descriptions.Item>
            <Descriptions.Item label="Address" span={3}>{postInfo?.propertyAddress + ", " + postInfo?.propertyCity + " " + postInfo?.propertyPostcode}</Descriptions.Item>
            <Descriptions.Item label="Furnish Type" span={3}>{postInfo?.propertyFurnishType}</Descriptions.Item>
            <Descriptions.Item label="Property Category" span={3}>{postInfo?.propertyCategory}</Descriptions.Item>
            <Descriptions.Item label="Rental Price" span={3}>{postInfo?.propertyPrice.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="Utility Deposit (RM)" span={3}>{(postInfo?.propertyPrice * 2.5).toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="Security Deposit (RM)" span={3}>{(postInfo?.propertyPrice * 0.1).toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="Property Type" span={3}>{postInfo?.propertyType}</Descriptions.Item>
            <Descriptions.Item label="Agent" span={3}>{agentName}</Descriptions.Item>

          </Descriptions>
        </div>

        <Divider />

        <div className="tenancyDetails" style={{ margin: "10px", padding: "5px" }}>
          <Form onFinish={onFinish} form={form} initialValues={
            {
              'durationMonths': 0,
            }
          }>
            <Descriptions bordered title="Tenancy Details" size="medium">
              <Descriptions.Item label="Tenant" span={3}>
                <Form.Item name="tenant" {...tenantConfig}>
                  <AutoComplete
                    style={{ width: "22vw" }}
                    options={options}
                    onSearch={onSearch}
                    onSelect={(value, option) => {
                      const selectedUser = option.data;
                      setTenant([selectedUser]);
                      form.setFieldsValue({ tenant: selectedUser });
                    }}
                  >
                    <Search placeholder="Search tenant" enterButton style={{ width: "100%" }} />
                  </AutoComplete>
                </Form.Item>
                <List dataSource={tenant} itemLayout="horizontal"
                  renderItem={item => (
                    <List.Item actions={[<a onClick={() => {
                      setTenant([]);
                      setTenantAvatar(null);
                    }}>Remove</a>]}>
                      <List.Item.Meta
                        avatar={<Avatar src={tenantAvatar} />}
                        title={item.name}
                        description={item.email}
                      />
                    </List.Item>
                  )}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Tenancy Start Date" span={3}>
                <Form.Item name="date-picker" {...config}>
                  <DatePicker format="YYYY-MM-DD" style={{ width: "40%" }} allowClear disabledDate={disabledDate} onChange={updateEndDate} />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Duration" span={3}>
                <Form.Item name="durationYears" {...durationConfig} style={{ display: 'inline-block' }}>
                  <InputNumber style={{ width: '90%' }} onChange={value => handleDurationChange(value, 'duration')} placeholder="Year" />
                </Form.Item>
                <span>Years</span>

                <Form.Item name="durationMonths" style={{ display: 'inline-block', marginLeft: 16 }}>
                  <InputNumber style={{ width: '90%' }} onChange={value => handleDurationChange(value, 'durationMonths')} min={0} max={11} placeholder="Month" />
                </Form.Item>
                <span>Months</span>

              </Descriptions.Item>

              <Descriptions.Item label="Tenancy End Date" span={3}>
                <Form.Item name="end-date-picker" {...config}>
                  <DatePicker format="YYYY-MM-DD" style={{ width: "40%" }} allowClear disabled value={endDate ? moment(endDate) : null} placeholder="End Date" />
                </Form.Item>
              </Descriptions.Item>
            </Descriptions>
            <div style={{ marginTop: "10px", width: "auto" }}>
              <Form.Item style={{ width: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
                <Button type="primary" htmlType="submit" style={{ fontSize: "1rem", height: "auto", marginRight: "10px", width: "100%" }}>Generate Rental Agreement</Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div >
      <Modal
        title="Rental Agreement Details"
        open={isModalVisible}
        onOk={() => {
          //download pdf
          const modalContent = document.getElementById('modal-content');
          // Create the PDF using html2pdf.js
          const opt = {
            margin: 10,
            filename: rentalAgreementInfo.rentalAgreementID + '.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          };

          html2pdf().from(modalContent).set(opt).save();
          // setIsModalVisible(false);
        }}
        onCancel={() => setIsModalVisible(false)}
        okText="Download PDF"
        cancelText="Cancel"
        width="80vw"
        style={{ height: "auto" }}
      >
        <div id="modal-content">
          {/* Display the rental agreement details in the modal */}
          {rentalAgreementInfo && pdfContent(rentalAgreementInfo)}
        </div>
      </Modal>
    </>
  );
}

export default AgentRentalAgreement;
