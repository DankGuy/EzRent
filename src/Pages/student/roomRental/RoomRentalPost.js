import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { Col, Row, Button, Modal, Select, Input, Form, Image, Breadcrumb, Avatar } from 'antd';
import { TfiLocationPin, TfiBasketball } from 'react-icons/tfi'
import { BsHouseFill, BsCurrencyDollar } from 'react-icons/bs'
import { FaBed, FaShower, FaCar, FaSwimmer, FaRunning, FaSwimmingPool, FaDumbbell, FaTableTennis, FaShoppingCart } from 'react-icons/fa'
import { TbAirConditioning, TbResize } from 'react-icons/tb'
import { GoReport } from 'react-icons/go'
import { CgSmartHomeRefrigerator } from 'react-icons/cg'
import { MdOutlineTableRestaurant, MdWaterDrop } from 'react-icons/md'
import { PiCoatHanger, PiTelevisionBold } from 'react-icons/pi'
import { BiCloset, BiWifi, BiFootball, BiBuildingHouse } from 'react-icons/bi'
import { GiSofa, GiClothesline, GiKidSlide, GiWashingMachine, GiShuttlecock, GiCoffeeCup, GiCctvCamera, GiBed, GiConverseShoe } from 'react-icons/gi'

import { supabase } from '../../../supabase-client'
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import ReportModalForm from '../../../Components/ReportModalForm';
import RecommendationPosts from './RecommendationPosts';

import "./RoomRentalPost.css"
import Carousel from "react-multi-carousel";
import 'react-multi-carousel/lib/styles.css';
import { getDateOnly, getElapsedTime } from '../../../Components/timeUtils';
import AppointmentModalForm from './AppointmentModalForm';
import {UserOutlined} from '@ant-design/icons';

