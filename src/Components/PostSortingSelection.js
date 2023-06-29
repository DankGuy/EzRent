import { Select } from 'antd';
import { useState } from 'react';

function PostSortingSelection({ value, onChange, additionalOption, ...rest }) {
  const [sortBy, setSortBy] = useState(null);

  const handleChange = (e) => {
    onChange(e);
    setSortBy(e);
  }

  const defaultOptions = [
    { value: 'ascDate', label: 'Posted date (old to new)' },
    { value: 'descDate', label: 'Posted date (new to old)' },
    { value: 'ascPrice', label: 'Price (low to high)' },
    { value: 'descPrice', label: 'Price (high to low)' },
    { value: 'ascSize', label: 'Built-up size (low to high)' },
    { value: 'descSize', label: 'Built-up size (high to low)' },
  ];

  const sortByOptions = additionalOption ? [...additionalOption, ...defaultOptions] : defaultOptions;

  return (
    <Select
      bordered={false}
      style={rest.style}
      options={sortByOptions}
      value={sortBy}
      onChange={handleChange}
      placeholder="Default"
    />
  );
}

export default PostSortingSelection;
