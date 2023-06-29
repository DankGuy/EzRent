import { Col, Image, Popconfirm, Row } from "antd";
import { AiFillEdit } from "react-icons/ai";
import { GrView } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabase-client";
import { getElapsedTime } from "../../../Components/timeUtils";


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
                    height: 'auto',
                    marginTop: '10px',
                    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                    borderRadius: '8px',
                }}
            >
                <Row>
                    <Col span={23} style={{textAlign: 'right', margin: '10px 10px 10px 0px', fontStyle: 'italic',overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                        Last modified: {getElapsedTime(post.lastModifiedDate)}
                    </Col>
                </Row>
                <Row >
                    <Col span={24} style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                        <Image style={{ justifyContent: 'center' }} height={200} src={`https://exsvuquqspmbrtyjdpyc.supabase.co/storage/v1/object/public/post/${post.postID}/${firstImage?.name}`} />
                    </Col>
                </Row>

                <Row>
                    <Col span={24} style={{paddingLeft: '10px', fontSize: '18px', fontWeight: '500', paddingRight: '10px' }}>
                        {post.propertyName}
                    </Col>
                </Row>
                <Row>
                    <Col span={24} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingLeft: '10px', paddingRight: '10px', fontSize: '16px' }}>
                        {post.propertyAddress}
                    </Col>
                </Row>
                <Row>
                    <Col span={24} style={{paddingLeft: '10px', fontSize: '16px'}}>
                        RM{post.propertyPrice}.00
                    </Col>
                </Row>
                <Row style={{paddingBottom: '10px'}}>
                    <Col span={12} style={{paddingLeft: '10px', fontSize: '16'}}>
                        {post.propertyCategory}
                    </Col>
                    <Col span={3} offset={3}>
                        <Link to={`/agent/roomRental/viewPost/${post.postID}`} state={{ post, isView: true }}>
                            <GrView size={18}/>
                        </Link>
                    </Col>
                    <Col span={3}>
                        <Link to={`/agent/roomRental/editPost/${post.postID}`} state={{ post, isView: false }}>
                            <AiFillEdit size={18} style={{color: 'black'}}/>
                        </Link>
                    </Col>
                    <Col span={3}>
                        <Popconfirm
                            title="Are you sure you want to delete this post?"
                            onConfirm={() => {
                                deletePost(post.postID);
                            }}
                        >
                            {contextHolder}

                            <MdDelete size={18}/>
                        </Popconfirm>
                    </Col>
                </Row>
            </div>
        </Col>
    )
}

export default CurrentPost;