import { KingdeeElement, track } from '@kdcloudjs/kwc';

// 导入 Shoelace Pagination 相关组件
import '@kdcloudjs/shoelace/dist/components/pagination/pagination.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';
import '@kdcloudjs/shoelace/dist/components/icon/icon.js';

export default class TEST_sl_pagination extends KingdeeElement {
    // 书签导航状态
    @track activeSection = 'case1';

    // 受控模式的状态
    @track controlledPage = 1;
    @track controlledPageSize = 20;

    // 事件日志
    @track eventLogs = [];

    // 书签导航数据
    get bookmarks() {
        return [
            { id: 'case1', label: '基础分页器', icon: 'chevron-bar-left', bookmarkClass: this.activeSection === 'case1' ? 'bookmarkItem active' : 'bookmarkItem' },
            { id: 'case2', label: '设置总数据量', icon: 'database', bookmarkClass: this.activeSection === 'case2' ? 'bookmarkItem active' : 'bookmarkItem' },
            { id: 'case3', label: '自定义每页条数', icon: 'list-ol', bookmarkClass: this.activeSection === 'case3' ? 'bookmarkItem active' : 'bookmarkItem' },
            { id: 'case4', label: '自定义条数选项', icon: 'sliders', bookmarkClass: this.activeSection === 'case4' ? 'bookmarkItem active' : 'bookmarkItem' },
            { id: 'case5', label: '设置默认页码', icon: 'bookmark', bookmarkClass: this.activeSection === 'case5' ? 'bookmarkItem active' : 'bookmarkItem' },
            { id: 'case6', label: '受控模式', icon: 'toggles', bookmarkClass: this.activeSection === 'case6' ? 'bookmarkItem active' : 'bookmarkItem' },
            { id: 'case7', label: '简洁模式', icon: 'layout-text-sidebar', bookmarkClass: this.activeSection === 'case7' ? 'bookmarkItem active' : 'bookmarkItem' },
            { id: 'case8', label: '禁用状态', icon: 'ban', bookmarkClass: this.activeSection === 'case8' ? 'bookmarkItem active' : 'bookmarkItem' },
            { id: 'case9', label: '事件监听', icon: 'lightning', bookmarkClass: this.activeSection === 'case9' ? 'bookmarkItem active' : 'bookmarkItem' },
            { id: 'case10', label: '动态更新', icon: 'arrow-repeat', bookmarkClass: this.activeSection === 'case10' ? 'bookmarkItem active' : 'bookmarkItem' },
            { id: 'case11', label: '自定义样式', icon: 'palette', bookmarkClass: this.activeSection === 'case11' ? 'bookmarkItem active' : 'bookmarkItem' }
        ];
    }

    // 判断是否有事件日志
    get hasEventLogs() {
        return this.eventLogs.length > 0;
    }

    // 带索引的日志列表
    get eventLogsWithIndex() {
        return this.eventLogs.map((log, index) => ({
            log: log,
            key: `log-${index}`
        }));
    }

    renderedCallback() {
        if (this._eventsBound) return;
        this._eventsBound = true;

        this.bindShoelaceEvents();
        this.setupPageSizeOpts();
        this.hideAllPageSizeSelectors();
    }

    disconnectedCallback() {
        this.unbindShoelaceEvents();
        this._eventsBound = false;
    }

