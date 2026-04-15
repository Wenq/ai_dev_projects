# NPM 命令参考手册

本文档列出了当前工程支持的所有 npm 命令及其详细说明。

## 开发调试

### `npm run dev`

启动 Vite 开发服务器，用于本地开发和调试 KWC 组件。

```bash
npm run dev
```

**功能说明：**
- 启动热更新开发服务器
- 自动打开浏览器预览
- 支持 React 组件的实时刷新

---

### `npm run debug`

以监听模式构建前端组件，文件变化时自动重新构建。

```bash
npm run debug
```

**功能说明：**
- 初始构建所有组件
- 监听 `app/kwc/` 目录下的文件变化
- 文件变化时自动重新构建对应组件
- 适用于本地调试场景

---

### `npm run server`

启动本地静态资源服务器，用于模拟苍穹平台的资源加载。

```bash
npm run server
```

**功能说明：**
- 默认监听端口 `3333`（可通过 `PORT` 环境变量修改）
- 读取 `.kd/config.json` 配置，动态挂载静态资源路由
- 支持 CORS 跨域访问
- 监听 `dist/kwc/` 目录变化，实时输出日志
- 监听配置文件变化，自动重新加载

**使用示例：**
```bash
# 使用默认端口
npm run server

# 指定端口
PORT=8080 npm run server
```

---

## 构建命令

### `npm run build`

执行完整构建，包括前端组件、Controller 和元数据文件。

```bash
npm run build
```

**功能说明：**
- 清理 `dist/` 目录
- 构建所有前端组件（输出到 `dist/kwc/`）
- 构建所有 Controller（输出到 `dist/controller/`）
- 拷贝元数据文件（`.kwp`, `.kwc`）到 `dist/metadata/`
- 处理 Shoelace 资源（输出到 `dist/shoelace/`）

**支持的参数：**

| 参数 | 说明 | 示例 |
|------|------|------|
| `--type` | 指定构建类型 | `--type=frontend` 或 `--type=controller` |
| `--env` / `-e` | 指定目标环境（仅 controller） | `--env=dev` |
| `[组件名]` | 指定构建的组件（需配合 `--type`） | `ComponentA ComponentB` |

**使用示例：**
```bash
# 全量构建
npm run build

# 仅构建前端
npm run build --type=frontend

# 仅构建 Controller
npm run build --type=controller

# 构建指定组件的前端
npm run build ExampleComponent --type=frontend

# 构建指定组件的 Controller 到开发环境
npm run build MyController --type=controller --env=dev
```

---

### `npm run build:frontend`

仅构建前端 KWC 组件。

```bash
npm run build:frontend
```

**功能说明：**
- 扫描 `app/kwc/` 目录下的所有组件
- 使用 Vite 库模式构建
- 输出压缩后的 ES 模块到 `dist/kwc/[组件名]/index.js`
- 处理 Shoelace 资源（CSS、assets、version.json）

**支持的参数：**

| 参数 | 说明 | 示例 |
|------|------|------|
| `[组件名]` | 指定构建的组件 | `ExampleComponent` |
| `--watch` | 监听模式 | `--watch` |

**使用示例：**
```bash
# 构建所有组件
npm run build:frontend

# 构建指定组件
npm run build:frontend -- ExampleComponent

# 构建多个组件
npm run build:frontend -- ComponentA ComponentB
```

---

### `npm run build:controller`

构建后端 TypeScript Controller 脚本。

```bash
npm run build:controller
```

**功能说明：**
- 检查 `app/ks/controller/` 目录是否存在
- 调用 `kd project build` 命令执行构建
- 支持指定目标环境

**支持的参数：**

| 参数 | 说明 | 示例 |
|------|------|------|
| `[组件名]` | 指定构建的 Controller | `MyController` |
| `--env` / `-e` | 指定目标环境 | `--env=dev` |

**使用示例：**
```bash
# 构建所有 Controller
npm run build:controller

# 构建到开发环境
npm run build:controller -- --env=dev

# 构建指定 Controller
npm run build:controller -- MyController
```

---

## 测试命令

### `npm run test`

运行单元测试。

```bash
npm run test
```

**功能说明：**
- 使用 Vitest 作为测试框架
- 基于 JSDOM 环境运行测试
- 执行一次后退出

---

### `npm run test:watch`

以监听模式运行单元测试。

```bash
npm run test:watch
```

**功能说明：**
- 持续监听文件变化
- 文件变化时自动重新运行相关测试
- 适用于开发时持续验证代码

---

## 代码质量

### `npm run lint`

检查代码规范问题。

```bash
npm run lint
```

**功能说明：**
- 使用 ESLint 检查代码
- 输出所有 lint 错误和警告

---

### `npm run lint:fix`

自动修复代码规范问题。

```bash
npm run lint:fix
```

**功能说明：**
- 使用 ESLint 检查代码
- 自动修复可修复的问题
- 输出无法自动修复的问题

---

## 命令速查表

| 命令 | 用途 | 常用场景 |
|------|------|----------|
| `npm run dev` | 启动开发服务器 | 本地开发 |
| `npm run debug` | 监听构建 | 本地调试 |
| `npm run server` | 启动静态资源服务器 | 模拟苍穹环境 |
| `npm run build` | 完整构建 | 发布前构建 |
| `npm run build:frontend` | 构建前端 | 仅更新前端 |
| `npm run build:controller` | 构建 Controller | 仅更新后端脚本 |
| `npm run test` | 运行测试 | 验证功能 |
| `npm run test:watch` | 监听测试 | 开发时持续测试 |
| `npm run lint` | 代码检查 | 代码审查 |
| `npm run lint:fix` | 自动修复 | 快速修复规范问题 |
