# Scckar's Blog

[![Deploy to GitHub Pages](https://github.com/Scckar99/Scckar99.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/Scckar99/Scckar99.github.io/actions/workflows/deploy.yml)

一个基于 [Astro](https://astro.build/) 与 [Astro Theme Pure](https://github.com/cworld1/astro-theme-pure) 的个人博客项目。

- 在线访问：<https://scckar99.github.io/>
- 部署方式：GitHub Actions + GitHub Pages

## 功能特性

- Astro 静态生成，页面加载快
- 博客内容使用 Markdown / MDX 管理
- 支持数学公式（KaTeX）
- 支持代码高亮与复制按钮
- 支持 Waline 评论系统
- 自动化构建并部署到 GitHub Pages
- 支持亮色 / 暗色主题切换

## 技术栈

- Astro `5.x`
- TypeScript
- UnoCSS
- `astro-pure`（本地包：`packages/pure`）
- KaTeX（`remark-math` + `rehype-katex`）
- Waline

## 快速开始

### 1. 环境要求

- Node.js `>= 20`
- pnpm `>= 9`

### 2. 安装依赖

```bash
pnpm install
```

### 3. 本地开发

```bash
pnpm run dev
```

默认开发地址一般为：`http://localhost:4321`

## 常用命令

```bash
# 开发
pnpm run dev

# 同步 Astro 内容类型
pnpm run sync

# 类型检查
pnpm run check

# 构建
pnpm run build

# 本地预览构建结果
pnpm run preview

# 代码格式化
pnpm run format

# ESLint 修复
pnpm run lint
```

## 项目结构

```text
.
├─ .github/workflows/      # GitHub Actions 部署流程
├─ packages/pure/          # astro-pure 本地包
├─ public/                 # 静态资源（构建时原样拷贝）
├─ src/
│  ├─ assets/              # 主题资源、图片、样式
│  ├─ components/          # 业务组件
│  ├─ content/blog/        # 博客内容
│  ├─ layouts/             # 页面布局
│  └─ pages/               # 路由页面
├─ astro.config.ts         # Astro 配置
├─ src/site.config.ts      # 站点主题配置
└─ src/content.config.ts   # 内容集合配置
```

## 写作说明（Blog）

文章位于 `src/content/blog/`，每篇文章通常使用独立目录存放内容与封面图，例如：

```text
src/content/blog/my-post/
├─ index.md
└─ thumbnail.jpg
```

可参考的 Frontmatter 字段（按项目 schema）：

```md
---
title: '文章标题'
description: '文章描述'
publishDate: 2026-02-10
updatedDate: 2026-02-10
tags: ['tag1', 'tag2']
draft: false
comment: true
---
```

## 部署说明

本项目通过 `.github/workflows/deploy.yml` 自动部署：

1. 推送到 `main` 分支
2. Actions 使用 Node.js 20 + pnpm 9 安装依赖
3. 执行构建并生成 `dist`
4. 发布到 GitHub Pages

如果你 Fork 本项目，请在仓库设置中确认：

- `Settings -> Pages -> Build and deployment` 使用 GitHub Actions
- `Actions` 权限允许 workflow 运行

## 致谢

- [Astro](https://astro.build/)
- [Astro Theme Pure](https://github.com/cworld1/astro-theme-pure)
- [Waline](https://waline.js.org/)
