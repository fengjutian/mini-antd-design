import { Typography } from 'mini-antd-design';
import React from 'react';

export default () => {
  return (
    <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
      <Typography.Text>Typography (default)</Typography.Text>
      <Typography.Text variant="secondary">
        Typography (secondary)
      </Typography.Text>
      <Typography.Text variant="success">Typography (success)</Typography.Text>
      <Typography.Text variant="warning">Typography (warning)</Typography.Text>
      <Typography.Text variant="danger">Typography (danger)</Typography.Text>
      <Typography.Text link={{ href: 'https://ant.design', target: '_blank' }}>
        Typography (Link)
      </Typography.Text>
    </div>
  );
};
