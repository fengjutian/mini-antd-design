````markdown
# PRD：Icon 使用与封装规范（Ant Design v6 / @ant-design/icons@6.x）

## 0. 背景与目标

**背景**

- antd@6.x 将 Icon 能力拆分为独立包 `@ant-design/icons`；项目中若版本不匹配（antd@6 + icons@非 6）会出现 Context / 样式异常风险。
- 在启用 `@layer antd`（如 `StyleProvider layer`）时，静态方法（`message/Modal/notification`）可能触发 icon 样式注入优先级问题，导致全局组件样式异常（官方 FAQ/issue 已指出）。
- 业务侧存在图标引入方式不统一：直接用内置图标、二色图标、自定义 SVG、iconfont，多种方式混用可能带来：包体积、可维护性、命名、主题一致性与安全风险。

**目标**

- 基于 antd v6 官方能力，形成**统一的 Icon 使用规范与最小封装**（可选），保证：
  1. 与 antd@6 的 Context/样式机制兼容
  2. 支持常见用法（内置图标/二色/自定义 SVG/iconfont）
  3. 主题一致、可控引入、可测试、可扩展

---

## 1. 范围（In Scope / Out of Scope）

### In Scope

- 统一安装与版本约束：`antd@6.x` 必配 `@ant-design/icons@6.x`
- Icon 使用方式规范化：
  - 内置图标组件（Outlined/Filled/TwoTone）
  - 旋转/动画（rotate/spin）
  - 双色图标主色（twoToneColor / 全局 setTwoToneColor）
  - 自定义 SVG（`Icon component={Svg}`）
  - iconfont.cn（`createFromIconfontCN`）
- 与样式层（`StyleProvider layer`）/静态方法冲突的规避策略
- 可选：提供一个 `shared/ui/icon` 的“薄封装”入口（统一导出/约束）

### Out of Scope（明确不做）

- 不建设完整“图标资产平台”（搜索、审核、自动同步 iconfont）
- 不对所有业务图标做全量替换迁移（仅提供规范与接入路径）
- 不扩展到非 Ant Design 体系的图标库（如 lucide、heroicons）统一管理（如需另起 PRD）

---

## 2. 术语

- **内置图标**：`@ant-design/icons` 提供的 React 组件，如 `HomeOutlined`
- **双色图标（TwoTone）**：支持 `twoToneColor` 的图标组件，如 `SmileTwoTone`
- **自定义 SVG 图标**：以 `<svg>` 为根的 React 组件，通过 `Icon component={...}` 渲染
- **iconfont 图标**：通过 `createFromIconfontCN({ scriptUrl })` 动态注入 symbol 并用 `<use>` 渲染
- **layer**：`StyleProvider layer` 启用的 `@layer antd` 样式隔离机制

---

## 3. 用户故事 / 需求点（Functional Requirements）

### FR-001：版本与依赖约束

**描述**

- 作为开发者，我希望图标能力与 antd v6 保持一致，避免 Context/样式问题。

**AC**

- 项目依赖中必须满足：`antd@6.x` + `@ant-design/icons@6.x`
- 若检测到版本不匹配，在开发环境给出明确提示（可通过文档/CI 检查实现）

---

### FR-002：内置图标基础使用

**描述**

- 作为开发者，我可以直接引入并使用内置图标。

**AC**

- 支持从 `@ant-design/icons` 直接 import：`{ HomeOutlined, SettingFilled, SmileOutlined }`
- 支持通用属性：`className`, `style`, `rotate`, `spin`
- `style` 推荐仅用于 `fontSize/color` 等基础样式，避免碎片化覆盖（见 NFR）

---

### FR-003：双色图标与全局主色

**描述**

- 作为开发者，我能对 TwoTone 图标设置主题色，且可全局统一。

**AC**

- 单个图标：支持 `twoToneColor`（`string | string[]`）
- 全局：支持 `setTwoToneColor(color)` / `getTwoToneColor()`
- 默认策略：若设计系统有主色 token，则以 token 值为默认 twoToneColor（如采用全局配置）

---

### FR-004：自定义 SVG 图标能力

**描述**

- 作为开发者，我可以把自有 SVG 资产以 React 组件方式接入，并复用 antd Icon 行为。

**AC**

- 支持：`import Icon from '@ant-design/icons'` + `Icon component={YourSvg}`
- `YourSvg` 必须以 `<svg>` 为根节点，默认宽高 `1em`，`fill="currentColor"` 推荐
- 允许透传 `style/rotate/spin`（但建议受控于规范）

---

### FR-005：iconfont.cn 接入

**描述**

- 作为开发者，我能使用 iconfont 的历史资产，快速接入现有业务图标。

**AC**

- 支持：`createFromIconfontCN({ scriptUrl })`
- `scriptUrl` 支持 `string | string[]`；当重名时以数组顺序覆盖
- 安全要求：`scriptUrl` 域名需白名单（见 EC-005）

---

### FR-006：与 layer/静态方法冲突规避

**描述**

- 作为开发者，我希望在启用 `StyleProvider layer` 时，避免因 icon 样式注入导致全局样式异常。

**AC**

---

## 4. 非功能需求（NFR）

- NFR-001：统一体验
  - 图标尺寸/颜色应遵循设计系统 token（例如 text-secondary、primary 等），避免业务任意 `style`
- NFR-002：可维护性
  - 统一入口导出（可选封装），避免各处散落导入与命名不一致
- NFR-003：上下文与样式稳定性
  - antd@6 与 icons@6 必须配套；启用 layer 时遵循“禁用静态方法”约束
