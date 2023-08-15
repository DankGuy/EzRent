import { Breadcrumb, Button, Col, Row } from "antd";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabase-client";
import MyListingPost from "./MyListingPost";
import ScrollToTopButton from "../../../Components/ScrollToTopButton";
import CreateRoommatePost from "./CreateRoommatePost";
import { Spin } from "antd";

function MyListings() {

    const [myListings, setMyListings] = useState([]);

    const [trigger, setTrigger] = useState(0);

    const [postModal, setPostModal] = useState(false);

    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {


        fetchMyListings();
    }, [trigger]);

    async function fetchMyListings() {

        setIsLoading(true);
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
        setIsLoading(false);
    }

    const handleTrigger = () => {
        setTrigger(trigger + 1);
    }

    const handleCreateModal = () => {
        setPostModal(true);
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "white",
                margin: "2.5% 1% 10px 1%",
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
                <Col span={18} style={{ marginLeft: '1%' }}>
                    <h1>My Listings ({myListings.length})</h1>
                </Col>
                <Col span={3} style={{ marginLeft: '1%', display: 'flex', alignItems: 'center' }}>
                    <Button type="primary" className="viewButton" style={{ width: '100%' }}
                        onClick={handleCreateModal}
                    >
                        Create a listing
                    </Button>
                    <CreateRoommatePost value={postModal} onModalChange={setPostModal} onTrigger={handleTrigger} />
                </Col>
            </Row>

            {isLoading &&
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2% 0 2% 0',
                    width: '100%',
                    height: '100%',
                }}>
                    <Spin size="large" />
                    <span style={{ marginTop: '1%', fontFamily: 'arial', fontSize: '15px' }}>
                        Loading...
                    </span>
                </div>

            }

            {!isLoading && myListings.length === 0 &&
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2%',
                    width: '30%',
                }}>
                    <p style={{ fontFamily: 'arial', fontSize: '15px' }}> You have not posted any listings yet... </p>
                    <Button type="primary" className="viewButton" style={{ width: '40%' }}
                        onClick={handleCreateModal}
                    >
                        Create a listing
                    </Button>
                    <CreateRoommatePost value={postModal} onModalChange={setPostModal} onTrigger={handleTrigger} />
                </div>
            }



            {!isLoading && myListings.length > 0 && <>
                <Row style={{ margin: '1% 5% 2% 1%' }}>
                    {myListings.map((listing, index) => (
                        <Col span={11} key={index} style={{ marginRight: '4%' }}>
                            <MyListingPost listing={listing} onTrigger={handleTrigger} />
                        </Col>
                    ))}
                </Row>
            </>}

            <ScrollToTopButton />
        </div>
    )
}

export default MyListings;