import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { Col, Row, Button, Modal, Select, Input, Form, Image } from 'antd';
import { TfiLocationPin, TfiBasketball } from 'react-icons/tfi'
import { BsHouseFill, BsCurrencyDollar } from 'react-icons/bs'
import { FaBed, FaShower, FaCar, FaSwimmer, FaRunning, FaSwimmingPool, FaDumbbell, FaTableTennis, FaShoppingCart } from 'react-icons/fa'
import { TbAirConditioning, TbResize } from 'react-icons/tb'
import { GoReport } from 'react-icons/go'
import { CgSmartHomeRefrigerator } from 'react-icons/cg'
import { MdOutlineTableRestaurant, MdWaterDrop } from 'react-icons/md'
import { BiCloset, BiWifi, BiFootball, BiBuildingHouse } from 'react-icons/bi'
import { GiSofa, GiClothesline, GiKidSlide, GiWashingMachine, GiShuttlecock, GiCoffeeCup, GiCctvCamera } from 'react-icons/gi'
import { createClient } from '@supabase/supabase-js';

import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import RecommendationPosts from '../student/RecommendationPosts';
import ModalForm from '../../Components/ModalForm';

import '../student/RoomRentalPost.css'
import Carousel from "react-multi-carousel";
import 'react-multi-carousel/lib/styles.css';


function RoomRentalPost() {
    const location = useLocation();
    const post = location.state; // Access the passed data from the location state
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [images, setImages] = useState([]);

    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 5,
            slidesToSlide: 3 // optional, default to 1.
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 3,
            slidesToSlide: 2 // optional, default to 1.
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            slidesToSlide: 1 // optional, default to 1.
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to the top of the page
    }, [post]);

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
            case 'Clothes hanger stand':
                return GiClothesline;
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

    //TODO: GET IMAGE
    const supabase = createClient(
        'https://exsvuquqspmbrtyjdpyc.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4c3Z1cXVxc3BtYnJ0eWpkcHljIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODYyNzMxNDgsImV4cCI6MjAwMTg0OTE0OH0.vtMaXrTWDAluG_A-68pvQlSQ6GAskzADYfOonmCXPoo'
    );

    const getImages = async () => {
        //Get all images from supabase storage with id = postID 
        const { data, error } = await supabase.storage.from('post').list(post.postID);

        if (data){
            setImages(data);
            console.log(data);
        }

        if (error){
            console.log(error)
        }
        
    }

    useEffect(() => {
        getImages();
    }, [])


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

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = (e) => {
        console.log(e);
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    dayjs.extend(customParseFormat);
    const { RangePicker } = DatePicker;
    const range = (start, end) => {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    };

    // eslint-disable-next-line arrow-body-style
    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < dayjs().endOf('day');
    };
    const disabledDateTime = () => ({
        disabledHours: () => range(0, 24).splice(4, 20),
        disabledMinutes: () => range(30, 60),
        disabledSeconds: () => [55, 56],
    });


    //itemClass css
    const itemClass = {
        width: 'auto',
        // height: '100%',
    }


    return (
        <div style={{ marginLeft: '4%', marginRight: '6%', marginTop: '10vh', padding: '10px', border: '1px red solid' }}>
            <div>
                <Link to="/student/">Home</Link>\
                <Link to={{ pathname: "/student/roomRental", state: post }}>Room Rental</Link>
            </div>
            <h1 style={{ fontFamily: 'arial', fontWeight: 'normal' }}>{post.propertyName}</h1>
            <h3 style={{ fontFamily: 'arial', fontWeight: 'normal' }}> <TfiLocationPin size={15} /> {post.propertyAddress}</h3>
            <h3 style={{ fontFamily: 'arial', fontWeight: 'normal' }}>{post.propertyState}</h3>


            <div>
                <Image.PreviewGroup>
                    <Carousel responsive={responsive} itemClass=''>
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
                    <div className='postSectionContainer'>
                        <Row style={{ border: '1px black solid', height: '200px' }}>
                            <Col span={24} className='postSectionTitle'>IMAGE</Col>
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
                                <Button
                                    onClick={showModal}
                                    type="primary"
                                    className='viewButton'>Book Appointment</Button>
                                <Modal title="Book appointment for room viewing" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                                    <p>Some contents...</p>
                                    <DatePicker

                                        format="YYYY-MM-DD"
                                        disabledDate={disabledDate}
                                        disabledTime={disabledDateTime}
                                        showTime={{
                                            defaultValue: dayjs('00:00:00'),
                                        }}
                                    />
                                </Modal>
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

                                <ModalForm buttonContent={"Report this post"} postID={post.postID} />
                            </Col>
                        </Row>
                    </div>
                </Col>

            </Row>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Row>
                    <Col span={24} style={{ fontSize: '30px', marginLeft: '10px', fontWeight: 'bold' }}>Recommended Properties</Col>
                </Row>
                <Row justify={'center'} style={{ margin: '1% 0%'}}>
                    <RecommendationPosts postID={post.postID}/>
                </Row>
            </div>
        </div>

    );
}

export default RoomRentalPost;