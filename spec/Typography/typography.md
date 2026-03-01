# PRD：Typography 能力统一封装（Ant Design v6）

> 基于 Ant Design v6 的 Typography 组件体系进行二次封装，形成统一文本能力层，面向代码生成与业务复用。

---

## 0. 背景与目标

### 背景

当前业务中对文本展示（标题、正文、次级文本、说明文本、可编辑文本、可复制文本、可省略文本）存在以下问题：

- 直接使用 antd 原生 `Typography.*`，风格分散
- 不同模块对 `ellipsis`、`copyable`、`editable` 使用不一致
- 主题（token）、国际化（locale）、容器（App/ConfigProvider）未统一消费
- 代码生成场景下，文本组件调用方式不稳定
- SSR / 容器卸载场景存在副作用风险

### 目标

基于 Ant Design v6 Typography 能力，封装统一文本组件层：

- 提供统一语义组件：`Text / Title / Paragraph`
- 提供统一扩展能力：`copy / edit / ellipsis / tooltip / link`
- 屏蔽 antd 复杂字段，暴露稳定 API
- 保证主题、国际化、prefixCls、容器一致
- 面向代码生成场景提供“可预测 API”

---

## 1. 范围（In Scope / Out of Scope）

### In Scope

- Title（h1–h5）
- Text（正文/次级/危险/成功等语义）
- Paragraph（段落）
- 可复制能力（copyable）
- 可编辑能力（editable）
- 省略能力（ellipsis：多行/tooltip/expandable）
- Link（安全跳转策略封装）
- 支持组件式 + 轻量配置式调用
- 全局默认策略配置（ellipsis 默认行数、copy icon、tooltip 等）

### Out of Scope

- 富文本编辑器（请使用 Editor 组件）
- Markdown 渲染能力
- 复杂排版系统（Grid + Typography 混排方案）
- 动态排版引擎

---

## 2. 术语

- **语义文本**：具有视觉语义的文本（secondary、danger、warning 等）
- **可编辑文本**：支持点击后转为输入态
- **可复制文本**：提供一键复制能力
- **省略文本**：超出行数折叠显示
- **Context**：由 ConfigProvider / App 提供的主题、prefixCls、locale

---

## 3. 用户故事 / 需求点

---

### FR-001：统一语义文本能力

作为开发者，在业务页面中需要快速输出语义化文本。

**AC**

- 支持 variant：`default | secondary | success | warning | danger`
- 默认字体尺寸与设计系统一致
- 自动消费主题 token
- 支持 className / style 透传

---

### FR-002：可复制能力（copyable）

作为用户，我希望一键复制文本。

**AC**

- 支持自定义复制内容
- 支持成功提示文案（国际化）
- 支持禁用
- 不允许注入 HTML
- 复制后回调 onCopy

---

### FR-003：可编辑能力（editable）

作为用户，我可以点击文本进入编辑态。

**AC**

- 支持受控 value
- 支持 maxLength
- 支持 onChange / onEnd
- 编辑态 ESC 取消
- 不污染外部状态

---

### FR-004：省略能力（ellipsis）

作为用户，长文本应自动省略。

**AC**

- 支持单行 / 多行
- 支持 tooltip 展示完整文本
- 支持 expandable（展开按钮）
- SSR 不报错
- 容器卸载自动清理 resize observer

---

### FR-005：安全链接封装

作为开发者，我希望安全地使用 Link。

**AC**

- 自动添加 `rel="noopener noreferrer"`
- 支持 target="\_blank"
- 支持权限禁用
- 非 http(s) 链接 warning（开发环境）

---

### FR-006：更新与受控能力

**AC**

- value 受控优先
- defaultValue 仅初始化生效
- 同 key 更新不触发重新 mount

---

## 4. 非功能需求（NFR）

- NFR-001：统一体验
  字体、间距、语义色值统一来自 token

- NFR-002：禁止业务直接使用
  禁止 import:

  ```ts
  import { Typography } from 'antd';
  ```

- NFR-003：上下文一致性
  必须消费 ConfigProvider/App

- NFR-004：可测试性
  支持 data-testid

