---
title: 约定式提交（Conventional Commits）类型笔记（速查版）
publishDate: 2026-02-11 11:30:00
description: '一份面向团队协作的 Conventional Commits 速查笔记，涵盖 feat/fix/chore 等常见类型、区分原则和 Breaking Change 写法。'
tags:
  - Git
  - Conventional Commits
  - 工程规范
  - 提交规范
heroImage: { src: './thumbnail.png' }
language: '中文'
---

这份笔记用于快速理解提交信息里常见的 `feat:`、`fix:`、`chore:` 等前缀，并给出在团队协作中可直接落地的选择方式。

---

## 1. 提交信息的基本格式

常见格式：

```text
<type>(<scope>)!: <subject>

<body>

<footer>
```

- **type**：类型（这次提交属于什么性质）
- **scope**（可选）：范围/模块（例如 `api`、`ui`、`ccg`）
- **!**（可选）：表示 **Breaking Change**（不兼容变更）
- **subject**：一句话摘要（简短说明做了什么）

示例：

```text
feat(ccg): 多模型协作系统 v1.0
fix(api): 修复超时重试导致的重复请求
chore(release): 发布 v1.0.3
feat!: 改动鉴权协议（不兼容旧版本）
```

---

## 2. 类型（type）一览

> 说明：Conventional Commits 规范要求必须有 `type`，但不强制规定必须有哪些 `type`。
> 实际项目里通常会约定一组“常用类型”，下面是最常见、最实用的一套。

| 类型 | 含义 | 什么时候用 | 常见例子 |
| --- | --- | --- | --- |
| **feat** | 新功能（feature） | 增加对用户或业务可感知的新能力 | 新增接口/页面/功能开关 |
| **fix** | 修 bug | 修复用户可见问题、线上缺陷 | 修复崩溃、修复逻辑错误 |
| **docs** | 文档变更 | 只改文档，不改代码逻辑 | README、接口文档、注释文档 |
| **style** | 代码风格/格式 | 不影响逻辑的格式调整 | 缩进、空格、lint 格式化 |
| **refactor** | 重构 | 不新增功能、不修 bug，但改实现 | 抽函数、拆模块、改结构 |
| **perf** | 性能优化 | 让性能更好（速度/内存/吞吐） | 降低耗时、减少对象创建 |
| **test** | 测试相关 | 增删改测试用例 | 单测、集成测试、e2e |
| **build** | 构建相关 | 影响构建/打包/依赖产物 | webpack/vite/tsconfig、打包脚本 |
| **ci** | CI 流水线 | CI 配置、自动化流程相关 | GitHub Actions、GitLab CI、Jenkins |
| **chore** | 杂务/维护 | 既不是功能也不是 bug，偏工程维护 | 发布配置、脚本小改动、清理文件 |
| **revert** | 回滚 | 回滚某次提交 | `git revert` 生成的回滚提交 |

---

## 3. `chore` 到底是什么？

**`chore` = 杂务/维护类改动**，特点是：

- 通常不改变业务功能
- 往往是项目维护、工程配置、发布相关

比如：

```text
chore: 优化 npm 发布配置，排除未测试文件
```

这种属于发布包内容管理和工程卫生（clean-up），是非常典型的 `chore`。

---

## 4. `build`、`ci`、`chore` 怎么区分？

一个实用的粗略判断：

- **build**：跟“构建/打包产物”强相关（构建工具、编译配置、打包链路）
- **ci**：跟“持续集成流水线”强相关（actions、pipeline、自动化测试/发布流程）
- **chore**：其它维护杂项（发布配置、脚本、临时清理、工具升级等），不太好归类的都可放这里

举例：

- 改 `vite.config.ts`、`webpack`、`tsconfig`：多数算 **build**
- 改 `.github/workflows/*.yml`：多数算 **ci**
- 改 `.npmignore`、`package.json` 里 `files`、发布脚本、小清理：多数算 **chore**

---

## 5. Breaking Change（不兼容变更）怎么写？

两种常见写法：

### 写法 A：在 type 后加 `!`

```text
feat!: 更新鉴权协议（不兼容旧客户端）
```

### 写法 B：在 footer 里写 `BREAKING CHANGE:`

```text
feat(auth): 更新鉴权协议

BREAKING CHANGE: token 字段从 token 改为 access_token，旧客户端不可用
```

---

## 6. 推荐的“统一写法”小建议（团队更不容易吵）

- **subject 尽量用动词开头**（新增/修复/优化/移除/调整）
- **scope 能用就用**：便于快速定位影响范围（例如 `api`、`ui`、`ccg`）
- **类型别太多**：团队固定一套最省心（比如 8 到 12 个足够）

---

## 7. 快速选择指南（懒人版）

- 新能力：`feat`
- 修缺陷：`fix`
- 只改 README/文档：`docs`
- 不改逻辑只改格式：`style`
- 改结构但功能不变：`refactor`
- 更快/更省：`perf`
- 测试相关：`test`
- 构建打包链路：`build`
- CI 流水线：`ci`
- 发布配置/工程杂务/清理：`chore`
- 回滚：`revert`

---

如果你愿意，也可以把你们仓库已有的 commit 前缀贴几条出来，再进一步沉淀成一份团队专用的“固定类型清单 + 示例模板”。
