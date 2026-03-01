import { Typography } from 'mini-antd-design';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState('This is an editable text.');
  const [limited, setLimited] = useState(
    'This is an editable text with limited length.',
  );

  return (
    <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
      <Typography.Text
        editable={{ value, onChange: setValue, onEnd: () => void 0 }}
      >
        {value}
      </Typography.Text>

      <Typography.Paragraph
        editable={{ value: limited, onChange: setLimited, maxLength: 50 }}
      >
        {limited}
      </Typography.Paragraph>
    </div>
  );
};
