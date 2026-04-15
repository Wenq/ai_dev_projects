# @kdcloudjs/cli 命令参考

> KD CLI 是金蝶 KWC 开发的命令行工具，用于项目初始化、构建、部署和调试。

## 安装

```bash
npm install -g @kdcloudjs/cli
```

## 查看版本

```bash
kd -v
# 或
kd --version
```

---

## 顶级命令

| 命令 | 说明 |
|-----|------|
| `kd update` | 更新 KD CLI 到最新版本 |
| `kd project` | 项目管理 |
| `kd env` | 环境管理 |
| `kd debug` | 调试项目 |

---

## kd update - 更新工具

更新 KD CLI 到最新版本。

```bash
kd update
```

---

## kd project - 项目管理

### kd project init

初始化新项目。

```bash
kd project init <name> [options]
```

| 参数 | 说明 | 默认值 |
|-----|------|--------|
| `<name>` | 项目名称 | 必填 |
| `-s, --source <source>` | 仓库源 | `outer` |

**示例：**
```bash
kd project init myapp
kd project init myapp -s inner
```

---

### kd project create

创建组件或页面。

```bash
kd project create <name> [options]
```

| 参数 | 说明 | 可选值 |
|-----|------|--------|
| `<name>` | 组件/页面名称 | 必填 |
| `--type <type>` | 类型 | `kwc` \| `page` \| `controller` |
| `-e, --target-env <env>` | 拉取 SDK 的目标环境 | 环境名称 |

**示例：**
```bash
# 创建 KWC 组件
kd project create myComponent --type kwc

# 创建页面
kd project create myPage --type page

# 创建 Controller
kd project create myController --type controller
```

---

### kd project build

构建前端或后端资源。

```bash
kd project build [fileNames...] [options]
```

| 参数 | 说明 | 可选值 |
|-----|------|--------|
| `[fileNames...]` | 要构建的文件名（可选） | 文件名列表 |
| `-t, --type <type>` | 构建类型 | `frontend` \| `controller` |
| `-e, --target-env <env>` | 目标环境（controller 构建时使用） | 环境名称 |

**示例：**
```bash
# 构建所有前端资源
kd project build --type frontend

# 构建指定组件
kd project build myComponent --type frontend

# 构建 Controller
kd project build --type controller -e dev
```

---

### kd project deploy

部署项目到目标环境。

```bash
kd project deploy [options]
```

| 参数 | 说明 |
|-----|------|
| `-e, --target-env <env>` | 目标环境 |
| `-d, --source-dir <dir>` | 源目录 |

**示例：**
```bash
# 部署到默认环境
kd project deploy

# 部署到指定环境
kd project deploy -e sit

# 从指定目录部署
kd project deploy -d ./dist
```

---

## kd env - 环境管理

### kd env create

创建新环境。

```bash
kd env create <name> [options]
```

| 参数 | 说明 |
|-----|------|
| `<name>` | 环境名称 |
| `--url <url>` | 环境 URL |

**示例：**
```bash
kd env create dev --url https://dev.example.com
```

---

### kd env set target-env

设置默认环境。

```bash
kd env set target-env <name>
```

**示例：**
```bash
kd env set target-env dev
kd env set target-env sit
```

---

### kd env info

显示当前环境信息。

```bash
kd env info
```

---

### kd env list

列出所有环境。

```bash
kd env list
```

**输出示例：**
```
--------------------+--------------------------------------------------+----------
 Name               | URL                                              | Default
--------------------+--------------------------------------------------+----------
 dev                | https://feature.kingdee.com:1026/feature_dev/    |
--------------------+--------------------------------------------------+----------
 sit                | https://feature.kingdee.com:1026/feature_sit/    | ★
--------------------+--------------------------------------------------+----------
```

---

### kd env delete

删除环境。

```bash
kd env delete <name>
```

**示例：**
```bash
kd env delete test
```

---

### kd env auth web

通过 Web 方式认证（用户名/密码）。

```bash
kd env auth web [options]
```

| 参数 | 说明 |
|-----|------|
| `-e, --target-env <name>` | 目标环境名称 |

**示例：**
```bash
kd env auth web -e sit
```

---

### kd env auth openapi

通过 OpenAPI 方式认证（客户端凭证）。

```bash
kd env auth openapi [options]
```

| 参数 | 说明 |
|-----|------|
| `-e, --target-env <name>` | 目标环境名称 |

**示例：**
```bash
kd env auth openapi -e sit
```

---

## kd debug - 调试项目

启动本地调试服务器，连接到远程环境进行调试。

```bash
kd debug [options]
```

| 参数 | 说明 |
|-----|------|
| `-e, --target-env <env>` | 目标环境 |
| `-f, --formid <formId>` | 要调试的表单 ID |

**示例：**
```bash
# 调试指定页面
kd debug -e sit -f kdtest_showFormPage

# 调试默认环境的页面
kd debug -f myPage
```

---

## 配置文件

KD CLI 的配置文件位于：

- **全局配置**：`~/.kd/config.json`
- **项目配置**：`<project>/.kd/config.json`

### 全局配置示例

```json
{
  "environments": [
    {
      "name": "dev",
      "url": "https://feature.kingdee.com:1026/feature_dev/"
    },
    {
      "name": "sit",
      "url": "https://feature.kingdee.com:1026/feature_sit/"
    }
  ],
  "defaultEnv": "sit"
}
```

### 项目配置示例

```json
{
  "app": "kdtest_wenq",
  "framework": "react",
  "language": "js",
  "isv": "kdtest"
}
```

---

## 常用工作流

### 1. 新建项目

```bash
kd project init myapp
cd myapp
npm install
```

### 2. 创建组件并开发

```bash
kd project create myComponent --type kwc
npm run dev
```

### 3. 构建并部署

```bash
npm run build
kd project deploy -e sit
```

### 4. 调试

```bash
kd debug -e sit -f myPage
```

### 5. 环境认证

```bash
kd env auth web -e sit
```
