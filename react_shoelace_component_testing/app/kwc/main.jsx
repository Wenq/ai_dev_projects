import React from 'react';
import ReactDOM from 'react-dom/client';
import TEST_all_components from './TEST_all_components/TEST_all_components.jsx';
import TEST_showForm from './TEST_showForm/TEST_showForm.jsx';
import TEST_sl_lookupF7 from './TEST_sl_lookupF7/TEST_sl_lookupF7.jsx';
import { setBasePath } from '@kdcloudjs/shoelace/dist/utilities/base-path.js';

setBasePath(import.meta.env.SHOELACE_BASE_URL);

// 页面路由映射
const routes = {
    '/': TEST_all_components,
    '/showForm': TEST_showForm,
    '/lookupF7': TEST_sl_lookupF7,
};

function mount(Component, props = {}) {
    const el = document.createElement('div');
    el.style.width = '100%';
    document.body.appendChild(el);
    const root = ReactDOM.createRoot(el);
    root.render(React.createElement(Component, props));
}

// 根据 URL hash 或 pathname 选择页面
function getPage() {
    const hash = window.location.hash.slice(1); // 去掉 #
    if (hash && routes[hash]) {
        return routes[hash];
    }
    return routes['/'];
}

mount(getPage());
