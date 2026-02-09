# 项目优化实施计划（方案 A：保守增量）

## 概述

基于 Codex（后端）+ Gemini（前端）双模型分析，综合形成以下实施计划。

## 实施步骤（共 8 步）

### Step 1: 统一包管理器（保留 pnpm）

**文件变更：**
- 删除 `bun.lock`
- 修改 `package.json`：`yijiansilian` 脚本中 `bun` → `pnpm run`
- 修改 `.github/workflows/deploy.yml`：`setup-bun` → `pnpm/action-setup`

### Step 2: 移除未使用依赖

**命令：** `pnpm remove @astrojs/vercel`

### Step 3: 字体优化

**策略：**
- Satoshi TTF → WOFF2（保留 preload）
- PingFang 11MB TTF **直接移除**，改用系统字体栈回退
- 更新 `BaseHead.astro` preload 引用
- 更新 `app.css` @font-face 声明

### Step 4: Quote API 替换

**文件：** `src/site.config.ts`
- 主源切换到 Hitokoto (`v1.hitokoto.cn`)
- 修改 `target` 解析函数

### Step 5: 启用构建压缩

**文件：** `astro.config.ts`
- 取消 `@playform/compress` 注释
- 配置：`SVG: false`, `Exclude: ['index.*.js']`

### Step 6: 代码清理

**文件：**
- `src/pages/index.astro`：删除注释掉的 Experience/Website List/Certifications 模板
- `src/pages/about/index.astro`：合并重复的 Learning/Environment ToolSection

### Step 7: SEO/A11y 修复

**文件：**
- `BaseHead.astro`：`theme-color` 设为 `#fafafa`
- `index.astro`：云南大学 logo 补 `alt="云南大学"`
- `about/index.astro`：删除空 `<p>` 标签

### Step 8: Shields.io 徽章优化

**文件：** `src/pages/index.astro`
- 补 `loading="lazy"`

## 验收标准

- 构建成功，无报错
- 字体请求体积显著下降（移除 11MB PingFang）
- Quote 功能正常（Hitokoto 源）
- Lighthouse Performance/SEO/Accessibility 无回归
