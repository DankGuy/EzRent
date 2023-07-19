import { IoAddCircle } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { Col, Form, Image, Popconfirm, Row, message, Pagination } from 'antd';
import { supabase } from '../../../supabase-client';
import CurrentPost from './CurrentPost';
import PostSortingSelection from '../../../Components/PostSortingSelection';



function AgentRoomRental() {

    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [draftPosts, setDraftPosts] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [sortBy, setSortBy] = useState(null);
    const [isFirstMount, setIsFirstMount] = useState(true);

    // Define the number of items to show per page
    const itemsPerPage = 8;
    const draftItemsPerPage = 4;

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
    }, [posts]);

    //useEffect get the data from supabase and do sorting query
    useEffect(() => {
        const fetchSortedData = async () => {

            let query = supabase.from('property_post')
                .select('*')
                .not('propertyStatus', 'cs' , '{ "stage": "drafted" }');

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

        fetchSortedData();
    }, [sortBy]);

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
            .not('propertyStatus', 'cs' , '{ "stage": "drafted" }');

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

        messageApi.open({
            type: 'success',
            content: 'Delete successful.',
        });
    }

    const handleSortBy = (value) => {
        setSortBy(value);
        setIsFirstMount(true);
    }

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
                        <CurrentPost post={post} key={post.postID} deletePost={deletePost} contextHolder={contextHolder} />
                    ))}
                </Row>
                <Pagination
                    current={currentDraftPage}
                    pageSize={draftItemsPerPage}
                    total={draftPosts.length}
                    onChange={handleDraftPageChange}
                    showQuickJumper
                    showTotal={() => `Total ${draftPosts.length} items`}
                />
            </div>

            <br />
            <Row>
                <Col span={14}>
                    <h1 style={{ fontSize: '25px' }}>Current Post</h1>
                </Col>
                <Col span={8} offset={2} style={{ display: 'flex', alignItems: 'end' }}>
                    <Form>
                        <Form.Item name="sort" label="Sort by">
                            <PostSortingSelection
                                style={{ width: '250px' }}
                                value={sortBy}
                                onChange={handleSortBy}
                                additionalOption={[
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
                    {currentPosts.map((post) => (
                        <CurrentPost post={post} key={post.postID} deletePost={deletePost} contextHolder={contextHolder} />
                    ))}
                </Row>
                <Pagination
                    current={currentPage}
                    pageSize={itemsPerPage}
                    total={posts.length}
                    onChange={handlePageChange}
                    showQuickJumper
                    showTotal={() => `Total ${posts.length} items`}
                />
            </div>

        </div>

    </>
}

export default AgentRoomRental;