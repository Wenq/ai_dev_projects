import { KingdeeElement, track } from '@kdcloudjs/kwc';

// 导入 Shoelace 组件定义
import '@kdcloudjs/shoelace/dist/components/button/button.js';
import '@kdcloudjs/shoelace/dist/components/icon/icon.js';
import '@kdcloudjs/shoelace/dist/components/input/input.js';

// 导入 logo 图片
import logoUrl from './logo.png';

export default class ExampleComponent extends KingdeeElement {
    count = 0;
    @track value = '';

    // logo 地址
    get logoUrl() {
        return logoUrl;
    }

    connectedCallback() {
        console.log('ExampleComponent connected');
    }

    renderedCallback() {
        // 防止重复绑定
        if (this._eventsBound) return;
        this._eventsBound = true;

        this.bindShoelaceEvents();
    }

    disconnectedCallback() {
        this.unbindShoelaceEvents();
        this._eventsBound = false;
    }

    // Shoelace 事件绑定配置
    get shoelaceEventBindings() {
        return [
            ['.hidden-input', 'sl-input', this.handleInputChange]
        ];
    }

    bindShoelaceEvents() {
        this._boundHandlers = this.shoelaceEventBindings.map(([selector, event, handler]) => {
            const el = this.template.querySelector(selector);
            if (el) {
                const boundHandler = handler.bind(this);
                el.addEventListener(event, boundHandler);
                return { el, event, boundHandler };
            }
            return null;
        }).filter(Boolean);
    }

    unbindShoelaceEvents() {
        if (this._boundHandlers) {
            this._boundHandlers.forEach(({ el, event, boundHandler }) => {
                el.removeEventListener(event, boundHandler);
            });
            this._boundHandlers = [];
        }
    }

    handleInputChange(event) {
        this.value = event.target.value;
    }

    handleIncrement() {
        this.count++;
    }
}
