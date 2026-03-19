# Chicken Career

这是一个使用 [Next.js](https://nextjs.org/) 构建的前端项目。

## 技术栈 (Tech Stack)

该项目主要使用了以下技术：
- **框架**: [Next.js 16](https://nextjs.org/) (基于 React 19)
- **开发语言**: TypeScript
- **样式框架**: [Tailwind CSS v4](https://tailwindcss.com/)
- **状态管理**: [Zustand](https://zustand-demo.pmnd.rs/)
- **动画库**: [Framer Motion](https://www.framer.com/motion/)
- **实用工具**:
  - `uuid`: 唯一标识符生成
  - `html2canvas` & `browser-image-compression`: 截图与图像压缩处理

## 项目结构 (Project Structure)

```text
├── app/                  # Next.js App Router 页面、布局及路由规划
│   ├── (game)/           # 游戏主工作流页面 (由路由组定义)
│   ├── api/              # Next.js 后端 API 路由
│   ├── skill/            # 技能/特点分析相关页面 (如 palm-reading)
│   └── globals.css       # 核心全局样式文件
├── components/           # 提取的可复用 UI 交互组件
├── store/                # 基于 Zustand 的全局状态管理 (如 user / skill 数据)
├── lib/                  # 核心常量定义、静态数据配置及工具类
├── types/                # 共用的 TypeScript 全局接口与类型声明
├── docs/                 # 相关的项目说明或配置文件文档
└── public/               # 公共静态资源 (图标 svg, 背景素材等)
```

## 历史版本 (Version History)

- **v0.1.0** (当前版本)
  - 完成项目核心架构初始化。
  - 引入 Tailwind v4、Zustand 和 Framer Motion 面向前端视图开发。
  - 搭建核心页面路由结构，包含角色职业、成就、历史记录及游戏主面板等模块。
  - 实现基础的用户与技能状态管理 store。

## 如何启动 (How to Start)

**1. 安装项目依赖**

在项目根目录下，使用您的包管理工具进行安装：

```bash
npm install
# 或者使用 yarn / pnpm：
# yarn install
# pnpm install
```

**2. 启动本地开发服务器**

```bash
npm run dev
# 或者
# yarn dev
# pnpm dev
```

启动完成后，请在浏览器中打开网址：[http://localhost:3000](http://localhost:3000) 以查看并调试应用。

你会看到页面内容的实时更新（当修改 `app` 等目录内容时）。

**3. 构建与生产部署**

当你准备好打包部署应用时，使用以下命令构建优化的应用产物，并用 start 启动：

```bash
npm run build
npm run start
```
