import { Col, Image, Popconfirm, Popover, Row } from "antd";
import { FiEdit3 } from "react-icons/fi";
import { GrView } from "react-icons/gr";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabase-client";
import { getElapsedTime } from "../../../Components/timeUtils";


function CurrentPost({ post, deletePost, contextHolder }) {

    const [firstImage, setFirstImage] = useState(null);

    useEffect(() => {
        getFirstImage();
    }, []);

    //Get first image from supabase storage
    const getFirstImage = async () => {
        const { data, error } = await supabase
            .storage
            .from('post')
            .list(`${post.postID}/Property`);

        if (error) {
            console.log(error)
        }

        console.log(post.postID);
        console.log(data);

        setFirstImage(data[0]);
    }

    const popOverStyle = {
        // paddingLeft: '2px',
        padding: '0px 5px 0px 2px',
        fontSize: '16px',
        cursor: 'pointer',
        margin: '5px 0px 5px 0px',    
    };

    const content = (
        <div 
            style={{
               width: '90px',
               padding: '0px',
            }}
        >
            <Row className="popOutBox">
                <Col span={24} style={popOverStyle}>
                    <Link to={`/agent/roomRental/viewPost/${post.postID}`} state={{ post, isView: true }} style={{ color: 'black', display: 'flex', alignItems: 'center' }}>
                        <span style={{ flexGrow: 1 }}>View</span>
                        <GrView size={18} />
                    </Link>
                </Col>
            </Row>
            <Row className="popOutBox">
                <Col span={24} style={popOverStyle}>
                    <Link to={`/agent/roomRental/editPost/${post.postID}`} state={{ post, isView: false }} style={{ color: 'black', display: 'flex', alignItems: 'center' }}>
                        <span style={{ flexGrow: 1 }}>Edit</span>
                        <FiEdit3 size={18} />
                    </Link>
                </Col>
            </Row>
            <Row className="popOutBox">
                <Col span={24} style={popOverStyle}>
                    <Popconfirm
                        title="Are you sure to delete this post?"
                        onConfirm={() => deletePost(post.postID)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <span style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <span style={{ flexGrow: 1 }}>Delete</span>
                            <MdOutlineDeleteOutline size={18} />
                        </span>
                    </Popconfirm>
                </Col>
            </Row>
        </div>
    );



    return (
        <Col span={5} style={{ marginRight: '40px', marginBottom: '30px' }} key={post.postID}>
            <div
                style={{
                    height: 'auto',
                    marginTop: '10px',
                    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                    borderRadius: '5px',
                    backgroundColor: 'white',
                    border: '1px solid #e8e8e8',
                    
                }}
            >
                <Row>
                    <Col span={23} style={{ textAlign: 'right', margin: '5px 5px 5px 0px', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        Last modified: {getElapsedTime(post.lastModifiedDate)}
                    </Col>
                </Row>
                <Row >
                    {firstImage && <Col span={24} style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                        <Image style={{ justifyContent: 'center' }} height={200} src={`https://exsvuquqspmbrtyjdpyc.supabase.co/storage/v1/object/public/post/${post.postID}/Property/${firstImage?.name}`} />
                    </Col>}
                </Row>
                <Row>
                    <Col span={24} style={{ paddingLeft: '15px', fontSize: '18px', fontWeight: '500', paddingRight: '10px' }}>
                        {post.propertyName}
                    </Col>
                </Row>
                <Row>
                    <Col span={24} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingLeft: '15px', paddingRight: '10px', fontSize: '16px' }}>
                        {post.propertyAddress}
                    </Col>
                </Row>
                <Row>
                    <Col span={24} style={{ paddingLeft: '15px', fontSize: '16px' }}>
                        RM{post.propertyPrice}.00
                    </Col>
                </Row>
                <Row style={{ paddingBottom: '10px' }}>
                    <Col span={12} style={{ paddingLeft: '15px', fontSize: '16' }}>
                        {post.propertyCategory}
                    </Col>

                    <Col span={2} offset={9}>
                        <Popover 
                            placement="leftTop" 
                            arrow={false} 
                            content={content} 
                            trigger="click">
                            <BsThreeDotsVertical size={18} 
                                style={{ 
                                    color: 'black',
                                    cursor: 'pointer',
                                     }} />
                        </Popover>
                    </Col>
                </Row>
            </div>
        </Col>
    )
}

export default CurrentPost;