import { Typography } from 'mini-antd-design';
import React, { useState } from 'react';

const content =
  'Ant Design, a design language for background applications, is refined by Ant UED Team. '.repeat(
    12,
  );

export default () => {
  const [rows, setRows] = useState(2);
  const [enabled, setEnabled] = useState(true);

  return (
    <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
      <label>
        行数：
        <input
          type="range"
          min={1}
          max={6}
          value={rows}
          onChange={(e) => setRows(Number(e.target.value))}
        />
        {rows}
      </label>
      <label>
        <input
          type="checkbox"
          checked={enabled}
          onChange={() => setEnabled((prev) => !prev)}
        />
        开启省略
      </label>

      <Typography.Paragraph
        ellipsis={enabled ? { rows, expandable: true, tooltip: true } : false}
      >
        {content}
      </Typography.Paragraph>
    </div>
  );
};
