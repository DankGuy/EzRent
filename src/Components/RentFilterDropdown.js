
import React, { useState } from 'react';
import { Dropdown, Button, Menu, Slider } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const RentFilterDropdown = ({ value, onChange, ...rest }) => {
  const [visible, setVisible] = useState(false);
  const initialValue = value || [0, 3000]; // Use the prop value or the default range
  const [minRent, setMinRent] = useState(initialValue[0]);
  const [maxRent, setMaxRent] = useState(initialValue[1]);

  const handleSliderChange = ([newMin, newMax]) => {
    setMinRent(newMin);
    setMaxRent(newMax);
    onChange([newMin, newMax]);
  };

  const handleVisibilityChange = flag => {
    setVisible(flag);
  };

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <div style={{ margin: '0 10px' }}>
          <strong>Min Rent:</strong> RM{minRent}
        </div>
      </Menu.Item>
      <Menu.Item key="2">
        <div style={{ margin: '0 10px' }}>
          <strong>Max Rent:</strong> RM{maxRent}
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3">
        <Slider
          range
          min={0}
          max={3000}
          step={100}
          defaultValue={[0, 3000]}
          onChange={handleSliderChange}
        />
      </Menu.Item>
    </Menu>
  );


  return (
    <Dropdown
      overlay={menu}
      trigger={['click']}
      open={visible}
      onOpenChange={handleVisibilityChange}
      arrow={true}
      
    >
      <span style={{ cursor: 'pointer' }}>
        Rent: RM{minRent} - RM{maxRent}
        <DownOutlined style={{ cursor: 'pointer', color: '#00000040', marginLeft: '10px' }} />
      </span>
    </Dropdown>

  );
};

export default RentFilterDropdown;