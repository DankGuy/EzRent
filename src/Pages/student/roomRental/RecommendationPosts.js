import React, { useState, useEffect } from 'react';
import { Row, Col, Image, Button } from 'antd';
import { BsCurrencyDollar } from 'react-icons/bs'
import { supabase } from '../../../supabase-client';
import Carousel from 'react-multi-carousel';


function RecommendationPosts({ postID }) {


    const [recommendedPosts, setPost] = useState([]);

    const [firstImage, setFirstImage] = useState({});

    const fetchPosts = async () => {

        //get current post state
        const { data: currentPost } = await supabase
            .from('property_post')
            .select('propertyState')
            .eq('postID', postID);

        //get all posts with the same state
        const { data: posts } = await supabase
            .from('property_post')
            .select('*, agent(*)')
            .eq('propertyState', currentPost[0].propertyState)
            .neq('postID', postID)
            .contains('propertyStatus', { status: 'active' });

        setPost(posts);

        const firstImageObject = {};

        for (let i = 0; i < posts.length; i++) {
            const { data, error } = await supabase.storage
                .from('post')
                .list(`%${posts[i].postID}/Property`);

            if (error) {
                console.log(error);
                return;
            }

            if (data) {
                firstImageObject[posts[i].postID] = data[0];
            }
        }

        setFirstImage(firstImageObject);
    }



    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [postID]);

    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3,
            slidesToSlide: 1 // optional, default to 1.
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,
            slidesToSlide: 1 // optional, default to 1.
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            slidesToSlide: 1 // optional, default to 1.
        }
    };

    const openLinkInNewTab = (url, stateData, event) => {
        event.preventDefault();
        const serializedState = JSON.stringify(stateData);
        window.open(`${url}?state=${encodeURIComponent(serializedState)}`, '_blank');
    };

    const renderPosts = () => {

        console.log(recommendedPosts);

        return recommendedPosts.map((post, index) => {

            return (
                <div
                    key={index}
                    style={{
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                        backgroundColor: 'white',
                        position: 'relative',
                        margin: '10px 25px 10px 30px',
                        height: 'auto',
                        width: '380px'
                    }}>
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
                            fontWeight: 'bold',
                            zIndex: '300',
                            fontFamily: '-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,\'Helvetica Neue\',Arial,\'Noto Sans\',sans-serif,\'Apple Color Emoji\',\'Segoe UI Emoji\',\'Segoe UI Symbol\',\'Noto Color Emoji\''
                        }}>
                        {post.propertyCategory}
                    </div>
                    <Row >
                        {firstImage[post.postID] &&
                            <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
                                <Image style={{ justifyContent: 'center' }} height={200}
                                    src={`https://exsvuquqspmbrtyjdpyc.supabase.co/storage/v1/object/public/post/${post.postID}/Property/${firstImage[post.postID].name}`}
                                    onError={() => { console.log("error") }} />
                            </Col>}
                    </Row>
                    <div style={{ margin: '10px' }}>
                        <Row>
                            <Col span={24} style={{ fontSize: '20px' }}><BsCurrencyDollar size={15} />Rental: RM{post.propertyPrice}.00</Col>
                        </Row>
                        <br />
                        <Row>
                            <Col span={24} style={{ fontSize: '18px', marginLeft: '0px' }}>{post.propertyName}</Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{ fontSize: '16px', marginLeft: '0px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {post.propertyAddress}
                            </Col>

                        </Row>
                        <Row>
                            <Col span={24} style={{ fontSize: '16px', marginLeft: '0px' }}>{post.propertyState}</Col>
                        </Row>
                        <br />
                        <Row>
                            <Col span={24} style={{ fontSize: '16px' }}>{post.propertyType}</Col>
                        </Row>
                        <Row>
                            <Col span={10} style={{ fontSize: '14px', fontStyle: 'italic' }}>
                                <span style={{ marginRight: '3px' }}>&bull;</span>{post.propertyFurnishType}
                            </Col>
                            <Col span={14} style={{ fontSize: '14px', fontStyle: 'italic' }}>
                                <span style={{ marginRight: '3px' }}>&bull;</span>Built-up size: {post.propertySquareFeet} sq.ft.
                            </Col>
                        </Row>
                        <Row style={{ margin: '10px 0px', paddingBottom: '10px' }}>
                            <Col span={12}>
                                <Button
                                    type="primary"
                                    className='viewButton'
                                    onClick={(e) => openLinkInNewTab(`/student/roomRental/${post.postID}`, post, e)}                                        >View
                                </Button>
                            </Col>
                            <Col span={11} style={{ fontSize: '16px', marginLeft: '0px', display: 'flex', justifyContent: 'end', alignItems: 'end' }}>{post.agent.name}</Col>

                        </Row>
                    </div>
                </div>
            )
        })

    }


    return (
        <>
            <div>
                <Carousel
                    responsive={responsive}
                    swipeable={false}
                    draggable={false}
                    infinite={false}
                >
                    {renderPosts()}
                </Carousel>
            </div>


        </>
    );
}

export default RecommendationPosts;