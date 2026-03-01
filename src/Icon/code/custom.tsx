import React from 'react';
import Icon from '../index';

const MessageSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 1024 1024"
    fill="currentColor"
    width="1em"
    height="1em"
    {...props}
  >
    <path d="M192 224a64 64 0 0 1 64-64h320a64 64 0 0 1 64 64v320a64 64 0 0 1-64 64H256a64 64 0 0 1-64-64V224zm64 0v320h256V224H256z" />
    <path d="M448 128a32 32 0 0 1 32 32v72a32 32 0 0 1-64 0v-72a32 32 0 0 1 32-32z" />
  </svg>
);

export default () => {
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <Icon component={MessageSvg} />
      <Icon
        component={MessageSvg}
        style={{ fontSize: '24px', color: '#52c41a' }}
      />
      <Icon component={MessageSvg} spin />
      <Icon component={MessageSvg} rotate={180} />
    </div>
  );
};
