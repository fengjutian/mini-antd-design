import {
  HeartFilled,
  HeartOutlined,
  StarFilled,
  StarOutlined,
  StarTwoTone,
  SyncOutlined,
} from '@ant-design/icons';
import React from 'react';
import Icon from '../index';

export default () => {
  return (
    <div
      style={{
        display: 'flex',
        gap: 24,
        flexWrap: 'wrap',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <StarOutlined style={{ fontSize: 24 }} />
        <StarFilled style={{ fontSize: 24, color: '#faad14' }} />
        <StarTwoTone twoToneColor="#faad14" style={{ fontSize: 24 }} />
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <HeartOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />
        <HeartFilled style={{ fontSize: 24, color: '#ff4d4f' }} />
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Icon component={StarOutlined} style={{ fontSize: 24 }} />
        <Icon
          component={StarFilled}
          style={{ fontSize: 24, color: '#faad14' }}
        />
        <Icon
          component={StarTwoTone}
          twoToneColor="#faad14"
          style={{ fontSize: 24 }}
        />
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Icon component={SyncOutlined} spin />
        <Icon component={SyncOutlined} rotate={90} style={{ fontSize: 24 }} />
      </div>
    </div>
  );
};
