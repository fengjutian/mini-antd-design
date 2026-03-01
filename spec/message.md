# PRD：全局消息提示（Message）能力封装（Ant Design v6）

## 0. 背景与目标

**背景**

- 各业务模块对成功/失败/警告/信息/加载提示实现分散，导致体验和策略不一致。
- 直接使用静态 API 时，难以稳定消费 `ConfigProvider/App` 上下文（theme/locale/prefixCls/container）。

**目标**

- 基于 Ant Design v6 Message 能力，提供统一封装 `toast` API。
- 支持全局策略与上下文一致性，保证可预测、可测试、可维护。

## 1. 范围

### 1.1 In Scope

- `success / error / warning / info / loading / open`
- 全局配置：`top / duration / maxCount / getContainer`
- `key` 更新同一条消息（loading -> success/error）
- `destroy()` 与 `destroy(key)`
- Bridge 模式接入 `App.useApp()` 上下文实例
- SSR/非浏览器环境降级保护

### 1.2 Out of Scope

- Notification 中心与长期消息流
- 富交互内容容器（应使用 Modal/Drawer）
- 复杂动效系统

## 2. 术语

- **静态 API**：直接调用全局 `message.xxx`。
- **实例 API**：通过 `App.useApp()` 或 hooks 获取实例。
- **Bridge**：根节点中注入实例到封装层的桥接组件。

## 3. 功能需求（FR）

### FR-001 展示与类型

- AC
- 支持 `success/error/warning/info/loading/open`。
- 默认不阻断用户交互。
- 支持 `ReactNode` 内容。

### FR-002 时长与关闭策略

- AC
- `duration > 0` 自动关闭。
- `duration = 0` 不自动关闭，仅可被更新或销毁关闭。

### FR-003 并发与上限

- AC
- 同时展示数量不超过 `maxCount`。
- 超出上限时按队列淘汰旧项。

### FR-004 同 key 更新

- AC
- 相同 `key` 的后续调用更新同一条，不新增。

### FR-005 销毁能力

- AC
- `destroy()` 清空全部。
- `destroy(key)` 仅移除目标消息。

### FR-006 回调与 thenable

- AC
- `onClose` 在关闭后触发。
- thenable 可在关闭后链式执行。

## 4. 非功能需求（NFR）

- NFR-001 统一体验：默认位置、时长、上限由封装层统一。
- NFR-002 封装边界：业务不直接散落 `message.config()`。
- NFR-003 上下文一致：优先实例 API，消费 `ConfigProvider/App`。
- NFR-004 可测试性：支持稳定 key 和 `data-testid`。
- NFR-005 安全：禁止 HTML 注入式文案渲染。

## 5. 边界与异常（EC）

- EC-001 高频触发：受 `maxCount` 限制，避免刷屏。
- EC-002 路由切换：容器卸载与计时器清理。
- EC-003 SSR：`window/document` 判空并降级。
- EC-004 Bridge 未初始化：允许降级调用并给开发告警。
- EC-005 非法内容：拒绝 `dangerouslySetInnerHTML`。

## 6. API 设计

```ts
export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading';

export interface ToastOptions {
  key?: string | number;
  duration?: number;
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClose?: () => void;
  onClick?: () => void;
}

export interface ToastAPI {
  success(content: React.ReactNode, options?: ToastOptions): Thenable;
  error(content: React.ReactNode, options?: ToastOptions): Thenable;
  info(content: React.ReactNode, options?: ToastOptions): Thenable;
  warning(content: React.ReactNode, options?: ToastOptions): Thenable;
  loading(content: React.ReactNode, options?: ToastOptions): Thenable;
  open(
    type: ToastType,
    content: React.ReactNode,
    options?: ToastOptions,
  ): Thenable;
  destroy(key?: string | number): void;
}

export interface ToastGlobalConfig {
  top?: number;
  duration?: number;
  maxCount?: number;
  getContainer?: () => HTMLElement;
}

export function configureToast(config: ToastGlobalConfig): void;
```

## 7. 实现策略

### 7.1 推荐

- Root：`<ConfigProvider><App><ToastBridge />...</App></ConfigProvider>`
- Bridge 注入实例；业务统一调用封装 `toast`。

### 7.2 降级

- 无实例时降级到静态实现。
- 非浏览器环境使用 no-op thenable。

### 7.3 差异声明

- 对外只暴露稳定字段，不透出全部 antd message 内部能力。

## 8. 示例

```ts
toast.loading('提交中...', { key: 'submit', duration: 0 });
toast.success('提交成功', { key: 'submit', duration: 2 });
```

## 9. 强约束

1. 禁止业务散落使用 `message.config`。
2. P0 流程必须使用 `key` 更新。
3. `duration=0` 必须有关闭闭环。
4. 必须具备 SSR 与卸载清理。

## 10. 兼容与迁移

- 锁定 antd v6 类型语义。
- 实例 API 优先于静态 API。

## 11. 测试最小集

- TC-001 默认渲染与自动关闭。
- TC-002 `duration=0` + 同 key 更新。
- TC-003 `maxCount` 限制。
- TC-004 `destroy()` / `destroy(key)`。
- TC-005 上下文一致性与 SSR 降级。

## 12. DoD

- 封装模块可用，Bridge 接入完成。
- 文档示例可运行。
- 核心测试通过，`build` 通过。
