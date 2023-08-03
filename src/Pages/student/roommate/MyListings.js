import { Breadcrumb, Col, Row } from "antd";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabase-client";
import MyListingPost from "./MyListingPost";

function MyListings() {

    const [myListings, setMyListings] = useState([]);

    useEffect(() => {

        
        fetchMyListings();
    }, []);

    async function fetchMyListings(){

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


    return (
        <div
            style={{
                marginTop: "4em",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #e0e0e0",

            }}
        >
            <div style={{ border: '2px solid #e0e0e0', width: '50%' }}>
                <Breadcrumb style={{ margin: '16px 0', fontWeight: '500' }}
                    items={[
                        { href: '/student', title: 'Home' },
                        { href: '/student/roommate', title: 'Roommate' },
                        { title: 'My Listings' },
                    ]}
                />
            </div>
            <Row>
                <Col span={24}>
                    <h1>My Listings ({myListings.length})</h1>
                </Col>
            </Row>
            
            {myListings.map((listing, index) => (
                <MyListingPost listing={listing} key={index}/>
            ))}
        </div>
    )
}

export default MyListings;