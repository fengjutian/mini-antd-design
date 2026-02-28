## 一、PRD 合理性评估（针对“全局 Message/Toast 封装”）

整体评价：这份 PRD **结构完整、边界清晰、可落地**，并且抓住了 Ant Design v6 的关键点（**优先实例 API / App.useApp 消费上下文**，静态 API 仅兜底）。作为“组件迁移 + 二次封装”的 PRD，已经具备交付级别。

### 做得很好的点

- **目标与范围**写得明确：只做 message/toast 统一封装，不扩展到 Notification/历史中心，避免失控。
- **FR + AC**齐全：每条能力都有验收标准，利于评审与测试。
- **关键业务流（loading→success/error）**用 `key` 更新强约束，这是最常见痛点。
- **上下文一致性**：提出 Bridge 注入实例 message，符合 antd v6 推荐方式。
- **Edge Cases**涵盖 SSR、防刷屏、路由切换、XSS 文案安全等，属于“封装层必须考虑”的点。
- **交付物/DoD/最小测试集**清晰，方便团队协作。

### 建议补强/澄清的点（让 PRD 更“组件化可复用”）

1. **Thenable 类型定义不够严谨**  
   PRD 里 `Thenable` 未定义。建议明确：返回值与 antd message.open 返回一致（通常是可 then 的 closePromise/thenable），并写清“关闭触发 then”的期望与限制。
2. **“全局配置 configureToast”与 antd message.config 的关系**  
   你写了“业务不要 message.config()”，但封装内部是否允许调用一次？建议补一句：
   - 实例模式（App message）优先走实例的配置能力；
   - 静态兜底时才调用 `message.config`（且仅初始化一次）。
3. **容器策略的默认值与路由切换策略**  
   `getContainer` 的默认策略最好明确：默认 `document.body`，以及在微前端/多 React Root 情况下如何处理（例如挂到应用根节点）。
4. **重复注入/热更新行为**  
   Bridge 每次 render 都 set 实例：是否需要幂等、是否允许后注入覆盖前注入（通常允许覆盖，并在 dev 打 log）。
5. **API 约束再收敛一点更“统一体验”**  
   你开放了 `icon/style/className`，但 NFR 又强调统一体验；建议写明：
   - 默认不建议业务使用 style/className；
   - 如果要用，必须走设计系统 token 或白名单 class（否则样式会碎片化）。
6. **错误文案规范可以再工程化**  
   现在是“注意事项”。如果团队常踩坑，可加“错误码/后端 msg 透传策略”（例如：只显示可读 msg，技术细节打点/日志）。

---

## 二、可复用的“组件二次封装 PRD 模板”（适用于迁移/封装任意 antd v6 组件）

> 这是一个“填空式模板”，保留你这份 PRD 的优点：范围、FR/AC、NFR、边界、API、实现建议、测试与 DoD。你可以用它来写 Modal/Table/Form/Upload/Notification 等封装 PRD。

````markdown
# PRD：{组件能力封装名称}（Ant Design v6）

## 0. 背景与目标

**背景**：{为什么要封装/迁移？现状痛点：分散使用、体验不一致、上下文不一致、迁移成本等}  
**目标**：基于 Ant Design v6 的 {组件名}，提供一套在任意业务模块可复用的统一能力封装，并确保在主题/国际化/容器/权限等上下文下表现一致。

---

## 1. 范围（In Scope / Out of Scope）

### In Scope

- {能力点 1}
- {能力点 2}
- {能力点 3}
- {支持的调用方式：静态/实例/Hook/组件式等}
- {全局配置能力：token/locale/容器/默认行为}

### Out of Scope（明确不做）

- {不做的扩展能力，避免 scope creep}
- {替代方案指引：例如复杂场景用 Notification/Modal 等}

---

## 2. 术语

- **{术语 1}**：{解释}
- **{术语 2}**：{解释}
- **Context**：`ConfigProvider/App` 提供的主题、国际化、前缀、容器等配置。

---

## 3. 用户故事 / 需求点（Functional Requirements）

> 每条需求包含：描述 + 验收标准（AC）。

### FR-001：{核心能力}

- 作为用户，我在 {业务场景} 时，应能够 {看到/完成/操作}。

**AC**

- {可见性/交互性/默认行为}
- {参数支持与兼容性：ReactNode/formatter/回调等}
- {与全局配置一致}

### FR-002：{默认策略/关闭策略/校验策略/分页策略...}

**AC**

- {明确的可测条件 1}
- {明确的可测条件 2}

### FR-003：{并发/队列/缓存/防抖等}

**AC**

