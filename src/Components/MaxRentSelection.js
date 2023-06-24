import { Select } from 'antd';
import { useState } from 'react';

function MaxRentSelection({ value, onChange, ...rest }) {
    const [maxRent, setMaxRent] = useState({ value });

    const handleChange = (e) => {
        setMaxRent(e);
        onChange(e);
    }

    const maxRentOption = [
        { value: 0, label: 'Max rent (RM)' },
        { value: 100, label: 'RM 100' },
        { value: 200, label: 'RM 200' },
        { value: 300, label: 'RM 300' },
        { value: 500, label: 'RM 500' },
        { value: 700, label: 'RM 700' },
        { value: 900, label: 'RM 900' },
        { value: 1000, label: 'RM 1000' },
        { value: 1200, label: 'RM 1200' },
        { value: 1500, label: 'RM 1500' },
        { value: 1800, label: 'RM 1800' },
        { value: 2000, label: 'RM 2000' },
        { value: 2200, label: 'RM 2200' },
        { value: 2500, label: 'RM 2500' },
        { value: 2800, label: 'RM 2800' },
        { value: 3000, label: 'RM 3000' },
    ];


    return <Select
        bordered={false}
        style={rest.style}
        options={maxRentOption}
        value={maxRent}
        onChange={handleChange}
    />
}

export default MaxRentSelection;