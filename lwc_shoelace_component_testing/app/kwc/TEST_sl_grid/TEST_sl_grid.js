import { KingdeeElement, track } from '@kdcloudjs/kwc';

// 导入 shoelace 栅格组件
import '@kdcloudjs/shoelace/dist/components/row/row.js';
import '@kdcloudjs/shoelace/dist/components/col/col.js';
import '@kdcloudjs/shoelace/dist/components/icon/icon.js';
import '@kdcloudjs/shoelace/dist/components/switch/switch.js';
import '@kdcloudjs/shoelace/dist/components/radio-group/radio-group.js';
import '@kdcloudjs/shoelace/dist/components/radio/radio.js';
import '@kdcloudjs/shoelace/dist/components/input/input.js';

export default class TESTSlGrid extends KingdeeElement {
    // ===== 功能组合案例的状态管理 =====
    @track gutter = 16;
    @track verticalGutter = 16;
    @track justify = 'start';
    @track align = 'top';
    @track wrap = true;
    @track activeSection = 'case1';

    // 书签导航数据
    @track bookmarks = [
        { id: 'case1', label: '基础栅格布局', icon: 'grid', activeClass: 'bookmark-item-active' },
        { id: 'case2', label: '栅格间距', icon: 'distribute-horizontal', activeClass: '' },
        { id: 'case3', label: '响应式布局', icon: 'phone', activeClass: '' },
        { id: 'case4', label: '列偏移', icon: 'arrow-right', activeClass: '' },
        { id: 'case5', label: '对齐方式', icon: 'align-center', activeClass: '' },
        { id: 'case6', label: 'Flex 布局', icon: 'layout-wtf', activeClass: '' },
        { id: 'case7', label: '功能组合案例', icon: 'sliders', activeClass: '' }
    ];

    // ===== Getter =====
    get gutterDisplay() {
        return this.gutter + 'px';
    }

    get verticalGutterDisplay() {
        return this.verticalGutter + 'px';
    }

    get wrapText() {
        return this.wrap ? '开启' : '关闭';
    }

    get configJson() {
        return JSON.stringify({
            gutter: [this.gutter, this.verticalGutter],
            justify: this.justify,
            align: this.align,
            wrap: this.wrap
        }, null, 2);
    }

    // ===== 生命周期 =====
    connectedCallback() {
        this._handleScroll = this.handleScroll.bind(this);
        window.addEventListener('scroll', this._handleScroll);
    }

    renderedCallback() {
        if (this._eventsBound) return;
        this._eventsBound = true;

        this.bindShoelaceEvents();
        this.setupComplexProperties();
    }

    disconnectedCallback() {
        if (this._handleScroll) {
            window.removeEventListener('scroll', this._handleScroll);
        }
        this.unbindShoelaceEvents();
        this._eventsBound = false;
    }

    // ===== 设置需要 JS 设置的复杂属性 =====
    setupComplexProperties() {
        // 设置 gutter 数组类型
        const gutterArrayRow = this.template.querySelector('.gutter-array-row');
        if (gutterArrayRow) {
            gutterArrayRow.gutter = [16, 24];
        }

        // 设置响应式属性
        this.setupResponsiveCols();

        // 设置案例7预览区的 gutter
        this.updatePreviewRowGutter();
    }

    setupResponsiveCols() {
        // 响应式栅格列 - 简单数值
        const responsiveCols = this.template.querySelectorAll('.responsive-col');
        responsiveCols.forEach(col => {
            col.xs = 24;
            col.sm = 12;
            col.md = 8;
            col.lg = 6;
            col.xl = 4;
        });

        // 响应式栅格列 - 带偏移的对象
        const responsiveOffsetCols = this.template.querySelectorAll('.responsive-offset-col');
        responsiveOffsetCols.forEach(col => {
            col.xs = { span: 24 };
            col.sm = { span: 12 };
            col.md = { span: 8, offset: 2 };
            col.lg = { span: 6, offset: 0 };
        });
    }

    updatePreviewRowGutter() {
        const previewRow = this.template.querySelector('.preview-row');
        if (previewRow) {
            previewRow.gutter = [this.gutter, this.verticalGutter];
        }
    }

    // ===== 事件绑定管理 =====
    get shoelaceEventBindings() {
        return [
            ['.gutter-input', 'sl-input', this.handleGutterInput],
            ['.vertical-gutter-input', 'sl-input', this.handleVerticalGutterInput],
            ['.justify-radio-group', 'sl-change', this.handleJustifyChange],
            ['.align-radio-group', 'sl-change', this.handleAlignChange],
            ['.wrap-switch', 'sl-change', this.handleWrapChange]
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

    // ===== 事件处理器 =====
    handleBookmarkClick(event) {
        const button = event.currentTarget;
        const targetId = button.dataset.target;
        const element = this.template.querySelector('.section-' + targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            this.updateActiveSection(targetId);
        }
    }

    handleScroll() {
        const sections = ['case1', 'case2', 'case3', 'case4', 'case5', 'case6', 'case7'];
        const scrollPosition = window.scrollY + 150;

        for (let i = sections.length - 1; i >= 0; i--) {
            const section = this.template.querySelector('.section-' + sections[i]);
            if (section && section.offsetTop <= scrollPosition) {
                this.updateActiveSection(sections[i]);
                break;
            }
        }
    }

    updateActiveSection(sectionId) {
        if (this.activeSection !== sectionId) {
            this.activeSection = sectionId;
            this.bookmarks = this.bookmarks.map(b => ({
                ...b,
                activeClass: b.id === sectionId ? 'bookmark-item-active' : ''
            }));
        }
    }

    handleGutterInput(event) {
        this.gutter = Number(event.target.value) || 0;
        this.updatePreviewRowGutter();
    }

    handleVerticalGutterInput(event) {
        this.verticalGutter = Number(event.target.value) || 0;
        this.updatePreviewRowGutter();
    }

    handleJustifyChange(event) {
        this.justify = event.target.value;
    }

    handleAlignChange(event) {
        this.align = event.target.value;
    }

    handleWrapChange(event) {
        this.wrap = event.target.checked;
    }
}
