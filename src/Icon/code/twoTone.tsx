import React from 'react';
import Icon, { getTwoToneColor, setTwoToneColor } from '../index';

export default () => {
  const currentColor = getTwoToneColor();

  const handleSetColor = () => {
    setTwoToneColor('#eb2f96');
    console.log('Color set to #eb2f96');
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', gap: 16 }}>
        <Icon />
        <Icon style={{ color: '#1890ff' }} />
      </div>
      <div>
        <p>当前双色主色: {currentColor}</p>
        <button type="button" onClick={handleSetColor}>
          设置双色为粉色
        </button>
      </div>
    </div>
  );
};
