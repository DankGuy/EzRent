import { Breadcrumb, Button, Col, Form, Row } from "antd";
import GenderSelection from "../../../Components/GenderSelection";
import RoomResourceSelection from "../../../Components/RoomResourceSelection";
import { useState } from "react";
import RoommatePostLayout from "./RoommatePostLayout";

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

            <RoommatePostLayout />
            
        </Form>
    </div>
}

export default Roommate;