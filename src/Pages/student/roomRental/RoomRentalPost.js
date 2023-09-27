import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Col, Row, Image, Breadcrumb, Avatar, Divider, Spin, Alert } from 'antd';
import { TfiLocationPin, TfiBasketball } from 'react-icons/tfi'
import { BsHouseFill, BsCurrencyDollar, BsPeopleFill } from 'react-icons/bs'
import { FaBed, FaShower, FaCar, FaSwimmer, FaRunning, FaSwimmingPool, FaDumbbell, FaTableTennis, FaShoppingCart } from 'react-icons/fa'
import { TbAirConditioning, TbResize } from 'react-icons/tb'
import { GoReport } from 'react-icons/go'
import { CgSmartHomeRefrigerator } from 'react-icons/cg'
import { MdCurtains, MdOutlineTableRestaurant, MdTableRestaurant, MdWaterDrop } from 'react-icons/md'
import { PiCoatHanger, PiTelevisionBold } from 'react-icons/pi'
import { BiCloset, BiWifi, BiFootball, BiBuildingHouse, BiSolidBlanket } from 'react-icons/bi'
import { LiaChairSolid } from 'react-icons/lia'
import { GiSofa, GiClothesline, GiKidSlide, GiWashingMachine, GiShuttlecock, GiCoffeeCup, GiCctvCamera, GiBed, GiConverseShoe, GiPillow } from 'react-icons/gi'

import { supabase } from '../../../supabase-client'
import ReportModalForm from '../../../Components/ReportModalForm';
import RecommendationPosts from './RecommendationPosts';

import "./RoomRentalPost.css"
import Carousel from "react-multi-carousel";
import 'react-multi-carousel/lib/styles.css';
import { getDateOnly, getElapsedTime } from '../../../Components/timeUtils';
import AppointmentModalForm from '../../../Components/AppointmentModalForm';
import { UserOutlined, LoadingOutlined } from '@ant-design/icons';
import { Fragment } from 'react';

