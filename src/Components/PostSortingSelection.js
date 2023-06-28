import { Select } from 'antd';
import { useState } from 'react';

function PostSortingSelection({ value, onChange, ...rest }) {
    const [sortBy, setSortBy] = useState(null);

    const handleChange = (e) => {
        onChange(e);
        setSortBy(e);
    }

    const sortByOption = [
        { value: 'ascDate', label: 'Posted date (old to new)' },
        { value: 'descDate', label: 'Posted date (new to old)' },
        { value: 'ascPrice', label: 'Price (low to high)' },
        { value: 'descPrice', label: 'Price (high to low)' },
        { value: 'ascSize', label: 'Built-up size (low to high)' },
        { value: 'descSize', label: 'Built-up size (high to low)' },
    ];

    return <Select
        bordered={false}
        style={rest.style}
        options={sortByOption}
        value={sortBy}
        onChange={handleChange}
        placeholder="Default"
    />
}

export default PostSortingSelection;