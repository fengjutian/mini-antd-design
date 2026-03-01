---
toc: content
---

# 排版 Typography

统一封装的文本能力组件，提供 `Text`、`Title`、`Paragraph`，并内置 `copyable`、`editable`、`ellipsis` 与安全链接策略。

## 何时使用

- 需要统一文本语义（default/secondary/success/warning/danger）。
- 需要可复制、可编辑、省略与展开能力。
- 需要统一安全链接策略（自动处理 `target="_blank"` 的 `rel`）。

## 基础示例

```tsx
import React from 'react';
import { Typography } from 'mini-antd-design';

export default () => {
  return (
    <>
      <Typography.Title level={2}>标题</Typography.Title>
      <Typography.Text variant="secondary">次级文本</Typography.Text>
      <Typography.Paragraph ellipsis={{ rows: 2, expandable: true }}>
        这是一段很长很长的内容，这是一段很长很长的内容，这是一段很长很长的内容。
      </Typography.Paragraph>
    </>
  );
};
```

## API

### Typography.Text / Typography.Paragraph

| 参数      | 说明         | 类型                                                                                                      | 默认值      |
| --------- | ------------ | --------------------------------------------------------------------------------------------------------- | ----------- |
| variant   | 文本语义     | `'default' \| 'secondary' \| 'success' \| 'warning' \| 'danger'`                                          | `'default'` |
| copyable  | 是否可复制   | `boolean \| { text?: string; onCopy?: () => void }`                                                       | `false`     |
| editable  | 是否可编辑   | `boolean \| { value?: string; onChange?: (val: string) => void; maxLength?: number; onEnd?: () => void }` | `false`     |
| ellipsis  | 省略配置     | `boolean \| { rows?: number; expandable?: boolean; tooltip?: boolean }`                                   | `false`     |
| link      | 安全链接配置 | `{ href: string; target?: '_blank' \| '_self' }`                                                          | -           |
| disabled  | 是否禁用     | `boolean`                                                                                                 | `false`     |
| className | 自定义类名   | `string`                                                                                                  | -           |
| style     | 行内样式     | `CSSProperties`                                                                                           | -           |

### Typography.Title

在上表基础上新增：

| 参数  | 说明     | 类型                    | 默认值 |
| ----- | -------- | ----------------------- | ------ |
| level | 标题等级 | `1 \| 2 \| 3 \| 4 \| 5` | `1`    |

### 全局配置

```ts
import { configureTypography } from 'mini-antd-design';

configureTypography({
  defaultEllipsisRows: 2,
  enableTooltipByDefault: true,
  linkTarget: '_blank',
});
```
