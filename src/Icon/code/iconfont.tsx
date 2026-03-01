import React from 'react';
import { createFromIconfontCN } from '../index';

const MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
});

export default () => {
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <MyIcon type="icon-example" />
      <MyIcon
        type="icon-example"
        style={{ fontSize: '20px', color: '#1890ff' }}
      />
      <MyIcon type="icon-example" spin />
      <MyIcon type="icon-example" rotate={45} />
    </div>
  );
};
