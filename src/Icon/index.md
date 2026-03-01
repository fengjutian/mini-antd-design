---
toc: content
demo:
  cols: 2
---

# 图标 Icon

语义化的矢量图形。

## 何时使用

- 当需要通过图形表达操作含义或状态时，如按钮、菜单、提示。
- 当需要补充文字语义并提升界面识别效率时。

## 代码演示

### 基础用法

<code src="./code/base.tsx" title="基础用法"></code>

### 双色图标

<code src="./code/twoTone.tsx" title="双色图标"></code>

### 自定义 SVG 图标

<code src="./code/custom.tsx" title="自定义 SVG 图标"></code>

### 使用 iconfont

<code src="./code/iconfont.tsx" title="使用 iconfont"></code>

## API

### Icon

| 参数         | 说明                                                  | 类型                                       | 默认值 |
| ------------ | ----------------------------------------------------- | ------------------------------------------ | ------ |
| className    | 设置图标样式名                                        | string                                     | -      |
| rotate       | 图标旋转角度                                          | number                                     | -      |
| spin         | 是否启用旋转动画                                      | boolean                                    | false  |
| style        | 设置图标样式，例如 `fontSize` 和 `color`              | CSSProperties                              | -      |
| twoToneColor | 双色图标主色，支持 `string` 或 `[primary, secondary]` | string \| [string, string]                 | -      |
| component    | 自定义渲染组件，通常是根节点为 `<svg>` 的 React 组件  | ComponentType&lt;CustomIconComponentProps> | -      |

### CustomIconComponentProps

| 参数         | 说明         | 类型                       | 默认值         |
| ------------ | ------------ | -------------------------- | -------------- |
| className    | `svg` 类名   | string                     | -              |
| style        | `svg` 样式   | CSSProperties              | -              |
| rotate       | 旋转角度     | number                     | -              |
| spin         | 是否旋转     | boolean                    | false          |
| twoToneColor | 双色颜色配置 | string \| [string, string] | -              |
| width        | `svg` 宽度   | string \| number           | `1em`          |
| height       | `svg` 高度   | string \| number           | `1em`          |
| fill         | `svg` 填充色 | string                     | `currentColor` |

### createFromIconfontCN

```ts
interface IconfontCNOptions {
  extraCommonProps?: Record<string, unknown>;
  scriptUrl: string | string[];
}

interface IconfontIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  type: string;
  spin?: boolean;
  rotate?: number;
}
```

- `scriptUrl` 支持字符串或字符串数组。
- 多个资源时按数组顺序加载，重名图标由后者覆盖前者。

### 全局方法

#### `setTwoToneColor(color: string | [string, string]): void`

设置全局双色图标主色。

#### `getTwoToneColor(): string`

读取当前全局双色图标主色。

#### `configureIcon(config: IconGlobalConfig): void`

```ts
interface IconGlobalConfig {
  defaultTwoToneColor?: string;
  iconfontScriptUrlWhitelist?: string[];
}
```

- `defaultTwoToneColor`: 默认双色主色。
- `iconfontScriptUrlWhitelist`: iconfont 脚本 URL 白名单前缀。

### IconProvider

```ts
interface IconProviderProps {
  children: React.ReactNode;
  config?: IconGlobalConfig;
}
```

在局部子树内覆盖全局 Icon 配置（如双色主色、iconfont 白名单）。

## 说明

- 当前 `Icon` 为封装组件，API 对齐常用场景。
- 若需完整等价 antd 官方能力，可直接使用 `@ant-design/icons` 对应组件。
