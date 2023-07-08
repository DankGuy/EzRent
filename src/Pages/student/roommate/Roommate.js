import { Breadcrumb, Button, Col, FloatButton, Form, Row } from "antd";
import GenderSelection from "../../../Components/GenderSelection";
import RoomResourceSelection from "../../../Components/RoomResourceSelection";
import { useState } from "react";
import RoommatePostLayout from "./RoommatePostLayout";
import { AiOutlineHistory } from "react-icons/ai";
import { BiEditAlt, BiMenu } from "react-icons/bi";

function Roommate() {

    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log(values);
    }

    const onFinishFailed = (errorInfo) => {
        console.log(errorInfo);
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
            }}
            size={150}
            type="primary"
            icon={<BiMenu />}
        >
            <FloatButton type="primary" icon={<BiEditAlt/>}/>
            <FloatButton type="primary" icon={<AiOutlineHistory />} />
        </FloatButton.Group>
    </div>
}

export default Roommate;