import React from 'react';
import ReactDOM from 'react-dom/client';
import TEST_sl_nav from './TEST_sl_nav/TEST_sl_nav.jsx';
import { setBasePath } from '@kdcloudjs/shoelace/dist/utilities/base-path.js';

setBasePath(import.meta.env.SHOELACE_BASE_URL);

function mount(Component, props = {}) {
    const el = document.createElement('div');
    el.style.width = '100%';
    document.body.appendChild(el);
    const root = ReactDOM.createRoot(el);
    root.render(React.createElement(Component, props));
}

mount(TEST_sl_nav)
