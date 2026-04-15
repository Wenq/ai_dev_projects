import { KingdeeElement, track } from '@kdcloudjs/kwc';

// 导入 Shoelace 组件
import '@kdcloudjs/shoelace/dist/components/dialog/dialog.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';
import '@kdcloudjs/shoelace/dist/components/icon/icon.js';
import '@kdcloudjs/shoelace/dist/components/input/input.js';
import '@kdcloudjs/shoelace/dist/components/textarea/textarea.js';

export default class TEST_sl_dialog extends KingdeeElement {
    // 表单数据
    @track formData = {
        name: '',
        email: '',
        message: ''
    };

    // 事件日志
    @track eventLogs = [];

    // 书签导航数据
    @track bookmarks = [
        { id: 'case1', label: '基础对话框', icon: 'chat-square', isActive: true },
        { id: 'case2', label: '自定义标题', icon: 'card-heading', isActive: false },
        { id: 'case3', label: '自定义底部', icon: 'box-arrow-down', isActive: false },
        { id: 'case4', label: '无标题对话框', icon: 'x-square', isActive: false },
        { id: 'case5', label: '表单对话框', icon: 'ui-checks', isActive: false },
        { id: 'case6', label: '嵌套对话框', icon: 'layers', isActive: false },
        { id: 'case7', label: '确认对话框', icon: 'question-circle', isActive: false },
        { id: 'case8', label: '自定义宽度', icon: 'arrows-expand', isActive: false },
        { id: 'case9', label: '阻止关闭', icon: 'shield-lock', isActive: false },
        { id: 'case10', label: '事件处理', icon: 'lightning', isActive: false },
        { id: 'case11', label: '滚动内容', icon: 'file-text', isActive: false },
        { id: 'case12', label: '禁用遮罩关闭', icon: 'shield-x', isActive: false }
    ];

    // 是否有事件日志
    get hasEventLogs() {
        return this.eventLogs.length > 0;
    }

    // 生命周期：渲染后绑定事件
    renderedCallback() {
        if (this._eventsBound) return;
        this._eventsBound = true;
        this.bindShoelaceEvents();
    }

    // 生命周期：销毁时解绑事件
    disconnectedCallback() {
        this.unbindShoelaceEvents();
        this._eventsBound = false;
    }

