import { Avatar, Breadcrumb, Button, Col, Divider, Row } from "antd";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../../../supabase-client";
import { UserOutlined } from '@ant-design/icons';
import { BsGenderFemale, BsGenderMale } from "react-icons/bs";
import { getDateOnly, getElapsedTime } from "../../../Components/timeUtils";

function RoommatePost() {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const stateParam = queryParams.get('state');
    const postID = stateParam ? JSON.parse(decodeURIComponent(stateParam)) : null;
    console.log(postID);

    const [listing, setListing] = useState({});

    const [avatar, setAvatar] = useState(null);

    useEffect(() => {
        if (!postID) {
            return;
        }

        const fetchListing = async () => {
            const { data, error } = await supabase
                .from('roommate_post')
                .select('*, student(*), rental_agreement(*, postID(*))')
                .eq('postID', postID)
                .single();

            if (error) {
                console.log(error);
                return;
            }

            console.log(data);
            setListing(data);
        }

        fetchListing();
    }, [postID]);

    useEffect(() => {
        if (Object.keys(listing).length === 0) {
            return;
        }

        const getAvatar = async () => {
            const { data } = await supabase.storage
                .from("avatar")
                .getPublicUrl(`avatar-${listing.student.student_id}`, {
                    select: "metadata",
                    fileFilter: (metadata) => {
                        const fileType = metadata.content_type.split("/")[1];
                        return fileType === "jpg" || fileType === "png";
                    },
                })

            return data;
        };

        getAvatar().then((data) => {
            setAvatar(data.publicUrl);
        });

    }, [listing]);



    const openLinkInNewTab = (url, stateData, event) => {
        console.log(stateData)
        event.preventDefault();
        const serializedState = JSON.stringify(stateData);
        window.open(`${url}?state=${encodeURIComponent(serializedState)}`, '_blank');
    };


    const labelStyle = {
        fontWeight: '500',
        marginRight: '5px',
        color: 'gray',
    }

    const colStyle = {
        marginBottom: '10px',
        fontSize: '16px',
    }

    const roommateLabelSpan = 7;
    const roommateValueSpan = 16;

    const myLifestyleLabelSpan = 8;
    const myLifestyleValueSpan = 16;

    return (
        <>
            {Object.keys(listing).length !== 0 && (
                <div style={{ marginLeft: '4%', marginRight: '6%', padding: '10px' }}>
                    <div>
                        <Breadcrumb style={{ margin: '16px 0', fontWeight: '500' }}
                            items={[
                                { href: '/student', title: 'Home' },
                                { href: '/student/roommate', title: 'Roommate' },
                                { title: 'Post Details' },
                            ]}
                        />
                    </div>
                    <div className="postSectionContainer">

                        <Row>
                            <Col span={2}
                                style={{
                                    marginBottom: '10px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <Avatar size={50} src={avatar} icon={<UserOutlined />} />
                            </Col>
                            <Col span={21} style={{ marginBottom: '10px', marginLeft: '10px' }}>
                                <Row>
                                    <Col span={10} style={{ display: 'flex', alignItems: 'center', paddingTop: '5px' }}>
                                        <span style={{ fontWeight: '500', fontSize: '16px' }}>
                                            {listing.student.name}
                                        </span>
                                        <span style={{ marginLeft: '1em' }}>
                                            {listing.student.gender === "Male" ? <BsGenderMale size={15} color="blue" /> : <BsGenderFemale size={15} color="#E75480" />}
                                        </span>
                                    </Col>
                                    <Col span={14} style={{ textAlign: 'right' }}>
                                        <p style={{ fontStyle: 'italic' }}>{`Posted on: ${getDateOnly(listing.postDate)} (Last modified: ${getElapsedTime(listing.lastModifiedDate)})`}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24} style={{ marginBottom: '0px' }}>
                                        <span style={{ fontSize: '15px', fontWeight: '500', color: 'gray', marginTop: '0px' }}>
                                            {listing.student.email}
                                        </span>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                    <Row >
                        <Col span={17}
                            style={{
                                marginRight: '4%',
                            }}>
                            <div className="postSectionContainer">

                                <Row>
                                    <Col span={24} style={{ marginBottom: '10px', fontWeight: '500', fontSize: '16px' }}>
                                        {listing.rental_agreement ? "Rented Property Details:" : "Preferred Property Details:"}
                                    </Col>
                                </Row>

                                <div style={{ marginBottom: '10px', paddingLeft: '10px' }}>
                                    {listing.rental_agreement ? (
                                        <>
                                            <Row>
                                                <Col span={24} style={colStyle}>
                                                    <span style={labelStyle} >
                                                        Property Name:
                                                    </span>
                                                    {listing.rental_agreement.postID.propertyName}
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={24} style={colStyle}>
                                                    <span style={labelStyle}>
                                                        Address:
                                                    </span>
                                                    {listing.rental_agreement.postID.propertyAddress},
                                                    {listing.rental_agreement.postID.propertyPostcode},
                                                    {listing.rental_agreement.postID.propertyCity},
                                                    {listing.rental_agreement.postID.propertyState}
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={8} style={colStyle}>
                                                    <span style={labelStyle}>
                                                        Type:
                                                    </span>
                                                    {listing.rental_agreement.postID.propertyType}
                                                </Col>
                                                <Col span={12} style={colStyle}>
                                                    <span style={labelStyle}>
                                                        Price:
                                                    </span>
                                                    RM{listing.rental_agreement.postID.propertyPrice}.00/month

                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={24} style={colStyle}>
                                                    <span>
                                                        View the property details{' '}
                                                        <span
                                                            style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
                                                            onClick={(e) => openLinkInNewTab(`/student/roomRental/${listing.rental_agreement.postID.postID}`, listing.rental_agreement.postID.postID, e)}
                                                        >
                                                            here
                                                        </span>
                                                        .
                                                    </span>                                        </Col>
                                            </Row>
                                        </>
                                    ) : (
                                        <>
                                            <Row>
                                                <Col span={24} style={colStyle}>
                                                    <span style={labelStyle}>
                                                        Location:
                                                    </span>
                                                    {listing.location}
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={12} style={colStyle}>
                                                    <span style={labelStyle}>
                                                        Property Type:
                                                    </span>
                                                    {listing.propertyType}
                                                </Col>
                                                <Col span={12} style={colStyle}>
                                                    <span style={labelStyle}>
                                                        Budget:
                                                    </span>
                                                    RM{listing.budget}.00/month
                                                </Col>
                                            </Row>
                                        </>
                                    )}
                                </div>
                            </div>
                            {
                                listing.moveInDate || listing.duration ? (
                                    <>
                                        <div className="postSectionContainer">
                                            <Row>
                                                <Col span={24} style={{ marginBottom: '10px', fontWeight: '500', fontSize: '16px' }}>
                                                    Preferred Rental Details:
                                                </Col>
                                            </Row>
                                            <div style={{ marginBottom: '10px', paddingLeft: '10px' }}>
                                                <Row>
                                                    {listing.moveInDate ? (
                                                        <Col span={12} style={colStyle}>
                                                            <span style={labelStyle}>
                                                                Move-in Date:
                                                            </span>
                                                            {getDateOnly(listing.moveInDate)}
                                                        </Col>
                                                    ) : null}
                                                    {listing.duration ? (
                                                        <Col span={12} style={colStyle}>
                                                            <span style={labelStyle}>
                                                                Duration:
                                                            </span>
                                                            {listing.duration} months
                                                        </Col>
                                                    ) : null}
                                                </Row>
                                            </div>
                                        </div>
                                    </>
                                ) : null
                            }
                            <Row>
                                <Col span={12} >
                                    {
                                        listing.roommate!== null ? (
                                            <>

                                                <div className="postSectionContainer" style={{ marginRight: '20px' }}>
                                                    <Row>
                                                        <Col span={24} style={{ marginBottom: '10px', fontWeight: '500', fontSize: '16px' }}>
                                                            Roommate Preferences:
                                                        </Col>
                                                    </Row>
                                                    <div style={{ marginBottom: '10px', paddingLeft: '10px' }}>
                                                        <Row>
                                                            {
                                                                listing.roommate.age ? (
                                                                    <>
                                                                        <Col span={roommateLabelSpan} style={colStyle}>
                                                                            <span style={labelStyle}>
                                                                                Age:
                                                                            </span>
                                                                        </Col>
                                                                        <Col span={roommateValueSpan} style={colStyle}>
                                                                            {listing.roommate.age[0]} - {listing.roommate.age[1]} years old
                                                                        </Col>
                                                                    </>

                                                                ) : null
                                                            }
                                                            {
                                                                listing.roommate.gender ? (
                                                                    <>
                                                                        <Col span={roommateLabelSpan} style={colStyle}>
                                                                            <span style={labelStyle}>
                                                                                Gender:
                                                                            </span>
                                                                        </Col>
                                                                        <Col span={roommateValueSpan} style={colStyle}>
                                                                            {listing.roommate.gender}
                                                                        </Col>
                                                                    </>
                                                                ) : null
                                                            }
                                                            {
                                                                listing.roommate.studentType ? (
                                                                    <>
                                                                        <Col span={roommateLabelSpan} style={colStyle}>
                                                                            <span style={labelStyle}>
                                                                                Student Type:
                                                                            </span>
                                                                        </Col>
                                                                        <Col span={roommateValueSpan} style={colStyle}>
                                                                            {listing.roommate.studentType} student
                                                                        </Col>
                                                                    </>
                                                                ) : null
                                                            }
                                                            {
                                                                listing.roommate.race ? (
                                                                    <>
                                                                        <Col span={roommateLabelSpan} style={colStyle}>
                                                                            <span style={labelStyle}>
                                                                                Race:
                                                                            </span>
                                                                        </Col>
                                                                        <Col span={roommateValueSpan} style={colStyle}>
                                                                            {listing.roommate.race}
                                                                        </Col>
                                                                    </>
                                                                ) : null
                                                            }
                                                            {
                                                                listing.roommate.religion ? (
                                                                    <>
                                                                        <Col span={roommateLabelSpan} style={colStyle}>
                                                                            <span style={labelStyle}>
                                                                                Religion:
                                                                            </span>
                                                                        </Col>
                                                                        <Col span={roommateValueSpan} style={colStyle}>
                                                                            {listing.roommate.religion}
                                                                        </Col>
                                                                    </>
                                                                ) : null
                                                            }
                                                            {
                                                                listing.roommate.description ? (
                                                                    <>
                                                                        <Col span={roommateLabelSpan} style={colStyle}>
                                                                            <span style={labelStyle}>
                                                                                Description:
                                                                            </span>
                                                                        </Col>
                                                                        <Col span={roommateValueSpan} style={colStyle}>
                                                                            {listing.roommate.description}
                                                                        </Col>
                                                                    </>
                                                                ) : null
                                                            }
                                                        </Row>
                                                    </div>
                                                </div>

                                            </>
                                        ) : null
                                    }
                                </Col>
                                <Col span={12}>
                                    {
                                         Object.keys(listing.myLifestyle).length !== 0 ? (
                                            <>
                                                <div className="postSectionContainer">
                                                    <Row>
                                                        <Col span={24} style={{ marginBottom: '10px', fontWeight: '500', fontSize: '16px' }}>
                                                            My Lifestyle:
                                                        </Col>
                                                    </Row>
                                                    <div style={{ marginBottom: '10px', paddingLeft: '10px' }}>
                                                        <Row>
                                                            {
                                                                listing.myLifestyle.cleanliness ? (
                                                                    <>
                                                                        <Col span={myLifestyleLabelSpan} style={colStyle}>
                                                                            <span style={labelStyle}>
                                                                                My Cleanliness:
                                                                            </span>
                                                                        </Col>
                                                                        <Col span={myLifestyleValueSpan} style={colStyle}>
                                                                            {listing.myLifestyle.cleanliness}
                                                                        </Col>
                                                                    </>

                                                                ) : null
                                                            }
                                                            {
                                                                listing.myLifestyle.smoking ? (
                                                                    <>
                                                                        <Col span={myLifestyleLabelSpan} style={colStyle}>
                                                                            <span style={labelStyle}>
                                                                                Smoking:
                                                                            </span>
                                                                        </Col>
                                                                        <Col span={myLifestyleValueSpan} style={colStyle}>
                                                                            {listing.myLifestyle.smoking}
                                                                        </Col>
                                                                    </>
                                                                ) : null
                                                            }
                                                            {
                                                                listing.myLifestyle.getUp ? (
                                                                    <>
                                                                        <Col span={myLifestyleLabelSpan} style={colStyle}>
                                                                            <span style={labelStyle}>
                                                                                Get Up:
                                                                            </span>
                                                                        </Col>
                                                                        <Col span={myLifestyleValueSpan} style={colStyle}>
                                                                            {listing.myLifestyle.getUp}
                                                                        </Col>

                                                                    </>
                                                                ) : null
                                                            }
                                                            {
                                                                listing.myLifestyle.goToBed ? (
                                                                    <>
                                                                        <Col span={myLifestyleLabelSpan} style={colStyle}>
                                                                            <span style={labelStyle}>
                                                                                Go To Bed:
                                                                            </span>
                                                                        </Col>
                                                                        <Col span={myLifestyleValueSpan} style={colStyle}>
                                                                            {listing.myLifestyle.goToBed}
                                                                        </Col>
                                                                    </>

                                                                ) : null
                                                            }
                                                            {
                                                                listing.myLifestyle.pets ? (
                                                                    <>
                                                                        <Col span={myLifestyleLabelSpan} style={colStyle}>
                                                                            <span style={labelStyle}>
                                                                                Pets:
                                                                            </span>
                                                                        </Col>
                                                                        <Col span={myLifestyleValueSpan} style={colStyle}>
                                                                            {listing.myLifestyle.pets}
                                                                        </Col>
                                                                    </>
                                                                ) : null
                                                            }
                                                            {
                                                                listing.myLifestyle.foodPreference ? (
                                                                    <>
                                                                        <Col span={myLifestyleLabelSpan} style={colStyle}>
                                                                            <span style={labelStyle}>
                                                                                Food Preference:
                                                                            </span>
                                                                        </Col>
                                                                        <Col span={myLifestyleValueSpan} style={colStyle}>
                                                                            {listing.myLifestyle.foodPreference}
                                                                        </Col>
                                                                    </>

                                                                ) : null
                                                            }
                                                            {
                                                                listing.myLifestyle.guests ? (
                                                                    <>
                                                                        <Col span={myLifestyleLabelSpan} style={colStyle}>
                                                                            <span style={labelStyle}>
                                                                                Guests:
                                                                            </span>
                                                                        </Col>
                                                                        <Col span={myLifestyleValueSpan} style={colStyle}>
                                                                            {listing.myLifestyle.guests}
                                                                        </Col>
                                                                    </>
                                                                ) : null
                                                            }
                                                            {
                                                                listing.myLifestyle.party ? (
                                                                    <>
                                                                        <Col span={myLifestyleLabelSpan} style={colStyle}>
                                                                            <span style={labelStyle}>
                                                                                Party:
                                                                            </span>
                                                                        </Col>
                                                                        <Col span={myLifestyleValueSpan} style={colStyle}>
                                                                            {listing.myLifestyle.party}
                                                                        </Col>
                                                                    </>

                                                                ) : null
                                                            }
                                                        </Row>
                                                    </div>
                                                </div>
                                            </>
                                        ) : null
                                    }
                                </Col>
                            </Row>
                        </Col>
                        <Col span={6}>
                            <div className="postSectionContainer" style={{ marginLeft: '-30px', padding: '15px' }} >
                                <Row>
                                    <Col span={24} style={{ fontWeight: '500', fontSize: '16px' }}>
                                        Let's Room Together!
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24} style={{ fontSize: '16px', color: 'gray', fontSize: '15px' }}>
                                        <p>
                                            Take the first step in finding your ideal roommate - contact the post owner or apply as a roommate by clicking the buttons
                                        </p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <Button type="primary" style={{ width: '100%' }} className="viewButton">
                                            Interested
                                        </Button>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
                                        <Button type="primary" style={{ width: '100%' }} className="viewButton">
                                            Contact
                                        </Button>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </div>
            )}
        </>
    )
}

export default RoommatePost;