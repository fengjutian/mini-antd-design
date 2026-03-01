import { Typography } from 'mini-antd-design';
import React from 'react';

const EllipsisMiddle = (props: { suffixCount: number; children: string }) => {
  const { suffixCount, children } = props;
  const start = children.slice(0, Math.max(0, children.length - suffixCount));
  const suffix = children.slice(-suffixCount);
  const text = `${start}...${suffix}`;

  return (
    <Typography.Text
      ellipsis={{ tooltip: true }}
      style={{ display: 'inline-block', maxWidth: 420 }}
    >
      {text}
    </Typography.Text>
  );
};

export default () => {
  return (
    <EllipsisMiddle suffixCount={12}>
      In the process of internal desktop applications development, many
      different design specs and implementations would be involved.
    </EllipsisMiddle>
  );
};
