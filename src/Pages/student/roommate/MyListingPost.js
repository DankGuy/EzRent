import { Card, Avatar, Row, Col, Tooltip, Popconfirm, message, Popover } from "antd";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabase-client";
import { BsCurrencyDollar, BsGenderFemale, BsGenderMale, BsThreeDotsVertical } from "react-icons/bs";
import { TfiLocationPin } from "react-icons/tfi";
import { BiBuildingHouse } from "react-icons/bi";
import { TbResize, TbCategory } from "react-icons/tb";
import { MdDelete, MdOutlineDeleteOutline } from 'react-icons/md';
import { Link, useNavigate } from "react-router-dom";
import { getElapsedTime } from "../../../Components/timeUtils";
import { GrView } from "react-icons/gr";
import { FiEdit3 } from "react-icons/fi";

const { Meta } = Card;


function MyListingPost({ listing, onTrigger }) {

    console.log(listing);

    const [agentAvatar, setAgentAvatar] = useState(null);

    const [messageApi, contextHolder] = message.useMessage();

    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);


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

    const handleTrigger = () => {
        onTrigger();
    }

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

        handleTrigger();

        setIsOpen(false);

        messageApi.open({
            type: 'success',
            content: 'Delete successful. You will be redirected to previous page within 3 seconds...',
        });

        setTimeout(() => {
            navigate("/student/roommate/myListings")
        }, 3000);
    }

    const popOverStyle = {
        padding: '0px 5px 0px 2px',
        fontSize: '16px',
        cursor: 'pointer',
        margin: '5px 0px 5px 0px',
    };


    const content = (
        <div
            style={{
                width: '90px',
                padding: '0px',
            }}
        >
            <Row className="popOutBox">
                <Col span={24} style={popOverStyle}>
                    <Link to={`/student/roommate/myListings/${listing.postID}`} key="view" state={{ listing: listing, isView: true }} style={{ color: 'black', display: 'flex', alignItems: 'center' }}>
                        <span style={{ flexGrow: 1 }}>View</span>
                        <GrView size={18} />
                    </Link>
                </Col>
            </Row>
            <Row className="popOutBox">
                <Col span={24} style={popOverStyle}>
                    <Link to={`/student/roommate/myListings/${listing.postID}`} key="view" state={{ listing: listing, isView: false }} style={{ color: 'black', display: 'flex', alignItems: 'center' }}>
                        <span style={{ flexGrow: 1 }}>Edit</span>
                        <FiEdit3 size={18} />
                    </Link>
                </Col>
            </Row>
            <Row className="popOutBox">
                <Col span={24} style={popOverStyle}>
                    <Popconfirm
                        title="Are you sure to delete this post?"
                        onConfirm={() => deletePost(listing.postID)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <span style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <span style={{ flexGrow: 1 }}>Delete</span>
                            <MdOutlineDeleteOutline size={18} />
                        </span>
                    </Popconfirm>
                </Col>
            </Row>
        </div>
    );

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
                <Meta style={{ paddingTop: '1em', paddingBottom: '5px' }}
                    avatar={<Avatar src={agentAvatar} size={"large"} />}
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
                    <p style={{ marginBlockStart: '-1em', fontStyle: 'italic' }}>Last modified: {getElapsedTime(listing.lastModifiedDate)}</p>
                </>
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
                        <Col span={10} style={cardContentStyle}>
                            <BiBuildingHouse size={iconSize} />
                            Type: {listing.rental_agreement.postID.propertyType}
                        </Col>
                        <Col span={10} style={cardContentStyle}>
                            <BsCurrencyDollar size={iconSize} />
                            Price: RM{listing.rental_agreement.postID.propertyPrice}.00/month
                        </Col>
                        <Col span={2} offset={2}>
                            <Popover
                                placement="leftTop"
                                arrow={false}
                                style={{
                                    border: '1px solid blue',
                                }}
                                content={content}
                                onOpenChange={() => setIsOpen(!isOpen)}
                                open={isOpen}
                                trigger="click">
                                <span>
                                    <BsThreeDotsVertical size={18}
                                        style={{
                                            color: 'black',
                                            cursor: 'pointer',
                                        }} />
                                </span>
                            </Popover>
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
                        <Col span={10} style={cardContentStyle}>
                            <BiBuildingHouse size={iconSize} />
                            Property Type: {listing.propertyType}
                        </Col>
                        <Col span={10} style={cardContentStyle}>
                            <BsCurrencyDollar size={iconSize} />
                            Budget: RM{listing.budget}.00/month
                        </Col>
                        <Col span={2} offset={2}>
                            <Popover
                                placement="leftTop"
                                arrow={false}
                                style={{
                                    border: '1px solid blue',
                                }}
                                content={content}
                                onOpenChange={() => setIsOpen(!isOpen)}
                                open={isOpen}
                                trigger="click">
                                <span>
                                    <BsThreeDotsVertical size={18}
                                        style={{
                                            color: 'black',
                                            cursor: 'pointer',
                                        }} />
                                </span>
                            </Popover>
                        </Col>
                    </Row>
                </div>
            )
            }
        </Card>
    );
}

export default MyListingPost;