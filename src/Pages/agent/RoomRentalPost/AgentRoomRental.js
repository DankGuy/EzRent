import { IoAddCircle } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { Col, Form, Image, Popconfirm, Row, message, Pagination, Select, Tooltip, Input } from 'antd';
import { supabase } from '../../../supabase-client';
import CurrentPost from './CurrentPost';
import PostSortingSelection from '../../../Components/PostSortingSelection';
import { BiInfoCircle } from 'react-icons/bi';



function AgentRoomRental() {

    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [draftPosts, setDraftPosts] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [sortBy, setSortBy] = useState(null);
    const [postStatus, setPostStatus] = useState('all');
    const [isFirstMount, setIsFirstMount] = useState(true);

    // Define the number of items to show per page
    const itemsPerPage = 6;
    const draftItemsPerPage = 3;

    // Define the current page state
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the start and end indexes for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;
    // Get the posts for the current page
    const currentPosts = posts.slice(startIndex, endIndex);


    const [currentDraftPage, setCurrentDraftPage] = useState(1);
    const startDraftIndex = (currentDraftPage - 1) * draftItemsPerPage;
    const endDraftIndex = currentDraftPage * draftItemsPerPage;
    const currentDraftPosts = draftPosts.slice(startDraftIndex, endDraftIndex);


    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDraftPageChange = (page) => {
        setCurrentDraftPage(page);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (isFirstMount) {
            setIsFirstMount(false);
            return;
        }
        window.scrollTo(0, 0);
    }, [posts, draftPosts]);

    //useEffect get the data from supabase and do sorting query
    useEffect(() => {
        const fetchProcessedData = async () => {

            let query = supabase.from('property_post')
                .select('*')
                .not('propertyStatus', 'cs', '{ "stage": "drafted" }')
                .not('propertyStatus', 'cs', '{ "stage": "rented" }')

            if (postStatus !== 'all')
                query = query.contains('propertyStatus', { stage: postStatus });


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
            } else if (sortBy === 'ascModifiedDate') {
                query = query.order('lastModifiedDate', { ascending: true });
            } else if (sortBy === 'descModifiedDate') {
                query = query.order('lastModifiedDate', { ascending: false });
            }
            const { data, error } = await query;

            if (error) {
                console.log(error);
                return;
            }
            setPosts(data);
        }

        fetchProcessedData();
    }, [sortBy, postStatus]);


    const createPost = () => {
        navigate("/agent/roomRental/createNewPost")
    }

    const fetchData = async () => {
        const { data, error } = await supabase
            .from('property_post')
            .select('*')
            .contains('propertyStatus', { stage: 'drafted' });

        if (error) {
            console.log(error);
            return;
        }

        console.log(data);
        setDraftPosts(data);

        const { data: data2, error: error2 } = await supabase
            .from('property_post')
            .select('*')
            .not('propertyStatus', 'cs', '{ "stage": "drafted" }')
            .not('propertyStatus', 'cs', '{ "stage": "rented" }');

        if (error2) {
            console.log(error2);
            return;
        }

        console.log(data2);
        setPosts(data2);
    }

    const deletePost = async (postID) => {
        const { data, error } = await supabase
            .from('property_post')
            .delete()
            .eq('postID', postID)

        if (error) {
            console.log(error)
        }
        fetchData();
        setSortBy(null);
        setPostStatus('all');

        messageApi.open({
            type: 'success',
            content: 'Delete successful.',
        });
    }

    const uploadPost = async (postID) => {
        console.log(postID);
        const { data, error } = await supabase
            .from('property_post')
            .update({
                propertyStatus: {
                    stage: 'pending',
                    status: "inactive"
                }
            })
            .eq('postID', postID);

        if (error) {
            console.log(error);
        }

        fetchData();

        setSortBy(null);
        setPostStatus('all');

        //display successful message
        message.success('Success! Your post has been submitted for admin approval. Please wait for further updates.');
    }


    const handleSortBy = (value) => {
        setSortBy(value);
        setIsFirstMount(true);
    }

    const handleStatusChange = (value) => {
        console.log(value);
        setPostStatus(value);
        setIsFirstMount(true);
    }

    const handlePostSearch = async (e) => {
        const postID = e.target.value;

        let query = supabase.from('property_post')
            .select('*')
            .not('propertyStatus', 'cs', '{ "stage": "drafted" }')
            .not('propertyStatus', 'cs', '{ "stage": "rented" }');

        if (postID !== '') {
            query = query.eq('postID', postID);
        }

        try {
            const { data, error } = await query;

            if (error) {
                console.log(error);
                setPosts([]);
                setIsFirstMount(true);

                return;
            }

            setPosts(data);
            setIsFirstMount(true);

        } catch (error) {
            console.log(error);
            setPosts([]);
            setIsFirstMount(true);

        }

    };





    return <>
        <h1 style={{ fontSize: '25px' }}>Room Rental Post</h1>
        <div >
            <Row>
                <Col span={24}>
                    <div
                        style={{
                            width: '250px',
                            height: '270px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            backgroundColor: '#E7E7E7'
                        }}
                        onClick={createPost}
                    >
                        <IoAddCircle size={50} />
                        <p>Create new post</p>
                    </div>
                </Col>
            </Row>
            <br />
            <Row>
                <Col span={24}>
                    <h1 style={{ fontSize: '25px' }}>Draft Post</h1>
                </Col>
            </Row>
            <div>
                <Row>
                    {currentDraftPosts.map((post) => (
                        <CurrentPost post={post} key={post.postID} deletePost={deletePost} uploadPost={uploadPost} contextHolder={contextHolder} />
                    ))}
                </Row>
                <Pagination
                    current={currentDraftPage}
                    pageSize={draftItemsPerPage}
                    total={draftPosts.length}
                    onChange={handleDraftPageChange}
                    showTotal={() => `Total ${draftPosts.length} items`}
                />
            </div>

            <br />
            <Row>
                <Col span={4} style={{ display: 'flex', alignItems: 'center' }}>
                    <h1 style={{ fontSize: '25px' }}>Current Post</h1>

                    <Tooltip
                        title={
                            <>
                                <p>This page displays all posts except for drafts. Posts can have one of the following statuses:</p>
                                <ul style={{ marginInlineStart: '-20px' }}>
                                    <li>Approved: The post has been approved by the admin.</li>
                                    <li>Rejected: The post was rejected by the admin.</li>
                                    <li>Pending: The post is awaiting approval.</li>
                                </ul>
                            </>
                        }
                        placement="right"
                        overlayStyle={{ maxWidth: '600px' }}
                    >
                        <span style={{ marginLeft: '10px' }}> <BiInfoCircle size={20} style={{ cursor: 'pointer' }} /></span>
                    </Tooltip>
                </Col>
                <Col span={5} offset={1} style={{ display: 'flex', alignItems: 'end' }}>
                    <Form>
                        <Form.Item name="search" label="Search">
                            <Input placeholder="Enter post ID" bordered={false}
                                style={{
                                    borderBottom: '1px solid #d9d9d9',
                                    borderRadius: '0px',
                                    width: '100%'
                                }}
                                onPressEnter={handlePostSearch}
                            />
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={3} offset={1} style={{ display: 'flex', alignItems: 'end' }}>
                    <Form>
                        <Form.Item name="status" label="Filter status">
                            <Select
                                options={[
                                    { value: 'all', label: 'All' },
                                    { value: 'approved', label: 'Approved' },
                                    { value: 'pending', label: 'Pending' },
                                    { value: 'rejected', label: 'Rejected' },
                                ]}
                                bordered={false}
                                style={{ width: '120px' }}
                                placeholder="All"
                                value={postStatus}
                                onChange={handleStatusChange}
                            />
                        </Form.Item>
                    </Form>
                </Col>

                <Col span={4} offset={2} style={{ display: 'flex', alignItems: 'end' }}>
                    <Form>
                        <Form.Item name="sort" label="Sort by">
                            <PostSortingSelection
                                style={{ width: '240px' }}
                                value={sortBy}
                                onChange={handleSortBy}
                                additionalOption={[
                                    { value: 'default', label: 'Default' },
                                    { value: 'ascModifiedDate', label: 'Last modified date (old to new)' },
                                    { value: 'descModifiedDate', label: 'Last modified date (new to old)' },
                                ]} />
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
            <Row>

            </Row>
            <div>
                <Row>
                    {
                        posts.length === 0 ?

                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                                <h1 style={{ fontSize: '25px' }}>No post found</h1>
                            </div>
                            :
                            currentPosts.map((post) => (
                                <CurrentPost post={post} key={post.postID} deletePost={deletePost} contextHolder={contextHolder} />
                            ))
                    }
                </Row>
                <Pagination
                    current={currentPage}
                    pageSize={itemsPerPage}
                    total={posts.length}
                    onChange={handlePageChange}
                    showTotal={() => `Total ${posts.length} items`}
                />
            </div>

        </div>

    </>
}

export default AgentRoomRental;