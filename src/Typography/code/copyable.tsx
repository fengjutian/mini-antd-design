import { Typography } from 'mini-antd-design';
import React from 'react';

export default () => {
  return (
    <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
      <Typography.Paragraph copyable>
        This is a copyable text.
      </Typography.Paragraph>
      <Typography.Paragraph copyable={{ text: 'Hello, Typography!' }}>
        Replace copy text.
      </Typography.Paragraph>
      <Typography.Text copyable={{ text: 'text to be copied' }}>
        Click copy button.
      </Typography.Text>
    </div>
  );
};
