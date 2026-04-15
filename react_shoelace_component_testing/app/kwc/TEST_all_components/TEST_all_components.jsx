import { useState } from 'react';
import styles from './TEST_all_components.module.scss';

// 导入各验收组件
import TEST_sl_nav from '../TEST_sl_nav/TEST_sl_nav.jsx';
import TEST_sl_grid from '../TEST_sl_grid/TEST_sl_grid.jsx';
import TEST_sl_screen from '../TEST_sl_screen/TEST_sl_screen.jsx';
import TEST_sl_dialog from '../TEST_sl_dialog/TEST_sl_dialog.jsx';
import TEST_sl_pagination from '../TEST_sl_pagination/TEST_sl_pagination.jsx';

// 导入 Shoelace React 包装器
import { SlIcon } from '@kdcloudjs/shoelace/dist/react';

// 三级菜单数据结构
// link: 独立页面链接（hash路由），点击后在新窗口打开
const menuData = [
    {
        key: 'components',
        label: '组件列表',
        icon: 'grid-3x3-gap',
        children: [
            { key: 'nav', label: 'Nav 导航', component: TEST_sl_nav },
            { key: 'grid', label: 'Grid 布局', component: TEST_sl_grid },
            { key: 'screen', label: '大屏组件', component: TEST_sl_screen },
            { key: 'dialog', label: 'Dialog 对话框', component: TEST_sl_dialog },
            { key: 'pagination', label: 'Pagination 分页器', component: TEST_sl_pagination },
            { key: 'lookupF7', label: 'LookupF7 F7选择器', link: '#/lookupF7', command: 'kd debug -e sit -f kdtest_lookupF7Page' }
        ]
    },
    {
        key: 'communication',
        label: '通信能力',
        icon: 'broadcast',
        children: [
            { key: 'showForm', label: 'showForm 打开表单', command: 'kd debug -e sit -f kdtest_showFormPage' },
            { key: 'http', label: 'HTTP 请求', component: null },
            { key: 'websocket', label: 'WebSocket', component: null },
            { key: 'event', label: '事件总线', component: null }
        ]
    },
    {
        key: 'backend',
        label: '后端脚本开发',
        icon: 'terminal',
        children: [
            { key: 'api', label: 'API 调用', component: null },
            { key: 'database', label: '数据库操作', component: null },
            { key: 'file', label: '文件处理', component: null }
        ]
    }
];

export default function TEST_all_components(config) {
    // 当前展开的一级菜单 key
    const [expandedKey, setExpandedKey] = useState('components');
    // 当前选中的二级菜单 key
    const [activeKey, setActiveKey] = useState('nav');

    // 处理一级菜单点击
    const handleMenuClick = (key) => {
        if (expandedKey === key) {
            // 已展开则折叠
            setExpandedKey(null);
        } else {
            // 展开并默认选中第一个子项
            setExpandedKey(key);
            const menu = menuData.find(m => m.key === key);
            if (menu?.children?.length > 0) {
                setActiveKey(menu.children[0].key);
            }
        }
    };

    // 处理二级菜单点击
    const handleSubMenuClick = (child, e) => {
        e.stopPropagation();
        // 如果有 link 属性，打开独立页面
        if (child.link) {
            window.open(child.link, '_blank');
            return;
        }
        // 如果有 command 属性，显示终端命令提示
        if (child.command) {
            const copied = navigator.clipboard.writeText(child.command).then(() => true).catch(() => false);
            alert(`请在终端执行以下命令：\n\n${child.command}\n\n（命令已复制到剪贴板）`);
            return;
        }
        setActiveKey(child.key);
    };

    // 获取当前选中的组件
    const getCurrentComponent = () => {
        for (const menu of menuData) {
            const child = menu.children?.find(c => c.key === activeKey);
            if (child) return child;
        }
        return null;
    };

    const currentItem = getCurrentComponent();
    const CurrentComponent = currentItem?.component;

    // 获取当前菜单路径（用于标题显示）
    const getMenuPath = () => {
        for (const menu of menuData) {
            const child = menu.children?.find(c => c.key === activeKey);
            if (child) {
                return `${menu.label} / ${child.label}`;
            }
        }
        return '未选择';
    };

    return (
        <div className={styles.pageWrapper}>
            {/* 顶部标题栏 */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>
                        <SlIcon name="puzzle" className={styles.titleIcon} />
                        KWC 组件验收中心
                    </h1>
                    <p className={styles.subtitle}>
                        当前位置：{getMenuPath()}
                    </p>
                </div>
            </header>

            {/* 内容区：左右分栏 */}
            <div className={styles.contentWrapper}>
                {/* 左侧三级菜单 */}
                <aside className={styles.sidebar}>
                    <nav className={styles.navMenu}>
                        {menuData.map((menu) => (
                            <div key={menu.key} className={styles.menuGroup}>
                                {/* 一级菜单 */}
                                <div
                                    className={`${styles.menuItem} ${expandedKey === menu.key ? styles.menuItemExpanded : ''}`}
                                    onClick={() => handleMenuClick(menu.key)}
                                >
                                    <SlIcon name={menu.icon} className={styles.menuIcon} />
                                    <span className={styles.menuLabel}>{menu.label}</span>
                                    <SlIcon
                                        name={expandedKey === menu.key ? 'chevron-down' : 'chevron-right'}
                                        className={styles.menuArrow}
                                    />
                                </div>

                                {/* 二级菜单 */}
                                {expandedKey === menu.key && menu.children && (
                                    <div className={styles.subMenu}>
                                        {menu.children.map((child) => (
                                            <div
                                                key={child.key}
                                                className={`${styles.subMenuItem} ${activeKey === child.key ? styles.subMenuItemActive : ''}`}
                                                onClick={(e) => handleSubMenuClick(child, e)}
                                            >
                                                <span className={styles.subMenuDot} />
                                                <span>{child.label}</span>
                                                {child.command && (
                                                    <SlIcon name="terminal" className={styles.externalIcon} />
                                                )}
                                                {child.link && (
                                                    <SlIcon name="box-arrow-up-right" className={styles.externalIcon} />
                                                )}
                                                {!child.component && !child.link && !child.command && (
                                                    <span className={styles.comingSoon}>开发中</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                </aside>

                {/* 右侧组件内容区 */}
                <main className={styles.mainContent}>
                    {CurrentComponent ? (
                        <CurrentComponent {...config} />
                    ) : (
                        <div className={styles.emptyState}>
                            <SlIcon name="tools" className={styles.emptyIcon} />
                            <p className={styles.emptyTitle}>功能开发中</p>
                            <p className={styles.emptyDesc}>
                                「{currentItem?.label || '该功能'}」正在紧张开发中，敬请期待...
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
