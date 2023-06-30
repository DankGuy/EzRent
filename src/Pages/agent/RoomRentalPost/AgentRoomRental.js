import { IoAddCircle } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { Col, Form, Image, Popconfirm, Row, message } from 'antd';
import { supabase } from '../../../supabase-client';
import CurrentPost from './CurrentPost';
import PostSortingSelection from '../../../Components/PostSortingSelection';



function AgentRoomRental() {

    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [sortBy, setSortBy] = useState(null);
    const [isFirstMount, setIsFirstMount] = useState(true);

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

            let query = supabase.from('property_post').select('*');

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
            .select('*');

        setPosts(data);
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
        <div>
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
            <Row style={{ border: '1 solid red' }}>
                <Col span={12}>
                    <h1 style={{ fontSize: '25px' }}>Current Post</h1>
                </Col>
                <Col span={8} offset={4} style={{ display: 'flex', alignItems: 'end' }}>
                    <Form>
                        <Form.Item name="sort" style={{ width: '100%' }} label="Sort by">
                            <PostSortingSelection
                                style={{ width: '60%' }}
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
            <Row>
                {posts.map((post) => (
                    <CurrentPost post={post} key={post.postID} deletePost={deletePost} contextHolder={contextHolder} />
                ))}
            </Row>

        </div>

    </>
}

export default AgentRoomRental;