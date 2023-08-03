import { Card, Avatar, Row, Col, Tooltip, Popconfirm, message } from "antd";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabase-client";
import { BsCurrencyDollar } from "react-icons/bs";
import { TfiLocationPin } from "react-icons/tfi";
import { BiBuildingHouse } from "react-icons/bi";
import { TbResize, TbCategory } from "react-icons/tb";
import { MdDelete } from 'react-icons/md';
import { AiOutlineHome, AiFillEye, AiFillEdit } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";

const { Meta } = Card;


function MyListingPost({ listing }) {

    console.log(listing);

    const [agentAvatar, setAgentAvatar] = useState(null);

    const [messageApi, contextHolder] = message.useMessage();

    const navigate = useNavigate();

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

    }, []);

    const cardContentStyle = {
        fontSize: '1em',
        fontWeight: '500',
        marginBottom: '5px'
    }

    const iconSize = 15;

    const deletePost = async (postID) => {
        console.log(postID);

        const { data, error } = await supabase
            .from('roommate_post')
            .delete()
            .eq('postID', postID);

        if (error) {
            console.log(error);
            return;
        }

        messageApi.open({
            type: 'success',
            content: 'Delete successful. You will be redirected to previous page within 3 seconds...',
        });

        setTimeout(() => {
            navigate("/student/roommate/listings")
        }, 3000);
    }

    return (
        <Card
            hoverable
            style={{ width: '40%', margin: '1em 0' }}
            bordered={true}
            title={
                <Meta style={{ paddingTop: '1em' }}
                    avatar={<Avatar src={agentAvatar} size={"large"} />}
                    title={listing.student.name}
                    description={listing.student.email}
                />
            }
            headStyle={{
                padding: '10px 24px',
            }}

            actions={[
                <Link to={`/student/roommate/listings/${listing.postID}`} key="view" state={{ listing: listing, isView: true }}>
                    <Tooltip title="View">
                        <AiFillEye size={20} />
                    </Tooltip>
                </Link>,
                <Link to={`/student/roommate/listings/${listing.postID}`} key="edit" state={{ listing: listing, isView: false }}>
                    <Tooltip title="Edit">
                        <AiFillEdit size={20} />
                    </Tooltip>
                </Link>,
                <Popconfirm
                    title="Are you sure to delete this post?"
                    onConfirm={() => deletePost(listing.postID)}
                    okText="Yes"
                    cancelText="No"
                >
                    {contextHolder}
                    <span key="delete">
                        <Tooltip title="Delete">
                            <MdDelete size={20} />
                        </Tooltip>
                    </span>
                </Popconfirm>
            ]}

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

export default MyListingPost;