import { Button, Col, Image, Row } from 'antd';
import { BsCurrencyDollar } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../../supabase-client';


function PostCarousel({ post }) {

    const [firstImage, setFirstImage] = useState(null);

    useEffect(() => {
        getFirstImage(post);
    }, []);

    useEffect(() => {
        setFirstImage(null);
        getFirstImage(post);
    }, [post]);


    //Get the first image from supabase storage with id = postID
    const getFirstImage = async (post) => {
        const { data, error } = await supabase.storage.from('post').list(post.postID);

        if (error) {
            console.log(error);
            return;
        }
        if (data) {
            setFirstImage(data[0]);
        }
    }

   

    return (<Col span={7} style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', backgroundColor: 'white', position: 'relative', margin: '10px 20px', height: 'auto', width: '380px' }}>
        <div
            style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '20%',
                height: '8%',
                backgroundColor: '#d5def5',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontWeight: 'bold',
                zIndex: '300',
            }}>
            {post.propertyCategory}
        </div>
        <Row >
            {firstImage && 
            <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
                <Image style={{ justifyContent: 'center' }} height={200} 
                    src={`https://exsvuquqspmbrtyjdpyc.supabase.co/storage/v1/object/public/post/${post.postID}/${firstImage?.name}`} 
                    onError={()=>{console.log("error")}}/>
            </Col>}
        </Row>
        <div style={{ margin: '10px' }}>
            <Row>
                <Col span={24} style={{ fontSize: '20px' }}><BsCurrencyDollar size={15} />Rental: RM{post.propertyPrice}.00</Col>
            </Row>
            <br />
            <Row>
                <Col span={24} style={{ fontSize: '18px', marginLeft: '0px' }}>{post.propertyName}</Col>
            </Row>
            <Row>
                <Col span={24} style={{ fontSize: '16px', marginLeft: '0px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {post.propertyAddress}
                </Col>

            </Row>
            <Row>
                <Col span={24} style={{ fontSize: '16px', marginLeft: '0px' }}>{post.propertyState}</Col>
            </Row>
            <br />
            <Row>
                <Col span={24} style={{ fontSize: '16px' }}>{post.propertyType}</Col>
            </Row>
            <Row>
                <Col span={10} style={{ fontSize: '14px', fontStyle: 'italic' }}>
                    <span style={{ marginRight: '3px' }}>&bull;</span>{post.propertyFurnishType}
                </Col>
                <Col span={14} style={{ fontSize: '14px', fontStyle: 'italic' }}>
                    <span style={{ marginRight: '3px' }}>&bull;</span>Built-up size: {post.propertySquareFeet}sq.ft.
                </Col>
            </Row>
            <Row style={{ margin: '10px 0px' }}>
                <Col span={12}>
                    <Link to={`/student/roomRental/${post.postID}`} state={post}>
                        <Button
                            type="primary"
                            className='viewButton'>View</Button>
                    </Link>
                </Col>
                <Col span={11} style={{ fontSize: '16px', marginLeft: '0px', display: 'flex', justifyContent: 'end', alignItems: 'end' }}>{post.agent.name}</Col>

            </Row>
        </div>
    </Col>

    )
}

export default PostCarousel;