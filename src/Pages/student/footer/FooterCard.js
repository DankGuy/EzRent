import { Col, Row } from "antd";
import { Fragment } from "react";
import { ImFacebook2, ImTwitter, ImInstagram, ImYoutube } from "react-icons/im";
import { Link } from "react-router-dom";
import "./footer.css" 


function Footer() {


    const colStyle = {
        margin: "2% 0 2% 0",
        padding: "0 2em",
        // border: '1px solid white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        lineHeight: '0.5',
    }

    const h1Style = {
        fontSize: "18px",
        fontWeight: "bold",
        marginBlockStart: "0.5em",
        marginBlockEnd: "0.5em",
        marginBottom: '15px',
    }

    const h2Style = {
        fontSize: "15px",
        fontWeight: "bold",
        marginBlockStart: "0.5em",
        marginBlockEnd: "0.5em",
        marginBottom: '10px',
    }

    const fontStyle = {
        fontSize: "13px",
        color: "white",
        marginBlockStart: "0.5em",
        marginBlockEnd: "0.5em",
        lineHeight: '1.5',

    }

    const iconSize = 20;

    return (
        <div style={{ position: 'relative', bottom: 0, width: '100%', zIndex: 50 }}>
            <Row style={{
                backgroundColor: "#001529",
                color: "white",
                margin: 0,
                height: "auto",
                padding: '0em 2em',
            }} >
                <Col span={8} style={{...colStyle, paddingLeft: '100px'}}>
                    <h1 style={h1Style}>Sitemap</h1>
                    <Link to="/student/roomRental" style={fontStyle}>Room Rental</Link>
                    <Link to="/student/roommate" style={fontStyle}>Roommate</Link>
                    <Link to="/student/aboutUs" style={fontStyle}>About Us</Link>
                    <Link to="/student/privacy" style={fontStyle}>Privacy Policy</Link>
                    <Link to="/student/terms" style={fontStyle}>Terms and Conditions</Link>

                </Col>

                <Col span={8} style={colStyle}>
                    <h1 style={h1Style}>Contact Information</h1>
                    <h2 style={h2Style}>Address</h2>
                    <p style={{ ...fontStyle, marginBlockStart: '0.5em', marginBlockEnd: '0.5em' }}>
                        5th Floor, Wisma Maba, No 5-5, Jalan Hang Jebat, 50150 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur
                    </p>
                    <br />
                    <h2 style={h2Style}>Office Hours</h2>
                    <p style={fontStyle}>Monday - Friday: 9:00am - 5:00pm</p>
                    <p style={fontStyle}>Saturday: 9:00am - 1:00pm</p>
                    <p style={fontStyle}>Sunday: Closed</p>
                    <br />
                    <p style={fontStyle}>Email: <a href="mailto:kelvinee37@gmail.com">kelvinee37@gmail.com</a></p>
                    <p style={fontStyle}>Phone: <a href="tel:+6016-555-5555">+6016-555-5555</a></p>
                </Col>

                <Col span={8} style={colStyle}>
                    <h1 style={h1Style}>Follow Us</h1>
                    <p style={fontStyle}>Follow us on our social media platforms to get the latest updates!</p>
                    <br />
                    <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <ImFacebook2 size={iconSize} style={{ marginRight: '10px' }} />
                        <ImTwitter size={iconSize} style={{ marginRight: '10px' }} />
                        <ImInstagram size={iconSize} style={{ marginRight: '10px' }} />
                        <ImYoutube size={iconSize} style={{ marginRight: '10px' }} />
                    </span>
                </Col>

            </Row>
            <Row style={{
                backgroundColor: "#430f58",
                color: "white",
                margin: 0,
                height: "auto",
                padding: '1em 2em',
            }} >
               
                <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
                    <p style={{ fontSize: '13px', color: 'white', margin: 0 }}>© 2023 EzRent. All rights reserved.</p>
                </Col>
            </Row>

        </div>
    )

}

export default Footer;  