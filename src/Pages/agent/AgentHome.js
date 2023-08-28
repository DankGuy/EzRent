import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase-client";
import { convertDate, getDateOnly } from "../../Components/timeUtils";

function AgentHome() {

    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {

            const userID = (await supabase.auth.getUser()).data.user.id;

            const todayDate = new Date();

            console.log(todayDate);

            console.log(getDateOnly(todayDate));


            const { data, error } = await supabase
                .from('appointment')
                .select('*')
                .eq('agentID', userID)
                .order('date', { ascending: false });

            if (error) {
                console.log(error);
                return;
            }

            console.log(data);
            setAppointments(data);
        }

        fetchAppointments();
    }, []);

    return (
        <div
            style={{
                border: '1px solid black',
            }} >
            <h1>Agent Home</h1>

            <div>
                <Row>
                    <Col span={12}>
                        <h2>Property Details</h2>
                    </Col>
                    <Col span={12}>
                        <h2>Student Details</h2>
                    </Col>
                </Row>

            </div>
        </div>
    )
}

export default AgentHome;