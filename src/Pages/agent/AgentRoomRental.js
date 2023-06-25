import { IoAddCircle } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from "../../supabase-client";
import { useEffect, useState } from 'react';
import { Col, Popconfirm, Row, message } from 'antd';
import { GrView } from 'react-icons/gr'
import { AiFillEdit } from 'react-icons/ai'
import { MdDelete } from 'react-icons/md'


function AgentRoomRental() {

    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();

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


    const renderedPosts = posts.map((post) => {
        return (
            <Col span={5} style={{ marginRight: '30px', marginBottom: '30px' }} key={post.postID}>
                <div
                    style={{
                        width: '250px',
                        height: '270px',
                        border: '1px red solid',
                        marginTop: '10px'
                    }}
                >
                    <Row>
                        <Col span={24}>
                            ID: {post.postID}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} style={{ width: '100%', height: '130px', border: '1px solid red' }}>
                            image
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            {post.propertyName}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {post.propertyAddress}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            RM{post.propertyPrice}.00
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            {post.propertyCategory}
                        </Col>
                        <Col span={4}>
                            <Link to={`/agent/roomRental/viewPost/${post.postID}`} state={{ post, isView: true }}>
                                <GrView />
                            </Link>
                        </Col>
                        <Col span={4}>
                            <Link to={`/agent/roomRental/editPost/${post.postID}`} state={{ post, isView: false }}>
                                <AiFillEdit />
                            </Link>
                        </Col>
                        <Col span={4}>
                            <Popconfirm
                                title="Are you sure you want to delete this post?"
                                onConfirm={() => {
                                    deletePost(post.postID);
                                }}
                            >
                                {contextHolder}

                                <MdDelete />
                            </Popconfirm>
                        </Col>
                    </Row>
                </div>
            </Col>
        )
    });

    useEffect(() => {
        fetchData();
    }, []);


    useEffect(() => {   
        window.scrollTo(0,0);
    }, [posts]);

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
                {renderedPosts}
            </Row>

        </div>

    </>
}

export default AgentRoomRental;