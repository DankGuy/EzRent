import { Form, Input } from 'antd';
import React, { useState } from 'react';

function MultiValueInput() {
  const [inputValue, setInputValue] = useState('');
  const [selectedValues, setSelectedValues] = useState([]);

  const [form] = Form.useForm();
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleInputKeyPress = (event) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      setSelectedValues([...selectedValues, inputValue.trim()]);
      setInputValue('');
      form.setFieldValue('title', '');
    }
  };

  const handleRemoveValue = (value) => {
    setSelectedValues(selectedValues.filter((v) => v !== value));
  };

  return (
    <div>
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Title"

        >
          <Input value={inputValue} onChange={handleInputChange} onKeyPress={handleInputKeyPress} />
        </Form.Item>
      </Form>
      <div>
        <ul>
          {selectedValues.map((value) => (
            <li key={value}>
              {value} <button onClick={() => handleRemoveValue(value)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MultiValueInput;
