import { Breadcrumb, Button, Col, FloatButton, Form, Row } from "antd";
import GenderSelection from "../../../Components/GenderSelection";
import RoomResourceSelection from "../../../Components/RoomResourceSelection";
import { useState } from "react";
import RoommatePostLayout from "./RoommatePostLayout";
import { AiOutlineHistory } from "react-icons/ai";
import { BiEditAlt, BiMenu } from "react-icons/bi";
import CreateRoommatePost from "./CreateRoommatePost";
import "./Roommate.css"

function Roommate() {

    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log(values);
    }

    const onFinishFailed = (errorInfo) => {
        console.log(errorInfo);
    }

    const [postModal, setPostModal] = useState(false);

    const handleCreateModal = () => {
        setPostModal(true);
    }

    return <div style={{ margin: '8.55vh 5% 0px' }}>
        <Breadcrumb style={{ margin: '16px 0', fontWeight: '500' }}
            items={[
                { href: '/student', title: 'Home' },
                { href: '/student/roommate', title: 'Roommate' },
            ]}
        />

        <Form
            name="search"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={
                {
                    genderSelection: null,
                    roomSelection: null,
                }
            }>
            <Row>
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
                <Col span={2}>
                    <Button type="primary" className="viewButton" htmlType="submit" style={{ width: '80%' }}>
                        Search
                    </Button>
                </Col>
            </Row>



        </Form>

        <RoommatePostLayout />

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
            icon={<BiMenu style={{color: 'white'}}/>}
        >
            <FloatButton type="primary" tooltip="Create post" icon={<BiEditAlt/>} onClick={handleCreateModal}/>
            <FloatButton type="primary" tooltip="View listings" icon={<AiOutlineHistory />} />
        </FloatButton.Group>

        <CreateRoommatePost value={postModal} onChange={setPostModal} />
    </div>
}

export default Roommate;