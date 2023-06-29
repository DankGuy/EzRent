import { Col, Image, Popconfirm, Row } from "antd";
import { AiFillEdit } from "react-icons/ai";
import { GrView } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabase-client";


function CurrentPost({post, deletePost, contextHolder}) {

    const [firstImage, setFirstImage] = useState(null);

    useEffect(() => {
        getFirstImage();
    }, []);

    //Get first image from supabase storage
    const getFirstImage = async () => {
        const { data, error } = await supabase
            .storage
            .from('post')
            .list(`${post.postID}/`);

        if (error) {
            console.log(error)
        }

        setFirstImage(data[0]);
    }

    return (
        <Col span={5} style={{ marginRight: '30px', marginBottom: '30px' }} key={post.postID}>
            <div
                style={{
                    width: '250px',
                    height: 'auto',
                    border: '1px red solid',
                    marginTop: '10px'
                }}
            >
                <Row>
                    <Col span={24}>
                        ID: {post.postID}
                    </Col>
                </Row>
                <Row >
                    <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
                        <Image style={{ justifyContent: 'center' }} height={200} src={`https://exsvuquqspmbrtyjdpyc.supabase.co/storage/v1/object/public/post/${post.postID}/${firstImage?.name}`} />
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
}

export default CurrentPost;