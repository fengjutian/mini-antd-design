import { Typography } from 'mini-antd-design';
import React from 'react';

export default () => {
  return (
    <div>
      <Typography.Title>Introduction</Typography.Title>
      <Typography.Paragraph>
        In the process of internal desktop applications development, many
        different design specs and implementations would be involved.
      </Typography.Paragraph>

      <Typography.Title level={2}>Guidelines and Resources</Typography.Title>
      <Typography.Paragraph>
        We supply practical patterns and high quality design resources.
      </Typography.Paragraph>

      <Typography.Paragraph>
        <ul>
          <li>
            <Typography.Text
              link={{ href: 'https://ant.design', target: '_blank' }}
            >
              Ant Design
            </Typography.Text>
          </li>
        </ul>
      </Typography.Paragraph>

      <Typography.Paragraph>
        按 <Typography.Text>Esc</Typography.Text> 键退出阅读。
      </Typography.Paragraph>
    </div>
  );
};
