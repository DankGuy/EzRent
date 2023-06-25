import { Select } from 'antd';
import { useState } from 'react';

function FurnishTypeSelection({ value, onChange, bordered, ...rest }) {
    const [furnish, setFurnish] = useState(null);

    const handleChange = (e) => {
        onChange(e);
        setFurnish(e);
    }

    const furnishOption = [
        { value: 'Unfurnished', label: 'Unfurnished' },
        { value: 'Partially Furnished', label: 'Partially furnished' },
        { value: 'Fully Furnished', label: 'Fully furnished' },
    ];

    console.log(bordered)

    return <Select
        placeholder="All Furnish Type"
        bordered={bordered}
        style={rest.style}
        options={furnishOption}
        value={furnish}
        onChange={handleChange}
    />
}

export default FurnishTypeSelection;