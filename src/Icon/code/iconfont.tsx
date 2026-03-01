import React from 'react';
import Icon from '../index';

const AlipaySvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 1024 1024"
    fill="currentColor"
    width="1em"
    height="1em"
    {...props}
  >
    <path d="M140.8 652.8c-48 0-86.4-38.4-86.4-86.4V259.2c0-48 38.4-86.4 86.4-86.4h742.4c48 0 86.4 38.4 86.4 86.4v307.2c0 48-38.4 86.4-86.4 86.4H140.8zM483.2 512H256v-51.2h227.2V512zm0-102.4H256v-51.2h227.2V409.6zm307.2 204.8H512v-51.2h278.4v51.2zm0-102.4H512v-51.2h278.4v51.2z" />
  </svg>
);

const TaobaoSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 1024 1024"
    fill="currentColor"
    width="1em"
    height="1em"
    {...props}
  >
    <path d="M104.96 796.16l-20.48-81.92 71.68-17.92 30.72 78.08 79.36-197.12-71.68-28.16 10.24-40.96-80.64 15.36-36.48-74.24-59.52 40.96 20.48 81.92-71.68 17.92-30.72-78.08-79.36 197.12 71.68 28.16-10.24 40.96 80.64-15.36 36.48 74.24 59.52-40.96zM388.48 614.4c-46.08 11.52-87.04 5.12-115.2-17.92-28.16-23.04-40.96-58.88-35.84-102.4 10.24-92.16 117.76-152.32 197.12-145.92 71.68 5.12 120.32 46.08 130.56 112.64 2.56 17.92 0 33.28-7.68 46.08l-79.36-15.36c5.12-7.68 7.68-15.36 7.68-25.6-10.24-46.08-40.96-76.8-81.92-81.92-56.32-7.68-107.52 38.4-120.32 107.52-10.24 53.76 17.92 97.28 61.44 114.56 28.16 11.52 58.88 10.24 84.48-2.56l17.92 81.92-138.24 33.28z" />
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
        <Icon component={AlipaySvg} style={{ fontSize: 24 }} />
        <Icon component={TaobaoSvg} style={{ fontSize: 24 }} />
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Icon
          component={AlipaySvg}
          style={{ fontSize: 24, color: '#1890ff' }}
        />
        <Icon
          component={TaobaoSvg}
          style={{ fontSize: 24, color: '#ff4d4f' }}
        />
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Icon component={AlipaySvg} spin style={{ fontSize: 24 }} />
        <Icon component={TaobaoSvg} rotate={45} style={{ fontSize: 24 }} />
      </div>
      <p style={{ color: '#8c8c8c', fontSize: 12 }}>
        提示: createFromIconfontCN 用于加载 iconfont.cn 的远程图标
      </p>
    </div>
  );
};
