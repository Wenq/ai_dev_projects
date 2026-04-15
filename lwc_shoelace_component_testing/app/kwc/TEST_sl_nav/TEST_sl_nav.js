import { KingdeeElement, track } from '@kdcloudjs/kwc';

// 导入 shoelace 导航组件
import '@kdcloudjs/shoelace/dist/components/nav/nav.js';
import '@kdcloudjs/shoelace/dist/components/nav-item/nav-item.js';
import '@kdcloudjs/shoelace/dist/components/nav-submenu/nav-submenu.js';
import '@kdcloudjs/shoelace/dist/components/nav-group/nav-group.js';
import '@kdcloudjs/shoelace/dist/components/icon/icon.js';
import '@kdcloudjs/shoelace/dist/components/switch/switch.js';
import '@kdcloudjs/shoelace/dist/components/radio-group/radio-group.js';
import '@kdcloudjs/shoelace/dist/components/radio/radio.js';
import '@kdcloudjs/shoelace/dist/components/input/input.js';

export default class TEST_sl_nav extends KingdeeElement {
    // ===== 功能组合案例的状态管理 =====
    @track navMode = 'inline';
    @track navTheme = 'light';
    @track isMultiple = false;
    @track isSelectable = true;
    @track isInlineCollapsed = false;
    @track inlineIndent = 24;
    @track subMenuOpenDelay = 0;
    @track subMenuCloseDelay = 0.1;
    @track triggerSubMenuAction = 'hover';
    @track activeSection = 'case1';

    // 书签导航数据
    @track bookmarks = [
        { id: 'case1', label: '基础内联导航', icon: 'list' },
        { id: 'case2', label: '水平导航', icon: 'layout-text-sidebar-reverse' },
        { id: 'case3', label: '垂直导航', icon: 'layout-text-sidebar' },
        { id: 'case4', label: '带分组的导航', icon: 'collection' },
        { id: 'case5', label: '带子菜单的导航', icon: 'diagram-3' },
        { id: 'case6', label: '多选导航', icon: 'check-square' },
        { id: 'case7', label: '内联折叠导航', icon: 'arrows-collapse' },
        { id: 'case8', label: '禁用选择导航', icon: 'ban' },
        { id: 'case9', label: '禁用项导航', icon: 'slash-circle' },
        { id: 'case10', label: '深色主题导航', icon: 'moon' },
        { id: 'case11', label: '事件处理导航', icon: 'lightning' },
        { id: 'case12', label: '功能组合案例', icon: 'sliders' }
    ];

    // ===== Getters for template =====
    get isInlineMode() {
        return this.navMode === 'inline';
    }

    get isNotCollapsed() {
        return !this.isInlineCollapsed;
    }

    get showInlineIndent() {
        return this.navMode === 'inline' && !this.isInlineCollapsed;
    }

    get multipleLabel() {
        return this.isMultiple ? '开启' : '关闭';
    }

    get selectableLabel() {
        return this.isSelectable ? '开启' : '关闭';
    }

    get collapsedLabel() {
        return this.isInlineCollapsed ? '开启' : '关闭';
    }

    get inlineIndentLabel() {
        return '缩进 (Inline Indent): ' + this.inlineIndent + 'px';
    }

    get openDelayLabel() {
        return '子菜单展开延迟: ' + this.subMenuOpenDelay + 's';
    }

    get closeDelayLabel() {
        return '子菜单关闭延迟: ' + this.subMenuCloseDelay + 's';
    }

    get case12NavStyle() {
        if (this.navMode === 'horizontal') {
            return 'width: 100%;';
        }
        return this.isInlineCollapsed ? 'width: 60px;' : 'width: 220px;';
    }

    get demoBoxClass() {
        return this.navTheme === 'dark' ? 'demoBox darkBox' : 'demoBox';
    }

    get currentConfig() {
        return JSON.stringify({
            mode: this.navMode,
            theme: this.navTheme,
            multiple: this.isMultiple,
            selectable: this.isSelectable,
            inlineCollapsed: this.isInlineCollapsed,
            inlineIndent: this.inlineIndent,
            subMenuOpenDelay: this.subMenuOpenDelay,
            subMenuCloseDelay: this.subMenuCloseDelay,
            triggerSubMenuAction: this.triggerSubMenuAction
        }, null, 2);
    }

