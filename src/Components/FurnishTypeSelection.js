import { Select } from 'antd';
import { useState } from 'react';

function FurnishTypeSelection({ value, onChange, bordered, ...rest }) {
    const [furnish, setFurnish] = useState(value);

    const handleChange = (e) => {
        onChange(e);
        // setFurnish(e);
    }

    const furnishOption = [
        { value: 'Unfurnished', label: 'Unfurnished' },
        { value: 'Partially Furnished', label: 'Partially furnished' },
        { value: 'Fully Furnished', label: 'Fully furnished' },
    ];

    return <Select
        placeholder="All Furnish Type"
        bordered={bordered}
        style={rest.style}
        options={furnishOption}
        value={value}
        onChange={handleChange}
    />
}
export default FurnishTypeSelection;