import React from 'react';
import Icon from '../index';

export default () => {
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <Icon />
      <Icon style={{ fontSize: '20px', color: '#1890ff' }} />
      <Icon spin />
      <Icon rotate={90} />
    </div>
  );
};
