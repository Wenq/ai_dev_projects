import { KingdeeElement, track } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/icon/icon.js';

export default class TEST_all_components extends KingdeeElement {
    // 当前选中的导航项 key，默认选中第一个
    activeKey = 'nav';

    // 导航菜单项列表
    @track menuItems = [
        { key: 'nav', label: 'Nav 导航' },
        { key: 'grid', label: 'Grid 布局' },
        { key: 'screen', label: '大屏组件' },
        { key: 'dialog', label: 'Dialog 对话框' },
        { key: 'pagination', label: 'Pagination 分页器' }
    ];

    // ===== Getters for 条件渲染 =====
    get isNavActive() {
        return this.activeKey === 'nav';
    }

    get isGridActive() {
        return this.activeKey === 'grid';
    }

    get isScreenActive() {
        return this.activeKey === 'screen';
    }

    get isDialogActive() {
        return this.activeKey === 'dialog';
    }

    get isPaginationActive() {
        return this.activeKey === 'pagination';
    }

    // 获取当前选中组件的标签
    get currentLabel() {
        const current = this.menuItems.find(item => item.key === this.activeKey);
        return current ? current.label : '未选择';
    }

    // 为 for:each 渲染准备带有 isActive 状态的菜单项
    get computedMenuItems() {
        return this.menuItems.map(item => ({
            ...item,
            isActive: item.key === this.activeKey,
            itemClass: item.key === this.activeKey ? 'navItem navItemActive' : 'navItem'
        }));
    }

    // ===== 事件处理 =====
    handleNavClick(event) {
        const key = event.currentTarget.dataset.key;
        if (key && key !== this.activeKey) {
            this.activeKey = key;
            // 触发响应式更新
            this.menuItems = [...this.menuItems];
        }
    }

    connectedCallback() {
        console.log('TEST_all_components connected');
    }
}