function RoomRentalPost() {
    const location = useLocation();
    const post = location.state; // Access the passed data from the location state
    const navigate = useNavigate();


    const [images, setImages] = useState([]);
    const [agentAvatar, setAgentAvatar] = useState(null);

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
        getImages();
        getAgentAvatar().then((data) => setAgentAvatar(data.publicUrl));

    }, [])

    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to the top of the page
        getImages();
        // getAvailableDate();
    }, [post]);

    const getAgentAvatar = async () => {
        const { data } = supabase.storage
          .from("avatar")
          .getPublicUrl(`avatar-${post.agent.agent_id}`, {
            select: "metadata",
            fileFilter: (metadata) => {
              const fileType = metadata.content_type.split("/")[1];
              return fileType === "jpg" || fileType === "png";
            },
          });
          console.log(data.publicUrl)
        return data;
      };


    let roomNum = '';
    let roomType = '';

    if (post.propertyCategory === 'Room') {
        roomType = (
            <>
                <FaBed size={15} /> Room type: {post.propertyRoomType}
            </>
        );
    } else {
        const [masterRoom, mediumRoom, smallRoom] = post.propertyRoomNumber;
        roomNum = (
            <>
                <FaBed size={15} />{masterRoom} Master room, {mediumRoom} Medium room, {smallRoom} Small room
            </>
        );

    }

    const getFurnishIcon = (value) => {
        switch (value) {
            case 'Air-conditioner':
                return TbAirConditioning;
            case 'Bed frame':
                return GiBed;
            case 'Bed':
                return FaBed;
            case 'Dining table':
                return MdOutlineTableRestaurant;
            case 'Water heater':
                return FaShower;
            case 'Refrigerator':
                return CgSmartHomeRefrigerator;
            case 'Study desk and table':
                return MdOutlineTableRestaurant;
            case 'Wardrobe':
                return BiCloset;
            case 'Sofa':
                return GiSofa;
            case 'Shoe rack':
                return GiConverseShoe;
            case 'Clothes hanger':
                return PiCoatHanger;
            case 'Clothes rack':
                return GiClothesline;
            case 'Television':
                return PiTelevisionBold;
            case 'Washing machine':
                return GiWashingMachine;
            case 'WiFi':
                return BiWifi;
            case 'Water dispenser':
                return MdWaterDrop;
            default:
                return null;
        }
    }


    const renderedFurnish = post.propertyFurnish.map((furnish, index) => {
        const IconComponent = getFurnishIcon(furnish);
        return <Col span={6}
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

    const renderedFacility = post.propertyFacility.map((facility, index) => {
        const IconComponent = getFacilityIcon(facility);
        return <Col span={6}
            className='iconComponent'
            key={index}
        >
            {IconComponent && <IconComponent style={{ verticalAlign: 'middle', marginRight: '5px' }} />} {facility}
        </Col>
    });

    const getImages = async () => {
        //Get all images from supabase storage with id = postID 
        const { data, error } = await supabase.storage.from('post').list(post.postID);

        if (data) {
            setImages(data);
        }

        if (error) {
            console.log(error)
        }
    }

    //Display all images
    const displayImages = () => {
        return images.map((image) => {
            const publicURL = `https://exsvuquqspmbrtyjdpyc.supabase.co/storage/v1/object/public/post/${post.postID}/${image.name}`;

            return (
                <Image width={"auto"} height={200} key={image.id} src={publicURL} alt={image.name} />
            )
        })
    }


    function redirectToWhatsApp(phoneNumber, postID) {
        const processedNumber = phoneNumber.replace(/-/g, '');
        const text = `Hi, I would like to inquire about the room rental with the post id '${postID}'.`;
        const encodedText = encodeURIComponent(text);
        const whatsappUrl = `https://wa.me/6${processedNumber}?text=${encodedText}`;
        window.location.href = whatsappUrl;
    }


    return (
        <div style={{ marginLeft: '4%', marginRight: '6%', marginTop: '10vh', padding: '10px' }}>
            <div>
                <Breadcrumb style={{ margin: '16px 0', fontWeight: '500' }}
                    items={[
                        { href: '/student', title: 'Home' },
                        { href: '/student/roomRental', title: 'Room Rental' },
                        { href: `/student/roomRental/${post.postID}`, title: `${post.propertyName}` },
                    ]}
                />
            </div>
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
                            <Col span={10} className='postSectionContent'><BsCurrencyDollar size={15} />Rental: RM{post.propertyPrice}.00</Col>
                            <Col span={10} className='postSectionContent'><BiBuildingHouse size={15} /> Property type: {post.propertyType}</Col>
                        </Row>
                        <Row >
                            <Col span={10} className='postSectionContent'><BsHouseFill size={15} />Furnish type: {post.propertyFurnishType}</Col>
                            <Col span={10} className='postSectionContent'><TbResize size={15} /> Built-up size: {post.propertySquareFeet} sq.ft.</Col>
                        </Row>
                        <Row>
                            <Col span={24} className='postSectionContent'>{roomType}</Col>
                        </Row>
                        <Row>
                            <Col span={24} className='postSectionContent'>{roomNum}</Col>
                        </Row>
                    </div>

                    <div className='postSectionContainer'>
                        <Row>
                            <Col span={24} className='postSectionTitle'>Property Furnish: </Col>
                        </Row>
                        <Row>
                            {renderedFurnish}
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
                    <div className='postSectionContainer' style={{padding: '20px 0px'}}>
                        <Row >
                            <Col span={24} className='postSectionTitle' style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <Avatar size={140} src={agentAvatar} icon={<UserOutlined />} />
                            </Col>
                        </Row>
                        <Row >
                            <Col span={22} style={{ fontSize: '18px', marginLeft: '20px', textAlign: 'center' }}>{post.agent.name}</Col>
                        </Row>
                        <Row >
                            <Col span={22} style={{ fontSize: '18px', marginLeft: '20px', textAlign: 'center' }}>
                                Contact: <a style={{ textDecoration: 'underline' }} onClick={() => { redirectToWhatsApp(post.agent.phone, post.postID) }}>{post.agent.phone}</a>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={22} style={{ fontSize: '18px', marginLeft: '20px', textAlign: 'center' }}>Rating: {post.agent.rating}/5.0</Col>
                        </Row>
                        <Row>
                            <Col span={22} style={{ fontSize: '18px', marginLeft: '20px', marginTop: '10px', textAlign: 'center' }}>
                                <AppointmentModalForm post={post} />
                            </Col>
                        </Row>
                    </div>
                    <div style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', margin: '10px 10px 20px 10px', padding: '10px 30px 10px 30px', backgroundColor: 'white' }}>
                        <Row >
                            <Col span={24} style={{ fontSize: '18px', marginBottom: '8px' }}><GoReport style={{ verticalAlign: 'middle', marginRight: '5px' }} />Want to report the post? </Col>
                        </Row>
                        <Row >
                            <Col span={24} style={{ fontSize: '15px', marginBottom: '8px', }}>If you believe that this listing is a breach against our policies, please let us know by reporting it, and we'll promptly investigate the matter.</Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
                                {/* //TODO: Pass student id to report modal */}
                                <ReportModalForm buttonContent={"Report this post"} postID={post.postID} />
                            </Col>
                        </Row>
                    </div>
                </Col>

            </Row>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Row>
                    <Col span={24} style={{ fontSize: '30px', marginLeft: '10px', fontWeight: 'bold' }}>Recommended Properties</Col>
                </Row>
                <Row justify={'center'} style={{ margin: '1% 0%' }}>
                    <RecommendationPosts postID={post.postID} />
                </Row>
            </div>
        </div>

    );
}

export default RoomRentalPost;