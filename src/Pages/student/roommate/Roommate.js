import { Breadcrumb, Button, Col, Empty, FloatButton, Form, Row, Slider, Spin } from "antd";
import GenderSelection from "../../../Components/GenderSelection";
import RoomResourceSelection from "../../../Components/RoomResourceSelection";
import { useEffect, useState } from "react";
import RoommatePostLayout from "./RoommatePostLayout";
import { AiOutlineHistory } from "react-icons/ai";
import { BiEditAlt, BiMenu } from "react-icons/bi";
import CreateRoommatePost from "./CreateRoommatePost";
import "./Roommate.css"
import { supabase } from "../../../supabase-client";
import ScrollToTopButton from "../../../Components/ScrollToTopButton";
import { SlPeople } from "react-icons/sl";
import { useNavigate } from "react-router-dom";

function Roommate() {

    const [form] = Form.useForm();

    const [listings, setListings] = useState([]);
    const [trigger, setTrigger] = useState(0);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const fetchListings = async () => {
        setLoading(true);
        const userID = (await supabase.auth.getUser()).data.user.id;

        let { data, error } = await supabase
            .from('roommate_post')
            .select('*, student(*), rental_agreement(*, postID(*))')
            .order('postDate', { ascending: false })
            .neq('studentID', userID);

        if (error) {
            console.log(error);
            return;
        }

        for (const element of data) {
            if (element.rental_agreement !== null) {
                const propertyPostID = element.rental_agreement.postID.postID;

                const { data: allRooms, error } = await supabase
                    .from('property_room')
                    .select('*')
                    .eq('propertyPostID', propertyPostID);

                if (error) {
                    console.log(error);
                    continue; // Skip this iteration and move to the next one
                }

                console.log(allRooms);

                let isAvailable = false;
                for (let i = 0; i < allRooms.length; i++) {
                    if (allRooms[i].availableSpace > 0) {
                        isAvailable = true;
                        break;
                    }
                }

                console.log("isAvailable: " + isAvailable);

                if (!isAvailable) {
                    // You cannot remove elements directly from the 'data' array within a for...of loop
                    // Instead, create a new array with the elements you want to keep
                    // and assign it back to 'data'
                    data = data.filter(item => item !== element);
                }
            }
        }


        return data;
    }



    // useEffect(() => {
    //     form.resetFields();
    //     fetchListings();
    // }, []);

    useEffect(() => {
        form.resetFields();
        fetchListings().then((data) => {
            setListings(data);
            setLoading(false);
        });
        console.log(trigger);
    }, [trigger]);



    const onFinish = async (values) => {
        setLoading(true);
        const userID = (await supabase.auth.getUser()).data.user.id;


        //filter post
        let { data, error } = await supabase
            .from('roommate_post')
            .select('*, student(*), rental_agreement(*, postID(*))')
            .order('postDate', { ascending: false })
            .neq('studentID', userID);


        for (const element of data) {
            if (element.rental_agreement !== null) {
                const propertyPostID = element.rental_agreement.postID.postID;

                const { data: allRooms, error } = await supabase
                    .from('property_room')
                    .select('*')
                    .eq('propertyPostID', propertyPostID);

                if (error) {
                    console.log(error);
                    continue; // Skip this iteration and move to the next one
                }

                console.log(allRooms);

                let isAvailable = false;
                for (let i = 0; i < allRooms.length; i++) {
                    if (allRooms[i].availableSpace > 0) {
                        isAvailable = true;
                        break;
                    }
                }

                console.log("isAvailable: " + isAvailable);

                if (!isAvailable) {
                    // You cannot remove elements directly from the 'data' array within a for...of loop
                    // Instead, create a new array with the elements you want to keep
                    // and assign it back to 'data'
                    data = data.filter(item => item !== element);
                }
            }
        }


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
        setLoading(false);
    }

    const onFinishFailed = (errorInfo) => {
        console.log(errorInfo);
    }

    const [postModal, setPostModal] = useState(false);

    const handleCreateModal = () => {
        setPostModal(true);
    }

    const handleViewListings = () => {
        navigate('/student/roommate/myListings');
    }

    const handleViewRequest = () => {
        navigate('/student/roommate/myRequest');
    }

    const handleTrigger = () => {
        setTrigger((prev) => prev + 1);
    }




    return (<>
        <div style={{
            padding: '40px 10px 0px 10px',
            // border: '1px solid black',
            boxShadow: '0px 4px 6px -2px rgba(0, 0, 0, 0.2)',
            position: 'sticky',
            top: '45px',
            zIndex: '999',
            backgroundColor: 'white',
        }}>
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
                <Row gutter={[16, 16]} style={{ marginLeft: '10%', paddingBottom: '10px' }}>
                    <Col xs={24} sm={24} md={4}>
                        <Form.Item name="genderSelection">
                            <GenderSelection bordered={true} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={4}>
                        <Form.Item name="roomSelection">
                            <RoomResourceSelection bordered={true} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={2}>
                        <Button type="primary" className="viewButton" htmlType="submit" style={{ width: '100%' }}>
                            Search
                        </Button>
                    </Col>
                </Row>



            </Form>
        </div>

        {loading ? (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50vh',
            }}>
                <Spin />
            </div>
        ) : <>

            {listings && listings.length === 0 ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <Empty description={<span style={{ fontSize: '20px' }}>No listings found. Please try refining your search.</span>} />
            </div> :
                <div style={{ display: 'flex', alignItems: 'center', height: '50px', marginLeft: '10%', marginTop: '10px' }}>
                    <span
                        style={{
                            fontStyle: 'italic',
                            fontSize: '20px',
                            fontFamily: 'sans-serif',
                        }}>
                        {listings.length} result(s) found...
                    </span>
                </div>
            }
        </>}


        <Row style={{ margin: '0% 5% 2% 8%' }}>
            {listings.map((listing, index) => {
                return (
                    <Col
                        xs={{ span: 24 }}        // 100% width on extra small screens
                        sm={{ span: 24 }}        // 50% width on small screens
                        md={{ span: 24 }}        // 50% width on medium screens
                        lg={{ span: 11 }}        // Your current setting for large screens
                        xl={{ span: 11 }}
                        key={index} style={{ marginRight: '4%' }}>
                        <RoommatePostLayout listing={listing} />
                    </Col>
                )
            })}
        </Row>



        <FloatButton.Group
            trigger="hover"
            className="floatButton"
            // type="primary"
            icon={<BiMenu style={{ color: 'white' }} />}
        >
            <FloatButton type="primary" tooltip="Create Listing" icon={<BiEditAlt />} onClick={handleCreateModal} />
            <FloatButton type="primary" tooltip="My Listings" icon={<AiOutlineHistory />} onClick={handleViewListings} />
            <FloatButton type="primary" tooltip="My Request" icon={<SlPeople />} onClick={handleViewRequest} />
        </FloatButton.Group>

        <CreateRoommatePost value={postModal} onModalChange={setPostModal} onTrigger={handleTrigger} />

        <ScrollToTopButton />

    </>
    )
}

export default Roommate;