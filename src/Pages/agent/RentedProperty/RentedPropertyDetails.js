import { Descriptions, Divider } from "antd";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabase-client";
import { Fragment } from "react";

function RentedPropertyDetails() {
    const location = useLocation();
    const { post } = location.state;

    const [occupantDetails, setOccupantDetails] = useState([]);

    useEffect(() => {
        const fetchOccupantDetails = async () => {
            let details = [];

            if (post.occupantID) {
                for (let occupantID of post.occupantID) {
                    const { data: occupant, error } = await supabase
                        .from('student')
                        .select('*')
                        .eq('student_id', occupantID)
                        .single();
                    if (error) {
                        console.log(error);
                        return;
                    }
                    details.push(
                        <Fragment key={occupantID}>
                            <Descriptions.Item label="Name" span={3}>{occupant.name}</Descriptions.Item>
                            <Descriptions.Item label="Email">{occupant.email}</Descriptions.Item>
                            <Descriptions.Item label="Phone Number">{occupant.phone}</Descriptions.Item>
                        </Fragment>
                    );
                }
            }
            setOccupantDetails(details);
        };

        fetchOccupantDetails();
    }, []);

    return (
        <div>
            <Descriptions title="Tenant Info" bordered>
                <Descriptions.Item label="Name" span={3}>{post.studentID.name}</Descriptions.Item>
                <Descriptions.Item label="Email">{post.studentID.email}</Descriptions.Item>
                <Descriptions.Item label="Phone Number">{post.studentID.phone}</Descriptions.Item>
            </Descriptions>

            {occupantDetails.length > 0 &&
                <>
                    <Divider orientation="left" style={{ borderColor: 'gray' }}>Occupant Info</Divider>
                    <Descriptions bordered>
                        {occupantDetails}
                    </Descriptions>
                </>}
        </div>
    );
}

export default RentedPropertyDetails;
