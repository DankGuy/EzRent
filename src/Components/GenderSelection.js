import { Select } from "antd";

function GenderSelection({onChange, bordered, ...rest}){


    const defaultOption = [
        {
            label: 'Any',
            value: 'any'
        }
        ,
        {
            label: 'Male',
            value: 'Male'
        },
        {
            label: 'Female',
            value: 'Female'
        },
    ]

    return <Select 
        bordered={bordered}
        style={rest.style}
        placeholder="Gender"
        options={defaultOption}
        onChange={onChange}
        />
}
export default GenderSelection;