import { createElement } from '@kdcloudjs/kwc';
import { setBasePath } from '@kdcloudjs/shoelace/dist/utilities/base-path.js';
import TESTAllComponents from './TEST_all_components/TEST_all_components.js';

// 设置 Shoelace 组件的基础路径
setBasePath(import.meta.env.SHOELACE_BASE_URL);

// 创建并挂载 LWC 组件
const el = createElement('kwc-test-all-components', { is: TESTAllComponents });
el.style.display = 'block';
el.style.width = '100%';
document.body.appendChild(el);
