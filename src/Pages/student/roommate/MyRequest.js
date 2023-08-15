import { Breadcrumb, Card, Col, Row } from 'antd';

function MyRequest() {


    


    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "white",
                margin: "2.5% 1% 10px 1%",
                height: "calc(100vh - 50px)",
                padding: "0 2em",
            }}
        >
            <div style={{ width: '50%', marginLeft: '1%' }}>
                <Breadcrumb style={{ margin: '16px 0', fontWeight: '500' }}
                    items={[
                        { href: '/student', title: 'Home' },
                        { href: '/student/roommate', title: 'Roommate' },
                        { title: 'My Requests' },
                    ]}
                />
            </div>

            <Row>
                <Col span={18} style={{ marginLeft: '1%' }}>
                    <h1>My Requests</h1>
                </Col>
            </Row>

            
        </div>
    )
}

export default MyRequest;