import { Card, Avatar, Row, Col } from "antd";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabase-client";
import { BsCurrencyDollar } from "react-icons/bs";
import { TfiLocationPin } from "react-icons/tfi";
import { BiBuildingHouse } from "react-icons/bi";

const { Meta } = Card;


function MyListingPost({ listing }) {

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

    }, []);

    const cardContentStyle = {
        fontSize: '1em',
        fontWeight: '500',
        marginBottom: '5px'
    }

    const iconSize = 15;

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
                <a href={`/student/roommate/my-listings/${listing.id}`}>View</a>,
                <a href={`/student/roommate/my-listings/${listing.id}/edit`}>Edit</a>,
                <a href={`/student/roommate/my-listings/${listing.id}/delete`}>Delete</a>,
            ]}

        >

            {listing.rentalAgreement !== null && listing.rental_agreement ? (
                <div>
                    <Row>
                        <Col span={12} style={cardContentStyle}>
                            Property Name: {listing.rental_agreement.postID.propertyName}
                        </Col>
                        <Col span={12} style={cardContentStyle}>
                            Property Type: {listing.rental_agreement.postID.propertyType}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} style={cardContentStyle}>
                            Property Address: {listing.rental_agreement.postID.propertyAddress}
                        </Col>
                        <Col span={12} style={cardContentStyle}>
                            Property Price: RM{listing.rental_agreement.postID.propertyPrice}.00/month
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} style={cardContentStyle}>
                            Property Size: {listing.rental_agreement.postID.propertySquareFeet} sqft
                        </Col>
                        <Col span={12} style={cardContentStyle}>
                            Property Category: {listing.rental_agreement.postID.propertyCategory}
                        </Col>
                    </Row>

                </div>
            ) : (
                <div>
                    <Row>
                        <Col span={24} style={cardContentStyle}>
                            <TfiLocationPin size={iconSize} />
                            Preferred Location: {listing.location}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} style={cardContentStyle}>
                            <BiBuildingHouse size={iconSize} />
                            Preferred Property Type: {listing.propertyType}
                        </Col>
                        <Col span={12} style={cardContentStyle}>
                            <BsCurrencyDollar size={iconSize} />
                            Preferred Budget: RM{listing.budget}.00/month
                        </Col>
                    </Row>
                </div>
            )
            }
        </Card>
    );
}

export default MyListingPost;