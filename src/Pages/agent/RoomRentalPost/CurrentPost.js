import { Col, Image, Popconfirm, Popover, Row, Tag, message } from "antd";
import { FiEdit3 } from "react-icons/fi";
import { GrDocumentPdf, GrView } from "react-icons/gr";
import { MdOutlineDeleteOutline, MdOutlinePublish } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabase-client";
import { getElapsedTime } from "../../../Components/timeUtils";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    DollarOutlined,
    SyncOutlined,
} from '@ant-design/icons';



function CurrentPost({ post, deletePost, uploadPost, contextHolder }) {

    const [firstImage, setFirstImage] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

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
                width: '100%',
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
            {post.propertyStatus.stage === 'approved' &&
                <Row className="popOutBox">
                    <Col span={24} style={popOverStyle}>
                        <Link to={`/agent/roomRental/###`} state={{ post }} style={{ color: 'black', display: 'flex', alignItems: 'center' }}>
                            <span style={{ flexGrow: 1, marginRight: '10px' }}>Process Rental</span>
                            <GrDocumentPdf size={18} />
                        </Link>
                    </Col>
                </Row>
            }

            {post.propertyStatus.stage === 'drafted' &&
                
                    <Row className="popOutBox">
                        <Col span={24} style={popOverStyle}
                            onClick={
                                () => {
                                    uploadPost(post.postID);
                                    setIsOpen(!isOpen);
                                }}>
                            <span
                                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <span style={{ flexGrow: 1 }}>Post</span>
                                <MdOutlinePublish size={18} />
                            </span>
                        </Col>
                    </Row>

                }
        </div>
    );

    const tagStatus = () => {

        if (post.propertyStatus.stage === 'drafted') {
            return;
        } else if (post.propertyStatus.stage === 'approved') {
            return (
                <Tag icon={<CheckCircleOutlined />} color="success">Approved</Tag>
            );
        } else if (post.propertyStatus.stage === 'rejected') {
            return (
                <Tag icon={<CloseCircleOutlined />} color="error">Rejected</Tag>
            );
        } else if (post.propertyStatus.stage === 'pending') {
            return (
                <Tag icon={<SyncOutlined spin />} color="processing">Pending</Tag>
            );
        } else if (post.propertyStatus.stage === 'rented') {
            return (
                <Tag icon={<DollarOutlined />} color="warning">Rented</Tag>
            );
        }
    }

    return (
        <Col span={6} style={{ marginRight: '70px', marginBottom: '30px' }} key={post.postID}>
            <div
                style={{
                    height: 'auto',
                    marginTop: '10px',
                    backgroundColor: '#ffffff', //fafafa f2f3f3
                    borderCollapse: 'separate',
                    borderSpacing: '0',
                    boxSizing: 'border-box',
                    boxShadow: '0 -1px 1px 0 rgba(0, 28, 36, .3), 0 1px 1px 0 rgba(0, 28, 36, .3), 1px 1px 1px 0 rgba(0, 28, 36, .15), -1px 1px 1px 0 rgba(0, 28, 36, .15)',
                    fontFamily: 'var(--font-family-base-m6jzpk, "Amazon Ember", "Helvetica Neue", Roboto, Arial, sans-serif)',
                }}
            >
                <Row>
                    <Col span={3} style={{ margin: '5px 0px 5px 5px' }}>
                        {tagStatus()}
                    </Col>
                    <Col span={20} style={{ fontSize: '13px', textAlign: 'right', margin: '5px 5px 5px 0px', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        Last modified: {getElapsedTime(post.lastModifiedDate)}
                    </Col>
                </Row>
                <Row >
                    {firstImage && <Col span={24} style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                        <Image style={{ justifyContent: 'center' }} height={200} src={`https://exsvuquqspmbrtyjdpyc.supabase.co/storage/v1/object/public/post/${post.postID}/Property/${firstImage?.name}`} />
                    </Col>}
                </Row>
                <Row>
                    <Col span={24} style={{ paddingLeft: '15px', fontSize: '13px' }}>
                        ID: {post.postID}
                    </Col>
                </Row>
                <Row>
                    <Col span={24}
                        style={{
                            paddingLeft: '15px',
                            fontSize: '18px',
                            fontWeight: '700',
                            letterSpacing: 'normal',
                            lineHeight: '22px',
                            paddingRight: '10px'
                        }}>
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
                            style={{
                                border: '1px solid blue',
                            }}
                            content={content}
                            onOpenChange={() => setIsOpen(!isOpen)}
                            open={isOpen}
                            trigger="click">
                            <span>
                                <BsThreeDotsVertical size={18}
                                    style={{
                                        color: 'black',
                                        cursor: 'pointer',
                                    }} />
                            </span>
                        </Popover>
                    </Col>
                </Row>
            </div>
        </Col>
    )
}

export default CurrentPost;