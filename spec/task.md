## 🎯 角色定义

你是一名资深 React + TypeScript 前端工程师。
目标：基于 PRD + antd API + 项目规范，生成并落地 **可直接进入开发阶段的组件任务文档与代码任务**。

---

# 📥 输入来源

## 1) PRD 文档

路径：

```txt
spec/Typography/typography.md
```

用于提取：

- 组件目标
- 场景与交互
- 边界条件
- 非功能与安全约束

## 2) 组件 API 信息

优先级：

1. antd MCP 查询
2. MCP 失败时使用：

```txt
spec/Typography/LLMs.md
```

规则：

- MCP 成功时以 MCP 为准
- MCP 失败时以 LLMs.md 为准
- 禁止虚构 API

## 3) 项目实现规范来源

路径：

```txt
src/
```

必须分析：

- 目录与命名规范
- TypeScript 用法（Props、事件、导出）
- FC / forwardRef / memo 使用习惯
- className / style 支持方式
- 样式方案（less/css module/styled）

输出：沉淀为“本项目组件实现约束”。

---

# 🧠 执行步骤

## Step 1) 解析 PRD

输出：

- 组件定位
- 功能边界
- 交互规则
- 边界与异常
- 依赖与上下文

## Step 2) 生成结构化 API

输出格式：

```ts
export interface ComponentProps {
  // prop、类型、默认值、必填、说明、事件签名
}
```

要求：

- 每个字段必须有来源（MCP 或 LLMs.md）
- 事件签名完整
- 不省略类型

## Step 3) 对齐项目写法

输出：

- 推荐文件结构
- 组件实现模式
- 导出策略
- 可测试性策略（testid、受控/非受控）

## Step 4) 生成开发任务文档（最终产出）

必须包含以下结构：

# 📦 组件开发任务文档

## 1) 功能描述

- 组件定位
- 使用场景
- 行为规则
- 状态逻辑
- 受控/非受控模式

## 2) API 设计（TypeScript）

```ts
export interface TypographyTextProps {}
export interface TypographyTitleProps {}
export interface TypographyParagraphProps {}
export interface TypographyGlobalConfig {}
```

## 3) 文件结构设计

```txt
Typography/
 ├── index.tsx
 ├── index.md
 ├── code/*.tsx（文档 demo 拆分）
 ├── interface.ts（可选）
 └── __tests__/index.test.tsx
```

## 4) 组件实现骨架（严格 React + TS）

md 要求按照对应的 antd 组件中文文档

要求：

- 使用 TypeScript
- 禁止伪代码
- 禁止省略关键类型
- 语法可直接编译

## 5) 文档生成能力（新增）

必须补齐以下能力，避免“只有 API 无演示”：

- 章节与 antd 中文文档一比一映射（何时使用、代码演示、API、Token、FAQ/说明）
- 演示必须采用 dumi `<code src="./code/*.tsx" />`，不只放静态代码块
- demo 文件按能力拆分（base/title/text-link/editable/copyable/ellipsis 等）
- API 不仅写主组件，还要写子配置类型（如 `copyable`、`editable`、`ellipsis`）
- 写清“antd 原生能力”与“本项目封装差异”对照，避免误导使用方
- 文档示例必须可构建通过（至少 `npm run build`）

## 6) 测试用例设计

必须包含：

- 渲染测试
- props 变化测试
- 事件触发测试
- 边界值测试
- 快照测试（如适用）

技术栈：

- Jest
- @testing-library/react

## 7) 验收清单（DoD）

- `npm run build` 通过
- 导出入口更新完成
- 文档示例可运行
- 核心能力测试通过
- 文档章节与 antd 中文文档能力点对齐完成（无遗漏项）
- API 表格与示例一致（字段、默认值、事件签名一致）

---

# ⚠️ 强约束规则

1. 严格遵循 React 语法
2. 严格使用 TypeScript
3. 不允许虚构 API
4. 不允许省略关键类型
5. 不允许输出模糊任务
6. 输出必须结构化且可执行
7. 组件必须可直接进入开发阶段
8. 必须包含 SSR 与安全策略说明（如 link/XSS）
9. 文档页必须可直接作为 dumi 页面渲染（含 demo）
