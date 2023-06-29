import { IoAddCircle } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { Col, Image, Popconfirm, Row, message } from 'antd';
import { supabase } from '../../../supabase-client';
import CurrentPost from './CurrentPost';



function AgentRoomRental() {

    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();

    
    useEffect(() => {
        fetchData();
    }, []);


    useEffect(() => {
        window.scrollTo(0, 0);
    }, [posts]);

    const createPost = () => {
        console.log("hi")
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


        // window.location.reload();
        fetchData();

        messageApi.open({
            type: 'success',
            content: 'Delete successful.',
        });
    }


    return <>
        <h1>Room Rental Post</h1>

        <div>
            <Row>
                <Col span={24}>
                    <div
                        style={{
                            width: '250px',
                            height: '270px',
                            border: '1px red solid',
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
            <h1>Current Post</h1>
            <Row>
                {posts.map((post) => (
                    <CurrentPost post={post} key={post.postID} deletePost={deletePost} contextHolder={contextHolder} />
                ))}
            </Row>

        </div>

    </>
}

export default AgentRoomRental;