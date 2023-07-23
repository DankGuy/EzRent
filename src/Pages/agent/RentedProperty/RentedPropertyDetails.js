import { Descriptions, Tag } from "antd";
import { useLocation } from "react-router-dom";
import { convertDate } from "../../../Components/timeUtils";

function RentedPropertyDetails(){

    const location = useLocation();
    const { post } = location.state;

    console.log(post);

    const rentalDuration = () => {
        if(post.rentalDuration.year === 0){
            return `${post.rentalDuration.month} month(s)`;
        }
        else if(post.rentalDuration.month === 0){
            return `${post.rentalDuration.year} year(s)`;
        }
        else{
            return `${post.rentalDuration.year} year(s) ${post.rentalDuration.month} month(s)`;
        }
    } 

    const postStatus = () => {
        if(post.status === "active"){
            return <Tag color="green">Active</Tag>
        }
        else if(post.status === "expired"){
            return <Tag color="red">Expired</Tag>
        }
        else if(post.status === "terminated"){
            return <Tag color="orange">Terminated</Tag>
        }
    }

    

    return(
        <div>
            <h1>Rented Property Details</h1>

            <Descriptions title="Property Info" bordered>
                <Descriptions.Item label="Property Post ID">{post.postID.postID}</Descriptions.Item>
                <Descriptions.Item label="Property Name" span={2}>{post.postID.propertyName}</Descriptions.Item>
                <Descriptions.Item label="Property Address" span={3}>{post.postID.propertyAddress}</Descriptions.Item>
                <Descriptions.Item label="Property Postcode">{post.postID.propertyPostcode}</Descriptions.Item>
                <Descriptions.Item label="Property City">{post.postID.propertyCity}</Descriptions.Item>
                <Descriptions.Item label="Property State">{post.postID.propertyState}</Descriptions.Item>
                <Descriptions.Item label="Property Type">{post.postID.propertyType}</Descriptions.Item>
                <Descriptions.Item label="Property Size">{post.postID.propertySquareFeet} sq.ft.</Descriptions.Item>
                <Descriptions.Item label="Property Category">{post.postID.propertyCategory}</Descriptions.Item>
            </Descriptions>
            <br/>
            <Descriptions title="Rental Agreement Info" bordered>
                <Descriptions.Item label="Rental Agreement ID">{post.rentalAgreementID}</Descriptions.Item>
                <Descriptions.Item label="Rental Duration">
                    {rentalDuration()}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                    {postStatus()}
                </Descriptions.Item>
                <Descriptions.Item label="Rental Price">RM {post.rentalPrice}.00</Descriptions.Item>
                <Descriptions.Item label="Security Deposit">
                    {post.rentalDeposit["Security deposit"]? `RM ${post.rentalDeposit["Security deposit"]}.00` : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Utility Deposit">
                    {post.rentalDeposit["Utility deposit"]? `RM ${post.rentalDeposit["Utility deposit"]}.00` : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Commencement Date">{convertDate(post.commencementDate)}</Descriptions.Item>
                <Descriptions.Item label="Expiration Date">{convertDate(post.expirationDate)}</Descriptions.Item>
            </Descriptions>
            <br/>
            <Descriptions title="Tenant Info" bordered>
                <Descriptions.Item label="Tenant Name" span={3}>{post.studentID.name}</Descriptions.Item>
                <Descriptions.Item label="Tenant Email">{post.studentID.email}</Descriptions.Item>
                <Descriptions.Item label="Tenant Phone Number">{post.studentID.phone}</Descriptions.Item>
            </Descriptions>
            <br/>
            <Descriptions title="Agent Info" bordered>
                <Descriptions.Item label="Agent Name">{post.agentID.name}</Descriptions.Item>
                <Descriptions.Item label="Agent Company" span={2}>{post.agentID.company}</Descriptions.Item>
                <Descriptions.Item label="Agent Email">{post.agentID.email}</Descriptions.Item>
                <Descriptions.Item label="Agent Phone Number">{post.agentID.phone}</Descriptions.Item>
            </Descriptions>
    </div>
    )
}

export default RentedPropertyDetails;