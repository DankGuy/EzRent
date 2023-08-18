import { Button, Descriptions, Divider, Modal } from "antd";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabase-client";
import { Fragment } from "react";


function RentedPropertyDetails({ value, onChange, occupantsID, tenant }) {

    console.log(occupantsID)
    console.log(tenant)

    const [occupants, setOccupants] = useState([])


    useEffect(() => {
        const fetchOccupantDetails = async () => {
            if (occupantsID === null || occupantsID.length === 0){
                setOccupants(null)
                return
            }

            const { data, error } = await supabase
                .from("student")
                .select("*")
                .in("student_id", occupantsID)

            if (error) console.log(error);
            console.log(data);

            setOccupants(data);
        };

        fetchOccupantDetails();
    }, [occupantsID]);

    useEffect(() => {
        console.log(occupants)
    }, [occupants])

    const renderedOccupants = () => {
        console.log(occupants)
        return (
            <>
                <Divider orientation="left" style={{ borderColor: 'gray' }}>Occupant Info</Divider>
                { occupants.map((element) => {
                        return (
                            <>
                                <Descriptions bordered>
                                    <Descriptions.Item label="Name" span={3}>{element.name}</Descriptions.Item>
                                    <Descriptions.Item label="Email">{element.email}</Descriptions.Item>
                                    <Descriptions.Item label="Phone Number">{element.phone}</Descriptions.Item>
                                </Descriptions>
                                <br />
                            </>
                        )
                    })
                }


            </>
        )
    }



    return (

        <Modal title="Rented Property Details"
            open={value}
            onOk={() => onChange(false)}
            onCancel={() => onChange(false)}
            width={1000}
            footer={[
                <Button key="back" onClick={() => onChange(false)} className="viewButton">
                    Return
                </Button>,
            ]}
        >
            <div>
                {tenant && (
                    <Descriptions title="Tenant Info" bordered>
                        <Descriptions.Item label="Name" span={3}>{tenant.name}</Descriptions.Item>
                        <Descriptions.Item label="Email">{tenant.email}</Descriptions.Item>
                        <Descriptions.Item label="Phone Number">{tenant.phone}</Descriptions.Item>
                    </Descriptions>
                )}
                <br />
                {occupants && renderedOccupants()}
            </div>
        </Modal>
    );
}

export default RentedPropertyDetails;
