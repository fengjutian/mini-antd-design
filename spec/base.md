# PRD 模板：{组件能力封装名称}（Ant Design v6）

> 用于定义“可直接进入开发”的组件封装需求。模板适用于 `src/*` 下的 React + TypeScript 组件。

## 0. 背景与目标

**背景**

- 现状痛点：{分散使用 / 体验不一致 / 上下文割裂 / 迁移成本高}
- 业务影响：{效率、稳定性、可维护性、可测试性}

**目标**

- 基于 Ant Design v6 的 `{组件名}` 做统一封装
- 提供稳定、可预测、可测试的业务 API
- 保证在 `ConfigProvider` / `App` / locale / token / 容器下行为一致

## 1. 范围

### 1.1 In Scope

- {能力点 1}
- {能力点 2}
- {能力点 3}
- {调用方式：组件式 / Hook / 静态入口}
- {全局配置能力：默认值 / 容器 / 主题 / 国际化}

### 1.2 Out of Scope

- {明确不做的能力，避免 scope creep}
- {复杂场景替代方案指引}

## 2. 术语

- **{术语 1}**：{解释}
- **{术语 2}**：{解释}
- **Context**：`ConfigProvider` / `App` 提供的主题、国际化、prefixCls、容器等信息

## 3. 功能需求（FR）

> 每条需求都必须给出可测试的 AC（Acceptance Criteria）。

### FR-001：{核心能力}

- 用户故事：作为{角色}，在{场景}下，我需要{行为}
- AC
- {默认行为可验证}
- {参数和回调可验证}
- {与全局配置一致可验证}

### FR-002：{策略能力：默认值、禁用、校验、并发等}

- AC
- {条件 1}
- {条件 2}

### FR-003：{受控/非受控能力}

- AC
- {value 优先级}
- {defaultValue 仅初始化生效}
- {同 key 更新不重挂载（如适用）}

### FR-004：{销毁/重置/更新}

- AC
- {destroy/reset/update 的明确结果}

### FR-005：{事件与回调}

- AC
- {onChange/onCopy/onExpand/onEnd 等时机定义}
- {Promise/Thenable 行为定义（如适用）}

## 4. 非功能需求（NFR）

- NFR-001 统一体验：来自 token 的字体、颜色、间距一致
- NFR-002 封装边界：业务禁止直接调用被收敛的 antd 原生 API
- NFR-003 上下文一致性：必须消费 `ConfigProvider` / `App` 信息
- NFR-004 可测试性：提供稳定 `data-testid` / key / 可控行为
- NFR-005 可观测性（可选）：埋点、日志、告警策略

## 5. 边界与异常（EC）

- EC-001 高频渲染：避免重复创建观察器/实例，控制性能开销
- EC-002 路由切换/卸载：清理监听器与异步副作用
- EC-003 SSR：`window/document` 判空与降级
- EC-004 权限/配置缺失：自动降级并提供开发期 warning
- EC-005 安全：禁止 `dangerouslySetInnerHTML`（无明确白名单时）

## 6. API 设计（开发可落地）

### 6.1 对外 API

```ts
export interface {Component}Props {
  // 必须包含：类型、是否必填、默认值来源、事件签名
}

export interface {Component}API {
  // 主入口 + 便捷入口 + 销毁/重置/更新入口
}
```

### 6.2 全局配置

```ts
export interface {Component}GlobalConfig {
  // 默认行数、tooltip 策略、容器、maxCount、target 等
}

export function configure{Component}(config: {Component}GlobalConfig): void;
```

## 7. 实现策略

### 7.1 推荐方案

- Root 接入：`<ConfigProvider><App><Bridge/Provider>{children}</Bridge/Provider></App></ConfigProvider>`
- 组件封装：收敛字段，屏蔽不稳定 API
- 幂等性：支持多次渲染、多 root、HMR

### 7.2 降级策略

- 无 App Context：回退到安全的基础实现
- 非浏览器：no-op / 纯渲染降级
- 开发期：可读 warning，不影响生产稳定性

### 7.3 与 antd 差异声明

- 仅暴露稳定字段，不透传全部 antd props
- 明确受控/非受控策略
- 锁定 antd v6 类型语义

## 8. 示例清单（业务侧）

- 基础渲染
- 常用交互（如 copy/edit/ellipsis）
- 受控与非受控对照
- 失败与降级场景

## 9. 强约束

1. 严禁虚构 API 或事件
2. TypeScript 类型必须完整，不允许 `any` 逃逸
3. SSR 与卸载清理必须显式处理
4. 安全策略必须默认开启（外链、HTML 注入等）
5. 文档、代码、测试必须同版本同步

## 10. 兼容与迁移说明

- v5 -> v6 差异点与影响面
- 行为差异与升级建议
- 废弃 API 的替代路径

## 11. 测试最小集

- TC-001 默认渲染
- TC-002 关键能力路径
- TC-003 边界值与异常路径
- TC-004 上下文一致性
- TC-005 SSR 降级

## 12. 交付定义（DoD）

- 代码：组件、类型、全局配置、导出已完成
- 文档：PRD + API + 示例已完成
- 测试：覆盖核心能力与边界
- 验证：`build` 通过，关键用例通过