    // 集中管理 Shoelace 事件绑定配置
    get shoelaceEventBindings() {
        return [
            // 受控模式分页器
            ['.pagination-controlled', 'sl-page-change', this.handleControlledPageChange],
            // 事件监听分页器
            ['.pagination-event', 'sl-page-change', this.handleEventLog],
            // 动态更新按钮
            ['.btn-page-1', 'click', this.handleSetPage1],
            ['.btn-page-5', 'click', this.handleSetPage5],
            ['.btn-page-10', 'click', this.handleSetPage10],
            ['.btn-size-10', 'click', this.handleSetSize10],
            ['.btn-size-20', 'click', this.handleSetSize20],
            ['.btn-size-50', 'click', this.handleSetSize50],
            ['.btn-total-100', 'click', this.handleSetTotal100],
            ['.btn-total-500', 'click', this.handleSetTotal500],
            ['.btn-total-2000', 'click', this.handleSetTotal2000],
            ['.btn-reset', 'click', this.handleResetPagination],
            ['.btn-clear-log', 'click', this.handleClearLog]
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

    // 设置 page-size-opts 数组属性（需要在 JS 中设置）
    setupPageSizeOpts() {
        const pagination1 = this.template.querySelector('.pagination-opts-1');
        if (pagination1) {
            pagination1.pageSizeOpts = [25, 50, 100, 200];
        }

        const pagination2 = this.template.querySelector('.pagination-opts-2');
        if (pagination2) {
            pagination2.pageSizeOpts = [5, 10, 15, 20];
        }
    }

    // 隐藏所有分页器中的「每页条数选择器」
    hideAllPageSizeSelectors() {
        const tryHide = () => {
            const paginations = this.template.querySelectorAll('sl-pagination');
            paginations.forEach(el => this.hidePageSizeSelector(el));
        };

        tryHide();
        // 组件可能尚未渲染完，延迟重试
        requestAnimationFrame(() => tryHide());
    }

    // 隐藏单个分页器的 page size selector
    hidePageSizeSelector(el) {
        if (!el) return;
        const root = el.shadowRoot;
        if (root) {
            const customSelect = root.querySelector('custom-select');
            if (customSelect) {
                customSelect.style.display = 'none';
            }
        }
    }

    // 处理书签点击
    handleBookmarkClick(event) {
        const button = event.currentTarget;
        const sectionId = button.dataset.section;
        if (sectionId) {
            const element = this.template.querySelector(`.${sectionId}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                this.activeSection = sectionId;
            }
        }
    }

    // 受控模式的页码变化处理
    handleControlledPageChange(event) {
        const { pageNumber, pageSize } = event.detail;
        this.controlledPage = pageNumber;
        this.controlledPageSize = pageSize;
        // 受控模式需手动更新组件属性
        event.target.currentPage = pageNumber;
        event.target.pageSize = pageSize;
    }

    // 记录事件日志
    handleEventLog(event) {
        const { pageNumber, pageSize } = event.detail;
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `[${timestamp}] 页码: ${pageNumber}, 每页: ${pageSize} 条`;
        // 保留最近 10 条日志
        this.eventLogs = [...this.eventLogs.slice(-9), logEntry];
    }

    // 清除日志
    handleClearLog() {
        this.eventLogs = [];
    }

    // 动态更新操作 - 跳转页码
    handleSetPage1() {
        const pagination = this.template.querySelector('.pagination-dynamic');
        if (pagination) {
            pagination.currentPage = 1;
        }
    }

    handleSetPage5() {
        const pagination = this.template.querySelector('.pagination-dynamic');
        if (pagination) {
            pagination.currentPage = 5;
        }
    }

    handleSetPage10() {
        const pagination = this.template.querySelector('.pagination-dynamic');
        if (pagination) {
            pagination.currentPage = 10;
        }
    }

    // 动态更新操作 - 每页条数
    handleSetSize10() {
        const pagination = this.template.querySelector('.pagination-dynamic');
        if (pagination) {
            pagination.pageSize = 10;
        }
    }

    handleSetSize20() {
        const pagination = this.template.querySelector('.pagination-dynamic');
        if (pagination) {
            pagination.pageSize = 20;
        }
    }

    handleSetSize50() {
        const pagination = this.template.querySelector('.pagination-dynamic');
        if (pagination) {
            pagination.pageSize = 50;
        }
    }

    // 动态更新操作 - 总条数
    handleSetTotal100() {
        const pagination = this.template.querySelector('.pagination-dynamic');
        if (pagination) {
            pagination.total = 100;
        }
    }

    handleSetTotal500() {
        const pagination = this.template.querySelector('.pagination-dynamic');
        if (pagination) {
            pagination.total = 500;
        }
    }

    handleSetTotal2000() {
        const pagination = this.template.querySelector('.pagination-dynamic');
        if (pagination) {
            pagination.total = 2000;
        }
    }

    // 重置分页器
    handleResetPagination() {
        const pagination = this.template.querySelector('.pagination-dynamic');
        if (pagination) {
            pagination.currentPage = 1;
            pagination.pageSize = 20;
            pagination.total = 500;
        }
    }
}
