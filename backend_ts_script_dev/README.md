# KWC React Web Component Template (JavaScript Version)

## 组件与页面功能验证场景

| 组件 | 页面 | 功能场景 |
|------|------|----------|
| **ExampleComponent** | — | 基础示例组件：演示 React 状态管理、Shoelace UI 集成、表单输入与提交、苍穹上下文数据监听与表单操作（showForm / close）。 |
| **GetUserCountCtrl** | `GetUserCountPage` | 人员数量查询：调用后端 `GetUserCountController` 接口，查询系统中启用状态的人员总数，验证 KWC 前后端通信（adapterApi.doGet）、加载状态、错误处理与重试机制。 |
| **SalesOrderDashboard** | `SalesOrderDashboardPage` | 销售订单仪表盘：调用后端 `SalesOrderDashboardController` 接口，展示单据按状态（暂存/已提交/已审核/已关闭）分类统计、总单数、最近12个月趋势图表，验证多 adapter 并行请求与数据聚合展示。 |
| **SalesOrderManage** | `SalesOrderManagePage` | 销售订单 CRUD 管理：调用后端 `SalesOrderManageController` 接口，完整验证新增、编辑、删除、列表查询（模糊搜索 + 分页）。覆盖多种字段类型（文本/数值/日期/状态），表单含必录标识、分区布局、系统信息只读展示。使用 SlTable 组件。 |
| **ServerCommTest** | `ServerCommTestPage` | HTTP 通信测试工具：支持自定义 URL、HTTP 方法（GET/POST/PUT/DELETE）、请求体编辑，实时展示响应内容、状态码、响应时间，用于调试和验证服务端接口连通性。 |
| — | `GetUserCountPage1` | 页面属性传递示例：演示通过 `.page-meta.kwp` 向组件传递属性配置（StringValue="hello world"），验证元数据驱动的属性注入机制。 |

### 后端控制器

| 控制器 | 基础 URL | 接口 | 说明 |
|--------|----------|------|------|
| **GetUserCountController** | `/kdtest/kdtest_kwc_wenq/userCount` | `GET /count`, `GET /countByOrg` | 查询 `bos_user` / `bd_person` 表的启用人员数量，支持按组织过滤 |
| **SalesOrderDashboardController** | `/kdtest/kdtest_kwc_wenq/salesDashboard` | `GET /statusSummary`, `GET /salesTrend` | 费用申请单按状态汇总统计、近12个月趋势 |
| **SalesOrderManageController** | `/kdtest/kdtest_kwc_wenq/salesOrderManage` | `GET /query`, `POST /create`, `POST /update`, `POST /delete` | 销售订单（`kdtest_wenq_xsdd01` 实体）完整 CRUD 操作 |

---

This template project is configured to build React components as standard Web Components (KWC - Kingdee Web Component).

> **Note**: This project is also used to validate backend TypeScript script development, i.e., writing controllers using TypeScript plugin scripts.

## Features

- **React 19**: Build native Web Components using React 19 and JSX.
- **Vite Library Mode**: Library build mode optimized for ES modules.
- **JavaScript**: Pure JavaScript development to lower the entry barrier.
- **Vitest**: Modern unit testing setup based on JSDOM.
- **Shoelace**: Integrated Shoelace UI component library.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run unit tests
npm run test
```

## Build

```bash
npm run build
```

The build process generates:
- `dist/[ComponentName]/index.js`: A compact, minified ES module containing component registration, unmount, and update logic.

## Usage

The library exports `mount`, `unmount`, and `update` functions. After uploading the build artifacts to the Cosmic (Cangqiong) platform via the scaffold, the component can be used in the Cosmic platform.

## Project Structure

- `app/kwc/`: Contains KWC components
  - `ExampleComponent/`: Example implementation of a KWC component
    - `Index.jsx`: Component JS logic
    - `index.module.scss`: Component style file
    - `index.js-meta.kwc`: Component metadata file containing configuration information.
  - `main.jsx`: Entry file for development mode.
- `app/pages/`: Contains pages for KWC components
  - `kwcdemo.page-meta.kwp`: Example page containing the `ExampleComponent` component.
- `vite.config.js`: Vite build configuration.

## Other Matters

### Component Naming

- Component filenames are recommended to use the `.jsx` suffix.
- If using a folder structure, the entry file should be named `Index.jsx` or `index.jsx`.

### Context Information

You can get the form context information via `props.config`. Define `props` in the component:

```javascript
function MyComponent(props) {
  // Access props.config
}
```

The Cosmic platform form passes the `config` object through `props`, which contains the following information:
- `config.metaProps`: Contains properties passed in the component metadata.
- `config.context.dispatchAction`: Used to trigger Cosmic platform form actions, such as showing popups or other operations requiring interaction with form plugins.
- `config.context.data`: Context page data.
- `config.context.getData`: `getter` method for context data, used to get real-time data.
- `config.context.addDataChangeListener`: Used to add data change listeners, triggering a callback when context data changes.
- `config.context.close`: Used to close the current form.
- `config.pageId`: Page ID of the current form.
- `config.formId`: Form ID of the current form.
- `config.controlId`: Control ID of the current component.
- `config.isvId`: ISV ID of the current component.
- `config.moduleId`: Module ID of the current component.

### Getting Context Data

```javascript
import { useState, useEffect } from 'react';
import { showForm } from '@kdcloudjs/kwc-shared-utils/sendBosPlatformEvent';

