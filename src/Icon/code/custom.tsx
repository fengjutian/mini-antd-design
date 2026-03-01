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

const SettingSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 1024 1024"
    fill="currentColor"
    width="1em"
    height="1em"
    {...props}
  >
    <path d="M512 128c-212.1 0-384 171.9-384 384s171.9 384 384 384 384-171.9 384-384-171.9-384-384-384zm0 704c-176.7 0-320-143.3-320-320s143.3-320 320-320 320 143.3 320 320-143.3 320-320 320z" />
    <path d="M534.4 353.6l-44.8-12.8c-12.8-25.6-32-44.8-57.6-51.2l-12.8-44.8c-12.8-19.2-44.8-19.2-57.6 0l-12.8 44.8c-25.6 6.4-44.8 25.6-51.2 51.2l-44.8 12.8c-19.2 12.8-19.2 44.8 0 57.6l44.8 12.8c6.4 25.6 25.6 44.8 51.2 51.2l12.8 44.8c12.8 19.2 44.8 19.2 57.6 0l12.8-44.8c25.6-6.4 44.8-25.6 51.2-51.2l44.8-12.8c19.2-12.8 19.2-44.8 0-57.6z" />
  </svg>
);

const CloudSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 1024 1024"
    fill="currentColor"
    width="1em"
    height="1em"
    {...props}
  >
    <path d="M792 504a232.96 232.96 0 0 0-217.92-232 152 152 0 0 0-299.52 52.48A184 184 0 0 0 112 560c-101.12 0-184 82.88-184 184s82.88 184 184 184h624a215.36 215.36 0 0 0 56-424z" />
  </svg>
);

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
        <Icon component={MessageSvg} style={{ fontSize: 24 }} />
        <Icon component={SettingSvg} style={{ fontSize: 24 }} />
        <Icon component={CloudSvg} style={{ fontSize: 24 }} />
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Icon
          component={MessageSvg}
          style={{ fontSize: 24, color: '#1890ff' }}
        />
        <Icon
          component={SettingSvg}
          style={{ fontSize: 24, color: '#52c41a' }}
        />
        <Icon component={CloudSvg} style={{ fontSize: 24, color: '#faad14' }} />
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Icon component={MessageSvg} spin style={{ fontSize: 24 }} />
        <Icon component={SettingSvg} rotate={180} style={{ fontSize: 24 }} />
      </div>
    </div>
  );
};
