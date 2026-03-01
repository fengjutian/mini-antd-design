import React from 'react';
import { createFromIconfontCN } from '../index';

const IconFont = createFromIconfontCN({
  scriptUrl: [
    '//at.alicdn.com/t/font_1788044_0dwu4guekcwr.js',
    '//at.alicdn.com/t/font_1788592_a5xf2bdic3u.js',
  ],
});

export default () => {
  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <IconFont type="icon-javascript" />
        <IconFont type="icon-java" />
        <IconFont type="icon-shoppingcart" />
        <IconFont type="icon-python" />
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <IconFont type="icon-javascript" style={{ color: '#fa8c16' }} />
        <IconFont type="icon-java" style={{ color: '#1677ff' }} />
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <IconFont type="icon-shoppingcart" spin />
        <IconFont type="icon-python" rotate={45} />
      </div>
    </div>
  );
};