- NFR-005：可观测性（可选）
  支持埋点：copy/edit/expand

---

## 5. 边界条件与异常处理

- EC-001：高频渲染
  避免重复创建 ellipsis observer

- EC-002：路由切换
  卸载时清理 resize listener

- EC-003：SSR
  window 判空保护

- EC-004：权限缺失
  editable/copyable 自动禁用

- EC-005：安全
  禁止 dangerouslySetInnerHTML

---

## 6. API 设计

路径：

```
src/shared/ui/typography/index.tsx
```

---

### 6.1 对外 API

```ts
export type TextVariant =
  | 'default'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger';

export interface BaseTextOptions {
  variant?: TextVariant;
  copyable?:
    | boolean
    | {
        text?: string;
        onCopy?: () => void;
      };
  editable?:
    | boolean
    | {
        value?: string;
        onChange?: (val: string) => void;
        maxLength?: number;
      };
  ellipsis?:
    | boolean
    | {
        rows?: number;
        expandable?: boolean;
        tooltip?: boolean;
      };
  link?: {
    href: string;
    target?: '_blank' | '_self';
  };
  disabled?: boolean;
}

export interface TypographyAPI {
  Text: React.FC<BaseTextOptions>;
  Title: React.FC<BaseTextOptions & { level?: 1 | 2 | 3 | 4 | 5 }>;
  Paragraph: React.FC<BaseTextOptions>;
}
```

---

### 6.2 全局配置

```ts
export interface TypographyGlobalConfig {
  defaultEllipsisRows?: number;
  enableTooltipByDefault?: boolean;
  linkTarget?: '_blank' | '_self';
}

export function configureTypography(config: TypographyGlobalConfig): void;
```

---

## 7. 实现方案（Ant Design v6）

### 7.1 推荐方案：基于 App 上下文封装

- Root:

```tsx
<ConfigProvider>
  <App>
    <TypographyProvider>
      <AppRoot />
    </TypographyProvider>
  </App>
</ConfigProvider>
```

- 内部使用：

  - `App.useApp()` 获取上下文
  - 封装 antd `Typography.Text`
  - 收敛 copyable/editable 字段

---

### 7.2 降级方案

- 无 App Context → 使用原生 Typography
- SSR → 自动禁用 ellipsis resize 监听
- 开发环境 console.warn

---

### 7.3 与 antd 差异说明

- 不暴露全部 antd props
- 收敛 editable/copyable 类型
- 默认 tooltip=true（如开启 ellipsis）
- Link 自动加安全策略
- 锁定 [antd@6.x](mailto:antd@6.x) 类型定义

---

## 8. 代码示例（业务侧）

### 8.1 基础用法

```tsx
<Typography.Text>默认文本</Typography.Text>
```

---

### 8.2 可复制

```tsx
<Typography.Text copyable>订单号：123456</Typography.Text>
```

---

### 8.3 可编辑

```tsx
<Typography.Text
  editable={{
    value,
    onChange: setValue,
  }}
>
  {value}
</Typography.Text>
```

---

### 8.4 多行省略

```tsx
<Typography.Paragraph
  ellipsis={{
    rows: 2,
    expandable: true,
  }}
>
  超长文本...
</Typography.Paragraph>
```

---

## 9. 注意事项（强约束）

1. 禁止业务直接使用 antd Typography
2. 所有 link 必须经过安全封装
3. ellipsis + expandable 必须可测试
4. 不允许 dangerouslySetInnerHTML
5. copyable 默认隐藏 icon hover 才显示

---

## 10. v6 版本差异说明

- Typography API 类型收敛
- copyable/editable 行为统一 Promise 化
- token 使用 css-in-js v6 体系
- ellipsis 内部 resize 机制优化

---

## 11. 测试用例（最小集）

- TC-001：默认渲染
- TC-002：copyable 回调触发
- TC-003：editable 受控模式
- TC-004：ellipsis 展开
- TC-005：SSR 渲染
- TC-006：link 安全属性

---

## 12. 交付物

- 封装模块
- 全局配置
- Provider 接入
- PRD 文档
- 单测覆盖核心能力
- 示例页面
