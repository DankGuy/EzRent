import SearchInput from '../../Components/SearchInput'
import { Col, Row, Button, Form } from 'antd';
import { Link } from 'react-router-dom'
import { SearchOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import FurnishTypeSelection from '../../Components/FurnishTypeSelection';
import MinRentSelection from '../../Components/MinRentSelection';
import MaxRentSelection from '../../Components/MaxRentSelection';
import BuiltupSizeSelection from '../../Components/BuiltupSizeSelection';
import StateSelection from '../../Components/StateSelection';
import { createClient } from '@supabase/supabase-js';
import CategorySelection from '../../Components/CategorySelection';
import PostSortingSelection from '../../Components/PostSortingSelection';
import {TfiLocationPin} from 'react-icons/tfi'
import './RoomRental.css'


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

    const supabase = createClient(
        'https://exsvuquqspmbrtyjdpyc.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4c3Z1cXVxc3BtYnJ0eWpkcHljIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODYyNzMxNDgsImV4cCI6MjAwMTg0OTE0OH0.vtMaXrTWDAluG_A-68pvQlSQ6GAskzADYfOonmCXPoo'
    );

    const [posts, setPost] = useState([]);

    const fetchFromSupabase = async (input) => {
        // Make a query to search your Supabase table based on the provided value
        try {
            const {
                searchInput, propertyBuiltupSize, propertyCategory,
                propertyCity, propertyDescription, propertyFacility,
                propertyFurnish, propertyFurnishType, propertyImage,
                propertyName, propertyPostcode, propertyRental,
                propertyState, propertyType, roomSquareFeet,
                roomType, masterRoomNum, mediumRoomNum, smallRoomNum } = input;

            let query = supabase.from('property_post').select('*, agent(*)');

            if (!!propertyState) {
                console.log("not null")
                query = query.eq('propertyState', propertyState);
            }

            if (!!searchInput) {
                query = query.ilike('propertyName', `%${searchInput}%`);
                query = query.ilike('propertyAddress', `%${searchInput}%`);
                query = query.ilike('propertyCity', `%${searchInput}%`);
            }

            if (!!propertyFurnishType) {
                query = query.eq('propertyFurnishType', propertyFurnishType);
            }

            if (!!propertyCategory) {
                query = query.eq('propertyCategory', propertyCategory);
            }

            if (minRent > 0) {
                query = query.gte('propertyPrice', minRent);
            }

            if (maxRent > 0) {
                query = query.lte('propertyPrice', maxRent);
            }

            if (propertyBuiltupSize > 0) {
                query = query.gte('propertySquareFeet', propertyBuiltupSize);
            }

            //Sort by option
            if (sortBy === 'ascDate') {
                query = query.order('postDate', { ascending: true }).order('postTime', { ascending: true });
            } else if (sortBy === 'descDate') {
                query = query.order('postDate', { ascending: false }).order('postTime', { ascending: false });
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

            console.log("i am here");
            console.log(data);
            setPost(data);

            // Store the searched posts in local storage
            localStorage.setItem('searchedPosts', JSON.stringify(data));
            console.log(posts)

        } catch (error) {
            console.error('An error occurred:', error);
        }

    };

    // Retrieve the searched posts from local storage
    useEffect(() => {
        const storedPosts = localStorage.getItem('searchedPosts');
        console.log(JSON.parse(storedPosts))
        if (storedPosts) {
            setPost(JSON.parse(storedPosts));
        }
    }, []);

    // Show the immediate change when choose different sort by option
    useEffect(() => {
        console.log("haha")
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
            } catch (error) {
                console.error('An error occurred:', error);
            }
        };

        fetchData();
    }, [sortBy]);

    const renderedPost = posts.map((post) => {

        let bgColor;
        let addDesc;

        if (post.propertyCategory === 'Room') {
            bgColor = '#d5def5';
            addDesc = post.propertyRoomType;
        } else {
            bgColor = '#8594e4';
            const [masterRoom, mediumRoom, smallRoom] = post.propertyRoomNumber;
            addDesc = `${masterRoom} Master room, ${mediumRoom} Medium room, ${smallRoom} Small room`;

        }

        return (
            <div key={post.postID} className='postContainer'>
                <div style={{ border: '2px solid red', margin: '10px', width: '30%' }}></div>
                <div className='postDescription'>
                    <div>
                        <Row>
                            <Col span={22} style={{ fontSize: '25px', fontWeight: 'normal' }}>{post.propertyName} - <span style={{fontStyle: 'italic', fontWeight: '', fontSize: '20px'}}>{post.propertyState}</span></Col>
                            <Col span={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: bgColor, fontWeight: 'bold' }}>{post.propertyCategory}</Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{ fontSize: '20px', fontWeight: 'lighter', marginTop: '5px' }}><TfiLocationPin size={15}/> {post.propertyAddress},{post.propertyPostcode},{post.propertyCity},{post.propertyState}</Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{ fontSize: '20px', marginTop: '5px', fontStyle: 'italic' }}>RM{post.propertyPrice}/month </Col>
                        </Row>
                        
                        <Row>
                            <Col span={24} style={{ fontSize: '18px', marginTop: '5px' }}>{addDesc}</Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{ fontSize: '16px', marginTop: '5px', fontStyle: 'italic' }}>
                                <span style={{ marginRight: '10px' }}>&bull;</span>
                                {post.propertyFurnishType}
                                <span style={{ marginLeft: '20px', marginRight: '10px' }}>&bull;</span>
                                Built-up size: {post.propertySquareFeet} sq.ft.
                            </Col>
                        </Row>
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <Row>
                            <Col span={12}>
                                <Link to={`/student/roomRental/${post.postID}`} state={post}>
                                    <Button
                                       type='primary'
                                        className='viewButton'>View</Button>
                                </Link>
                            </Col>
                            <Col span={12} style={{ textDecoration: 'underline', fontStyle: 'italic', display: 'flex', justifyContent: 'end', alignItems: 'end' }}>Posted on: {post.postDate} {post.postTime}</Col>
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

        {renderedPost}

    </>
};

export default RoomRental;