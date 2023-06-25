import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { Col, Row, Button, Modal, Select, Input, Form } from 'antd';
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

import { DatePicker, Carousel } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import RecommendationPosts from '../student/RecommendationPosts';
import ModalForm from '../../Components/ModalForm';

import '../student/RoomRentalPost.css'


function RoomRentalPost() {
    const location = useLocation();
    const post = location.state; // Access the passed data from the location state
    const navigate = useNavigate();

    const DemoBox = (props) => <p className={`height-${props.value}`}>{props.children}</p>;

    const [isModalOpen, setIsModalOpen] = useState(false);

    const { TextArea } = Input;

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

    const handleClick = async () => {
        console.log('hallo')

        const { data, error } = await supabase.storage.from('public/images2').list()


        console.log(data);
        console.log(error);
        // const images = await fetchPostImages(post.postId);
        // console.log(images); // Array of image URLs
    }

    async function fetchPostImages(postId) {
        try {
            // Replace 'images' with the actual folder name inside the 'images' bucket
            const folderName = `images/${postId}`;

            // Fetch the files in the specified folder
            const { data, error } = await supabase.storage.from('images').list();

            if (error) {
                console.error('Error fetching images:', error);
                return;
            }

            // Extract the URLs of the images from the response
            const imageUrls = data.map((file) => file.url);

            // Return the array of image URLs
            return imageUrls;
        } catch (error) {
            console.error('Error fetching images:', error);
            return;
        }
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


    const recommededPost = (currentPost) => {

        return (<Col span={7} style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', backgroundColor: 'white', position: 'relative', margin: '10px 20px', height: '460px', width: '380px', paddingLeft: '10px' }}>
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '20%',
                    height: '8%',
                    backgroundColor: '#d5def5',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontWeight: 'bold'
                }}>
                {currentPost.propertyCategory}
            </div>
            <Row >
                <Col span={24} style={{ height: '200px' }}></Col>
            </Row>
            <div style={{ margin: '10px' }}>
                <Row>
                    <Col span={24} style={{ fontSize: '20px' }}><BsCurrencyDollar size={15} />Rental: RM{currentPost.propertyPrice}.00</Col>
                </Row>
                <br />
                <Row>
                    <Col span={24} style={{ fontSize: '18px', marginLeft: '0px' }}>{currentPost.propertyName}</Col>
                </Row>
                <Row>
                    <Col span={24} style={{ fontSize: '16px', marginLeft: '0px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {currentPost.propertyAddress}
                    </Col>

                </Row>
                <Row>
                    <Col span={24} style={{ fontSize: '16px', marginLeft: '0px' }}>{currentPost.propertyState}</Col>
                </Row>
                <br />
                <Row>
                    <Col span={24} style={{ fontSize: '16px' }}>{currentPost.propertyType}</Col>
                </Row>
                <Row>
                    <Col span={10} style={{ fontSize: '14px', fontStyle: 'italic' }}>
                        <span style={{ marginRight: '3px' }}>&bull;</span>{currentPost.propertyFurnishType}
                    </Col>
                    <Col span={14} style={{ fontSize: '14px', fontStyle: 'italic' }}>
                        <span style={{ marginRight: '3px' }}>&bull;</span>Built-up size: {currentPost.propertySquareFeet}sq.ft.
                    </Col>
                </Row>
                <Row style={{ margin: '10px 0px' }}>
                    <Col span={12}>
                        <Link to={`/student/roomRental/${currentPost.postID}`} state={currentPost}>
                            <Button
                                type="primary"
                                className='viewButton'>View</Button>
                        </Link>
                    </Col>
                    <Col span={11} style={{ fontSize: '16px', marginLeft: '0px', display: 'flex', justifyContent: 'end', alignItems: 'end' }}>{currentPost.agent.name}</Col>

                </Row>
            </div>
        </Col>

        )
    };



    return (
        <div style={{ marginLeft: '4%', marginRight: '6%', padding: '10px', border: '1px red solid' }}>
            <div>
                <Link to="/student/">Home</Link>\
                <Link to={{ pathname: "/student/roomRental", state: post }}>Room Rental</Link>
            </div>
            <h1 style={{ fontFamily: 'arial', fontWeight: 'normal' }}>{post.propertyName}</h1>
            <h3 style={{ fontFamily: 'arial', fontWeight: 'normal' }}> <TfiLocationPin size={15} /> {post.propertyAddress}</h3>
            <h3 style={{ fontFamily: 'arial', fontWeight: 'normal' }}>{post.propertyState}</h3>


            <Row justify="center" align="top">
                <Col span={24} style={{ border: '2px solid red', height: '200px' }}>
                    <DemoBox value={100}>Image</DemoBox>
                </Col>

            </Row>
            <Row align="top" style={{ marginTop: '20px' }}>
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
                    <Col span={24} style={{ fontSize: '30px', marginLeft: '10px' }}>Other recommendations:</Col>
                </Row>
                <Row justify={'center'} style={{ margin: '1% 0%', border: '1px solid red' }}>

                    <RecommendationPosts content={recommededPost}></RecommendationPosts>
                </Row>
            </div>
        </div>

    );
}

export default RoomRentalPost;