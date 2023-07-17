import SearchInput from '../../../Components/SearchInput';
import { Col, Row, Button, Form, Image, Empty } from 'antd';
import { Link } from 'react-router-dom'
import { SearchOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import FurnishTypeSelection from '../../../Components/FurnishTypeSelection';
import MinRentSelection from '../../../Components/MinRentSelection';
import MaxRentSelection from '../../../Components/MaxRentSelection';
import BuiltupSizeSelection from '../../../Components/BuiltupSizeSelection';
import StateSelection from '../../../Components/StateSelection';
import CategorySelection from '../../../Components/CategorySelection';
import PostSortingSelection from '../../../Components/PostSortingSelection';
import { TfiLocationPin } from 'react-icons/tfi'
import './RoomRental.css'
import { getDateOnly, getElapsedTime } from '../../../Components/timeUtils';
import { supabase } from '../../../supabase-client';


function RoomRental() {

    const [state, setState] = useState('null');
    const [input, setInput] = useState('null');
    const [furnish, setFurnish] = useState('null');
    const [minRent, setMinRent] = useState(0)
    const [maxRent, setMaxRent] = useState(0)
    const [size, setSize] = useState(500)
    const [category, setCategory] = useState('null')
    const [sortBy, setSortBy] = useState('null')
    const [isError, setIsError] = useState(false)
    let errorMessage = "*Minimum rent cannot larger than maximum rent";


    const [posts, setPost] = useState([]);
    const [firstImages, setFirstImages] = useState({});


    const handleStateChange = (e) => {
        setState(e);
    }

    const handleInputChange = (e) => {
        setInput(e);
    }

    const handleFurnishChange = (e) => {
        setFurnish(e);
    }

    const handleMinRentChange = (e) => {
        if (e > maxRent) {
            setIsError(true);
            setMinRent(e);
            return;
        }
        setMinRent(e);
        setIsError(false);
    }

    const handleMaxRentChange = (e) => {
        if (e < minRent) {
            setIsError(true);
            setMaxRent(e);
            return;
        }
        setMaxRent(e);
        setIsError(false);
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

            if (!!input['propertyState']) {
                console.log("testing1")
                query = query.eq('propertyState', input['propertyState']);
            }

            if (!!input['searchInput']) {
                console.log("testing2")
                const searchInput = input['searchInput'];
                query = query.or(
                    `propertyName.eq."${searchInput}",propertyAddress.eq."${searchInput}",propertyCity.eq."${searchInput}"`,
                );
            }

            if (!!input['propertyFurnishType']) {
                console.log("testing3")
                query = query.eq('propertyFurnishType', input['propertyFurnishType']);
            }

            if (!!input['propertyCategory']) {
                console.log("testing4")
                query = query.eq('propertyCategory', input['propertyCategory']);
            }

            if (input["minRent"] > 0) {
                console.log("testing5")
                query = query.gte('propertyPrice', input["minRent"]);
            }

            if (input["maxRent"] > 0) {
                console.log("testing6")
                query = query.lte('propertyPrice', input["maxRent"]);
            }

            if (input["propertyBuildupSize"] > 0) {
                console.log("testing7")
                query = query.gte('propertySquareFeet', input["propertyBuildupSize"]);
            }

            //Sort by option
            if (sortBy === 'ascDate') {
                query = query.order('postDate', { ascending: true });
            } else if (sortBy === 'descDate') {
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
                    minRent,
                    maxRent,
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
        const { data } = await supabase.storage
            .from('post')
            .list(`${post.postID}/Property`);

        if (data) {
            setFirstImages((prevState) => ({
                ...prevState,
                [post.postID]: data[0],
            }));
        }
    };



    const renderedPost = posts.map((post) => {
        let bgColor;
        const firstImage = firstImages[post.postID];

        if (post.propertyCategory === 'Room') {
            bgColor = '#d5def5';
        } else {
            bgColor = '#8594e4';
          
        }

        return (
            <div key={post.postID} className='postContainer'>
                <Row >
                    <Col span={24} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: "300px", paddingLeft: '10px' }}>
                        {firstImage &&
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
                            <Col span={22} style={{ fontSize: '25px', fontWeight: 'normal' }}>{post.propertyName} - <span style={{ fontStyle: 'italic', fontWeight: '', fontSize: '20px' }}>{post.propertyState}</span></Col>
                            <Col span={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: bgColor, fontWeight: 'bold' }}>{post.propertyCategory}</Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{ fontSize: '20px', fontWeight: 'lighter', marginTop: '5px' }}><TfiLocationPin size={15} /> {post.propertyAddress},{post.propertyPostcode},{post.propertyCity},{post.propertyState}</Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{ fontSize: '20px', marginTop: '5px', fontStyle: 'italic' }}>RM{post.propertyPrice}/month </Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{ fontSize: '16px', marginTop: '5px', fontStyle: 'italic' }}>
                                <span style={{ marginRight: '10px' }}>&bull;</span>
                                {post.propertyFurnishType}
                                <span style={{ marginLeft: '20px', marginRight: '10px' }}>&bull;</span>
                                Built-up size: {post.propertySquareFeet} sq.ft.

                                {post.propertyCategory === 'Room' ?
                                    <>
                                        <span style={{ marginLeft: '20px', marginRight: '10px' }}>&bull;</span>
                                        {post.propertyRoomDetails[1].roomType}
                                    </> :
                                    <>
                                        <span style={{ marginLeft: '20px', marginRight: '10px' }}>&bull;</span>
                                        {post.propertyRoomNumber} rooms available
                                    </>
                                }
                            </Col>
                        </Row>
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <Row>
                            <Col span={6}>
                                <Link to={`/student/roomRental/${post.postID}`} state={post}>
                                    <Button
                                        type='primary'
                                        className='viewButton'>View</Button>
                                </Link>
                            </Col>
                            <Col span={18} style={{ textDecoration: 'underline', fontStyle: 'italic', display: 'flex', justifyContent: 'end', alignItems: 'end' }}>{`Posted on: ${getDateOnly(post.postDate)} (Last modified: ${getElapsedTime(post.lastModifiedDate)})`}</Col>
                        </Row>

                    </div>
                </div>
            </div>
        )
    });



    return <>
        <div style={{ margin: '10vh 0px 0px', padding: '0px 10px 0px', border: '0px solid black', boxShadow: '0px 4px 6px -2px rgba(0, 0, 0, 0.2)' }}>
            <Form
                onFinish={onFinish}
                initialValues={
                    {
                        propertyState: null,
                        propertyFurnishType: null,
                        minRent: 0,
                        maxRent: 0,
                        propertyBuildupSize: 0,
                        propertyCategory: null,
                        sortBy: null,
                        searchInput: null,
                    }
                }>
                <Row style={{ marginLeft: '10%', marginRight: '5%', height: '25px' }}>
                    <Col span={4}>
                        <Form.Item name="propertyState">
                            <StateSelection value={state} onChange={handleStateChange} style={{ width: '80%' }} />
                        </Form.Item>
                    </Col>

                    <Col span={17}>
                        <Form.Item name="searchInput">
                            <SearchInput placeholder='Search by location or property name' style={{ width: '90%' }} value={input} onChange={handleInputChange} />
                        </Form.Item>
                    </Col>

                    <Col span={3} >
                        <Form.Item>
                            <Button htmlType='submit' style={{ display: 'flex', alignItems: 'center', backgroundColor: '#6643b5', borderRadius: '0px', fontWeight: 'bold' }} type="primary" icon={<SearchOutlined />}><Col />
                                Search
                            </Button>
                        </Form.Item>
                    </Col>


                </Row>
                <Row style={{ marginLeft: '10%', marginTop: '20px' }}>
                    <Col span={3}>
                        <Form.Item name='propertyFurnishType'>
                            <FurnishTypeSelection bordered={false} value={furnish} onChange={handleFurnishChange} style={{ width: '95%' }} />
                        </Form.Item>
                    </Col>

                    <Col span={3}>
                        <Form.Item name="propertyCategory">
                            <CategorySelection value={category} onChange={handleCategoryChange} style={{ width: '80%' }} />
                        </Form.Item>
                    </Col>

                    <Col span={3}>
                        <Form.Item name="minRent">
                            <MinRentSelection value={minRent} onChange={handleMinRentChange} style={{ width: '85%' }} />
                        </Form.Item>
                    </Col>

                    <Col span={3}>
                        <Form.Item name="maxRent">
                            <MaxRentSelection value={maxRent} onChange={handleMaxRentChange} style={{ width: '85%' }} />
                        </Form.Item>
                    </Col>

                    <Col span={3}>
                        <Form.Item name="propertyBuildupSize">
                            <BuiltupSizeSelection value={size} onChange={handleSizeChange} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>

                    <Col span={7} offset={2}>
                        <Form.Item name="sortBy" label="Sort by:" style={{ display: 'inline-block' }}>
                            <PostSortingSelection value={sortBy} onChange={handleSortByChange} style={{ width: '200px' }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row style={{ marginLeft: '52%' }}>
                    <Col style={{ color: '#b80606', fontStyle: 'italic' }}>{isError && errorMessage}</Col>
                </Row>
            </Form>
        </div>

        {posts.length === 0 && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <Empty description={<span style={{ color: '#b80606', fontStyle: 'italic', fontSize: '20px' }}>No properties found. Please try refining your search.</span>} />
        </div>}

        {/* mention how many results found */}
        {posts.length > 0 && <div style={{ display: 'flex', alignItems: 'center', height: '50px', marginLeft: '10%', marginTop: '10px' }}>
            <span
                style={{
                    fontStyle: 'italic',
                    fontSize: '20px',
                    fontFamily: 'sans-serif',
                }}>
                {posts.length} results found...
            </span>
        </div>}

        {renderedPost}

    </>
};

export default RoomRental;