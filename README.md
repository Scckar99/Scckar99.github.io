<div align="center">
  <img src="./src/assets/avatar.png" width="96" alt="Scckar avatar" />

  <h1>Scckar's Blog</h1>

  <p>记录企业 AI、智能体工程与软件开发实践的个人技术主页。</p>

  <p>
    <a href="https://scckar99.github.io/"><strong>在线访问</strong></a>
    ·
    <a href="https://scckar99.github.io/blog">文章</a>
    ·
    <a href="https://scckar99.github.io/projects">项目</a>
    ·
    <a href="https://scckar99.github.io/about">关于</a>
  </p>

  <p>
    <a href="https://github.com/Scckar99/Scckar99.github.io/actions/workflows/deploy.yml">
      <img src="https://github.com/Scckar99/Scckar99.github.io/actions/workflows/deploy.yml/badge.svg" alt="Deploy to GitHub Pages" />
    </a>
    <a href="https://astro.build/">
      <img src="https://img.shields.io/badge/Astro-5-BC52EE?logo=astro&logoColor=white" alt="Astro 5" />
    </a>
    <a href="https://www.typescriptlang.org/">
      <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript 5" />
    </a>
    <a href="./LICENSE">
      <img src="https://img.shields.io/github/license/Scckar99/Scckar99.github.io" alt="Apache 2.0 License" />
    </a>
  </p>
</div>

