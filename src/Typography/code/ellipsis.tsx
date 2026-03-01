import { Typography } from 'mini-antd-design';
import React, { useState } from 'react';

const article =
  'Ant Design, a design language for background applications, is refined by Ant UED Team. '.repeat(
    8,
  );

export default () => {
  const [ellipsis, setEllipsis] = useState(true);

  return (
    <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
      <label>
        <input
          type="checkbox"
          checked={ellipsis}
          onChange={() => setEllipsis((prev) => !prev)}
        />
        开启省略
      </label>

      <Typography.Paragraph ellipsis={ellipsis}>{article}</Typography.Paragraph>

      <Typography.Paragraph
        ellipsis={
          ellipsis ? { rows: 2, expandable: true, tooltip: true } : false
        }
      >
        {article}
      </Typography.Paragraph>
    </div>
  );
};