// Import Shoelace styles
import '@kdcloudjs/shoelace/dist/themes/light.css';
// Import Shoelace components
import '@kdcloudjs/shoelace/dist/components/button/button.js';
import '@kdcloudjs/shoelace/dist/components/icon/icon.js';
import '@kdcloudjs/shoelace/dist/components/card/card.js';
import '@kdcloudjs/shoelace/dist/components/input/input.js';

// Import styles
import styles from './index.module.scss';

export default function ExampleComponent({ config }) {
    const [contextData, setContextData] = useState({});
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');

    useEffect(() => {
        const propContext = config?.context;
        if (propContext) {
            // 1. Initialize context data
            setContextData(propContext.data || {});

            // 2. Add data change listener
            if (propContext.addDataChangeListener) {
                const removeListener = propContext.addDataChangeListener((event) => {
                    // 3. Handle context data changes
                    setContextData(event.data || {});
                });

                // 4. Remove listener when component unmounts
                return () => {
                    removeListener();
                };
            }
        }
    }, [config]);

    const handleSubmit = () => {
        const formConfig = {
            parentPageId: config?.pageId,
            formId: 'myForm',
            params: {
                openStyle: { showType: 6 },
                name: input1,
                phone: input2
            }
        };

        const urlConfig = {
            app: config?.app,
            callBackId: 'callBackId'
        };

        showForm(formConfig, urlConfig);
    };

    const handleClose = () => {
        config?.context?.close({ params: 123 });
    };

    return (
        <div className={styles.exampleComponent}>
            <sl-card class={styles.cardOverview}>
                <div slot="header">
                    <strong>React + Shoelace Web Component</strong>
                </div>

                <div className={styles.partContainer}>
                    {/* Part 1: Two inputs and one button */}
                    <div className={`${styles.part} ${styles.partInputs}`}>
                        <sl-input
                            label="Input 1"
                            value={input1}
                            onSlInput={(e) => setInput1(e.target.value)}
                            placeholder="Enter something..."
                            class={styles.inputItem}
                        ></sl-input>
                        <sl-input
                            label="Input 2"
                            value={input2}
                            onSlInput={(e) => setInput2(e.target.value)}
                            placeholder="Enter something else..."
                            class={styles.inputItem}
                        ></sl-input>
                        <sl-button variant="primary" onClick={handleSubmit} class={styles.submitBtn}>
                            Submit
                        </sl-button>
                    </div>

                    {/* Part 2: Two descriptions, shown when contextData has name and phone */}
                    {contextData.name && contextData.phone && (
                        <div className={`${styles.part} ${styles.partDescriptions}`}>
                            <div className={styles.descriptionItem}>
                                <strong>Description 1:</strong>
                                <p>Data exists in the context.</p>
                            </div>
                            <div className={styles.descriptionItem}>
                                <strong>Description 2:</strong>
                                <p>name: {contextData.name}</p>
                                <p>phone: {contextData.phone}</p>
                            </div>
                            <sl-button variant="primary" class={styles.submitBtn} onClick={handleClose}>
                                Close
                            </sl-button>
                        </div>
                    )}
                </div>
            </sl-card>
        </div>
    );
}
```

```scss
// ExampleComponent/index.module.scss
.exampleComponent {
    font-family: var(--sl-font-sans);
    padding: 1rem;
}

.partContainer {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.part {
    padding: 1rem;
    border: 1px solid var(--sl-color-neutral-200);
    border-radius: var(--sl-border-radius-medium);
    background-color: var(--sl-color-neutral-50);
}

.partInputs {
    .inputItem {
        margin-bottom: 1rem;
    }

    .submitBtn {
        width: 100%;
    }
}

.partDescriptions {
    border-left: 4px solid var(--sl-color-primary-600);

    .descriptionItem {
        margin-bottom: 0.5rem;

        p {
            margin: 0.25rem 0 0 0;
            font-size: 0.9rem;
            color: var(--sl-color-neutral-700);
        }
    }
}

.cardOverview {
    max-width: 500px;
}
```
