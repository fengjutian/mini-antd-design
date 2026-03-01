---
toc: content
demo:
  cols: 2
---

# 排版 Typography

文本的基本格式。

## 何时使用

- 当需要展示标题、段落、列表内容时使用，如文章/博客/日志的文本样式。
- 当需要一列基于文本的基础操作时，如拷贝/省略/可编辑。

## 代码演示

### 基本

<code src="./code/base.tsx" title="基本"></code>

### 标题组件

<code src="./code/title.tsx" title="标题组件"></code>

### 文本与超链接组件

<code src="./code/text-link.tsx" title="文本与超链接组件"></code>

### 可编辑

<code src="./code/editable.tsx" title="可编辑"></code>

### 可复制

<code src="./code/copyable.tsx" title="可复制"></code>

### 省略号

<code src="./code/ellipsis.tsx" title="省略号"></code>

### 受控省略展开/收起

<code src="./code/ellipsis-controlled.tsx" title="受控省略展开/收起"></code>

### 省略中间

<code src="./code/ellipsis-middle.tsx" title="省略中间"></code>

### 后缀

<code src="./code/ellipsis-suffix.tsx" title="后缀"></code>

## API

### Typography.Text

| 参数      | 说明                                                                  | 类型                                                            | 默认值 |
| --------- | --------------------------------------------------------------------- | --------------------------------------------------------------- | ------ |
| code      | 添加代码样式                                                          | boolean                                                         | false  |
| copyable  | 是否可拷贝，为对象时可进行各种自定义                                  | boolean \| copyable                                             | false  |
| delete    | 添加删除线样式                                                        | boolean                                                         | false  |
| disabled  | 禁用文本                                                              | boolean                                                         | false  |
| editable  | 是否可编辑，为对象时可对编辑进行控制                                  | boolean \| editable                                             | false  |
| ellipsis  | 自动溢出省略，为对象时不能设置省略行数、是否可展开、onExpand 展开事件 | boolean \| Omit<ellipsis, 'expandable' \| 'rows' \| 'onExpand'> | false  |
| keyboard  | 添加键盘样式                                                          | boolean                                                         | false  |
| mark      | 添加标记样式                                                          | boolean                                                         | false  |
| onClick   | 点击 Text 时的回调                                                    | (event) => void                                                 | -      |
| strong    | 是否加粗                                                              | boolean                                                         | false  |
| italic    | 是否斜体                                                              | boolean                                                         | false  |
| type      | 文本类型                                                              | `secondary` \| `success` \| `warning` \| `danger`               | -      |
| underline | 添加下划线样式                                                        | boolean                                                         | false  |

### Typography.Title

| 参数      | 说明                                                         | 类型                                              | 默认值 |
| --------- | ------------------------------------------------------------ | ------------------------------------------------- | ------ |
| code      | 添加代码样式                                                 | boolean                                           | false  |
| copyable  | 是否可拷贝，为对象时可进行各种自定义                         | boolean \| copyable                               | false  |
| delete    | 添加删除线样式                                               | boolean                                           | false  |
| disabled  | 禁用文本                                                     | boolean                                           | false  |
| editable  | 是否可编辑，为对象时可对编辑进行控制                         | boolean \| editable                               | false  |
| ellipsis  | 自动溢出省略，为对象时可设置省略行数、是否可展开、添加后缀等 | boolean \| ellipsis                               | false  |
| level     | 重要程度，相当于 `h1`、`h2`、`h3`、`h4`、`h5`                | number: 1,2,3,4,5                                 | 1      |
| mark      | 添加标记样式                                                 | boolean                                           | false  |
| onClick   | 点击 Title 时的回调                                          | (event) => void                                   | -      |
| italic    | 是否斜体                                                     | boolean                                           | false  |
| type      | 文本类型                                                     | `secondary` \| `success` \| `warning` \| `danger` | -      |
| underline | 添加下划线样式                                               | boolean                                           | false  |

### Typography.Paragraph

| 参数      | 说明                                                         | 类型                                              | 默认值 |
| --------- | ------------------------------------------------------------ | ------------------------------------------------- | ------ |
| code      | 添加代码样式                                                 | boolean                                           | false  |
| copyable  | 是否可拷贝，为对象时可进行各种自定义                         | boolean \| copyable                               | false  |
| delete    | 添加删除线样式                                               | boolean                                           | false  |
| disabled  | 禁用文本                                                     | boolean                                           | false  |
| editable  | 是否可编辑，为对象时可对编辑进行控制                         | boolean \| editable                               | false  |
| ellipsis  | 自动溢出省略，为对象时可设置省略行数、是否可展开、添加后缀等 | boolean \| ellipsis                               | false  |
| mark      | 添加标记样式                                                 | boolean                                           | false  |
| onClick   | 点击 Paragraph 时的回调                                      | (event) => void                                   | -      |
| strong    | 是否加粗                                                     | boolean                                           | false  |
| italic    | 是否斜体                                                     | boolean                                           | false  |
| type      | 文本类型                                                     | `secondary` \| `success` \| `warning` \| `danger` | -      |
| underline | 添加下划线样式                                               | boolean                                           | false  |

### copyable

```ts
interface CopyableConfig {
  text: string | (() => string | Promise<string>);
  onCopy: (event: Event) => void;
  icon: React.ReactNode;
  tooltips: false | [React.ReactNode, React.ReactNode];
  format: 'text/plain' | 'text/html';
  tabIndex: number;
}
```

### editable

```ts
interface EditableConfig {
  icon: React.ReactNode;
  tooltip: React.ReactNode | false;
  editing: boolean;
  maxLength: number;
  autoSize: boolean | { minRows: number; maxRows: number };
  text: string;
  onChange: (value: string) => void;
  onCancel: () => void;
  onStart: () => void;
  onEnd: () => void;
  triggerType: Array<'icon' | 'text'>;
  enterIcon: React.ReactNode | null;
  tabIndex: number;
}
```

### ellipsis

```ts
interface EllipsisConfig {
  rows: number;
  expandable: boolean | 'collapsible';
  suffix: string;
  symbol: React.ReactNode | ((expanded: boolean) => React.ReactNode);
  tooltip: React.ReactNode;
  defaultExpanded: boolean;
  expanded: boolean;
  onExpand: (event: MouseEvent, info: { expanded: boolean }) => void;
  onEllipsis: (ellipsis: boolean) => void;
}
```

## 主题变量（Design Token）

### 组件 Token (Typography)

| Token 名称        | 描述       | 类型             | 默认值 |
| ----------------- | ---------- | ---------------- | ------ |
| titleMarginBottom | 标题下间距 | string \| number | 0.5em  |
| titleMarginTop    | 标题上间距 | string \| number | 1.2em  |

## 说明

- 页面示例结构与 antd Typography 文档保持一致。
- 当前项目 `Typography` 为封装组件，部分能力为收敛版，若需完全等价 antd 原生行为请直接使用 antd 官方组件能力。
