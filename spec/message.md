# PRD：全局消息提示（Message）能力封装（Ant Design v6）

## 0. 背景与目标

**背景**：项目需要统一的全局操作反馈提示（成功/失败/警告/信息/加载中），避免各页面自行实现导致样式、时机、文案、关闭策略不一致。  
**目标**：基于 Ant Design v6 的 Message 能力，提供一套可在任意业务模块调用的统一 API，并确保在主题/国际化/容器等上下文下表现一致。

---

## 1. 范围（In Scope / Out of Scope）

### In Scope

- 全局消息提示：`success / error / warning / info / loading`
- 支持静态调用与可消费 Context 的调用方式（推荐）
- 支持全局配置（top/duration/maxCount/getContainer 等）
- 支持 key 更新同一条消息（加载 → 成功/失败）
- 支持销毁全部/按 key 销毁
- 支持 Promise/thenable 链式回调（消息关闭后执行）

### Out of Scope（明确不做）

- 复杂通知中心（请用 Notification）
- 持久化消息列表/历史记录
- 自定义渲染动画引擎（只做 API 封装与参数规范）

---

## 2. 术语

- **静态 API**：`message.success(...)` 这类全局静态调用。
- **实例 API（可消费 Context）**：通过 `message.useMessage()` 或 `App.useApp()` 获取的 message 实例。
- **Context**：`ConfigProvider/App` 提供的主题、国际化、前缀、容器等配置。

---

## 3. 用户故事 / 需求点（Functional Requirements）

### FR-001：展示消息

- 作为用户，我在执行操作（保存/删除/提交）后，应看到对应的成功/失败/提示信息。
- 类型：
  - 成功：`success`
  - 失败：`error`
  - 警告：`warning`
  - 信息：`info`
  - 进行中：`loading`

**验收标准（AC）**

- 调用 API 后消息可见，且不会阻塞页面交互。
- 默认显示位置符合全局配置（默认顶部），持续时间默认值按全局配置。
- 文案支持 ReactNode（可带高亮/链接/组件）。

### FR-002：自动关闭与持续时间

- 默认自动关闭。
- 支持 `duration = 0`：不自动关闭，必须手动关闭或被更新/销毁。

**AC**

- `duration > 0`：到期自动关闭
- `duration = 0`：不会自动关闭

### FR-003：最大并发数量控制

- 支持 `maxCount` 限制同时展示的消息数量，超过时按 AntD 行为淘汰。

**AC**

- 当同时触发多条 message，最大显示数量不超过 `maxCount`。

### FR-004：同 key 更新（推荐用法）

- 业务常见流程：先 `loading`，后更新为 `success/error`，且不产生多条堆叠。

**AC**

- `key` 相同的 message 后续调用会更新同一条（不新增一条）。

### FR-005：销毁

- 支持销毁全部消息
- 支持按 key 销毁指定消息

**AC**

- `destroy()` 后页面无任何 message
- `destroy(key)` 后对应 key 的 message 消失

### FR-006：关闭后回调 / 链式执行

- 支持 `onClose` 或 thenable `.then()` 在关闭后触发逻辑（如跳转、刷新）。

**AC**

- 到期关闭 / 手动关闭 / destroy 触发后，回调可执行（以 antd 实际行为为准，见“版本差异”）

---

## 4. 非功能需求（NFR）

- NFR-001：统一体验  
  全项目 message 位置、持续时间、最大数量、容器策略一致。
- NFR-002：不污染业务代码  
  业务仅调用封装层 API，不直接散落使用 `message.config(...)`。
- NFR-003：上下文一致性  
  支持跟随 `ConfigProvider/App` 的主题与国际化配置（优先使用实例 API）。

---

## 5. 边界条件与异常处理（Edge Cases）

- EC-001：频繁触发  
  连续触发大量消息时，不应无限堆叠；受 `maxCount` 控制。
- EC-002：重复提交  
  同一操作多次触发应使用同一 `key` 更新，避免刷屏。
- EC-003：容器/路由切换  
  SPA 路由切换时，消息容器仍应可用；必要时切换容器策略（`getContainer`）。
- EC-004：SSR/非浏览器环境  
  若在非浏览器环境调用，需要保护（封装层判断 `window`/`document` 存在）。
- EC-005：文案安全  
  禁止插入未经处理的 HTML 字符串（避免 XSS）；仅使用 ReactNode/纯文本。

---

## 6. API 设计（给代码生成/落地用）

> 建议封装为 `src/shared/ui/feedback/toast.ts`（命名可调整），对外暴露统一 API。

### 6.1 对外 API（业务调用层）

