import { Breadcrumb, Col, Row } from "antd";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabase-client";
import MyListingPost from "./MyListingPost";
import ScrollToTopButton from "../../../Components/ScrollToTopButton";

function MyListings() {

    const [myListings, setMyListings] = useState([]);

    const [trigger, setTrigger] = useState(0);

    useEffect(() => {


        fetchMyListings();
    }, [trigger]);

    async function fetchMyListings() {

        const studentID = (await supabase.auth.getUser()).data.user.id;

        const { data, error } = await supabase
            .from('roommate_post')
            .select('*, student(*), rental_agreement(*, postID(*))')
            .eq('studentID', studentID);

        if (error) {
            console.log(error);
            return;
        }

        console.log(data);
        setMyListings(data);
    }

    const handleTrigger = () => {
        setTrigger(trigger + 1);
    }


    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "white",
                margin: "10px 1% 10px 1%",
                height: (myListings.length <= 2) ? "calc(100vh - 70px)" : 'auto',
                padding: "0 2em",
            }}
        >
            <div style={{ width: '50%', marginLeft: '1%' }}>
                <Breadcrumb style={{ margin: '16px 0', fontWeight: '500' }}
                    items={[
                        { href: '/student', title: 'Home' },
                        { href: '/student/roommate', title: 'Roommate' },
                        { title: 'My Listings' },
                    ]}
                />
            </div>
            <Row>
                <Col span={24} style={{ marginLeft: '1%'}}>
                    <h1>My Listings ({myListings.length})</h1>
                </Col>
            </Row>

            <Row style={{ margin: '1% 5% 2% 1%' }}>
                {myListings.map((listing, index) => (
                    <Col span={11} key={index} style={{ marginRight: '4%' }}>
                        <MyListingPost listing={listing} onTrigger={handleTrigger}/>
                    </Col>
                ))}
            </Row>

            <ScrollToTopButton />
        </div>
    )
}

export default MyListings;