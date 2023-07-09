import { Button, Col, Row } from "antd";

function RoommatePostLayout() {

    //css for postLayout
    const postLayout = {
        margin: '30px 50% 0px 1%',
        height: 'auto',
        padding: '10px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)',
    }



    return (
        <div style={postLayout}>
            <Row>
                <Col span={4}>
                    img
                </Col>
                <Col span={4}>
                    Student Name
                </Col>
                <Col span={4}>
                    Gender
                </Col>
                <Col span={4} offset={8}>
                    Posted Date
                </Col>
            </Row>

            <Row>
                <Col span={4}>
                    Rent budget
                </Col>
                <Col span={4}>
                    Location
                </Col>
            </Row>
            <Row>
                <Col span={4}>
                    Duration
                </Col>
                <Col span={4}>
                    Move in date
                </Col>
            </Row>
            <Row>
                <Col span={4}>
                    Responsibility
                </Col>
                
            </Row>

            <Row>
                <Col span={4}>
                    <Button type="primary" className="viewButton" style={{ width: '80%' }}>
                        View
                    </Button>
                </Col>
                <Col span={4} offset={16}>
                    Contact Number
                </Col>
            </Row>
        </div>

    );
}

export default RoommatePostLayout;