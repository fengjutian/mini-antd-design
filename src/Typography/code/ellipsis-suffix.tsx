import { Typography } from 'mini-antd-design';
import React, { useMemo, useState } from 'react';

const article =
  'To be, or not to be, that is the question: Whether it is nobler in the mind to suffer.';

export default () => {
  const [rows, setRows] = useState(1);
  const text = useMemo(() => `${article} --William Shakespeare`, []);

  return (
    <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
      <label>
        行数：
        <input
          type="range"
          min={1}
          max={5}
          value={rows}
          onChange={(e) => setRows(Number(e.target.value))}
        />
        {rows}
      </label>

      <Typography.Paragraph
        ellipsis={{ rows, expandable: true, tooltip: true }}
      >
        {text}
      </Typography.Paragraph>
    </div>
  );
};
