import { Select } from "antd";

function RoomResourceSelection({onChange, bordered, ...rest}){
 
    const defaultOption = [
        {
            label: 'Yes',
            value: 'yes'
        },
        {
            label: 'No',
            value: 'no'
        },
    ]
    
    return (
        <Select
            bordered={bordered}
            style={rest.style}
            placeholder="Room Resource"
            options={defaultOption}
            onChange={onChange}
        />          
    )
}

export default RoomResourceSelection;