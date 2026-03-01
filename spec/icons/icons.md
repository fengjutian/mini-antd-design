# PRD：Icon 使用与封装规范（Ant Design v6 / @ant-design/icons@6.x）

## 0. 背景与目标

**背景**

- antd v6 下 Icon 与 antd 分包，版本不一致会引发上下文与样式风险。
- 项目存在内置图标、TwoTone、自定义 SVG、iconfont 混用，缺少统一约束。

**目标**

- 建立统一 Icon 使用规范与可选薄封装。
- 保证与 antd v6 样式机制兼容，兼顾可维护性与安全性。

## 1. 范围

### 1.1 In Scope

- `@ant-design/icons@6.x` 配套规范
- 基础图标属性：`className/style/rotate/spin`
- TwoTone 与全局主色配置
- 自定义 SVG 接入：`Icon component={Svg}`
- iconfont 接入：`createFromIconfontCN`
- layer 场景与静态方法冲突规避策略

### 1.2 Out of Scope

- 图标平台化系统（资产审核/自动发布）
- 非 antd 体系图标库统一治理

## 2. 术语

- **内置图标**：`HomeOutlined` 等组件。
- **TwoTone**：支持 `twoToneColor` 的图标。
- **自定义 SVG**：`<svg>` 组件经 `Icon component` 渲染。
- **iconfont**：通过 `scriptUrl` 注入 symbol 的图标方式。

## 3. 功能需求（FR）

### FR-001 依赖一致性

- AC
- 必须满足 `antd@6.x` 与 `@ant-design/icons@6.x` 主版本一致。
- 版本不一致时在开发流程中可检测（CI 或文档约束）。

### FR-002 基础图标能力

- AC
- 支持按需导入内置图标。
- 支持 `rotate` 与 `spin`。

### FR-003 TwoTone 能力

- AC
- 支持图标级 `twoToneColor`。
- 支持 `setTwoToneColor/getTwoToneColor` 全局策略。

### FR-004 自定义 SVG

- AC
- `component` 输入必须为合法 React SVG 组件。
- 默认推荐 `1em` 与 `currentColor` 方案。

### FR-005 iconfont 接入

- AC
- 支持单/多 `scriptUrl`。
- 重名图标按数组顺序覆盖。

### FR-006 layer 冲突规避

- AC
- 启用 `StyleProvider layer` 时，优先禁用 `message/Modal/notification` 静态方法。
- 若无法禁用，提供“App 下提前渲染任意 icon”的兜底策略。

## 4. 非功能需求（NFR）

- NFR-001 统一体验：优先 token 与语义样式。
- NFR-002 可维护性：建议统一导入出口。
- NFR-003 稳定性：layer 场景遵循冲突规避策略。
- NFR-004 可测试性：关键图标可稳定定位。
- NFR-005 安全：iconfont 脚本需白名单策略。

## 5. 边界与异常（EC）

- EC-001 多应用或微前端：脚本注入幂等处理。
- EC-002 SSR：iconfont 注入仅在客户端执行。
- EC-003 重名覆盖：明确覆盖顺序与命名规范。
- EC-004 外部脚本风险：非白名单域名告警或拒绝。

## 6. API 设计（可选薄封装）

```ts
export interface IconGlobalConfig {
  defaultTwoToneColor?: string;
  iconfontScriptUrlWhitelist?: string[];
}

export function configureIcon(config: IconGlobalConfig): void;

export {
  createFromIconfontCN,
  getTwoToneColor,
  setTwoToneColor,
} from '@ant-design/icons';
```

## 7. 实现策略

### 7.1 推荐

- 版本锁定：icons 与 antd 主版本一致。
- 业务图标统一从封装层导出（可选）。

### 7.2 layer 策略

- 停用静态反馈方法，统一 hooks/App 实例。
- 兜底：在 `<App>` 下首屏渲染任一 icon。

## 8. 示例

```tsx
import { HomeOutlined, SmileTwoTone } from '@ant-design/icons';

<HomeOutlined spin />;
<SmileTwoTone twoToneColor="#52c41a" />;
```

## 9. 强约束

1. 必须配套 `antd@6.x` + `@ant-design/icons@6.x`。
2. layer 场景禁止静态反馈方法。
3. iconfont `scriptUrl` 必须在可信白名单内。
4. 自定义 SVG 禁止内嵌不可信脚本内容。

## 10. 兼容与迁移

- 从“散落导入”逐步迁移到“规范导入或封装导入”。
- 旧 iconfont 资源需做域名和命名治理。

## 11. 测试最小集

- TC-001 基础图标渲染（含 spin/rotate）。
- TC-002 TwoTone 局部/全局色策略。
- TC-003 layer 场景样式稳定性。
- TC-004 iconfont 白名单与渲染行为。
- TC-005 SSR 场景下 iconfont 降级。

## 12. DoD

- 文档规范可执行。
- 版本策略与治理策略明确。
- 示例可运行，关键场景可回归。
