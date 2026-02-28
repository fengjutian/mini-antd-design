# Message

全局展示操作反馈信息。

## 安装

```bash
npm install mini-antd-design
```

## 引入

```jsx | pure
import message from 'mini-antd-design';
// 或使用 Hooks 方式
import { useMessage } from 'mini-antd-design';
```

## 基础用法

### 静态方法

```jsx | pure
import message from 'mini-antd-design';

// 成功提示
message.success('操作成功');

// 错误提示
message.error('操作失败');

// 信息提示
message.info('这是一条信息');

// 警告提示
message.warning('警告信息');

// 加载提示
message.loading('加载中...');
```

### Hooks 方式（推荐）

<code src="./code/base.tsx" title="基本用法"></code>

## Promise 接口

<code src="./code/promise.tsx" title="Promise 示例"></code>

## 全局配置

<code src="./code/config.tsx" title="全局配置"></code>

## 自定义配置

<code src="./code/custom.tsx" title="自定义配置"></code>

## API

### 静态方法

| 方法                                            | 作用                   | 参数                     |
| ----------------------------------------------- | ---------------------- | ------------------------ |
| `message.success(content, [duration], onClose)` | 显示成功提示           | 内容、持续时间、关闭回调 |
| `message.error(content, [duration], onClose)`   | 显示错误提示           | 内容、持续时间、关闭回调 |
| `message.info(content, [duration], onClose)`    | 显示信息提示           | 内容、持续时间、关闭回调 |
| `message.warning(content, [duration], onClose)` | 显示警告提示           | 内容、持续时间、关闭回调 |
| `message.warn(...)`                             | 警告别名（同 warning） | -                        |
| `message.loading(content, [duration], onClose)` | 显示 loading 类型提示  | 内容、持续时间、关闭回调 |
| `message.open(config)`                          | 打开自定义消息         | 配置对象                 |
| `message.config(options)`                       | 全局配置               | 配置对象                 |
| `message.destroy(key?)`                         | 销毁消息               | 消息 key（可选）         |

### Hooks API

```tsx | pure
const [api, contextHolder] = useMessage();
```

- `api`: 与静态方法相同的 API
- `contextHolder`: React 元素，需要插入到组件树中

### 配置项

| 配置项         | 类型          | 说明             |
| -------------- | ------------- | ---------------- |
| `content`      | ReactNode     | 提示内容         |
| `duration`     | number        | 持续时间（秒）   |
| `icon`         | ReactNode     | 自定义图标       |
| `key`          | stringnumber  | 唯一标识         |
| `style`        | CSSProperties | 自定义样式       |
| `className`    | string        | 自定义类名       |
| `pauseOnHover` | boolean       | 鼠标悬停暂停计时 |
| `onClick`      | () => void    | 点击回调         |

### 全局配置项

| 配置项         | 类型              | 说明                   |
| -------------- | ----------------- | ---------------------- |
| `top`          | number            | 提示距离顶部的偏移位置 |
| `duration`     | number            | 默认持续时间（秒）     |
| `maxCount`     | number            | 最大同时显示数         |
| `prefixCls`    | string            | 覆盖 class 前缀        |
| `rtl`          | boolean           | 是否启用 RTL           |
| `getContainer` | () => HTMLElement | 自定义渲染容器         |
