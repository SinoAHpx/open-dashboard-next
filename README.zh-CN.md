# Open Dashboard Next

基于 Next.js 15 构建的现代化生产级仪表板启动模板，帮助您更快地交付 SaaS 或应用程序后端。

[English Documentation](./README.md)

## 特性

- **现代化技术栈**：基于 Next.js 15 App Router、React 19 和 Turbopack，实现超快的开发体验
- **精美界面**：预配置 Tailwind CSS v4、Hero UI 组件库和 Phosphor 图标
- **类型安全**：完整的 TypeScript 支持，启用严格模式
- **状态管理**：使用 Zustand 进行高效的客户端状态管理
- **数据可视化**：集成 Recharts 用于图表和图形展示
- **数据库就绪**：配置好的 TypeORM 用于数据库操作
- **代码质量**：使用 Biome 进行代码检查和格式化
- **开发体验**：使用 Bun 运行时实现更快的包管理和执行

## 快速开始

### 前置要求

- [Bun](https://bun.sh/)（推荐）或 Node.js 18+

### 安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/open-saas-next.git
cd open-saas-next

# 安装依赖
bun install

# 启动开发服务器
bun run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看仪表板。

## 可用脚本

- `bun run dev` - 使用 Turbopack 启动开发服务器
- `bun run build` - 使用 Turbopack 构建生产版本
- `bun run start` - 启动生产服务器
- `bun run lint` - 运行 Biome 代码检查
- `bun run format` - 使用 Biome 格式化代码
- `bun run create-page` - 创建新页面（自定义脚本）

## 项目结构

```
open-saas-next/
├── src/
│   ├── app/              # Next.js App Router 页面和布局
│   │   ├── (auth)/       # 认证页面（登录、注册）
│   │   ├── (dashboard)/  # 仪表板页面及共享布局
│   │   └── api/          # API 路由
│   ├── components/       # 可复用的 UI 组件
│   ├── lib/              # 工具函数和辅助函数
│   └── stores/           # Zustand 状态管理存储
├── public/               # 静态资源
├── scripts/              # 构建和工具脚本
└── 配置文件              # 配置文件（Next.js、Tailwind、TypeScript 等）
```

## 技术栈

### 核心框架
- **Next.js 15.5.4** - 带 App Router 的 React 框架
- **React 19.1.0** - UI 库
- **TypeScript 5** - 类型安全

### 样式与 UI
- **Tailwind CSS v4** - 实用优先的 CSS 框架
- **Hero UI** - 组件库
- **Phosphor Icons** - 图标系统
- **Framer Motion** - 动画库

### 数据与状态
- **Zustand** - 状态管理
- **TanStack Table** - 强大的表格组件
- **Recharts** - 图表库
- **Zod** - 模式验证
- **TypeORM** - 数据库 ORM

### 开发工具
- **Bun** - 快速的运行时和包管理器
- **Turbopack** - 下一代打包工具
- **Biome** - 快速的代码检查和格式化工具

## 配置

### 路径映射

TypeScript 配置了路径映射以实现更简洁的导入：

```typescript
import { Component } from '@/components/Component'
import { util } from '@/lib/util'
```

### 样式

Tailwind CSS v4 已配置好 Hero UI 集成。全局样式位于 `src/app/globals.css`。

### 代码检查

Biome 已针对 Next.js 和 React 最佳实践进行配置。配置文件为 `biome.json`。

## 开发指南

- 使用 App Router 模式创建所有新页面
- 将共享组件放在 `src/components/` 目录
- 使用 Zustand 存储管理全局状态
- 遵循现有的代码结构和命名约定
- 提交代码前运行 `bun run lint`

## 认证路由

模板包含预构建的认证页面：

- `/login` - 用户登录页面
- `/register` - 用户注册页面

## 仪表板功能

仪表板包含多个示例页面，展示常见模式：

- **主仪表板** - 带图表和指标的概览页
- **简单表格** - 基本数据表格实现
- **分页** - 带服务端分页的表格
- **操作** - 带行操作的表格
- **复合** - 具有多种功能的复杂表格
- **可选择** - 带行选择的表格
- **富单元格** - 带自定义单元格渲染的表格
- **设置** - 用户设置页面

## 定制

### 添加新页面

使用自定义页面脚手架脚本：

```bash
bun run create-page
```

### 修改侧边栏

编辑 `src/lib/sidebar-items.ts` 以添加或删除侧边栏导航项。

### 自定义主题

修改 `tailwind.config.ts` 和 `src/lib/color-theme.ts` 以自定义主题。

## 部署

### 构建生产版本

```bash
bun run build
bun run start
```

### 部署到 Vercel

最简单的部署方式是使用 [Vercel](https://vercel.com)：

[![使用 Vercel 部署](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/open-saas-next)

## 贡献

欢迎贡献！请随时提交 Pull Request。

## 许可证

本项目为开源项目，采用 MIT 许可证。

## 支持

如有任何问题或遇到问题，请在 GitHub 上提交 issue。
