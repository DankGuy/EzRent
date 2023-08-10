import { Descriptions, Divider } from "antd";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabase-client";
import { Fragment } from "react";

// ... (imports remain the same)

function RentedPropertyDetails() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const stateParam = queryParams.get('state');
    const rentalAgreementID = stateParam ? JSON.parse(decodeURIComponent(stateParam)) : null;

    console.log(rentalAgreementID);

    const [occupants, setOccupants] = useState({});
    const [tenant, setTenant] = useState(null);

    useEffect(() => {
        if (!rentalAgreementID) {
            return;
        }

        const fetchTenantDetails = async () => {
            try {
                const { data: tenantData, error } = await supabase
                    .from('rental_agreement')
                    .select('*, studentID(*)')
                    .eq('rentalAgreementID', rentalAgreementID)
                    .single();

                if (error) {
                    console.log(error);
                    // Handle the error (e.g., show an error message)
                    return;
                }

                console.log(tenantData);
                setTenant(tenantData);
            } catch (error) {
                console.log(error);
                // Handle the error (e.g., show an error message)
            }
        };

        const fetchOccupantDetails = async () => {
            try {
                const { data, error } = await supabase
                    .from('rental_agreement')
                    .select('*')
                    .eq('rentalAgreementID', rentalAgreementID)
                    .single();

                if (error) {
                    console.log(error);
                    // Handle the error (e.g., show an error message)
                    return;
                }

                console.log(data);

                const occupantIDs = data.occupantID;

                // let details = [];

                if (occupantIDs.length > 0){
                    for (let i = 0; i < occupantIDs.length; i++) {

                        const { data: occupantData, error } = await supabase
                            .from('student')
                            .select('*')
                            .eq('student_id', occupantIDs[i])
                            .single();
    
                        if (error) {
                            console.log(error);
                            // Handle the error (e.g., show an error message)
                            return;
                        }
    
                        console.log(occupantData);
                        
                        setOccupants(prevState => ({
                            ...prevState,
                            [i]: occupantData
                        }));
                    }
    
                }

            } catch (error) {
                console.log(error);
            }
        };

        fetchTenantDetails();
        fetchOccupantDetails();
    }, [rentalAgreementID]);

    useEffect(()=>{
        console.log(occupants)
    }, [occupants])

    const renderedOccupants = () => {
        console.log(occupants)
        return (
            <>
                <Divider orientation="left" style={{ borderColor: 'gray' }}>Occupant Info</Divider>
                {Object.keys(occupants).map((key, index) => {
                    return (
                        <Fragment key={index}>
                            <Descriptions bordered>
                                <Descriptions.Item label="Name" span={3}>{occupants[key].name}</Descriptions.Item>
                                <Descriptions.Item label="Email">{occupants[key].email}</Descriptions.Item>
                                <Descriptions.Item label="Phone Number">{occupants[key].phone}</Descriptions.Item>
                            </Descriptions>
                            <br/>
                            
                        </Fragment>
                    )
                })}
                <br />
            </>
        )
    }


    return (
        <div>
            {tenant && (
                <Descriptions title="Tenant Info" bordered>
                    <Descriptions.Item label="Name" span={3}>{tenant.studentID.name}</Descriptions.Item>
                    <Descriptions.Item label="Email">{tenant.studentID.email}</Descriptions.Item>
                    <Descriptions.Item label="Phone Number">{tenant.studentID.phone}</Descriptions.Item>
                </Descriptions>
            )}
            {Object.entries(occupants).length !== 0 && renderedOccupants()}
        </div>
    );
}

export default RentedPropertyDetails;
