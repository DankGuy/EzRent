import { supabase } from "../../supabase-client";
import { useState, useEffect } from "react";

function AgentMyProperty() {


    const [data, setData] = useState([]);

    useEffect(() => {

        const getData = async () => {
            const { data, error } = await supabase
                .from('property_post')
                .select(`propertyRoomDetails->"1"->"roomType"`);

            setData(data);
            console.log(data);

            if (error) {
                console.log(error);
            }


        }

        getData();


    }, [])

    return (
        <div>
            <h1>My Property</h1>
            {data.map((item) => {
                return (
                    <div>
                        <p>{item.roomType}</p>
                    </div>
                )
            })
            }
        </div>
    )
}

export default AgentMyProperty;