import { Select } from "antd";

function GenderSelection({onChange, bordered, ...rest}){


    const defaultOption = [
        {
            label: 'Male',
            value: 'male'
        },
        {
            label: 'Female',
            value: 'female'
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