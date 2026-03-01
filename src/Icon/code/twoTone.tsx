import { StarTwoTone } from '@ant-design/icons';
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
        <Icon
          component={StarTwoTone}
          twoToneColor={currentColor}
          style={{ fontSize: 24 }}
        />
        <Icon
          component={StarTwoTone}
          twoToneColor="#1890ff"
          style={{ fontSize: 24 }}
        />
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
