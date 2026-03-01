# 全局提示 Message

全局展示操作反馈信息。

## 何时使用

可提供成功、警告和错误等反馈信息。顶部居中显示并自动消失，是一种不打断用户操作的轻量级提示方式。

## 代码演示

### 基础用法

通过 `message.useMessage` 创建支持读取 context 的 `contextHolder`。

请注意，我们推荐通过顶层注册的方式代替 `message` 静态方法，因为静态方法无法消费上下文，因而 `ConfigProvider` 的数据也不会生效。

<code src="./code/base.tsx" title="基本用法"></code>

### 自定义时长

自定义时长 10s，默认时长为 3s。

<code src="./code/config.tsx" title="自定义时长"></code>

### Promise 接口

可以通过 `then` 接口在关闭后运行 callback 。

以上用例将在每个 message 将要结束时通过 `then` 显示新的 message 。

<code src="./code/promise.tsx" title="Promise 接口"></code>

### 自定义样式

通过 `classNames` 和 `styles` 传入对象/函数可以自定义消息的语义化结构样式。

<code src="./code/custom.tsx" title="自定义样式"></code>

### 更新消息内容

可以通过唯一的 `key` 来更新内容。

```tsx
import { Button, toast } from 'mini-antd-design';
import React from 'react';

export default () => {
  const success = () => {
    toast.loading('Action in progress..', { key: 'action-loading' });

    setTimeout(() => {
      toast.success('Loading finished', { key: 'action-loading' });
    }, 1000);
  };

  return (
    <>
      <Button title="Display a loading message" onClick={success} />
    </>
  );
};
```

### 全局配置

当你使用 `ConfigProvider` 进行全局化配置时，系统会默认自动开启 RTL 模式。

(4.3.0+)

当你想单独使用，可通过如下设置开启 RTL 模式。

```js
message.config({
  top: 100,
  duration: 2,
  maxCount: 3,
  rtl: true,
  prefixCls: 'my-message',
});
```

## API

### 静态方法

组件提供了一些静态方法，使用方式和参数如下：

- `message.success(content, [duration], onClose)`
- `message.error(content, [duration], onClose)`
- `message.info(content, [duration], onClose)`
- `message.warning(content, [duration], onClose)`
- `message.loading(content, [duration], onClose)`

| 参数     | 说明                                        | 类型             | 默认值 |
| -------- | ------------------------------------------- | ---------------- | ------ |
| content  | 提示内容                                    | ReactNode config | -      |
| duration | 自动关闭的延时，单位秒。设为 0 时不自动关闭 | number           | 3      |
| onClose  | 关闭时触发的回调函数                        | function         | -      |

组件同时提供 promise 接口。

- `message[level](content, [duration]).then(afterClose)`
- `message[level](content, [duration], onClose).then(afterClose)`

其中 `message[level]` 是组件已经提供的静态方法。`then` 接口返回值是 Promise。

也可以对象的形式传递参数：

- `message.open(config)`
- `message.success(config)`
- `message.error(config)`
- `message.info(config)`
- `message.warning(config)`
- `message.loading(config)`

`config` 对象属性如下：

| 参数         | 说明                                                       | 类型                                                                                      | 默认值 |
| ------------ | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------ |
| className    | 自定义 CSS class                                           | string                                                                                    | -      |
| classNames   | 用于自定义组件内部各语义化结构的 class，支持对象或函数     | Record<SemanticDOM, string> (info: { props })=> Record<SemanticDOM, string>               | -      |
| content      | 提示内容                                                   | ReactNode                                                                                 | -      |
| duration     | 自动关闭的延时，单位秒。设为 0 时不自动关闭                | number                                                                                    | 3      |
| icon         | 自定义图标                                                 | ReactNode                                                                                 | -      |
| pauseOnHover | 悬停时是否暂停计时器                                       | boolean                                                                                   | true   |
| key          | 当前提示的唯一标志                                         | string number                                                                             | -      |
| style        | 自定义内联样式                                             | CSSProperties                                                                             | -      |
| styles       | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | Record<SemanticDOM, CSSProperties> (info: { props })=> Record<SemanticDOM, CSSProperties> | -      |
| onClick      | 点击 message 时触发的回调函数                              | function                                                                                  | -      |

全局方法还提供了全局配置和全局销毁方法：

- `message.config(options)`
- `message.destroy()`

也可通过 `message.destroy(key)` 来关闭一条消息。

### message.config

| 参数         | 说明                                           | 类型              | 默认值              | 版本  |
| ------------ | ---------------------------------------------- | ----------------- | ------------------- | ----- |
| duration     | 默认自动关闭延时，单位秒                       | number            | 3                   | -     |
| getContainer | 配置渲染节点的输出位置，但依旧为全屏展示       | () => HTMLElement | () => document.body | -     |
| maxCount     | 最大显示数，超过限制时，最早的消息会被自动关闭 | number            | -                   | -     |
| prefixCls    | 消息节点的 className 前缀                      | string            | ant-message         | 4.5.0 |
| rtl          | 是否开启 RTL 模式                              | boolean           | false               | -     |
| top          | 消息距离顶部的位置                             | string number     | 8                   | -     |

### Semantic DOM

| 节点    | 说明                                                             | 版本  |
| ------- | ---------------------------------------------------------------- | ----- |
| root    | 根元素，设置固定定位、层级、内边距、背景色、圆角、阴影和动画样式 | 6.0.0 |
| icon    | 图标元素，设置字体大小、右边距和状态颜色样式                     | 6.0.0 |
| content | 内容元素，设置行内块布局、文字颜色和内容展示样式                 | 6.0.0 |

### 主题变量（Design Token）

| Token 名称     | 描述           | 类型                              | 默认值   |
| -------------- | -------------- | --------------------------------- | -------- |
| contentBg      | 提示框背景色   | string                            | #ffffff  |
| contentPadding | 提示框内边距   | Padding<string  number> undefined | 9px 12px |
| zIndexPopup    | 提示框 z-index | number                            | 2010     |

## FAQ

### 为什么 message 不能获取 context、redux 的内容和 ConfigProvider 的 locale/prefixCls/theme 等配置？

直接调用 `message` 方法，antd 会通过 `ReactDOM.render` 动态创建新的 React 实体。其 context 与当前代码所在 context 并不相同，因而无法获取 context 信息。

当你需要 context 信息（例如 ConfigProvider 配置的内容）时，可以通过 `message.useMessage` 方法会返回 api 实体以及 contextHolder 节点。将其插入到你需要获取 context 位置即可：

```tsx
import React from 'react';
import { Button, toast, ToastBridge } from 'mini-antd-design';

export default () => {
  const success = () => {
    toast.success('操作成功');
  };

  return (
    <>
      <ToastBridge />
      <Button title="显示成功提示" onClick={success} />
    </>
  );
};
```

### 异同：

- 通过 hooks 创建的 contextHolder 必须插入到子元素节点中才会生效，当你不需要上下文信息时请直接调用静态方法。
- hooks 方式创建的 message 实例不会共享同一个容器，而静态方法创建的 message 实例会共享一个容器，当你需要不同的配置时，推荐使用 hooks 方式。
- 当你需要在非组件环境下调用 message 时，只能使用静态方法。