function RoomRentalPost() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const stateParam = queryParams.get('state');
    const postID = stateParam ? JSON.parse(decodeURIComponent(stateParam)) : null;


    const [post, setPost] = useState({});
    const [rooms, setRooms] = useState({});
    const [propertyImages, setPropertyImages] = useState([]);
    const [roomImages, setRoomImages] = useState({});

    const [agentAvatar, setAgentAvatar] = useState(null);

    const [loadingImages, setLoadingImages] = useState(true);
    const [warningMessage, setWarningMessage] = useState('');


    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 5,
            slidesToSlide: 1 // optional, default to 1.
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 3,
            slidesToSlide: 1 // optional, default to 1.
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            slidesToSlide: 1 // optional, default to 1.
        }
    };

    useEffect(() => {

        if (!postID) {
            return;
        }

        const fetchPost = async () => {
            const { data: post, error } = await supabase
                .from("property_post")
                .select('*, agent(*)')
                .eq("postID", postID)
                .single();

            if (error) {
                console.log(error)
            }

            console.log(post)
            console.log(post.propertyStatus.status)

            setPost(post);

            //Check if the post is still available
            if (post.propertyStatus.status === 'inactive') {
                setWarningMessage('Inactive Post Warning: This post is no longer active and is not visible to others. Any requests related to this post are disabled.');
            }



            // console.log(post.postID);

            //get the room details
            const { data: roomDetails, error: roomDetailsError } = await supabase
                .from("property_room")
                .select('*')
                .eq("propertyPostID", post.postID)
                .order('roomType', { ascending: true });

            if (roomDetailsError) {
                console.log(roomDetailsError)
            }

            // console.log(roomDetails);

            setRooms(roomDetails);
        }


        fetchPost();

    }, [postID])

    useEffect(() => {

        if (Object.keys(post).length === 0) {
            return;
        }
        if (rooms.length === 0) {
            return;
        }
        const getImages = async () => {
            setLoadingImages(true);


            // Get all images from supabase storage with id = postID 
            const { data: propertyData, error: propertyError } = await supabase.storage
                .from("post")
                .list(`${post.postID}/Property`);

            if (propertyData) {
                setPropertyImages(propertyData);
            }

            if (propertyError) {
                console.log(propertyError);
            }

            Object.entries(rooms).forEach(async ([key, room]) => {

                const roomType = room.roomType;
                const roomIndex = room.roomID.split('_')[1];

                console.log(roomType, roomIndex);


                const { data: roomData, error: roomError } = await supabase.storage
                    .from("post")
                    .list(`${post.postID}/${roomType}_${roomIndex}`);

                if (roomData) {
                    setRoomImages((prevState) => {
                        const updatedState = { ...prevState };
                        updatedState[room.roomType] = roomData;
                        return updatedState;
                    });
                }

                if (roomError) {
                    console.log(roomError);
                }
            });


            // // Create an array of room numbers
            // const roomNumbers = Array.from({ length: post.propertyRoomNumber }, (_, i) => i + 1);

            // // Map over the room numbers and retrieve room images for each
            // await Promise.all(
            //     roomNumbers.map(async (roomNumber) => {

            //         const roomType = rooms[roomNumber - 1].roomType;

            //         const { data: roomData, error: roomError } = await supabase.storage
            //             .from("post")
            //             .list(`${post.postID}/${roomType}`);

            //         if (roomData) {
            //             setRoomImages((prevState) => {
            //                 const updatedState = { ...prevState };
            //                 updatedState[roomType] = roomData;
            //                 return updatedState;
            //             });
            //         }

            //         if (roomError) {
            //             console.log(roomError);
            //         }
            //     })
            // );

            setLoadingImages(false);

        };

        const getAvatar = async () => {
            // to speed up the process, browser will use cached data instead of fetching from the server
            const timestamp = new Date().getTime(); // Generate a timestamp to serve as the cache-busting query parameter
            const { data, error } = supabase.storage
                .from("avatar")
                .getPublicUrl(`avatar-${post.agent.agent_id}`, {
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
            setAgentAvatar(data);
        });


        getImages();
    }, [post, rooms]);


    // useEffect(() => {
    //     if (!post.agent) {
    //         return;
    //     }


    // }, [post.agent]);


    // const getAgentAvatar = async () => {
    //     const { data } = supabase.storage
    //         .from("avatar")
    //         .getPublicUrl(`avatar-${post.agent.agent_id}`, {
    //             select: "metadata",
    //             fileFilter: (metadata) => {
    //                 const fileType = metadata.content_type.split("/")[1];
    //                 return fileType === "jpg" || fileType === "png";
    //             },
    //         });
    //     return data;
    // };




    const getFurnishIcon = (value) => {
        switch (value) {
            case 'Clothes hanger':
                return PiCoatHanger;
            case 'Clothes rack':
                return GiClothesline;
            case 'Refrigerator':
                return CgSmartHomeRefrigerator;
            case 'Dining table':
                return MdOutlineTableRestaurant;

            case 'Shoe rack':
                return GiConverseShoe;
            case 'Sofa':
                return GiSofa;
            case 'Television':
                return PiTelevisionBold;
            case 'Water dispenser':
                return MdWaterDrop;
            case 'Water heater':
                return FaShower;
            case 'Washing machine':
                return GiWashingMachine;
            case 'WiFi':
                return BiWifi;

            default:
                return null;
        }
    }


    const renderedFurnish = post?.propertyFurnish?.map((furnish, index) => {
        const IconComponent = getFurnishIcon(furnish);
        return <Col span={8}
            className='iconComponent'
            key={index}

        >
            {IconComponent && <IconComponent style={{ verticalAlign: 'middle', marginRight: '5px' }} />} {furnish}
        </Col>
    });

    const getFacilityIcon = (value) => {
        switch (value) {
            case 'Parking area':
                return FaCar;
            case 'Smiwimng pool':
                return FaSwimmer;
            case 'Wadding pool':
                return FaSwimmingPool;
            case 'Gym room':
                return FaDumbbell;
            case 'Basketball court':
                return TfiBasketball;
            case 'Football court':
                return BiFootball;
            case 'Badminton court':
                return GiShuttlecock;
            case 'Table tennis court':
                return FaTableTennis;
            case 'Mini market':
                return FaShoppingCart;
            case 'Cafeteria':
                return GiCoffeeCup;
            case '24-hours security':
                return GiCctvCamera;
            case 'Playground':
                return GiKidSlide;
            case 'Jogging track':
                return FaRunning;
            default:
                return null;
        }
    }

    const renderedFacility = post?.propertyFacility?.map((facility, index) => {
        const IconComponent = getFacilityIcon(facility);
        return <Col span={8}
            className='iconComponent'
            key={index}
        >
            {IconComponent && <IconComponent style={{ verticalAlign: 'middle', marginRight: '5px' }} />} {facility}
        </Col>
    });

    const getRoomFurnishIcon = (value) => {
        switch (value) {
            case 'Air-conditioner':
                return TbAirConditioning;
            case 'Bed':
                return FaBed;
            case 'Bed frame':
                return GiBed;
            case 'Blanket':
                return BiSolidBlanket;
            case 'Pillow':
                return GiPillow;
            case 'Study desk':
                return MdTableRestaurant;
            case 'Study chair':
                return LiaChairSolid;
            case 'Wardrobe':
                return BiCloset;
            case 'Window curtain':
                return MdCurtains;
            default:
                return null;
        }
    }

    const getRoomFurnish = (currentNum) => {

        const roomFurnish = rooms[currentNum - 1].roomFurnish;

        const furnishLabels = Object.keys(roomFurnish);
        const renderedRoomFurnish = furnishLabels.map((furnish, index) => {
            const IconComponent = getRoomFurnishIcon(furnish);
            const quantity = roomFurnish[furnish];
            return <Col span={7}
                className='iconComponent'
                style={
                    {
                        marginLeft: '30px',
                    }
                }
                key={index}
            >
                {IconComponent && <IconComponent style={{ verticalAlign: 'middle', marginRight: '5px' }} />} {furnish} x {quantity}
            </Col>
        });

        return <Fragment>
            <Row>
                <Col span={24} style={{ marginLeft: '20px' }}>
                    <h3 style={{ fontFamily: 'arial', fontWeight: 'normal', marginBottom: '1em' }}>Room Furnish:</h3>
                </Col>
            </Row>
            <Row>
                {renderedRoomFurnish}
            </Row>
        </Fragment>
    }





    //Display all images
    const displayImages = () => {


        if (loadingImages) {
            return (
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    height: '200px', width: '200px'
                }}>
                    <Spin size="small" />
                    <span style={{ marginTop: '10px', fontFamily: 'arial', fontSize: '15px' }}>
                        Loading...
                    </span>
                </div>

            )
        }

        if (propertyImages === undefined || propertyImages.length === 0) {
            return <p style={{ fontFamily: 'arial' }}>No images available</p>;
        }

        return propertyImages.map((image) => {
            const publicURL = `https://exsvuquqspmbrtyjdpyc.supabase.co/storage/v1/object/public/post/${post.postID}/Property/${image.name}`;

            return (
                <Image width={"auto"} height={200} key={image.id} src={publicURL} alt={image.name} />
            )
        })
    }

    const displayRoomImages = (roomType, currentNum) => {
        const images = roomImages[roomType];


        if (loadingImages) {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', width: '200px' }}>
                    <Spin size="small" />
                    <span style={{ marginTop: '10px', fontFamily: 'arial', fontSize: '15px' }}>
                        Loading...
                    </span>
                </div>
            )
        }

        if (images === undefined || images.length === 0) {
            return <p>No images available</p>;
        }


        if (images && images.length > 0) {
            return images.map((image) => {
                const publicURL = `https://exsvuquqspmbrtyjdpyc.supabase.co/storage/v1/object/public/post/${post.postID}/${roomType}_${currentNum}/${image.name}`;

                return (
                    <Image width={"auto"} height={100} key={image.id} src={publicURL} alt={image.name} />
                );
            });
        }

        return null;
    };


    function redirectToWhatsApp(phoneNumber, postID) {
        const processedNumber = phoneNumber.replace(/-/g, '');
        const text = `Hi, I would like to inquire about the room rental following post: http://localhost:3000/student/roomRental/${postID}?state=${postID}`;
        const encodedText = encodeURIComponent(text);
        const whatsappUrl = `https://wa.me/6${processedNumber}?text=${encodedText}`;
        window.open(whatsappUrl, '_blank');
    }




    const roomDetails = (currentNum) => {

        const roomType = rooms[currentNum - 1].roomType;
        const roomSqrFeet = rooms[currentNum - 1].roomSquareFeet;
        const maxTenant = rooms[currentNum - 1].maxTenant;

        return (
            <Fragment key={currentNum}>
                {
                    post.propertyCategory === 'Unit' &&
                    <Divider orientation="left" style={{ borderColor: 'gray' }} >Room {currentNum}</Divider>
                }


                <div
                    style={{
                        marginBottom: '20px',
                        marginLeft: '20px',
                    }}
                >
                    <Image.PreviewGroup>
                        <Carousel responsive={responsive}>
                            {displayRoomImages(roomType, currentNum)}
                        </Carousel>
                    </Image.PreviewGroup>
                </div>

                <Row >
                    <Col span={10} className='postSectionContent'><FaBed size={15} /> Room type: {roomType}</Col>
                    <Col span={10} className='postSectionContent'><TbResize size={15} /> Room size: {roomSqrFeet} sq.ft.</Col>
                </Row>
                <Row >
                    <Col span={10} className='postSectionContent'><BsPeopleFill size={15} /> Max tenant: {maxTenant}</Col>
                </Row>
                {getRoomFurnish(currentNum)}
            </Fragment>
        )
    }


    return (
        <div style={{ margin: '2.5% 6% 0 4%', padding: '10px' }}>
            <div>
                <Breadcrumb style={{ margin: '16px 0', fontWeight: '500' }}
                    items={[
                        { href: '/student', title: 'Home' },
                        { href: '/student/roomRental', title: 'Room Rental' },
                        { title: `${post.propertyName}` },
                    ]}
                />
            </div>
            {warningMessage !== '' && (
                <Alert
                    message={
                        <>
                            <strong>{warningMessage.split(':')[0]}</strong>
                            {warningMessage.split(':').slice(1).join(':')}
                        </>
                    }
                    type="warning"
                    showIcon
                    banner
                    closable
                />
            )}
            <h1 style={{ fontFamily: 'arial', fontWeight: 'normal' }}>{post.propertyName}</h1>
            <h3 style={{ fontFamily: 'arial', fontWeight: 'normal', marginBottom: '0em' }}> <TfiLocationPin size={15} />{post.propertyAddress}, {post.propertyPostcode}, {post.propertyCity}</h3>
            <Row>
                <Col span={15}>
                    <h3 style={{ fontFamily: 'arial', fontWeight: 'normal' }}>{post.propertyState}</h3>
                </Col>
                <Col span={9} offset={0} style={{ textAlign: 'right' }}>
                    <p style={{ fontStyle: 'italic' }}>{`Posted on: ${getDateOnly(post.postDate)} (Last modified: ${getElapsedTime(post.lastModifiedDate)})`}</p>
                </Col>
            </Row>

            <div>
                <Image.PreviewGroup>
                    <Carousel responsive={responsive}>
                        {displayImages()}
                    </Carousel>
                </Image.PreviewGroup>
            </div>
            <Row align="top" style={{ margin: '2% 8% 0px' }}>
                <Col span={15} style={{}}>

                    <div className='postSectionContainer'>
                        <Row>
                            <Col span={24} className='postSectionTitle'>Property Details: </Col>
                        </Row>
                        <Row >
                            <Col span={11} className='postSectionContent'><BsCurrencyDollar size={15} />
                                {
                                    post.propertyCategory === 'Room' ?
                                        `Room Rental Price: RM${post.propertyPrice}.00`
                                        :
                                        `Property Rental Price: RM${post.propertyPrice}.00`
                                }
                            </Col>
                            <Col span={10} className='postSectionContent'><BiBuildingHouse size={15} /> Property type: {post.propertyType}</Col>
                        </Row>
                        <Row >
                            <Col span={11} className='postSectionContent'><BsHouseFill size={15} />Furnish type: {post.propertyFurnishType}</Col>
                            <Col span={10} className='postSectionContent'><TbResize size={15} /> Built-up size: {post.propertySquareFeet} sq.ft.</Col>
                        </Row>
                    </div>

                    <div className='postSectionContainer'>
                        <Row>
                            <Col span={24} className='postSectionTitle'>Room Details: </Col>
                        </Row>

                        {rooms.length > 0 ?
                            rooms.map((room, index) => {
                                return roomDetails(index + 1);
                            }
                            )
                            :
                            <Row>
                                <Col span={24} style={{ fontSize: '18px', margin: '5px 20px 5px', paddingRight: '30px' }}>
                                    No other room details...
                                </Col>
                            </Row>
                        }
                    </div>


                    <div className='postSectionContainer'>
                        <Row>
                            <Col span={24} className='postSectionTitle'>Property Furnish: </Col>
                        </Row>
                        <Row>
                            {post.propertyFurnishType === 'Unfurnished' ?
                                <Col span={24} style={{ fontSize: '18px', margin: '5px 20px 5px', paddingRight: '30px' }}>
                                    No other furnishing...
                                </Col>
                                : renderedFurnish
                            }
                        </Row>
                    </div>

                    <div className='postSectionContainer'>
                        <Row>
                            <Col span={24} className='postSectionTitle'>Property Facility: </Col>
                        </Row>
                        <Row>
                            {renderedFacility}
                        </Row>
                    </div>


                    <div className='postSectionContainer'>
                        <Row>
                            <Col span={24} className='postSectionTitle'>Property Description: </Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{ fontSize: '18px', margin: '5px 20px 5px', paddingRight: '30px' }}>
                                <p style={{ whiteSpace: "pre-line" }}>{post.propertyDescription === null ? "No other description..." : post.propertyDescription}</p>
                            </Col>
                        </Row>
                    </div>

                </Col>
                <Col span={8} offset={1}>
                    <div className='postSectionContainer' style={{ padding: '20px 0px' }}>
                        <Row >
                            <Col span={24} className='postSectionTitle' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Avatar size={140} icon={<UserOutlined />} src={agentAvatar} />
                            </Col>
                        </Row>
                        <Row >
                            <Col span={22} style={{ fontSize: '18px', marginLeft: '20px', textAlign: 'center' }}>{post.agent?.name}</Col>
                        </Row>
                        <Row >
                            <Col span={22} style={{ fontSize: '18px', marginLeft: '20px', textAlign: 'center' }}>
                                Contact: <a style={{ textDecoration: 'underline' }} onClick={() => { redirectToWhatsApp(post.agent?.phone, post.postID) }}>{post.agent?.phone}</a>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={22} style={{ fontSize: '18px', marginLeft: '20px', textAlign: 'center' }}>Rating: {post.agent?.rating}/5.0</Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{ fontSize: '18px', marginLeft: '0px', marginTop: '10px', textAlign: 'center' }}>
                                <AppointmentModalForm post={post} warningMessage={warningMessage} />
                            </Col>
                        </Row>
                    </div>
                    <div style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', margin: '10px 10px 20px 10px', padding: '10px 30px 20px 30px', backgroundColor: 'white' }}>
                        <Row >
                            <Col span={24} style={{ fontSize: '18px', marginBottom: '8px' }}><GoReport style={{ verticalAlign: 'middle', marginRight: '5px' }} />Want to report the post? </Col>
                        </Row>
                        <Row >
                            <Col span={24} style={{ fontSize: '15px', marginBottom: '8px', }}>If you believe that this listing is a breach against our policies, please let us know by reporting it, and we'll promptly investigate the matter.</Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
                                <ReportModalForm buttonContent={"Report this post"} postID={post.postID} warningMessage={warningMessage} />
                            </Col>
                        </Row>
                    </div>
                </Col>

            </Row>

            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
                <Row>
                    <Col span={24} style={{ fontSize: '30px', marginLeft: '10px', fontWeight: '500' }}>Recommended Properties</Col>
                </Row>
                <RecommendationPosts postID={post.postID} />
            </div>
        </div>

    );
}



export default RoomRentalPost;