![Scckar's Blog 首页预览](./.github/assets/readme-preview.webp)

## 项目简介

这是 [Scckar](https://github.com/Scckar99) 的个人主页与技术博客源代码。站点基于 Astro 静态生成，内容聚焦企业 AI 应用、智能体工作流、多模态识别、业务系统集成及相关工程实践。

项目在 [Astro Theme Pure](https://github.com/cworld1/astro-theme-pure) 的基础上持续个性化改造，并将主题能力维护为仓库内的本地包 [`packages/pure`](./packages/pure)。它既是线上站点的完整源码，也是一份可供参考的 Astro 博客工程实践。

## 功能亮点

- **内容管理**：使用 Astro Content Collections 管理 Markdown / MDX，并通过 Zod schema 校验 Frontmatter。
- **文章体验**：支持目录、阅读时间、标签、归档、分页、草稿和图片放大浏览。
- **内容增强**：支持 KaTeX 数学公式、Shiki 双主题代码高亮、语言标识与复制按钮。
- **站内检索**：构建时生成 Pagefind 全文索引，无需单独部署搜索服务。
- **发现与订阅**：自动生成 Sitemap、`robots.txt` 与 RSS Feed。
- **互动能力**：集成 Waline 评论、评论数与浏览量，并支持文章社交分享。
- **主题适配**：响应式布局，支持亮色 / 暗色主题并记忆访客选择。
- **持续部署**：推送到 `main` 后，由 GitHub Actions 构建并发布到 GitHub Pages。

## 技术栈

| 类别       | 方案                                          |
| ---------- | --------------------------------------------- |
| 框架       | [Astro](https://astro.build/) 5               |
| 语言       | [TypeScript](https://www.typescriptlang.org/) |
| 样式       | [UnoCSS](https://unocss.dev/)                 |
| 主题核心   | 本地 `astro-pure` 集成包                      |
| 内容       | Markdown / MDX + Astro Content Collections    |
| 搜索       | [Pagefind](https://pagefind.app/)             |
| 数学公式   | [KaTeX](https://katex.org/)                   |
| 评论       | [Waline](https://waline.js.org/)              |
| 构建与托管 | GitHub Actions + GitHub Pages                 |

## 快速开始

### 环境准备

建议使用与持续集成环境一致的版本：

- Node.js 20
- pnpm 9

### 本地运行

```bash
git clone https://github.com/Scckar99/Scckar99.github.io.git
cd Scckar99.github.io

pnpm install
pnpm run link:astro-pure
pnpm run dev
```

开发服务器默认运行在 <http://localhost:4321>。`pnpm run dev` 的前置脚本也会自动检查并链接仓库内的 `astro-pure` 本地包。

## 配置说明

个性化站点时，主要修改以下文件：

| 文件                                                                 | 用途                                                                     |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [`src/site.config.ts`](./src/site.config.ts)                         | 站点名称、作者、语言、导航、社交链接、搜索、图片缩放和 Waline 等主题配置 |
| [`astro.config.ts`](./astro.config.ts)                               | 站点 URL、静态输出、Markdown 插件、KaTeX 与 Shiki 配置                   |
| [`src/content.config.ts`](./src/content.config.ts)                   | 博客集合与 Frontmatter schema                                            |
| [`src/pages/index.astro`](./src/pages/index.astro)                   | 首页个人介绍、项目、教育经历与技能内容                                   |
| [`src/pages/projects/index.astro`](./src/pages/projects/index.astro) | 项目列表与赞助信息                                                       |

如果 Fork 后部署到自己的域名或 GitHub Pages，请至少替换：

1. `astro.config.ts` 中的 `site`。
2. `src/site.config.ts` 中的作者、站点链接、社交账号和评论服务地址。
3. `src/assets/` 与 `public/favicon/` 中的头像、图片和站点图标。

## 内容创作

文章保存在 `src/content/blog/`。推荐使用独立目录存放正文与封面图：

```text
src/content/blog/my-post/
├── index.md
└── thumbnail.png
```

可以通过项目内置命令创建文章：

```bash
# 创建目录形式的 Markdown 文章
pnpm run new --folder "文章标题"

# 创建 MDX 草稿
pnpm run new --folder --mdx --draft "文章标题"
```

完整 Frontmatter 示例：

```yaml
---
title: '文章标题'
description: '不超过 160 个字符的文章摘要。'
publishDate: 2026-08-10
updatedDate: 2026-08-10
heroImage:
  src: ./thumbnail.png
  alt: '文章封面描述'
tags: ['Astro', 'TypeScript']
language: zh-CN
draft: false
comment: true
---
```

字段约束以 [`src/content.config.ts`](./src/content.config.ts) 为准：`title`、`description` 和 `publishDate` 为必填字段；生产构建会过滤 `draft: true` 的文章。

## 常用命令

所有命令均在仓库根目录执行。

| 命令                  | 说明                                                 |
| --------------------- | ---------------------------------------------------- |
| `pnpm run dev`        | 链接本地主题包并启动开发服务器                       |
| `pnpm run new "标题"` | 创建一篇新文章                                       |
| `pnpm run sync`       | 同步 Astro 内容类型                                  |
| `pnpm run check`      | 执行 Astro 类型与内容检查                            |
| `pnpm run build`      | 检查环境、类型并构建生产站点，随后生成 Pagefind 索引 |
| `pnpm run preview`    | 本地预览 `dist/` 构建结果                            |
| `pnpm run lint`       | 运行 ESLint 并自动修复可修复问题                     |
| `pnpm run format`     | 使用 Prettier 格式化源码与内容                       |

## 项目结构

```text
.
├── .github/
│   ├── ISSUE_TEMPLATE/      # Issue 模板
│   └── workflows/           # GitHub Pages 部署流程
├── packages/pure/           # 本地 astro-pure 集成、组件与工具
├── public/                  # 构建时原样复制的静态资源
├── scripts/                 # 本地包链接脚本
├── src/
│   ├── assets/              # 图片、图标与全局样式
│   ├── components/          # 首页、项目和评论组件
│   ├── content/blog/        # Markdown / MDX 文章
│   ├── layouts/             # 页面与文章布局
│   ├── pages/               # 文件路由、RSS、搜索与政策页面
│   ├── content.config.ts    # 内容集合 schema
│   └── site.config.ts       # 站点与主题配置
├── astro.config.ts          # Astro 构建配置
├── uno.config.ts            # UnoCSS 配置
└── package.json             # 依赖与项目命令
```

## 部署

仓库通过 [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) 自动发布到 GitHub Pages：

1. 向 `main` 分支推送提交，或手动触发 workflow。
2. Actions 使用 Node.js 20 与 pnpm 9 执行 `pnpm install --frozen-lockfile`。
3. 执行 `pnpm run sync` 与 `pnpm run astro build`，生成静态站点和 Pagefind 索引。
4. 将 `dist/` 作为 Pages artifact 发布。

Fork 本项目后，需要在 `Settings → Pages → Build and deployment` 中选择 **GitHub Actions** 作为部署来源。

## 参与贡献

欢迎通过 [Issues](https://github.com/Scckar99/Scckar99.github.io/issues) 报告问题或提出建议，也可以提交 Pull Request。提交前请确保：

```bash
pnpm run check
pnpm run build
```

参与项目时请遵守 [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md)。

## 致谢

- [Astro](https://astro.build/)
- [Astro Theme Pure](https://github.com/cworld1/astro-theme-pure)
- [UnoCSS](https://unocss.dev/)
- [Pagefind](https://pagefind.app/)
- [Waline](https://waline.js.org/)

## 许可证

本项目基于 [Apache License 2.0](./LICENSE) 开源。
