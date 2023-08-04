import { Breadcrumb, Button, Col, Empty, FloatButton, Form, Row, Slider } from "antd";
import GenderSelection from "../../../Components/GenderSelection";
import RoomResourceSelection from "../../../Components/RoomResourceSelection";
import { useEffect, useState } from "react";
import RoommatePostLayout from "./RoommatePostLayout";
import { AiOutlineHistory } from "react-icons/ai";
import { BiEditAlt, BiMenu } from "react-icons/bi";
import CreateRoommatePost from "./CreateRoommatePost";
import "./Roommate.css"
import { supabase } from "../../../supabase-client";

function Roommate() {

    const [form] = Form.useForm();

    const [listings, setListings] = useState([]);

    useEffect(() => {
        form.resetFields();


        const fetchListings = async () => {
            const { data, error } = await supabase
                .from('roommate_post')
                .select('*, student(*), rental_agreement(*, postID(*))')
                .order('postDate', { ascending: false })

            if (error) {
                console.log(error);
                return;
            }

            console.log(data);
            setListings(data);
        }

        fetchListings();
    }, []);

    const onFinish = async (values) => {

        //filter post
        let { data, error } = await supabase
            .from('roommate_post')
            .select('*, student(*), rental_agreement(*, postID(*))');



        if (error) {
            console.log(error);
            return;
        }

        
        if (values.genderSelection === 'Male' || values.genderSelection === 'Female') {
            data = data.filter(post => post.student && post.student.gender === values.genderSelection);
        }

        if (values.roomSelection === 'yes' || values.roomSelection === 'no') {

            if (values.roomSelection === 'yes') {
                data = data.filter(post => post.rental_agreement !== null);
            } else {
                data = data.filter(post => post.rental_agreement === null);
            }
        }

        console.log(data);
        setListings(data);
    }

    const onFinishFailed = (errorInfo) => {
        console.log(errorInfo);
    }

    const [postModal, setPostModal] = useState(false);

    const handleCreateModal = () => {
        setPostModal(true);
    }

    const handleViewListings = () => {
        window.location.href = '/student/roommate/listings';
    }

    return (<>
        <div style={{ margin: '2% 0px 0px', padding: '0px 10px 0px', border: '0px solid black', boxShadow: '0px 4px 6px -2px rgba(0, 0, 0, 0.2)' }}>
            <Form
                name="search"
                form={form}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                initialValues={
                    {
                        genderSelection: null,
                        roomSelection: null,
                    }
                }>
                <Row style={{marginLeft: '10%'}}>
                    <Col span={4}>
                        <Form.Item name="genderSelection">
                            <GenderSelection bordered={true} style={{ width: '80%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item name="roomSelection">
                            <RoomResourceSelection bordered={true} style={{ width: '80%' }} />
                        </Form.Item>
                    </Col>
                    {/* <Col span={4}>
                    <Form.Item name="priceRange">
                        <Slider range min={0} max={1000} defaultValue={[0, 1000]} step={100} />
                    </Form.Item>
                </Col> */}
                    <Col span={2}>
                        <Button type="primary" className="viewButton" htmlType="submit" style={{ width: '80%' }}>
                            Search
                        </Button>
                    </Col>
                </Row>



            </Form>
        </div>

        {listings.length === 0 && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <Empty description={<span style={{ color: '#b80606', fontStyle: 'italic', fontSize: '20px' }}>No listings found. Please try refining your search.</span>} />
        </div>}

        <Row style={{ margin: '2% 10%' }}>
            {listings.map((listing, index) => {
                return (
                    <Col span={10} key={index} style={{ marginRight: '8%' }}>
                        <RoommatePostLayout listing={listing} />
                    </Col>
                )
            })}
        </Row>



        <FloatButton.Group
            trigger="click"
            style={{
                right: '24',
                bottom: '24',
                position: 'fixed',
                color: 'white',
            }}
            className="floatButton"
            // type="primary"
            icon={<BiMenu style={{ color: 'white' }} />}
        >
            <FloatButton type="primary" tooltip="Create Post" icon={<BiEditAlt />} onClick={handleCreateModal} />
            <FloatButton type="primary" tooltip="My Listings" icon={<AiOutlineHistory />} onClick={handleViewListings} />
        </FloatButton.Group>

        <CreateRoommatePost value={postModal} onChange={setPostModal} />

    </>
    )
}

export default Roommate;