import { DatePicker } from "antd";
import moment from "moment";


function AgentAppointment(){

    

    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < moment().endOf('day');

    }

    const onChangeDate = (date, dateString) => {
        console.log(date, dateString);
    }
    
    return <>

        <h1>Set Available Timeslot</h1>
        <div style={{border: '1px solid red', height: '300px', display: 'flex'}}>
            <div style={{border: '1px solid blue', width: '40%', height: '300px'}}>
                <DatePicker 
                    format='DD-MM-YYYY'
                    disabledDate={disabledDate}
                    onChange={onChangeDate}
                    />
            </div>
            <div style={{border: '1px solid blue', width: '60%', height: '300px'}}>
            
            </div>

        </div>
    
    
    </>
}

export default AgentAppointment;