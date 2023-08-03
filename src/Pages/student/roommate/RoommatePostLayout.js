import { Card, Avatar, Row, Col, Tooltip, Popconfirm, message } from "antd";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabase-client";
import { BsCurrencyDollar, BsGenderMale, BsGenderFemale } from "react-icons/bs";
import { TfiLocationPin } from "react-icons/tfi";
import { BiBuildingHouse } from "react-icons/bi";
import { TbResize, TbCategory } from "react-icons/tb";
import { MdDelete } from 'react-icons/md';
import { AiOutlineHome, AiFillEye, AiFillEdit } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { UserOutlined } from '@ant-design/icons';
import { getDateOnly, getElapsedTime } from "../../../Components/timeUtils";


const { Meta } = Card;


function RoommatePostLayout({ listing }) {

    console.log(listing);

    const [agentAvatar, setAgentAvatar] = useState(null);

    useEffect(() => {
        const getAvatar = async () => {
            const { data } = await supabase.storage
                .from("avatar")
                .getPublicUrl(`avatar-${listing.studentID}`, {
                    select: "metadata",
                    fileFilter: (metadata) => {
                        const fileType = metadata.content_type.split("/")[1];
                        return fileType === "jpg" || fileType === "png";
                    },
                })

            return data;
        };

        getAvatar().then((data) => {
            setAgentAvatar(data.publicUrl);
        });

    }, [listing]);

    const cardContentStyle = {
        fontSize: '1em',
        fontWeight: '500',
        marginBottom: '5px'
    }

    const iconSize = 15;


    return (
        <Card
            hoverable
            style={{ width: '100%', margin: '1em 0' }}
            headStyle={{
                padding: '10px 24px',
            }}
            bordered={true}
            title={
                <Meta style={{ paddingTop: '1em' }}
                    avatar={<Avatar src={agentAvatar} size={"large"} icon={<UserOutlined />} />}
                    title={
                        <>
                            {listing.student.name}
                            <span style={{ marginLeft: '1em' }}>
                                {listing.student.gender === "Male" ? <BsGenderMale size={iconSize} color="blue" /> : <BsGenderFemale size={iconSize} color="pink" />}
                            </span>

                        </>
                    }
                    description={listing.student.email}
                />
            }
            extra={
                <>
                    <p style={{marginBlockStart: '0em'}}>{getElapsedTime(listing.lastModifiedDate)}</p>
                </>
            }
           
        >

                    {listing.rentalAgreement !== null && listing.rental_agreement ? (
                        <div>
                            <Row>
                                <Col span={24} style={cardContentStyle}>
                                    <h3>Rented Property Details:</h3>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12} style={cardContentStyle}>
                                    <AiOutlineHome size={iconSize} />
                                    Name: {listing.rental_agreement.postID.propertyName}
                                </Col>
                                <Col span={12} style={cardContentStyle}>
                                    <BiBuildingHouse size={iconSize} />
                                    Type: {listing.rental_agreement.postID.propertyType}
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12} style={cardContentStyle}>
                                    <TfiLocationPin size={iconSize} />
                                    Address: {listing.rental_agreement.postID.propertyAddress}
                                </Col>
                                <Col span={12} style={cardContentStyle}>
                                    <BsCurrencyDollar size={iconSize} />
                                    Price: RM{listing.rental_agreement.postID.propertyPrice}.00/month
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12} style={cardContentStyle}>
                                    <TbResize size={iconSize} />
                                    Size: {listing.rental_agreement.postID.propertySquareFeet} sq.ft.
                                </Col>
                                <Col span={12} style={cardContentStyle}>
                                    <TbCategory size={iconSize} />
                                    Category: {listing.rental_agreement.postID.propertyCategory}
                                </Col>
                            </Row>

                        </div>
                    ) : (
                        <div>
                            <Row>
                                <Col span={24} style={cardContentStyle}>
                                    <h3>Preferred Property Details:</h3>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24} style={cardContentStyle}>
                                    <TfiLocationPin size={iconSize} />
                                    Location: {listing.location}
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12} style={cardContentStyle}>
                                    <BiBuildingHouse size={iconSize} />
                                    Property Type: {listing.propertyType}
                                </Col>
                                <Col span={12} style={cardContentStyle}>
                                    <BsCurrencyDollar size={iconSize} />
                                    Budget: RM{listing.budget}.00/month
                                </Col>
                            </Row>
                        </div>
                    )
                    }
                </Card>
            );
}

            export default RoommatePostLayout;