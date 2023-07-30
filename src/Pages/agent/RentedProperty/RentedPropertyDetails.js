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

    const [occupants, setOccupants] = useState([]);
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

                let details = [];

                if (occupantIDs.length > 0) {
                    occupantIDs.forEach(async (occID) => {

                        const { data: occupant, error } = await supabase
                            .from('student')
                            .select('*')
                            .eq('student_id', occID)
                            .single();

                        console.log(occupant);

                        if (error) {
                            console.log(error);
                            // Handle the error (e.g., show an error message)
                            return;
                        }

                        if (occupant) {
                            details.push(
                                <Fragment key={occID}>
                                    <Descriptions.Item label="Name" span={3}>{occupant.name}</Descriptions.Item>
                                    <Descriptions.Item label="Email">{occupant.email}</Descriptions.Item>
                                    <Descriptions.Item label="Phone Number">{occupant.phone}</Descriptions.Item>
                                </Fragment>
                            );
                        }
                    }
                    );
                }
                console.log(details);
                setOccupants(details);
            } catch (error) {
                console.log(error);
                // Handle the error (e.g., show an error message)
            }
        };

        fetchTenantDetails();
        fetchOccupantDetails();
    }, [rentalAgreementID]);

    return (
        <div>
            {tenant && (
                <Descriptions title="Tenant Info" bordered>
                    <Descriptions.Item label="Name" span={3}>{tenant.studentID.name}</Descriptions.Item>
                    <Descriptions.Item label="Email">{tenant.studentID.email}</Descriptions.Item>
                    <Descriptions.Item label="Phone Number">{tenant.studentID.phone}</Descriptions.Item>
                </Descriptions>
            )}
            {occupants.length > 0 && (
                <>
                    <Divider orientation="left" style={{ borderColor: 'gray' }}>Occupant Info</Divider>
                    <Descriptions bordered>
                        {occupants}
                    </Descriptions>
                </>
            )}
        </div>
    );
}

export default RentedPropertyDetails;