```ts
export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading';

export interface ToastOptions {
  /** 唯一 key，用于更新同一条消息 */
  key?: string | number;
  /** 持续时间（秒），0 不自动关闭 */
  duration?: number;
  /** 自定义图标/样式（谨慎开放，建议只在少数场景使用） */
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

  /** 销毁全部或按 key 销毁 */
  destroy(key?: string | number): void;
}
```

### 6.2 全局配置（应用初始化一次）

```ts
export interface ToastGlobalConfig {
  top?: number;
  duration?: number;
  maxCount?: number;
  getContainer?: () => HTMLElement;
}

export function configureToast(config: ToastGlobalConfig): void;
```

---

## 7. 实现方案（Ant Design v6 推荐）

### 7.1 推荐：使用 App 上下文（可消费 ConfigProvider/App）

在应用根部：

```tsx
import { App, ConfigProvider } from 'antd';

export function Root() {
  return (
    <ConfigProvider>
      <App>{/* routes/layout */}</App>
    </ConfigProvider>
  );
}
```

在封装层内部：优先通过 `App.useApp()` 获取实例 message。  
由于 `App.useApp()` 只能在 React 组件/Hook 中使用，建议实现为“桥接模式”：

- 在根部渲染一个 `ToastBridge` 组件，把实例 message 写入模块级变量（或依赖注入容器）。
- 业务层调用 `toast.success()` 时，使用已注入的实例；若未注入则降级到静态 message（并给出开发期警告）。

**Bridge 组件示例：**

```tsx
// ToastBridge.tsx
import { App } from 'antd';
import { setToastImpl } from './toast-impl';

export function ToastBridge() {
  const { message } = App.useApp();
  setToastImpl(message);
  return null;
}
```

把它放到 `<App>` 内部、路由之上：

```tsx
<App>
  <ToastBridge />
  {/* Router */}
</App>
```

### 7.2 降级：静态 message（仅兜底）

- 若 bridge 未初始化（例如在某些非 React 模块很早执行），允许静态调用，但可能无法跟随上下文主题/国际化。

---

## 8. 代码示例（业务侧）

### 8.1 成功/失败

```ts
toast.success('保存成功');
toast.error('保存失败，请重试');
```

### 8.2 loading → success（同 key 更新）

```ts
toast.loading('提交中...', { key: 'submit', duration: 0 });

try {
  await api.submit();
  toast.success('提交成功', { key: 'submit', duration: 2 });
} catch (e) {
  toast.error('提交失败', { key: 'submit', duration: 3 });
}
```

### 8.3 关闭/销毁

```ts
toast.destroy(); // 清空全部
toast.destroy('submit'); // 清空指定 key
```

### 8.4 关闭后执行

```ts
toast.success('操作完成', { duration: 1 }).then(() => {
  // 关闭后执行
});
```

---

## 9. 注意事项（强约束）

1. **不要在业务页面随意 `message.config()`**：全局配置只能在应用初始化处设置一次。
2. **P0 场景必须用 key 更新**：避免 loading 堆叠、刷屏。
3. **duration=0 必须可被关闭**：要么后续更新 key，要么显式 destroy。
4. **文案规范**：错误提示避免技术细节；必要时提供“重试/联系管理员”指引。
5. **可访问性**：避免把重要业务信息只通过瞬时 message 呈现（需要持久提示用 Alert/Modal）。

---

## 10. 版本差异与兼容说明（Ant Design v6）

- v6 仍保留 message 静态 API + Hooks/App 实例用法，但**推荐使用可消费上下文的实例方式**（App / Hooks），以确保主题与国际化一致。
- `message.open` 的配置项在不同大版本可能存在字段增减（如部分行为/类型声明变化）。**以项目锁定的 antd@6.x 实际类型定义为准**，封装层应尽量只暴露稳定字段（content/type/key/duration/onClose 等）。
- thenable 行为与回调触发时机，可能在 “自动关闭 / 手动关闭 / destroy” 情况下略有不同；封装层在关键业务（如跳转）建议同时支持 `onClose` 与业务显式 await/流程控制。

---

## 11. 测试用例（最小集）

- TC-001：success 默认 2s 自动关闭（按全局 duration）
- TC-002：duration=0 不自动关闭，后续同 key 更新为 success 后关闭
- TC-003：maxCount=3，连续触发 10 条，最多展示 3 条
- TC-004：destroy() 清空全部
- TC-005：destroy(key) 仅清空对应 key
- TC-006：在 ConfigProvider 设置主题/locale 后，message 展现符合预期（验证“实例 API”可消费 Context）

---

## 12. 交付物（Definition of Done）

- 提供 `toast` 封装模块（含类型、全局配置、key 更新、destroy）
- 提供 `ToastBridge`（或同等机制）并接入应用根部
- 文档：本 PRD + 使用示例
- 测试：至少覆盖“key 更新 + duration=0 + destroy + maxCount”

```


```