- NFR-004：可测试性
  - 关键图标应可通过 `aria-label`/`data-testid` 或稳定 DOM 结构定位（建议在封装层约束）
- NFR-005：安全
  - iconfont `scriptUrl` 必须走可信域名白名单；禁止业务随意引用外部脚本

---

## 5. 边界条件与异常处理（Edge Cases）

- EC-001：启用 `StyleProvider layer` 后样式异常
  - 按 FR-006 的策略处理：优先停用静态方法；否则 App 下渲染任意 icon 兜底
- EC-002：多 React Root / 微前端
  - iconfont 脚本注入可能重复；需保证注入幂等（或允许重复但不影响功能）
- EC-003：SSR/非浏览器环境
  - iconfont 动态注入依赖 DOM；SSR 环境需延迟到 client 执行或禁用该能力
- EC-004：图标重名覆盖
  - `scriptUrl` 为数组时，按数组顺序覆盖；需在文档写清并建议建立命名规范
- EC-005：安全/XSS
  - iconfont 脚本属于外部可执行资源：必须白名单 + 版本管理；必要时自托管

---

## 6. API 设计（给落地用）

> 推荐封装路径：`src/shared/ui/icon/`

### 6.1 对外 API（可选薄封装）

```ts
// src/shared/ui/icon/index.ts
export {
  // 业务允许使用的内置图标（建议按需白名单导出）
  HomeOutlined,
  SettingFilled,
  // ...
} from '@ant-design/icons';

export { default as AntdIcon } from '@ant-design/icons';
export {
  createFromIconfontCN,
  setTwoToneColor,
  getTwoToneColor,
} from '@ant-design/icons';
```
````

> 说明：是否做“白名单导出”取决于团队治理强度；若不做封装，也至少要有规范与 lint 约束。

### 6.2 全局配置（可选）

```ts
export interface IconGlobalConfig {
  defaultTwoToneColor?: string;
  iconfontScriptUrlWhitelist?: string[];
}

export function configureIcon(config: IconGlobalConfig): void;
```

---

## 7. 实现方案（Ant Design v6 推荐）

### 7.1 依赖与版本

- 固定依赖：`@ant-design/icons@6.x` 配套 `antd@6.x`
- CI 检查建议：锁定主版本一致，避免误升

### 7.2 layer 与静态方法规避（关键）

**推荐**

- 停用 `message/Modal/notification` 静态方法，统一使用 hooks 或 `App` 实例（与全局封装保持一致）

**兜底（仅当无法避免静态方法时）**

```tsx
<StyleProvider layer>
  <ConfigProvider>
    <App>
      {/* 立即渲染任意 icon，规避静态方法引发的样式异常 */}
      <RightOutlined />
      {/* pages */}
    </App>
  </ConfigProvider>
</StyleProvider>
```

---

## 8. 代码示例（业务侧）

### 8.1 基础用法

```tsx
import { Space } from 'antd';
import { HomeOutlined, SyncOutlined } from '@ant-design/icons';

export const Demo = () => (
  <Space>
    <HomeOutlined />
    <SyncOutlined spin />
  </Space>
);
```

### 8.2 双色图标

```tsx
import { SmileTwoTone } from '@ant-design/icons';

<SmileTwoTone twoToneColor="#52c41a" />;
```

### 8.3 自定义 SVG

```tsx
import Icon from '@ant-design/icons';

const HeartSvg = () => (
  <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
    <path d="..." />
  </svg>
);

<Icon component={HeartSvg} style={{ color: 'hotpink' }} />;
```

### 8.4 iconfont

```tsx
import { createFromIconfontCN } from '@ant-design/icons';

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/xxx.js',
});

<IconFont type="icon-tuichu" />;
```

---

## 9. 注意事项（强约束）

1. **必须**：`antd@6.x` 配套 `@ant-design/icons@6.x`
2. **必须**：在启用 layer 时，**停止使用** `message/Modal/notification` 静态方法（统一走 hooks/App 实例/封装层）
3. **不建议**：业务随意用 `style/className` 做复杂覆盖；优先 token/语义化 class
4. **安全**：iconfont 的 `scriptUrl` 必须白名单；禁止指向不可信域名
5. **SSR**：iconfont 注入仅在 client 执行；SSR 需降级或延迟加载

---

## 10. 版本差异与兼容说明（Ant Design v6）

- antd 从 4.0 起不再内置 Icon，需独立包 `@ant-design/icons`
- antd@6.x 下请使用 `@ant-design/icons@6.x`，避免版本不匹配引发 Context/样式问题
- layer 场景下静态方法可能导致 icon 样式注入优先级异常，需要遵循规避策略

---

## 11. 测试用例（最小集）

- TC-001：`@ant-design/icons@6.x` 与 `antd@6.x` 配套检查通过（CI / lockfile）
- TC-002：内置图标渲染正常（含 spin/rotate）
- TC-003：TwoTone `twoToneColor` 生效；全局 `setTwoToneColor` 生效
- TC-004：启用 `StyleProvider layer` 时，页面样式不异常（禁用静态方法；或兜底 icon 渲染生效）
- TC-005：iconfont 在白名单域名可渲染；非白名单阻止/告警

---

## 12. 交付物（Definition of Done）

- 文档：本 PRD + 使用规范（README/内网文档）
- 依赖策略：锁定 antd/icons 主版本一致（package.json + CI 校验）
- （可选）封装模块：`shared/ui/icon` 统一导出 + `configureIcon`
- （可选）lint 规则：禁止直接使用静态 `message/Modal/notification`（若团队已治理则复用现有规则）

```

```
