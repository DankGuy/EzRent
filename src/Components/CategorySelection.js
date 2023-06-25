import { Select } from 'antd';
import { useState } from 'react';

function CategorySelection({ value, onChange, ...rest }) {
    const [category, setCategory] = useState(null);

    const handleChange = (e) => {
        onChange(e);
        setCategory(e);
    }

    const categoryOption = [
        { value: 'Unit', label: 'Unit' },
        { value: 'Room', label: 'Room' },
    ];

    return <Select
        bordered={false}
        style={rest.style}
        options={categoryOption}
        value={category}
        onChange={handleChange}
        placeholder="All Categories"
    />
}

export default CategorySelection;