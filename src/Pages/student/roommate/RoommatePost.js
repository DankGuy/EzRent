import { Avatar, Breadcrumb, Button, Col, message, Row, Popconfirm, Modal, Form, Input, Tag, Select } from "antd";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../../../supabase-client";
import { UserOutlined } from '@ant-design/icons';
import { BsGenderFemale, BsGenderMale } from "react-icons/bs";
import { getCurrentDateTime, getDateOnly, getElapsedTime } from "../../../Components/timeUtils";

function RoommatePost() {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const stateParam = queryParams.get('state');
    const postID = stateParam ? JSON.parse(decodeURIComponent(stateParam)) : null;

    const [listing, setListing] = useState({});

    const [avatar, setAvatar] = useState(null);

    const [messageApi, contextHolder] = message.useMessage();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [form] = Form.useForm();

    const [roomTypeOptions, setRoomTypeOptions] = useState([]);

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

            if (!data.rental_agreement) {
                return;
            }

            const propertyPostID = data?.rental_agreement.postID.postID;

            console.log(propertyPostID);

            const { data: propertyRoomDetails, error: propertyRoomDetailsError } = await supabase
                .from('property_room')
                .select('*')
                .eq('propertyPostID', propertyPostID);

            if (propertyRoomDetailsError) {
                console.log(propertyRoomDetailsError);
                return;
            }

            console.log(propertyRoomDetails);

            const uniqueRoomTypes = propertyRoomDetails.reduce((acc, value) => {
                acc.push(value);
                return acc;
            }, []);

            console.log(uniqueRoomTypes);

            setRoomTypeOptions(uniqueRoomTypes.map((value) => ({
                value: value.roomID,
                label: (
                    <>
                        <span style={{ fontWeight: '500' }}>
                            Room {value.roomID.split('_')[1]} - {value.roomType}
                        </span>
                        <br />
                        <span style={{ color: 'gray', fontStyle: 'italic' }}>
                            Available Space: {value.availableSpace} - Max: {value.maxTenant} pax  
                        </span>
                    </>
                ),
                disabled: value.availableSpace === 0,
            })));

            console.log(roomTypeOptions);
        }

        fetchListing();
    }, [postID]);

    useEffect(() => {
        if (Object.keys(listing).length === 0) {
            return;
        }

        const getAvatar = async () => {
            // to speed up the process, browser will use cached data instead of fetching from the server
            const timestamp = new Date().getTime(); // Generate a timestamp to serve as the cache-busting query parameter
            const { data, error } = supabase.storage
                .from("avatar")
                .getPublicUrl(`avatar-${listing.studentID}`, {
                    select: "metadata",
                    fileFilter: (metadata) => {
                        const fileType = metadata.content_type.split("/")[1];
                        return fileType === "jpg" || fileType === "png";
                    },
                });

            if (error) {
                console.log(error);
            }
            const avatarUrlWithCacheBuster = `${data.publicUrl}?timestamp=${timestamp}`; // Append the cache-busting query parameter

            return avatarUrlWithCacheBuster;
        };

        getAvatar().then((data) => {
            setAvatar(data);
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

    function redirectToWhatsApp(phoneNumber, postID) {
        const processedNumber = phoneNumber.replace(/-/g, '');
        const text = `Hi, I would like to inquire about the room rental following post: http://localhost:3000/student/roommate/post/${postID}?state=${postID}`;
        const encodedText = encodeURIComponent(text);
        const whatsappUrl = `https://wa.me/6${processedNumber}?text=${encodedText}`;
        window.open(whatsappUrl, '_blank');
    }

    const sendRoommateRequest = async (postID, values) => {

        const userID = (await supabase.auth.getUser()).data.user.id;

        //Do the validation to check if the user send the request before
        const { data: existingRequest, error: existingRequestError } = await supabase
            .from('roommate_request')
            .select('*')
            .eq('studentID', userID)
            .eq('postID', postID)
            .neq('requestStatus', 'Rejected');

        if (existingRequestError) {
            console.log(existingRequestError);
            return;
        }

        if (existingRequest.length !== 0) {
            messageApi.open({
                type: 'error',
                content: 'You have already sent a request for this post',
            });
            return;
        }

        const currentDate = getCurrentDateTime();

        const { data, error } = await supabase
            .from('roommate_request')
            .insert([
                {
                    studentID: userID,
                    postID: postID,
                    requestStatus: 'Pending',
                    requestedDateTime: currentDate,
                    message: values.message,
                    roomID: values.roomType,
                },
            ]);

        if (error) {
            console.log(error);
            return;
        }

        console.log(data);
        messageApi.open({
            type: 'success',
            content: 'Successfully sent roommate request',
        });
    }


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
                                {/* <Row>
                                    <Col span={24} style={{ marginBottom: '0px' }}>
                                        <span style={{ fontSize: '15px', fontWeight: '500', color: 'gray', marginTop: '0px' }}>
                                            {listing.student.email}
                                        </span>
                                    </Col>
                                </Row> */}
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
                                                    {`${listing.rental_agreement.postID.propertyAddress}, ${listing.rental_agreement.postID.propertyPostcode}, ${listing.rental_agreement.postID.propertyCity}, ${listing.rental_agreement.postID.propertyState}`}
                                                    {/* {listing.rental_agreement.postID.propertyAddress}, 
                                                    {listing.rental_agreement.postID.propertyPostcode},
                                                    {listing.rental_agreement.postID.propertyCity},
                                                    {listing.rental_agreement.postID.propertyState} */}
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
                                                    {listing.location &&
                                                        listing.location.map((location, index) => {
                                                            return (
                                                                <Tag key={index} color="blue" style={{ marginLeft: '0.5em' }}>{location}</Tag>
                                                            )
                                                        }
                                                        )
                                                    }
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
                                                            {listing.duration}
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
                                        listing.roommate !== null ? (
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
                                                                        <Col span={roommateValueSpan} style={{ ...colStyle, textTransform: 'capitalize' }} >
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
                                                                        <Col span={roommateValueSpan} style={{ ...colStyle, textTransform: 'capitalize' }} >
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
                                    <Col span={24} >
                                        {contextHolder}
                                        <Button
                                            className="viewButton"
                                            style={{ width: '100%', marginLeft: '0px' }} type="primary"
                                            onClick={() => setIsModalOpen(true)}
                                        >
                                            Interested
                                        </Button>

                                        <Modal
                                            title="Apply as a roommate"
                                            open={isModalOpen}
                                            // onOk={() => {
                                            //     form.submit();
                                            // }}
                                            onCancel={() => {
                                                setIsModalOpen(false);
                                                form.resetFields();
                                            }}
                                            footer={[
                                                <Button key="back" className="viewButton" onClick={() => {
                                                    setIsModalOpen(false);
                                                    form.resetFields();
                                                }}>
                                                    Cancel
                                                </Button>,
                                                <Button key="submit" className="viewButton" type="primary" onClick={() => {
                                                    form.submit();
                                                }}>
                                                    Submit
                                                </Button>,
                                            ]}
                                        >

                                            <Form layout="vertical"
                                                form={form}
                                                onFinish={(values) => {
                                                    console.log(values);
                                                    sendRoommateRequest(listing.postID, values);
                                                    setIsModalOpen(false);
                                                }}
                                                initialValues={{
                                                    message: "I'd love to be your roommate and share great times together!"
                                                }}>

                                                {roomTypeOptions.length !== 0 && (
                                                    <Form.Item
                                                        label="Room Type"
                                                        name="roomType"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'Please select a room type',
                                                            },
                                                        ]}
                                                    >
                                                        <Select placeholder="Select room type" options={roomTypeOptions} />
                                                    </Form.Item>
                                                )}

                                                <Form.Item
                                                    label="Drop your message here"
                                                    name="message"
                                                >
                                                    <Input.TextArea
                                                        rows={4}
                                                        placeholder="Write a description to attract attention..."
                                                    />
                                                </Form.Item>
                                            </Form>
                                        </Modal>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24} style={{ marginTop: '10px' }}>
                                        <Button
                                            type="primary"
                                            style={{ width: '100%', marginLeft: '0px' }}
                                            className="viewButton"
                                            onClick={() => redirectToWhatsApp(listing.student.phone, listing.postID)}
                                        >
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