---
toc: content
demo:
  cols: 2
---

# 图标 Icon

语义化的矢量图形。

## 何时使用

- 在桌面应用程序中，通常使用图形来辅助文字表达，帮助用户更直观地理解操作。
- 图标可以作为按钮、菜单的视觉指示器。

## 代码演示

#### 基础用法

使用 `<Icon />` 组件渲染图标。可以通过 `component` 属性传入自定义 SVG 组件，也可以直接使用 `@ant-design/icons` 包提供的图标。

不同主题的 Icon 组件名为图标名加主题作为后缀，例如：

- `StarOutlined` - 线框风格
- `StarFilled` - 实心风格
- `StarTwoTone` - 双色风格

可以通过设置 `spin` 属性来实现动画旋转效果。

<code src="./code/base.tsx" title="基础用法"></code>

#### 双色图标

通过 `setTwoToneColor` 和 `getTwoToneColor` 全局设置图标主色。

<code src="./code/twoTone.tsx" title="双色图标"></code>

#### 自定义 SVG 图标

通过 `component` 属性传入一个 SVG 组件来渲染图标。

<code src="./code/custom.tsx" title="自定义 SVG"></code>

#### 使用 iconfont

通过 `createFromIconfontCN` 方法创建基于 iconfont.cn 的图标组件。

<code src="./code/iconfont.tsx" title="iconfont 图标"></code>

## API

### Icon

| 参数         | 说明                                                                 | 类型                                      | 默认值 | 版本 |
| ------------ | -------------------------------------------------------------------- | ----------------------------------------- | ------ | ---- |
| className    | 设置图标的样式名                                                     | string                                    | -      |      |
| rotate       | 图标旋转角度（IE9 无效）                                             | number                                    | -      |      |
| spin         | 是否有旋转动画                                                       | boolean                                   | false  |      |
| style        | 设置图标的样式，例如 fontSize 和 color                               | CSSProperties                             | -      |      |
| twoToneColor | 仅适用于双色图标。设置双色图标的主要颜色，支持设置十六进制颜色字符串 | string \| string[]                        | -      |      |
| component    | 控制如何渲染图标，通常是一个渲染根标签为 `<svg>` 的 React 组件       | ComponentType\<CustomIconComponentProps\> | -      |      |

### CustomIconComponentProps

通过 `component` 属性传入的组件会接收以下 props：

| 参数      | 说明                  | 类型          | 只读值        |
| --------- | --------------------- | ------------- | ------------- |
| className | 计算后的 svg 类名     | string        | -             |
| style     | 计算后的 svg 元素样式 | CSSProperties | -             |
| rotate    | 图标旋转角度          | number        | -             |
| spin      | 是否有旋转动画        | boolean       | -             |
| viewBox   | svg viewBox 属性      | string        | 0 0 1024 1024 |
| children  | svg 子元素            | ReactNode     | -             |

### 全局方法

#### setTwoToneColor(color: string | string[]): void

设置双色图标的主色。

```tsx
import { setTwoToneColor } from 'mini-antd-design';

setTwoToneColor('#eb2f96');
```

#### getTwoToneColor(): string

获取当前双色图标的主色。

```tsx
import { getTwoToneColor } from 'mini-antd-design';

const color = getTwoToneColor(); // '#1890ff'
```

#### createFromIconfontCN(options: IconfontCNOptions): ComponentType\<IconfontIconProps\>

创建一个基于 iconfont.cn 的图标组件。

从 @ant-design/icons@4.1.0 开始，scriptUrl 可引用多个资源，用户可灵活的管理 iconfont.cn 图标。如果资源的图标出现重名，会按照数组顺序进行覆盖。

```tsx
import { createFromIconfontCN } from 'mini-antd-design';

const MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
});
```

##### IconfontCNOptions

| 参数             | 说明                                              | 类型                      | 默认值 | 版本                                  |
| ---------------- | ------------------------------------------------- | ------------------------- | ------ | ------------------------------------- |
| extraCommonProps | 给所有的 svg 图标组件设置额外的属性               | Record\<string, unknown\> | {}     |                                       |
| scriptUrl        | iconfont.cn 项目在线生成的 js 地址，支持 string[] | string \| string[]        | -      | @ant-design/icons@4.1.0 支持 string[] |

##### IconfontIconProps

通过 `createFromIconfontCN` 创建的图标组件支持以下 props：

| 参数      | 说明                                     | 类型          | 默认值 |
| --------- | ---------------------------------------- | ------------- | ------ |
| type      | 图标的名称，对应 iconfont 项目中的图标名 | string        | -      |
| className | 设置图标的样式名                         | string        | -      |
| style     | 设置图标的样式，例如 fontSize 和 color   | CSSProperties | -      |
| spin      | 是否有旋转动画                           | boolean       | false  |
| rotate    | 图标旋转角度                             | number        | -      |

#### configureIcon(config: IconGlobalConfig): void

配置 Icon 全局选项。

```tsx
import { configureIcon } from 'mini-antd-design';

configureIcon({
  defaultTwoToneColor: '#1890ff',
});
```

##### IconGlobalConfig

| 参数                       | 说明                      | 类型     | 默认值  |
| -------------------------- | ------------------------- | -------- | ------- |
| defaultTwoToneColor        | 设置默认的双色图标主色    | string   | #1890ff |
| iconfontScriptUrlWhitelist | iconfont scriptUrl 白名单 | string[] | -       |

## 关于 SVG 图标

从 3.9.0 开始，使用 SVG 图标替换了原先的 font 图标，从而带来了以下优势：

- 完全离线化使用，不需要从 CDN 下载字体文件，图标不会因为网络问题呈现方块，也无需字体文件本地部署。
- 在低端设备上 SVG 有更好的清晰度。
- 支持多色图标。
- 对于内建图标的更换可以提供更多 API，而不需要进行样式覆盖。

所有的图标都会以 `<svg>` 标签渲染，可以使用 `style` 和 `className` 设置图标的大小和单色图标的颜色。

```tsx
import { MessageOutlined } from '@ant-design/icons';

<MessageOutlined style={{ fontSize: '16px', color: '#08c' }} />;
```

## 主题变量（Design Token）

| Token 名称          | 描述         | 类型   | 默认值    |
| ------------------- | ------------ | ------ | --------- |
| colorTextQuaternary | 图标禁用颜色 | string | #bfbfbf   |
| colorTextTertiary   | 图标次级颜色 | string | #8c8c8c   |
| colorTextSecondary  | 图标默认颜色 | string | #595959   |
| colorText           | 图标主要颜色 | string | #000000e0 |
| colorPrimary        | 图标主题色   | string | #1890ff   |

## FAQ

### 为什么有时 icon 注入的样式会引起全局样式异常？

相关 issue：#54391。启用 layer 时，icon 的样式可能会影响全局样式。
