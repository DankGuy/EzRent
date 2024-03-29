import SearchInput from '../../../Components/SearchInput';
import { Col, Row, Button, Form, Image, Empty, Pagination, FloatButton, Tag, Badge, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import FurnishTypeSelection from '../../../Components/FurnishTypeSelection';
import BuiltupSizeSelection from '../../../Components/BuiltupSizeSelection';
import StateSelection from '../../../Components/StateSelection';
import CategorySelection from '../../../Components/CategorySelection';
import PostSortingSelection from '../../../Components/PostSortingSelection';
import { TfiLocationPin } from 'react-icons/tfi'
import './RoomRental.css'
import { getDateOnly, getElapsedTime } from '../../../Components/timeUtils';
import { supabase } from '../../../supabase-client';
import ScrollToTopButton from '../../../Components/ScrollToTopButton';
import RentFilterDropdown from '../../../Components/RentFilterDropdown';


function RoomRental() {

    const [state, setState] = useState('null');
    const [input, setInput] = useState('null');
    const [furnish, setFurnish] = useState('null');
    const [size, setSize] = useState(500)
    const [category, setCategory] = useState('null')
    const [sortBy, setSortBy] = useState('null')
    const [rentRange, setRentRange] = useState([0, 3000]);
    const [posts, setPost] = useState([]);
    const [firstImages, setFirstImages] = useState({});
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState({});

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;
    const currentPosts = posts.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleStateChange = (e) => {
        setState(e);
    }

    const handleInputChange = (e) => {
        setInput(e);
    }

    const handleFurnishChange = (e) => {
        setFurnish(e);
    }

    const handleSizeChange = (e) => {
        setSize(e);
    }

    const handleCategoryChange = (e) => {
        setCategory(e);
    }

    const handleSortByChange = (e) => {
        setSortBy(e);

    }

    const onFinish = (e) => {
        console.log(e);

        fetchFromSupabase(e);
    };

    const fetchFromSupabase = async (input) => {
        // Make a query to search your Supabase table based on the provided value
        try {

            console.log(input['searchInput']);


            let query = supabase.from('property_post').select('*, agent(*)');

            if (!!input['propertyState'] && input['propertyState'] !== 'All States') {
                query = query.eq('propertyState', input['propertyState']);
            }

            if (!!input['searchInput']) {
                console.log("testing2")
                const searchInput = input['searchInput'];
                query = query.or(
                    `propertyName.eq."${searchInput}",propertyAddress.eq."${searchInput}",propertyCity.eq."${searchInput}",propertyState.eq."${searchInput}"`
                );
            }

            if (!!input['propertyFurnishType'] && input['propertyFurnishType'] !== 'null') {
                console.log("testing3")
                query = query.eq('propertyFurnishType', input['propertyFurnishType']);
            }

            if (!!input['propertyCategory'] && input['propertyCategory'] !== 'All Categories') {
                console.log("testing4")
                query = query.eq('propertyCategory', input['propertyCategory']);
            }

            //query rent range
            query = query.gte('propertyPrice', input["rentRange"][0]);
            query = query.lte('propertyPrice', input["rentRange"][1]);


            if (input["propertyBuildupSize"] > 0) {
                console.log("testing7")
                query = query.gte('propertySquareFeet', input["propertyBuildupSize"]);
            }

            //Sort by option
            if (sortBy === 'ascDate') {
                query = query.order('postDate', { ascending: true });
            } else if (sortBy === 'descDate' || sortBy === 'null') {
                query = query.order('postDate', { ascending: false });
            } else if (sortBy === 'ascPrice') {
                query = query.order('propertyPrice', { ascending: true });
            } else if (sortBy === 'descPrice') {
                query = query.order('propertyPrice', { ascending: false });
            } else if (sortBy === 'ascSize') {
                query = query.order('propertySquareFeet', { ascending: true });
            } else if (sortBy === 'descSize') {
                query = query.order('propertySquareFeet', { ascending: false });
            }

            query = query.contains('propertyStatus', { status: 'active' });

            const { data, error } = await query;

            if (error) {
                console.error('Search failed:', error);
                return;
            }
            console.log('Search results:', data);
            setPost(data);

            // Store the searched posts in local storage
            localStorage.setItem('searchedPosts', JSON.stringify(data));

        } catch (error) {
            console.error('An error occurred:', error);
        }

    };

    useEffect(() => {
        const storedPosts = localStorage.getItem('searchedPosts');
        if (storedPosts) {
            setPost(JSON.parse(storedPosts));
        }

        const fetchFirstImages = async () => {
            await Promise.all(posts.map((post) => getFirstImage(post)));
        };

        fetchFirstImages();
    }, []);

    useEffect(() => {
        const fetchFirstImages = async () => {
            await Promise.all(posts.map((post) => getFirstImage(post)));
        };

        fetchFirstImages();
    }, [posts]);

    // Show the immediate change when choose different sort by option
    useEffect(() => {
        const fetchData = async () => {
            try {
                const searchData = {
                    stateSelection: state,
                    locationInput: input,
                    furnishType: furnish,
                    category,
                    rentRange,
                    builtUpSize: size,
                    sortBy,
                };

                await fetchFromSupabase(searchData);

                // Call getFirstImage for each post to retrieve the first image
                posts.forEach((post) => {
                    getFirstImage(post);
                });

            } catch (error) {
                console.error('An error occurred:', error);
            }
        };
        fetchData();
    }, [sortBy]);


    //Get the first image from supabase storage with id = postID
    const getFirstImage = async (post) => {
        setIsLoading((prevLoading) => ({ ...prevLoading, [post.postID]: true }));
        const { data } = await supabase.storage
            .from('post')
            .list(`${post.postID}/Property`);

        if (data) {
            setFirstImages((prevImages) => ({
                ...prevImages,
                [post.postID]: data[0],
            }));
        }

        setIsLoading((prevLoading) => ({ ...prevLoading, [post.postID]: false }));
    };




    const openLinkInNewTab = (url, stateData, event) => {
        console.log(stateData)
        event.preventDefault();
        const serializedState = JSON.stringify(stateData);
        window.open(`${url}?state=${encodeURIComponent(serializedState)}`, '_blank');
    };



    const renderedPost = currentPosts.map((post) => {
        const firstImage = firstImages[post.postID];

        return (
            <Badge.Ribbon
                text={
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'black' }}>
                        {post.propertyCategory}
                    </span>
                }
                color={post.propertyCategory === 'Room' ? '#d5def5' : '#8594e4'}
                key={post.postID}
            >
                <Row
                    className='postContainer'>
                    <Col span={24} style={{ display: 'flex', width: '100%' }}>
                        <Row >
                            <Col span={24} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: "300px", paddingLeft: '10px' }}>

                                {isLoading[post.postID] &&
                                    <div style={{
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                        height: '200px', width: '200px'
                                    }}>
                                        <Spin size="small" />
                                        <span style={{ marginTop: '10px', fontFamily: 'arial', fontSize: '15px' }}>
                                            Loading...
                                        </span>
                                    </div>}

                                {!isLoading[post.postID] && firstImage &&
                                    <Image
                                        style={{ justifyContent: 'center' }}
                                        height={200}
                                        src={`https://exsvuquqspmbrtyjdpyc.supabase.co/storage/v1/object/public/post/${post.postID}/Property/${firstImage?.name}`} />
                                }

                            </Col>
                        </Row>
                        <div className='postDescription'>
                            <div>
                                <Row>
                                    <Col span={22} style={{ fontSize: '22px', fontWeight: '500' }}>{post.propertyName}</Col>
                                </Row>
                                <Row>
                                    <Col span={24}
                                        style={{
                                            fontSize: '20px',
                                            marginTop: '5px',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            color: 'gray',
                                            width: '300px'
                                        }}>
                                        <TfiLocationPin size={15} /> {post.propertyAddress}, {post.propertyPostcode}, {post.propertyCity}, {post.propertyState}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24} style={{ fontSize: '20px', marginTop: '5px' }}>RM{post.propertyPrice}/month </Col>
                                </Row>
                                <Row gutter={[16, 16]}>
                                    <Col style={{ fontSize: '16px', marginTop: '5px' }} xs={24} sm={24} md={8}>
                                        <span>&bull;</span>
                                        {post.propertyFurnishType}
                                    </Col>
                                    <Col style={{ fontSize: '16px', marginTop: '5px' }} xs={24} sm={24} md={8}>
                                        <span>&bull;</span>
                                        Built-up size: {post.propertySquareFeet} sq.ft.
                                    </Col>
                                </Row>
                            </div>
                            <div style={{ marginTop: '20px' }}>
                                <Row>
                                    <Col span={6}>
                                        <Button

                                            type='link'
                                            className='viewButton'
                                            onClick={(e) => openLinkInNewTab(`/student/roomRental/${post.postID}`, post.postID, e)}
                                        >
                                            View
                                        </Button>
                                    </Col>
                                    <Col span={18} style={{ fontStyle: 'italic', display: 'flex', justifyContent: 'end', alignItems: 'end' }}>{`Posted on: ${getDateOnly(post.postDate)} (Last modified: ${getElapsedTime(post.lastModifiedDate)})`}</Col>
                                </Row>

                            </div>
                        </div>
                    </Col>
                </Row>
            </Badge.Ribbon>
        )
    });



    return <>
        <div style={{
            padding: '40px 10px 0px',
            border: '0px solid black',
            width: '100%',
            boxShadow: '0px 4px 6px -2px rgba(0, 0, 0, 0.2)',
            position: 'sticky',
            top: '45px',
            zIndex: '999',
            backgroundColor: '#FFFFFF',
        }}>
            <Form
                onFinish={onFinish}
                initialValues={{
                    propertyState: null,
                    propertyFurnishType: null,
                    rentRange: [0, 3000],
                    propertyBuildupSize: 0,
                    propertyCategory: null,
                    sortBy: null,
                    searchInput: null,
                }}>
                <Row gutter={[16, 16]} style={{ marginLeft: '5%', marginRight: '5%', height: '25px' }}>
                    <Col xs={24} sm={8} md={6}>
                        <Form.Item name="propertyState">
                            <StateSelection value={state} onChange={handleStateChange} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={15}>
                        <Form.Item name="searchInput">
                            <SearchInput placeholder='Search by location or property name' style={{ width: '100%' }} value={input} onChange={handleInputChange} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={4} md={3}>
                        <Form.Item>
                            <Button htmlType='submit' style={{ display: 'flex', alignItems: 'center', backgroundColor: '#6643b5', borderRadius: '0px', fontWeight: 'bold' }} type="primary" icon={<SearchOutlined />}>
                                Search
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 16]} style={{ marginLeft: '5%', marginTop: '20px' }}>
                    <Col xs={24} sm={8} md={3}>
                        <Form.Item name='propertyFurnishType'>
                            <FurnishTypeSelection bordered={false} value={furnish} onChange={handleFurnishChange} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8} md={3}>
                        <Form.Item name="propertyCategory">
                            <CategorySelection value={category} onChange={handleCategoryChange} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8} md={4}>
                        <Form.Item name="rentRange">
                            <RentFilterDropdown value={rentRange} onChange={setRentRange} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8} md={3}>
                        <Form.Item name="propertyBuildupSize">
                            <BuiltupSizeSelection value={size} onChange={handleSizeChange} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={7} offset={2}>
                        <Form.Item name="sortBy" label="Sort by:" style={{ display: 'inline-block' }}>
                            <PostSortingSelection value={sortBy} onChange={handleSortByChange} style={{ width: '200px' }} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>


        {posts.length === 0 && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <Empty description={<span style={{ fontSize: '20px' }}>No properties found. Please try refining your search.</span>} />
        </div>}

        {/* mention how many results found */}
        {posts.length > 0 && <div style={{ display: 'flex', alignItems: 'center', height: '50px', marginLeft: '10%', marginTop: '10px' }}>
            <span
                style={{
                    fontStyle: 'italic',
                    fontSize: '20px',
                    fontFamily: 'sans-serif',
                }}>
                {posts.length} result(s) found...
            </span>
        </div>}

        <div style={{
            display: 'flex',
            flexDirection: 'column',
            marginLeft: '10%',
            // marginRight: '25%',
            marginTop: '10px',
            width: '75%',
        }}>
            {renderedPost}
        </div>

        <Pagination
            current={currentPage}
            pageSize={itemsPerPage}
            total={posts.length}
            onChange={handlePageChange}
            showQuickJumper
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', marginBottom: '20px' }}
        />

        {/* <FloatButton.BackTop /> */}

        <ScrollToTopButton />

    </>
};

export default RoomRental;