- {上限、淘汰策略或冲突策略}

### FR-004：{更新/受控/联动能力（如果有）}

**AC**

- {同 key 更新 / 受控 props 优先级 / 状态机规则}

### FR-005：{销毁/重置/卸载}

**AC**

- {destroy/reset 后的预期}

### FR-006：{回调/Thenable/Promise/事件}

**AC**

- {触发时机：成功/失败/关闭/卸载}
- {与 antd 行为一致性说明}

---

## 4. 非功能需求（NFR）

- NFR-001：统一体验  
  {默认样式/位置/尺寸/文案/交互一致}
- NFR-002：不污染业务代码  
  {业务只能通过封装层调用；禁止直接用 antd 原生 API 的哪些口子}
- NFR-003：上下文一致性  
  {必须可消费 ConfigProvider/App：主题、locale、prefixCls、getContainer}
- NFR-004：可测试性  
  {暴露稳定 API；提供可控 key/testid；方便单测}
- NFR-005：可观测性（可选）  
  {埋点/日志/错误上报策略}

---

## 5. 边界条件与异常处理（Edge Cases）

- EC-001：高频触发/批量渲染  
  {上限/节流/性能要求}
- EC-002：路由切换/容器卸载  
  {容器策略；避免 setState on unmounted；清理机制}
- EC-003：SSR/非浏览器环境  
  {window/document 保护；降级策略}
- EC-004：权限/配置缺失  
  {缺省配置时的行为；开发期 warning}
- EC-005：安全  
  {XSS/注入/文件类型限制/外链跳转等}

---

## 6. API 设计（给落地用）

> 建议封装路径：`src/shared/ui/{domain}/{component}.ts(x)`（可调整）

### 6.1 对外 API（业务调用层）

```ts
export interface {Component}Options {
  // {关键参数：key、duration、placement、size、variant、callbacks...}
}

export interface {Component}API {
  // {主入口：open/show/confirm/render...}
  // {便捷方法：success/error/...}
  // {destroy/reset/update...}
}
```
````

### 6.2 全局配置（应用初始化一次）

```ts
export interface {Component}GlobalConfig {
  // {默认值策略：container、locale、token、maxCount、zIndex 等}
}

export function configure{Component}(config: {Component}GlobalConfig): void;
```

---

## 7. 实现方案（Ant Design v6 推荐）

### 7.1 推荐：使用 App 上下文（可消费 ConfigProvider/App）

- 根部接入方式：{ConfigProvider + App + Bridge/Provider}
- Bridge/依赖注入：{如何把实例写入封装层}
- 线程安全/幂等：{多次渲染、多 root、HMR}

### 7.2 降级方案（兜底）

- {静态 API / no-op / 抛错策略}
- {开发期 warning 文案}

### 7.3 与 antd 差异/约束（必须写清）

- {字段收敛：只暴露稳定字段}
- {行为差异：thenable/onClose/受控 vs 非受控}
- {版本锁定：以 antd@6.x 当前类型为准}

---

## 8. 代码示例（业务侧）

- 8.1 基础用法
- 8.2 常见流程（例如：加载 → 成功 / 校验 → 提交 / 批量操作）
- 8.3 销毁/重置/更新
- 8.4 回调/await/链式

---

## 9. 注意事项（强约束）

1. {禁止业务直接调用的 antd API}
2. {P0 必须遵循的规范：key、受控、容器、文案}
3. {duration=0 / destroy / cleanup 等必备闭环}
4. {可访问性：不要仅靠瞬时提示承载关键信息}
5. {安全规范}

---

## 10. 版本差异与兼容说明（Ant Design v6）

- {v5→v6 迁移差异点}
- {类型/字段变化点与封装策略}
- {对 thenable/回调时机的声明}

---

## 11. 测试用例（最小集）

- TC-001：{默认行为}
- TC-002：{关键边界：duration=0 / destroy / update / maxCount}
- TC-003：{上下文一致性：theme/locale/container}
- TC-004：{SSR/非浏览器降级}

---

## 12. 交付物（Definition of Done）

- 封装模块：{入口、类型、全局配置、核心能力}
- 接入：{Bridge/Provider} 已在 Root 生效
- 文档：PRD + 使用示例
- 测试：覆盖 {最关键能力点}

```

---

如果你希望我把“Message/Toast PRD”进一步抽象成“组件封装规范”（含：统一命名、目录结构、lint 约束、禁止直接 import antd 的规则、以及单测/Storybook 模板），告诉我你们的技术栈（Vite/Next.js、测试用 vitest/jest、是否微前端、多主题方案）。
```