    // 为书签列表添加 class
    get bookmarksWithClass() {
        return this.bookmarks.map(b => ({
            ...b,
            cssClass: this.activeSection === b.id ? 'bookmarkItem active' : 'bookmarkItem'
        }));
    }

    connectedCallback() {
        this._scrollHandler = this.handleScroll.bind(this);
        window.addEventListener('scroll', this._scrollHandler);
    }

    renderedCallback() {
        if (this._eventsBound) return;
        this._eventsBound = true;
        this.bindShoelaceEvents();
    }

    disconnectedCallback() {
        window.removeEventListener('scroll', this._scrollHandler);
        this.unbindShoelaceEvents();
        this._eventsBound = false;
    }

    // 集中管理 Shoelace 事件绑定配置
    get shoelaceEventBindings() {
        return [
            // 案例 11 事件
            ['.nav-case11', 'sl-nav-select', this.handleNavSelect],
            ['.nav-case11', 'sl-change', this.handleNavChange],
            ['.nav-case11', 'sl-nav-open-change', this.handleOpenChange],
            // 案例 12 事件
            ['.nav-case12', 'sl-nav-select', this.handleNavSelect],
            ['.nav-case12', 'sl-change', this.handleNavChange],
            ['.nav-case12', 'sl-nav-open-change', this.handleOpenChange],
            // 控制面板
            ['.mode-radio-group', 'sl-change', this.handleModeChange],
            ['.theme-radio-group', 'sl-change', this.handleThemeChange],
            ['.multiple-switch', 'sl-change', this.handleMultipleChange],
            ['.selectable-switch', 'sl-change', this.handleSelectableChange],
            ['.collapsed-switch', 'sl-change', this.handleCollapsedChange],
            ['.indent-input', 'sl-input', this.handleIndentChange],
            ['.open-delay-input', 'sl-input', this.handleOpenDelayChange],
            ['.close-delay-input', 'sl-input', this.handleCloseDelayChange],
            ['.trigger-radio-group', 'sl-change', this.handleTriggerChange]
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

    // ===== 滚动监听 =====
    handleScroll() {
        const scrollPosition = window.scrollY + 150;
        for (let i = this.bookmarks.length - 1; i >= 0; i--) {
            const section = this.template.querySelector('.section-' + this.bookmarks[i].id);
            if (section && section.offsetTop <= scrollPosition) {
                this.activeSection = this.bookmarks[i].id;
                break;
            }
        }
    }

    // ===== 书签点击 =====
    handleBookmarkClick(event) {
        const sectionId = event.currentTarget.dataset.id;
        const element = this.template.querySelector('.section-' + sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            this.activeSection = sectionId;
        }
    }

    // ===== 导航事件处理 =====
    handleNavSelect(e) {
        console.log('选中项:', e.detail);
    }

    handleNavChange(e) {
        console.log('导航变化:', e.detail);
    }

    handleOpenChange(e) {
        console.log('展开变化:', e.detail);
    }

    // ===== 菜单项点击 =====
    handleItemClick(event) {
        const name = event.currentTarget.dataset.name;
        const key = event.currentTarget.dataset.key;
        alert('被点击菜单：' + name + '\n菜单 ID：' + key);
    }

    // ===== 控制面板事件处理 =====
    handleModeChange(e) {
        this.navMode = e.target.value;
    }

    handleThemeChange(e) {
        this.navTheme = e.target.value;
    }

    handleMultipleChange(e) {
        this.isMultiple = e.target.checked;
    }

    handleSelectableChange(e) {
        this.isSelectable = e.target.checked;
    }

    handleCollapsedChange(e) {
        this.isInlineCollapsed = e.target.checked;
    }

    handleIndentChange(e) {
        this.inlineIndent = Number(e.target.value);
    }

    handleOpenDelayChange(e) {
        this.subMenuOpenDelay = Number(e.target.value);
    }

    handleCloseDelayChange(e) {
        this.subMenuCloseDelay = Number(e.target.value);
    }

    handleTriggerChange(e) {
        this.triggerSubMenuAction = e.target.value;
    }
}
