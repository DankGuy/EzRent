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
            style={{
                width: '100%',
                boxSizing: 'border-box',
                boxShadow: '0 -1px 1px 0 rgba(0, 28, 36, .3), 0 1px 1px 0 rgba(0, 28, 36, .3), 1px 1px 1px 0 rgba(0, 28, 36, .15), -1px 1px 1px 0 rgba(0, 28, 36, .15)',
                margin: '1em 0',
                borderRadius: '0px',

            }}
            bordered={true}
            title={
                <Meta style={{ paddingTop: '1em' }}
                    avatar={<Avatar src={agentAvatar} size={"large"} icon={<UserOutlined />} />}
                    title={
                        <>
                            {listing.student.name}
                            <span style={{ marginLeft: '1em' }}>
                                {listing.student.gender === "Male" ? <BsGenderMale size={iconSize} color="blue" /> : <BsGenderFemale size={iconSize} color="#E75480" />}
                            </span>

                        </>
                    }
                    description={listing.student.email}
                />
            }
            headStyle={{
                padding: '5px 24px',
            }}
            bodyStyle={{
                padding: '0px 24px 24px 24px',
            }}
            extra={
                <>
                    <p style={{ marginBlockStart: '-1em', fontStyle: 'italic', textAlign: 'right' }}>Last modified: {getElapsedTime(listing.lastModifiedDate)}</p>
                </>
            }
            onClick={() => {
                console.log(listing);
            }
            }

        >

            {listing.rentalAgreement !== null && listing.rental_agreement ? (
                <div>
                    <Row>
                        <Col span={24} style={cardContentStyle}>
                            <h3 style={{ marginBlockEnd: '0em' }}>Rented Property Details:</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} style={cardContentStyle}>
                            <TfiLocationPin size={iconSize} />
                            Location: {listing.rental_agreement.postID.propertyAddress}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} style={cardContentStyle}>
                            <BiBuildingHouse size={iconSize} />
                            Type: {listing.rental_agreement.postID.propertyType}
                        </Col>
                        <Col span={12} style={cardContentStyle}>
                            <BsCurrencyDollar size={iconSize} />
                            Price: RM{listing.rental_agreement.postID.propertyPrice}.00/month
                        </Col>
                    </Row>
                </div>
            ) : (
                <div>
                    <Row>
                        <Col span={24} style={cardContentStyle}>
                            <h3 style={{ marginBlockEnd: '0em' }}>Preferred Property Details:</h3>
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