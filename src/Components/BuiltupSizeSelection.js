import { Select } from 'antd';
import { useState } from 'react';

function BuiltupSizeSelection({ value, onChange, ...rest }) {
    const [size, setSize] = useState({ value });

    const handleChange = (e) => {
        setSize(e);
        onChange(e);
    }

    const sizeOptions = [
        { value: 0, label: 'Built-up size (sq.ft.)' },
        { value: 500, label: '500 sq.ft.' },
        { value: 600, label: '600 sq.ft.' },
        { value: 700, label: '700 sq.ft.' },
        { value: 800, label: '800 sq.ft.' },
        { value: 900, label: '900 sq.ft.' },
        { value: 1000, label: '1000 sq.ft.' },
        { value: 1100, label: '1100 sq.ft.' },
        { value: 1200, label: '1200 sq.ft.' },
        { value: 1300, label: '1300 sq.ft.' },
        { value: 1400, label: '1400 sq.ft.' },
        { value: 1500, label: '1500 sq.ft.' },
        { value: 1600, label: '1600 sq.ft.' },
        { value: 1700, label: '1700 sq.ft.' },
        { value: 1800, label: '1800 sq.ft.' },
        { value: 1900, label: '1900 sq.ft.' },
        { value: 2000, label: '2000 sq.ft.' },
    ];
    return <Select
        bordered={false}
        style={rest.style}
        options={sizeOptions}
        value={size}
        onChange={handleChange}

    />
}

export default BuiltupSizeSelection;