    // Shoelace 事件绑定配置
    get shoelaceEventBindings() {
        return [
            // 表单输入事件
            ['.form-name-input', 'sl-input', this.handleNameInput],
            ['.form-email-input', 'sl-input', this.handleEmailInput],
            ['.form-message-input', 'sl-input', this.handleMessageInput],
            // 阻止关闭对话框事件
            ['.prevent-close-dialog', 'sl-request-close', this.handlePreventClose],
            // 事件测试对话框事件
            ['.event-dialog', 'sl-show', this.handleEventShow],
            ['.event-dialog', 'sl-after-show', this.handleEventAfterShow],
            ['.event-dialog', 'sl-hide', this.handleEventHide],
            ['.event-dialog', 'sl-after-hide', this.handleEventAfterHide],
            ['.event-dialog', 'sl-initial-focus', this.handleEventInitialFocus],
            ['.event-dialog', 'sl-request-close', this.handleEventRequestClose],
            // 禁用遮罩关闭对话框事件
            ['.mask-closable-dialog', 'sl-request-close', this.handleMaskClosableRequestClose]
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

    // ===== 对话框显示/隐藏方法 =====
    openBasicDialog() {
        this.template.querySelector('.basic-dialog').show();
    }

    closeBasicDialog() {
        this.template.querySelector('.basic-dialog').hide();
    }

    openHeaderDialog() {
        this.template.querySelector('.header-dialog').show();
    }

    closeHeaderDialog() {
        this.template.querySelector('.header-dialog').hide();
    }

    openFooterDialog() {
        this.template.querySelector('.footer-dialog').show();
    }

    closeFooterDialog() {
        this.template.querySelector('.footer-dialog').hide();
    }

    handleFooterLater() {
        alert('稍后处理');
    }

    handleFooterSave() {
        alert('已保存');
        this.template.querySelector('.footer-dialog').hide();
    }

    openNoHeaderDialog() {
        this.template.querySelector('.no-header-dialog').show();
    }

    closeNoHeaderDialog() {
        this.template.querySelector('.no-header-dialog').hide();
    }

    openFormDialog() {
        this.template.querySelector('.form-dialog').show();
    }

    closeFormDialog() {
        this.template.querySelector('.form-dialog').hide();
    }

    openNestedDialog() {
        this.template.querySelector('.nested-dialog').show();
    }

    closeNestedDialog() {
        this.template.querySelector('.nested-dialog').hide();
    }

    openInnerDialog() {
        this.template.querySelector('.inner-dialog').show();
    }

    closeInnerDialog() {
        this.template.querySelector('.inner-dialog').hide();
    }

    openConfirmDialog() {
        this.template.querySelector('.confirm-dialog').show();
    }

    closeConfirmDialog() {
        this.template.querySelector('.confirm-dialog').hide();
    }

    openCustomWidthDialog() {
        this.template.querySelector('.custom-width-dialog').show();
    }

    closeCustomWidthDialog() {
        this.template.querySelector('.custom-width-dialog').hide();
    }

    openPreventCloseDialog() {
        this.template.querySelector('.prevent-close-dialog').show();
    }

    closePreventCloseDialog() {
        this.template.querySelector('.prevent-close-dialog').hide();
    }

    openEventDialog() {
        this.template.querySelector('.event-dialog').show();
    }

    closeEventDialog() {
        this.template.querySelector('.event-dialog').hide();
    }

    openScrollDialog() {
        this.template.querySelector('.scroll-dialog').show();
    }

    closeScrollDialog() {
        this.template.querySelector('.scroll-dialog').hide();
    }

    handleScrollAgree() {
        alert('感谢您的同意！');
        this.template.querySelector('.scroll-dialog').hide();
    }

    openMaskClosableDialog() {
        this.template.querySelector('.mask-closable-dialog').show();
    }

    closeMaskClosableDialog() {
        this.template.querySelector('.mask-closable-dialog').hide();
    }

    // ===== 书签导航 =====
    handleBookmarkClick(event) {
        const targetId = event.currentTarget.dataset.id;
        const element = this.template.querySelector('.' + targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            this.bookmarks = this.bookmarks.map(b => ({
                ...b,
                isActive: b.id === targetId
            }));
        }
    }

    // ===== 表单处理 =====
    handleNameInput(event) {
        this.formData = { ...this.formData, name: event.target.value };
    }

    handleEmailInput(event) {
        this.formData = { ...this.formData, email: event.target.value };
    }

    handleMessageInput(event) {
        this.formData = { ...this.formData, message: event.target.value };
    }

    handleFormSubmit() {
        alert(`表单提交成功！\n姓名：${this.formData.name}\n邮箱：${this.formData.email}\n留言：${this.formData.message}`);
        this.template.querySelector('.form-dialog').hide();
        this.formData = { name: '', email: '', message: '' };
    }

    // ===== 确认对话框 =====
    handleConfirm() {
        alert('您点击了确认！');
        this.template.querySelector('.confirm-dialog').hide();
    }

    // ===== 阻止关闭 =====
    handlePreventClose(event) {
        if (event.detail.source === 'overlay' || event.detail.source === 'keyboard') {
            event.preventDefault();
            alert('请点击底部按钮关闭对话框');
        }
    }

    // ===== 事件日志 =====
    logEvent(eventName, detail) {
        const timestamp = new Date().toLocaleTimeString();
        const newLog = `[${timestamp}] ${eventName}: ${JSON.stringify(detail || {})}`;
        const newLogs = [...this.eventLogs.slice(-9), newLog];
        this.eventLogs = newLogs;
    }

    handleEventShow() {
        this.logEvent('sl-show', { message: '对话框即将显示' });
    }

    handleEventAfterShow() {
        this.logEvent('sl-after-show', { message: '对话框已完全显示' });
    }

    handleEventHide() {
        this.logEvent('sl-hide', { message: '对话框即将隐藏' });
    }

    handleEventAfterHide() {
        this.logEvent('sl-after-hide', { message: '对话框已完全隐藏' });
    }

    handleEventInitialFocus() {
        this.logEvent('sl-initial-focus', { message: '对话框获得初始焦点' });
    }

    handleEventRequestClose(event) {
        this.logEvent('sl-request-close', { source: event.detail.source });
    }

    clearEventLogs() {
        this.eventLogs = [];
    }

    // ===== 禁用遮罩关闭 =====
    handleMaskClosableRequestClose(event) {
        if (event.detail.source === 'overlay') {
            event.preventDefault();
        }
    }
}
