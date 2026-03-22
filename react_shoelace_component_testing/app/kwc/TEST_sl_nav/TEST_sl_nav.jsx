import { useState, useEffect } from 'react';
import styles from './TEST_sl_nav.module.scss';

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

export default function TEST_sl_nav(config) {
    // ===== 功能组合案例的状态管理 =====
    const [navMode, setNavMode] = useState('inline');
    const [navTheme, setNavTheme] = useState('light');
    const [isMultiple, setIsMultiple] = useState(false);
    const [isSelectable, setIsSelectable] = useState(true);
    const [isInlineCollapsed, setIsInlineCollapsed] = useState(false);
    const [inlineIndent, setInlineIndent] = useState(24);
    const [subMenuOpenDelay, setSubMenuOpenDelay] = useState(0);
    const [subMenuCloseDelay, setSubMenuCloseDelay] = useState(0.1);
    const [triggerSubMenuAction, setTriggerSubMenuAction] = useState('hover');
    const [activeSection, setActiveSection] = useState('case1');

    // 书签导航数据
    const bookmarks = [
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
        { id: 'case12', label: '功能组合案例', icon: 'sliders' },
    ];

    // 处理书签点击
    const handleBookmarkClick = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveSection(id);
        }
    };

    // 监听滚动更新当前激活的书签
    useEffect(() => {
        const handleScroll = () => {
            const sections = bookmarks.map(b => document.getElementById(b.id));
            const scrollPosition = window.scrollY + 150;

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section && section.offsetTop <= scrollPosition) {
                    setActiveSection(bookmarks[i].id);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 处理导航选择事件
    const handleNavSelect = (e) => {
        console.log('选中项:', e.detail);
    };

    // 处理导航变化事件
    const handleNavChange = (e) => {
        console.log('导航变化:', e.detail);
    };

    // 处理子菜单展开变化
    const handleOpenChange = (e) => {
        console.log('展开变化:', e.detail);
    };

    // 处理菜单项点击，显示 alert
    const handleItemClick = (itemName, itemKey) => {
        alert(`被点击菜单：${itemName}\n菜单 ID：${itemKey}`);
    };

    return (
        <div className={styles.pageWrapper}>
            {/* 侧边书签导航 */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <sl-icon name="bookmark-star" class={styles.sidebarIcon}></sl-icon>
                    <span>案例导航</span>
                </div>
                <nav className={styles.bookmarkNav}>
                    {bookmarks.map((bookmark) => (
                        <button
                            key={bookmark.id}
                            className={`${styles.bookmarkItem} ${activeSection === bookmark.id ? styles.active : ''}`}
                            onClick={() => handleBookmarkClick(bookmark.id)}
                        >
                            <sl-icon name={bookmark.icon}></sl-icon>
                            <span>{bookmark.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* 主内容区 */}
            <main className={styles.mainContent}>
                <h1 className={styles.title}>Shoelace Nav 导航组件示例</h1>

            {/* ===== 案例 1: 基础内联导航 ===== */}
            <section id="case1" className={styles.section}>
                <h2>案例 1: 基础内联导航 (Inline Mode)</h2>
                <p className={styles.desc}>最基本的垂直导航，适用于侧边栏菜单</p>
                <div className={styles.demoBox}>
                    <sl-nav mode="inline" style={{ width: '200px' }}>
                        <sl-nav-item item-key="home" onClick={() => handleItemClick('首页', 'home')}>
                            <sl-icon slot="prefix" name="house"></sl-icon>
                            首页
                        </sl-nav-item>
                        <sl-nav-item item-key="products" onClick={() => handleItemClick('产品', 'products')}>
                            <sl-icon slot="prefix" name="box"></sl-icon>
                            产品
                        </sl-nav-item>
                        <sl-nav-item item-key="services" onClick={() => handleItemClick('服务', 'services')}>
                            <sl-icon slot="prefix" name="gear"></sl-icon>
                            服务
                        </sl-nav-item>
                        <sl-nav-item item-key="about" onClick={() => handleItemClick('关于我们', 'about')}>
                            <sl-icon slot="prefix" name="info-circle"></sl-icon>
                            关于我们
                        </sl-nav-item>
                    </sl-nav>
                </div>
            </section>

            {/* ===== 案例 2: 水平导航 ===== */}
            <section id="case2" className={styles.section}>
                <h2>案例 2: 水平导航 (Horizontal Mode)</h2>
                <p className={styles.desc}>适用于顶部导航栏</p>
                <div className={styles.demoBox}>
                    <sl-nav mode="horizontal">
                        <sl-nav-item item-key="home" onClick={() => handleItemClick('首页', 'home')}>首页</sl-nav-item>
                        <sl-nav-item item-key="products" onClick={() => handleItemClick('产品', 'products')}>产品</sl-nav-item>
                        <sl-nav-item item-key="services" onClick={() => handleItemClick('服务', 'services')}>服务</sl-nav-item>
                        <sl-nav-item item-key="about" onClick={() => handleItemClick('关于我们', 'about')}>关于我们</sl-nav-item>
                        <sl-nav-item item-key="contact" onClick={() => handleItemClick('联系我们', 'contact')}>联系我们</sl-nav-item>
                    </sl-nav>
                </div>
            </section>

            {/* ===== 案例 3: 垂直导航 ===== */}
            <section id="case3" className={styles.section}>
                <h2>案例 3: 垂直导航 (Vertical Mode)</h2>
                <p className={styles.desc}>垂直排列的导航菜单</p>
                <div className={styles.demoBox}>
                    <sl-nav mode="vertical" style={{ width: '200px' }}>
                        <sl-nav-item item-key="home" onClick={() => handleItemClick('首页', 'home')}>
                            <sl-icon slot="prefix" name="house"></sl-icon>
                            首页
                        </sl-nav-item>
                        <sl-nav-item item-key="products" onClick={() => handleItemClick('产品', 'products')}>
                            <sl-icon slot="prefix" name="box"></sl-icon>
                            产品
                        </sl-nav-item>
                        <sl-nav-item item-key="services" onClick={() => handleItemClick('服务', 'services')}>
                            <sl-icon slot="prefix" name="gear"></sl-icon>
                            服务
                        </sl-nav-item>
                        <sl-nav-item item-key="about" onClick={() => handleItemClick('关于我们', 'about')}>
                            <sl-icon slot="prefix" name="info-circle"></sl-icon>
                            关于我们
                        </sl-nav-item>
                    </sl-nav>
                </div>
            </section>

            {/* ===== 案例 4: 带分组的导航 ===== */}
            <section id="case4" className={styles.section}>
                <h2>案例 4: 带分组的导航 (Nav Group)</h2>
                <p className={styles.desc}>将导航项分组显示，带有分组标题</p>
                <div className={styles.demoBox}>
                    <sl-nav mode="inline" style={{ width: '200px' }}>
                        <sl-nav-group label="基础功能">
                            <sl-nav-item item-key="dashboard" onClick={() => handleItemClick('仪表盘', 'dashboard')}>
                                <sl-icon slot="prefix" name="speedometer"></sl-icon>
                                仪表盘
                            </sl-nav-item>
                            <sl-nav-item item-key="analytics" onClick={() => handleItemClick('数据分析', 'analytics')}>
                                <sl-icon slot="prefix" name="graph-up"></sl-icon>
                                数据分析
                            </sl-nav-item>
                        </sl-nav-group>
                        <sl-nav-group label="系统管理">
                            <sl-nav-item item-key="users" onClick={() => handleItemClick('用户管理', 'users')}>
                                <sl-icon slot="prefix" name="people"></sl-icon>
                                用户管理
                            </sl-nav-item>
                            <sl-nav-item item-key="settings" onClick={() => handleItemClick('系统设置', 'settings')}>
                                <sl-icon slot="prefix" name="sliders"></sl-icon>
                                系统设置
                            </sl-nav-item>
                        </sl-nav-group>
                    </sl-nav>
                </div>
            </section>

            {/* ===== 案例 5: 带子菜单的导航 ===== */}
            <section id="case5" className={styles.section}>
                <h2>案例 5: 带子菜单的导航 (Nav Submenu)</h2>
                <p className={styles.desc}>支持多级嵌套的导航菜单</p>
                <div className={styles.demoBox}>
                    <sl-nav mode="inline" style={{ width: '220px' }}>
                        <sl-nav-item item-key="home" onClick={() => handleItemClick('首页', 'home')}>
                            <sl-icon slot="prefix" name="house"></sl-icon>
                            首页
                        </sl-nav-item>
                        <sl-nav-submenu title="产品中心">
                            <sl-icon slot="prefix" name="box"></sl-icon>
                            <sl-nav-item item-key="product1" onClick={() => handleItemClick('产品 A', 'product1')}>产品 A</sl-nav-item>
                            <sl-nav-item item-key="product2" onClick={() => handleItemClick('产品 B', 'product2')}>产品 B</sl-nav-item>
                            <sl-nav-submenu title="子分类">
                                <sl-nav-item item-key="sub1" onClick={() => handleItemClick('子项 1', 'sub1')}>子项 1</sl-nav-item>
                                <sl-nav-item item-key="sub2" onClick={() => handleItemClick('子项 2', 'sub2')}>子项 2</sl-nav-item>
                            </sl-nav-submenu>
                        </sl-nav-submenu>
                        <sl-nav-submenu title="服务支持">
                            <sl-icon slot="prefix" name="gear"></sl-icon>
                            <sl-nav-item item-key="consulting" onClick={() => handleItemClick('咨询服务', 'consulting')}>咨询服务</sl-nav-item>
                            <sl-nav-item item-key="training" onClick={() => handleItemClick('培训服务', 'training')}>培训服务</sl-nav-item>
                            <sl-nav-item item-key="support" onClick={() => handleItemClick('技术支持', 'support')}>技术支持</sl-nav-item>
                        </sl-nav-submenu>
                        <sl-nav-item item-key="contact" onClick={() => handleItemClick('联系我们', 'contact')}>
                            <sl-icon slot="prefix" name="envelope"></sl-icon>
                            联系我们
                        </sl-nav-item>
                    </sl-nav>
                </div>
            </section>

            {/* ===== 案例 6: 多选导航 ===== */}
            <section id="case6" className={styles.section}>
                <h2>案例 6: 多选导航 (Multiple Selection)</h2>
                <p className={styles.desc}>支持同时选择多个导航项</p>
                <div className={styles.demoBox}>
                    <sl-nav mode="inline" multiple style={{ width: '200px' }}>
                        <sl-nav-item item-key="item1" onClick={() => handleItemClick('选项 1', 'item1')}>选项 1</sl-nav-item>
                        <sl-nav-item item-key="item2" onClick={() => handleItemClick('选项 2', 'item2')}>选项 2</sl-nav-item>
                        <sl-nav-item item-key="item3" onClick={() => handleItemClick('选项 3', 'item3')}>选项 3</sl-nav-item>
                        <sl-nav-item item-key="item4" onClick={() => handleItemClick('选项 4', 'item4')}>选项 4</sl-nav-item>
                    </sl-nav>
                </div>
            </section>

            {/* ===== 案例 7: 内联折叠导航 ===== */}
            <section id="case7" className={styles.section}>
                <h2>案例 7: 内联折叠导航 (Inline Collapsed)</h2>
                <p className={styles.desc}>折叠状态下的导航，只显示图标</p>
                <div className={styles.demoBox}>
                    <sl-nav mode="inline" inline-collapsed style={{ width: '60px' }}>
                        <sl-nav-item item-key="home" title="首页" onClick={() => handleItemClick('首页', 'home')}>
                            <sl-icon slot="prefix" name="house"></sl-icon>
                        </sl-nav-item>
                        <sl-nav-item item-key="products" title="产品" onClick={() => handleItemClick('产品', 'products')}>
                            <sl-icon slot="prefix" name="box"></sl-icon>
                        </sl-nav-item>
                        <sl-nav-item item-key="services" title="服务" onClick={() => handleItemClick('服务', 'services')}>
                            <sl-icon slot="prefix" name="gear"></sl-icon>
                        </sl-nav-item>
                        <sl-nav-item item-key="about" title="关于" onClick={() => handleItemClick('关于', 'about')}>
                            <sl-icon slot="prefix" name="info-circle"></sl-icon>
                        </sl-nav-item>
                    </sl-nav>
                </div>
            </section>

            {/* ===== 案例 8: 禁用选择导航 ===== */}
            <section id="case8" className={styles.section}>
                <h2>案例 8: 禁用选择 (Non-selectable)</h2>
                <p className={styles.desc}>导航项不可被选中，仅用于展示</p>
                <div className={styles.demoBox}>
                    <sl-nav mode="inline" selectable={false} style={{ width: '200px' }}>
                        <sl-nav-item item-key="home" onClick={() => handleItemClick('首页', 'home')}>首页</sl-nav-item>
                        <sl-nav-item item-key="products" onClick={() => handleItemClick('产品', 'products')}>产品</sl-nav-item>
                        <sl-nav-item item-key="services" onClick={() => handleItemClick('服务', 'services')}>服务</sl-nav-item>
                        <sl-nav-item item-key="about" onClick={() => handleItemClick('关于我们', 'about')}>关于我们</sl-nav-item>
                    </sl-nav>
                </div>
            </section>

            {/* ===== 案例 9: 禁用项导航 ===== */}
            <section id="case9" className={styles.section}>
                <h2>案例 9: 禁用特定项 (Disabled Items)</h2>
                <p className={styles.desc}>某些导航项被禁用，无法点击</p>
                <div className={styles.demoBox}>
                    <sl-nav mode="inline" style={{ width: '200px' }}>
                        <sl-nav-item item-key="home" onClick={() => handleItemClick('首页', 'home')}>首页</sl-nav-item>
                        <sl-nav-item item-key="products" disabled>产品（禁用）</sl-nav-item>
                        <sl-nav-item item-key="services" onClick={() => handleItemClick('服务', 'services')}>服务</sl-nav-item>
                        <sl-nav-item item-key="about" disabled>关于（禁用）</sl-nav-item>
                    </sl-nav>
                </div>
            </section>

            {/* ===== 案例 10: 深色主题导航 ===== */}
            <section id="case10" className={styles.section}>
                <h2>案例 10: 深色主题 (Dark Theme)</h2>
                <p className={styles.desc}>深色主题样式的导航</p>
                <div className={`${styles.demoBox} ${styles.darkBox}`}>
                    <sl-nav mode="inline" theme="dark" style={{ width: '200px' }}>
                        <sl-nav-item item-key="home" onClick={() => handleItemClick('首页', 'home')}>
                            <sl-icon slot="prefix" name="house"></sl-icon>
                            首页
                        </sl-nav-item>
                        <sl-nav-item item-key="products" onClick={() => handleItemClick('产品', 'products')}>
                            <sl-icon slot="prefix" name="box"></sl-icon>
                            产品
                        </sl-nav-item>
                        <sl-nav-submenu title="服务">
                            <sl-icon slot="prefix" name="gear"></sl-icon>
                            <sl-nav-item item-key="consulting" onClick={() => handleItemClick('咨询', 'consulting')}>咨询</sl-nav-item>
                            <sl-nav-item item-key="support" onClick={() => handleItemClick('支持', 'support')}>支持</sl-nav-item>
                        </sl-nav-submenu>
                        <sl-nav-item item-key="about" onClick={() => handleItemClick('关于', 'about')}>
                            <sl-icon slot="prefix" name="info-circle"></sl-icon>
                            关于
                        </sl-nav-item>
                    </sl-nav>
                </div>
            </section>

            {/* ===== 案例 11: 事件处理导航 ===== */}
            <section id="case11" className={styles.section}>
                <h2>案例 11: 事件处理 (Event Handling)</h2>
                <p className={styles.desc}>监听导航的各种事件（查看控制台输出）</p>
                <div className={styles.demoBox}>
                    <sl-nav
                        mode="inline"
                        style={{ width: '200px' }}
                        onSlNavSelect={handleNavSelect}
                        onSlChange={handleNavChange}
                        onSlNavOpenChange={handleOpenChange}
                    >
                        <sl-nav-item item-key="home" onClick={() => handleItemClick('首页', 'home')}>首页</sl-nav-item>
                        <sl-nav-submenu title="产品">
                            <sl-nav-item item-key="product1" onClick={() => handleItemClick('产品 A', 'product1')}>产品 A</sl-nav-item>
                            <sl-nav-item item-key="product2" onClick={() => handleItemClick('产品 B', 'product2')}>产品 B</sl-nav-item>
                        </sl-nav-submenu>
                        <sl-nav-item item-key="services" onClick={() => handleItemClick('服务', 'services')}>服务</sl-nav-item>
                        <sl-nav-item item-key="about" onClick={() => handleItemClick('关于', 'about')}>关于</sl-nav-item>
                    </sl-nav>
                </div>
            </section>

            {/* ===== 案例 12: 功能组合案例（属性开关） ===== */}
            <section id="case12" className={`${styles.section} ${styles.fullWidthSection}`}>
                <h2>案例 12: 功能组合案例（属性开关）</h2>
                <p className={styles.desc}>通过下方控制面板调整导航的各项属性，实时预览效果</p>

                {/* 控制面板 */}
                <div className={styles.controlPanel}>
                    <h3>属性控制面板</h3>
                    <div className={styles.controls}>
                        <div className={styles.controlItem}>
                            <label>模式 (Mode):</label>
                            <sl-radio-group value={navMode} onSlChange={(e) => setNavMode(e.target.value)}>
                                <sl-radio value="inline">Inline</sl-radio>
                                <sl-radio value="horizontal">Horizontal</sl-radio>
                                <sl-radio value="vertical">Vertical</sl-radio>
                            </sl-radio-group>
                        </div>

                        <div className={styles.controlItem}>
                            <label>主题 (Theme):</label>
                            <sl-radio-group value={navTheme} onSlChange={(e) => setNavTheme(e.target.value)}>
                                <sl-radio value="light">Light</sl-radio>
                                <sl-radio value="dark">Dark</sl-radio>
                            </sl-radio-group>
                        </div>

                        <div className={styles.controlItem}>
                            <label>多选 (Multiple):</label>
                            <sl-switch checked={isMultiple} onSlChange={(e) => setIsMultiple(e.target.checked)}>
                                {isMultiple ? '开启' : '关闭'}
                            </sl-switch>
                        </div>

                        <div className={styles.controlItem}>
                            <label>可选择 (Selectable):</label>
                            <sl-switch checked={isSelectable} onSlChange={(e) => setIsSelectable(e.target.checked)}>
                                {isSelectable ? '开启' : '关闭'}
                            </sl-switch>
                        </div>

                        {navMode === 'inline' && (
                            <div className={styles.controlItem}>
                                <label>内联折叠 (Inline Collapsed):</label>
                                <sl-switch checked={isInlineCollapsed} onSlChange={(e) => setIsInlineCollapsed(e.target.checked)}>
                                    {isInlineCollapsed ? '开启' : '关闭'}
                                </sl-switch>
                            </div>
                        )}

                        {navMode === 'inline' && !isInlineCollapsed && (
                            <div className={styles.controlItem}>
                                <label>缩进 (Inline Indent): {inlineIndent}px</label>
                                <sl-input
                                    type="number"
                                    value={inlineIndent}
                                    onSlInput={(e) => setInlineIndent(Number(e.target.value))}
                                    style={{ width: '100px' }}
                                />
                            </div>
                        )}

                        <div className={styles.controlItem}>
                            <label>子菜单展开延迟: {subMenuOpenDelay}s</label>
                            <sl-input
                                type="number"
                                step="0.1"
                                value={subMenuOpenDelay}
                                onSlInput={(e) => setSubMenuOpenDelay(Number(e.target.value))}
                                style={{ width: '100px' }}
                            />
                        </div>

                        <div className={styles.controlItem}>
                            <label>子菜单关闭延迟: {subMenuCloseDelay}s</label>
                            <sl-input
                                type="number"
                                step="0.1"
                                value={subMenuCloseDelay}
                                onSlInput={(e) => setSubMenuCloseDelay(Number(e.target.value))}
                                style={{ width: '100px' }}
                            />
                        </div>

                        <div className={styles.controlItem}>
                            <label>触发方式:</label>
                            <sl-radio-group value={triggerSubMenuAction} onSlChange={(e) => setTriggerSubMenuAction(e.target.value)}>
                                <sl-radio value="hover">悬停 (Hover)</sl-radio>
                                <sl-radio value="click">点击 (Click)</sl-radio>
                            </sl-radio-group>
                        </div>
                    </div>
                </div>

                {/* 预览区域 */}
                <div className={`${styles.demoBox} ${navTheme === 'dark' ? styles.darkBox : ''}`}>
                    <sl-nav
                        mode={navMode}
                        theme={navTheme}
                        multiple={isMultiple}
                        selectable={isSelectable}
                        inline-collapsed={isInlineCollapsed}
                        inline-indent={inlineIndent}
                        sub-menu-open-delay={subMenuOpenDelay}
                        sub-menu-close-delay={subMenuCloseDelay}
                        trigger-sub-menu-action={triggerSubMenuAction}
                        style={{ width: navMode === 'horizontal' ? '100%' : isInlineCollapsed ? '60px' : '220px' }}
                        onSlNavSelect={handleNavSelect}
                        onSlChange={handleNavChange}
                        onSlNavOpenChange={handleOpenChange}
                    >
                        <sl-nav-item item-key="home" title="首页" onClick={() => handleItemClick('首页', 'home')}>
                            <sl-icon slot="prefix" name="house"></sl-icon>
                            {!isInlineCollapsed && '首页'}
                        </sl-nav-item>
                        <sl-nav-submenu title={isInlineCollapsed ? '' : '产品中心'}>
                            <sl-icon slot="prefix" name="box"></sl-icon>
                            {!isInlineCollapsed && '产品中心'}
                            <sl-nav-item item-key="product1" onClick={() => handleItemClick('产品 A', 'product1')}>产品 A</sl-nav-item>
                            <sl-nav-item item-key="product2" onClick={() => handleItemClick('产品 B', 'product2')}>产品 B</sl-nav-item>
                            <sl-nav-submenu title="子分类">
                                <sl-nav-item item-key="sub1" onClick={() => handleItemClick('子项 1', 'sub1')}>子项 1</sl-nav-item>
                                <sl-nav-item item-key="sub2" onClick={() => handleItemClick('子项 2', 'sub2')}>子项 2</sl-nav-item>
                            </sl-nav-submenu>
                        </sl-nav-submenu>
                        <sl-nav-submenu title={isInlineCollapsed ? '' : '服务支持'}>
                            <sl-icon slot="prefix" name="gear"></sl-icon>
                            {!isInlineCollapsed && '服务支持'}
                            <sl-nav-item item-key="consulting" onClick={() => handleItemClick('咨询服务', 'consulting')}>咨询服务</sl-nav-item>
                            <sl-nav-item item-key="training" onClick={() => handleItemClick('培训服务', 'training')}>培训服务</sl-nav-item>
                            <sl-nav-item item-key="support" disabled>技术支持（禁用）</sl-nav-item>
                        </sl-nav-submenu>
                        <sl-nav-item item-key="about" title="关于我们" onClick={() => handleItemClick('关于我们', 'about')}>
                            <sl-icon slot="prefix" name="info-circle"></sl-icon>
                            {!isInlineCollapsed && '关于我们'}
                        </sl-nav-item>
                        <sl-nav-item item-key="contact" title="联系我们" onClick={() => handleItemClick('联系我们', 'contact')}>
                            <sl-icon slot="prefix" name="envelope"></sl-icon>
                            {!isInlineCollapsed && '联系我们'}
                        </sl-nav-item>
                    </sl-nav>
                </div>

                {/* 当前配置显示 */}
                <div className={styles.configDisplay}>
                    <h4>当前配置:</h4>
                    <pre>{JSON.stringify({
                        mode: navMode,
                        theme: navTheme,
                        multiple: isMultiple,
                        selectable: isSelectable,
                        inlineCollapsed: isInlineCollapsed,
                        inlineIndent,
                        subMenuOpenDelay,
                        subMenuCloseDelay,
                        triggerSubMenuAction
                    }, null, 2)}</pre>
                </div>
            </section>
        </main>
        </div>
    );
}
