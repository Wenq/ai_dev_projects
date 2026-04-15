import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import styles from './TEST_sl_screen.module.scss';

// 导入 Shoelace React 包装器
import {
    SlScreen,
    SlIcon,
    SlSwitch,
    SlRadioGroup,
    SlRadio,
    SlInput,
    SlButton
} from '@kdcloudjs/shoelace/dist/react';

export default function TEST_sl_screen() {
    // ===== 状态管理 =====
    const [activeSection, setActiveSection] = useState('case1');

    // 案例5：属性配置面板的状态
    const [isStatic, setIsStatic] = useState(false);
    const [isRemovable, setIsRemovable] = useState(true);
    const [cellHeight, setCellHeight] = useState(80);
    const [margin, setMargin] = useState(14);
    const [columnCount, setColumnCount] = useState(12);
    const screenRef = useRef(null);

    // 案例7：拖拽添加卡片的状态
    const [dragScreenData, setDragScreenData] = useState([]);
    const dragScreenRef = useRef(null);

    // 书签导航数据
    const bookmarks = [
        { id: 'case1', label: '基础用法', icon: 'grid-3x3' },
        { id: 'case2', label: '静态大屏展示', icon: 'lock' },
        { id: 'case3', label: '可删除元素', icon: 'trash' },
        { id: 'case4', label: '自定义配置', icon: 'sliders' },
        { id: 'case5', label: '嵌套内容展示', icon: 'layers' },
        { id: 'case6', label: '属性配置面板', icon: 'gear' },
        { id: 'case7', label: '拖拽添加卡片', icon: 'plus-square' }
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

    // 案例1：基础数据
    const basicData = [
        {
            x: 0, y: 0, w: 4, h: 2,
            content: '<div class="grid-item-content"><h3>指标卡 1</h3><p>销售额：¥128,000</p></div>'
        },
        {
            x: 4, y: 0, w: 4, h: 2,
            content: '<div class="grid-item-content"><h3>指标卡 2</h3><p>订单量：1,234</p></div>'
        },
        {
            x: 8, y: 0, w: 4, h: 2,
            content: '<div class="grid-item-content"><h3>指标卡 3</h3><p>用户数：5,678</p></div>'
        },
        {
            x: 0, y: 2, w: 6, h: 3,
            content: '<div class="grid-item-content chart"><h3>趋势图表</h3><div class="chart-placeholder">图表区域</div></div>'
        },
        {
            x: 6, y: 2, w: 6, h: 3,
            content: '<div class="grid-item-content chart"><h3>数据分布</h3><div class="chart-placeholder">图表区域</div></div>'
        }
    ];

    // 案例2：静态展示数据
    const staticData = [
        {
            x: 0, y: 0, w: 3, h: 2,
            content: '<div class="grid-item-content info"><sl-icon name="people"></sl-icon><h4>在线用户</h4><span class="number">1,234</span></div>'
        },
        {
            x: 3, y: 0, w: 3, h: 2,
            content: '<div class="grid-item-content info success"><sl-icon name="check-circle"></sl-icon><h4>成功率</h4><span class="number">98.5%</span></div>'
        },
        {
            x: 6, y: 0, w: 3, h: 2,
            content: '<div class="grid-item-content info warning"><sl-icon name="clock"></sl-icon><h4>响应时间</h4><span class="number">120ms</span></div>'
        },
        {
            x: 9, y: 0, w: 3, h: 2,
            content: '<div class="grid-item-content info danger"><sl-icon name="exclamation-triangle"></sl-icon><h4>错误数</h4><span class="number">23</span></div>'
        },
        {
            x: 0, y: 2, w: 12, h: 3,
            content: '<div class="grid-item-content"><h3>监控大屏</h3><p>此为静态展示模式，元素不可拖拽和调整大小</p><div class="chart-placeholder">监控图表区域</div></div>'
        }
    ];

    // 案例3：可删除元素数据
    const removableData = [
        {
            x: 0, y: 0, w: 4, h: 2,
            content: '<div class="grid-item-content removable"><h4>可删除卡片 1</h4><p>点击右上角删除按钮</p></div>'
        },
        {
            x: 4, y: 0, w: 4, h: 2,
            content: '<div class="grid-item-content removable"><h4>可删除卡片 2</h4><p>点击右上角删除按钮</p></div>'
        },
        {
            x: 8, y: 0, w: 4, h: 2,
            content: '<div class="grid-item-content removable"><h4>可删除卡片 3</h4><p>点击右上角删除按钮</p></div>'
        },
        {
            x: 0, y: 2, w: 6, h: 2,
            content: '<div class="grid-item-content removable"><h4>可删除卡片 4</h4><p>拖拽可调整位置和大小</p></div>'
        },
        {
            x: 6, y: 2, w: 6, h: 2,
            content: '<div class="grid-item-content removable"><h4>可删除卡片 5</h4><p>拖拽可调整位置和大小</p></div>'
        }
    ];

    // 案例4：自定义配置数据
    const customData = [
        {
            x: 0, y: 0, w: 2, h: 1,
            content: '<div class="grid-item-content custom"><span>A</span></div>'
        },
        {
            x: 2, y: 0, w: 2, h: 1,
            content: '<div class="grid-item-content custom"><span>B</span></div>'
        },
        {
            x: 4, y: 0, w: 2, h: 1,
            content: '<div class="grid-item-content custom"><span>C</span></div>'
        },
        {
            x: 0, y: 1, w: 3, h: 2,
            content: '<div class="grid-item-content custom"><span>D</span></div>'
        },
        {
            x: 3, y: 1, w: 3, h: 2,
            content: '<div class="grid-item-content custom"><span>E</span></div>'
        }
    ];

    // 案例5：嵌套内容数据
    const nestedData = [
        {
            x: 0, y: 0, w: 4, h: 3,
            content: '<div class="grid-item-content nested"><sl-card><div slot="header">销售统计</div>'
                + '<sl-progress-bar value="75"></sl-progress-bar><p style="margin-top:10px">完成度: 75%</p></sl-card></div>'
        },
        {
            x: 4, y: 0, w: 4, h: 3,
            content: '<div class="grid-item-content nested"><sl-card><div slot="header">订单状态</div>'
                + '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">'
                + '<sl-badge variant="success">已完成: 128</sl-badge>'
                + '<sl-badge variant="warning">进行中: 45</sl-badge>'
                + '<sl-badge variant="danger">待处理: 12</sl-badge></div></sl-card></div>'
        },
        {
            x: 8, y: 0, w: 4, h: 3,
            content: '<div class="grid-item-content nested"><sl-card><div slot="header">快捷操作</div>'
                + '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">'
                + '<sl-button variant="primary" size="small">新建</sl-button>'
                + '<sl-button variant="default" size="small">导出</sl-button>'
                + '<sl-button variant="default" size="small">刷新</sl-button></div></sl-card></div>'
        },
        {
            x: 0, y: 3, w: 12, h: 2,
            content: '<div class="grid-item-content nested full"><h3>数据概览</h3>'
                + '<p>此区域可以放置更复杂的图表和数据展示组件</p></div>'
        }
    ];

    // 案例6：配置面板数据
    const getConfigData = () => [
        {
            x: 0, y: 0, w: 4, h: 2,
            content: '<div class="grid-item-content config"><h4>模块 A</h4><p>可拖拽调整</p></div>'
        },
        {
            x: 4, y: 0, w: 4, h: 2,
            content: '<div class="grid-item-content config"><h4>模块 B</h4><p>可拖拽调整</p></div>'
        },
        {
            x: 8, y: 0, w: 4, h: 2,
            content: '<div class="grid-item-content config"><h4>模块 C</h4><p>可拖拽调整</p></div>'
        },
        {
            x: 0, y: 2, w: 6, h: 2,
            content: '<div class="grid-item-content config"><h4>模块 D</h4><p>可拖拽调整</p></div>'
        },
        {
            x: 6, y: 2, w: 6, h: 2,
            content: '<div class="grid-item-content config"><h4>模块 E</h4><p>可拖拽调整</p></div>'
        }
    ];

    // 获取网格数据
    const handleGetGridData = () => {
        if (screenRef.current) {
            const data = screenRef.current.getGridData();
            alert(`当前网格数据:\n${JSON.stringify(data, null, 2)}`);
        }
    };

    // 案例7：可拖拽的组件列表
    const draggableComponents = [
        {
            id: 'indicator',
            name: '指标卡',
            icon: 'speedometer2',
            color: '#667eea',
            w: 4, h: 2,
            content: (id) => `<div class="grid-item-content drag-indicator" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                <sl-icon name="speedometer2" style="font-size: 24px; color: #fff;"></sl-icon>
                <h4 style="color: #fff; margin: 8px 0 4px;">指标卡 #${id}</h4>
                <span style="font-size: 24px; font-weight: bold; color: #fff;">¥128,000</span>
            </div>`
        },
        {
            id: 'chart',
            name: '图表组件',
            icon: 'bar-chart',
            color: '#f093fb',
            w: 6, h: 3,
            content: (id) => `<div class="grid-item-content drag-chart" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                <sl-icon name="bar-chart" style="font-size: 24px; color: #fff;"></sl-icon>
                <h4 style="color: #fff; margin: 8px 0;">图表 #${id}</h4>
                <div style="height: 60px; background: rgba(255,255,255,0.2); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #fff;">图表区域</div>
            </div>`
        },
        {
            id: 'table',
            name: '数据表格',
            icon: 'table',
            color: '#4facfe',
            w: 6, h: 3,
            content: (id) => `<div class="grid-item-content drag-table" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                <sl-icon name="table" style="font-size: 24px; color: #fff;"></sl-icon>
                <h4 style="color: #fff; margin: 8px 0;">表格 #${id}</h4>
                <div style="background: rgba(255,255,255,0.2); border-radius: 4px; padding: 8px; color: #fff; font-size: 12px;">
                    <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.3); padding: 4px 0;">
                        <span>列1</span><span>列2</span><span>列3</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 4px 0;">
                        <span>数据</span><span>数据</span><span>数据</span>
                    </div>
                </div>
            </div>`
        },
        {
            id: 'progress',
            name: '进度组件',
            icon: 'hourglass-split',
            color: '#43e97b',
            w: 4, h: 2,
            content: (id) => `<div class="grid-item-content drag-progress" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
                <sl-icon name="hourglass-split" style="font-size: 24px; color: #fff;"></sl-icon>
                <h4 style="color: #fff; margin: 8px 0 4px;">进度 #${id}</h4>
                <sl-progress-bar value="65" style="--height: 8px;"></sl-progress-bar>
                <span style="color: #fff; font-size: 12px; margin-top: 4px;">完成度: 65%</span>
            </div>`
        },
        {
            id: 'status',
            name: '状态卡片',
            icon: 'activity',
            color: '#fa709a',
            w: 3, h: 2,
            content: (id) => `<div class="grid-item-content drag-status" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
                <sl-icon name="activity" style="font-size: 24px; color: #fff;"></sl-icon>
                <h4 style="color: #fff; margin: 8px 0 4px;">状态 #${id}</h4>
                <sl-badge variant="success">运行中</sl-badge>
            </div>`
        },
        {
            id: 'text',
            name: '文本区块',
            icon: 'file-text',
            color: '#a8edea',
            w: 4, h: 2,
            content: (id) => `<div class="grid-item-content drag-text" style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);">
                <sl-icon name="file-text" style="font-size: 24px; color: #333;"></sl-icon>
                <h4 style="color: #333; margin: 8px 0 4px;">文本 #${id}</h4>
                <p style="color: #666; font-size: 12px; margin: 0;">这是一段描述文本内容...</p>
            </div>`
        }
    ];

    // 拖拽计数器，用于生成唯一 ID
    const dragCounterRef = useRef(0);

    // 处理拖拽开始
    const handleDragStart = (e, component) => {
        // 只传递组件 id，因为 JSON.stringify 无法序列化函数
        e.dataTransfer.setData('text/plain', component.id);
        e.dataTransfer.effectAllowed = 'copy';
    };

    // 处理拖拽放置
    const handleDrop = (e) => {
        e.preventDefault();
        const componentId = e.dataTransfer.getData('text/plain');
        const component = draggableComponents.find(c => c.id === componentId);
        if (component) {
            dragCounterRef.current += 1;
            const newItem = {
                x: 0,
                y: 0,
                w: component.w,
                h: component.h,
                content: component.content(dragCounterRef.current)
            };
            setDragScreenData(prev => [...prev, newItem]);
        }
    };

    // 处理拖拽悬停
    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    // 清空大屏
    const handleClearScreen = () => {
        setDragScreenData([]);
        dragCounterRef.current = 0;
    };

    return (
        <div className={styles.pageWrapper}>
            {/* 侧边书签导航 */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <SlIcon name="display" className={styles.sidebarIcon} />
                    <span>大屏案例导航</span>
                </div>
                <nav className={styles.bookmarkNav}>
                    {bookmarks.map((bookmark) => (
                        <button
                            key={bookmark.id}
                            className={`${styles.bookmarkItem} ${activeSection === bookmark.id ? styles.active : ''}`}
                            onClick={() => handleBookmarkClick(bookmark.id)}
                        >
                            <SlIcon name={bookmark.icon} />
                            <span>{bookmark.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* 主内容区 */}
            <main className={styles.mainContent}>
                <h1 className={styles.title}>Shoelace Screen 大屏组件示例</h1>

                {/* ===== 案例 1: 基础用法 ===== */}
                <section id="case1" className={styles.section}>
                    <h2>案例 1: 基础用法</h2>
                    <p className={styles.desc}>
                        最简单的大屏组件使用方式，展示基本的网格布局。元素可拖拽调整位置和大小。
                    </p>
                    <div className={styles.screenContainer}>
                        <SlScreen
                            className={styles.screen}
                            data={basicData}
                        />
                    </div>
                </section>

                {/* ===== 案例 2: 静态大屏展示 ===== */}
                <section id="case2" className={styles.section}>
                    <h2>案例 2: 静态大屏展示 (Static Mode)</h2>
                    <p className={styles.desc}>
                        使用 <code>static</code> 属性创建静态网格，元素不可拖拽和调整大小，适用于纯展示场景。
                    </p>
                    <div className={styles.screenContainer}>
                        <SlScreen
                            className={styles.screen}
                            data={staticData}
                            static
                        />
                    </div>
                </section>

                {/* ===== 案例 3: 可删除元素 ===== */}
                <section id="case3" className={styles.section}>
                    <h2>案例 3: 可删除元素 (Removable)</h2>
                    <p className={styles.desc}>
                        使用 <code>removable</code> 属性允许删除网格元素，每个元素右上角会显示删除按钮。
                    </p>
                    <div className={styles.screenContainer}>
                        <SlScreen
                            className={styles.screen}
                            data={removableData}
                            removable
                        />
                    </div>
                </section>

                {/* ===== 案例 4: 自定义配置 ===== */}
                <section id="case4" className={styles.section}>
                    <h2>案例 4: 自定义配置 (Custom Options)</h2>
                    <p className={styles.desc}>
                        通过 <code>options</code> 属性自定义网格配置，如单元格高度、边距、列数等。
                    </p>
                    <div className={styles.screenContainer}>
                        <SlScreen
                            className={styles.screen}
                            data={customData}
                            options={{
                                cellHeight: 100,
                                margin: 20,
                                column: 6
                            }}
                        />
                    </div>
                </section>

                {/* ===== 案例 5: 嵌套内容展示 ===== */}
                <section id="case5" className={styles.section}>
                    <h2>案例 5: 嵌套内容展示</h2>
                    <p className={styles.desc}>
                        在大屏网格中嵌套其他 Shoelace 组件（Card、Badge、Button、ProgressBar 等）。
                    </p>
                    <div className={styles.screenContainer}>
                        <SlScreen
                            className={styles.screen}
                            data={nestedData}
                            static
                        />
                    </div>
                </section>

                {/* ===== 案例 6: 属性配置面板 ===== */}
                <section id="case6" className={`${styles.section} ${styles.fullWidthSection}`}>
                    <h2>案例 6: 属性配置面板</h2>
                    <p className={styles.desc}>
                        通过下方控制面板调整大屏的各项属性，实时预览效果
                    </p>

                    {/* 控制面板 */}
                    <div className={styles.controlPanel}>
                        <h3>属性控制面板</h3>
                        <div className={styles.controls}>
                            <div className={styles.controlItem}>
                                <label>静态模式 (Static):</label>
                                <SlSwitch
                                    checked={isStatic}
                                    onSlChange={(e) => setIsStatic(e.target.checked)}
                                >
                                    {isStatic ? '开启' : '关闭'}
                                </SlSwitch>
                            </div>

                            <div className={styles.controlItem}>
                                <label>可删除 (Removable):</label>
                                <SlSwitch
                                    checked={isRemovable}
                                    disabled={isStatic}
                                    onSlChange={(e) => setIsRemovable(e.target.checked)}
                                >
                                    {isRemovable ? '开启' : '关闭'}
                                </SlSwitch>
                            </div>

                            <div className={styles.controlItem}>
                                <label>单元格高度 (Cell Height): {cellHeight}px</label>
                                <SlInput
                                    type="number"
                                    value={cellHeight}
                                    min="40"
                                    max="200"
                                    onSlInput={(e) => setCellHeight(Number(e.target.value))}
                                    style={{ width: '120px' }}
                                />
                            </div>

                            <div className={styles.controlItem}>
                                <label>边距 (Margin): {margin}px</label>
                                <SlInput
                                    type="number"
                                    value={margin}
                                    min="0"
                                    max="50"
                                    onSlInput={(e) => setMargin(Number(e.target.value))}
                                    style={{ width: '120px' }}
                                />
                            </div>

                            <div className={styles.controlItem}>
                                <label>列数 (Column): {columnCount}</label>
                                <SlRadioGroup
                                    value={String(columnCount)}
                                    onSlChange={(e) => setColumnCount(Number(e.target.value))}
                                >
                                    <SlRadio value="6">6 列</SlRadio>
                                    <SlRadio value="12">12 列</SlRadio>
                                    <SlRadio value="24">24 列</SlRadio>
                                </SlRadioGroup>
                            </div>

                            <div className={styles.controlItem}>
                                <label>操作:</label>
                                <SlButton variant="primary" size="small" onClick={handleGetGridData}>
                                    <SlIcon slot="prefix" name="download" />
                                    获取网格数据
                                </SlButton>
                            </div>
                        </div>
                    </div>

                    {/* 预览区域 */}
                    <div className={styles.screenContainer}>
                        <SlScreen
                            ref={screenRef}
                            className={styles.screen}
                            data={getConfigData()}
                            static={isStatic || undefined}
                            removable={(!isStatic && isRemovable) || undefined}
                            options={{
                                cellHeight: cellHeight,
                                margin: margin,
                                column: columnCount
                            }}
                        />
                    </div>

                    {/* 当前配置显示 */}
                    <div className={styles.configDisplay}>
                        <h4>当前配置:</h4>
                        <pre>{JSON.stringify({
                            static: isStatic,
                            removable: !isStatic && isRemovable,
                            options: {
                                cellHeight,
                                margin,
                                column: columnCount
                            }
                        }, null, 2)}</pre>
                    </div>
                </section>

                {/* ===== 案例 7: 拖拽添加卡片 ===== */}
                <section id="case7" className={`${styles.section} ${styles.fullWidthSection}`}>
                    <h2>案例 7: 拖拽添加卡片 (Drag to Add)</h2>
                    <p className={styles.desc}>
                        从左侧组件列表拖拽不同类型的组件到大屏中，自动生成对应样式的卡片。
                        支持多种组件类型，每种组件有不同的外观和尺寸。
                    </p>

                    <div className={styles.dragDropContainer}>
                        {/* 左侧组件列表 */}
                        <div className={styles.componentList}>
                            <h3>
                                <SlIcon name="box-seam" />
                                组件库
                            </h3>
                            <p className={styles.dragHint}>拖拽组件到右侧大屏区域</p>
                            <div className={styles.componentItems}>
                                {draggableComponents.map((comp) => (
                                    <div
                                        key={comp.id}
                                        className={styles.draggableItem}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, comp)}
                                        style={{ '--item-color': comp.color }}
                                    >
                                        <div className={styles.itemIcon} style={{ background: comp.color }}>
                                            <SlIcon name={comp.icon} />
                                        </div>
                                        <div className={styles.itemInfo}>
                                            <span className={styles.itemName}>{comp.name}</span>
                                            <span className={styles.itemSize}>{comp.w}x{comp.h}</span>
                                        </div>
                                        <SlIcon name="grip-vertical" className={styles.dragHandle} />
                                    </div>
                                ))}
                            </div>
                            <div className={styles.listActions}>
                                <SlButton variant="danger" size="small" onClick={handleClearScreen}>
                                    <SlIcon slot="prefix" name="trash" />
                                    清空大屏
                                </SlButton>
                            </div>
                        </div>

                        {/* 右侧大屏区域 */}
                        <div
                            className={styles.dropZone}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        >
                            {dragScreenData.length === 0 ? (
                                <div className={styles.dropPlaceholder}>
                                    <SlIcon name="cloud-arrow-down" />
                                    <p>拖拽左侧组件到此处</p>
                                </div>
                            ) : (
                                <SlScreen
                                    ref={dragScreenRef}
                                    className={styles.screen}
                                    data={dragScreenData}
                                    removable
                                />
                            )}
                        </div>
                    </div>

                    {/* 使用说明 */}
                    <div className={styles.usageNote}>
                        <h4><SlIcon name="info-circle" /> 使用说明</h4>
                        <ul>
                            <li>从左侧组件库中选择需要的组件类型</li>
                            <li>按住鼠标左键拖拽组件到右侧大屏区域</li>
                            <li>松开鼠标后组件将自动添加到大屏中</li>
                            <li>添加后的组件可以拖拽调整位置和大小</li>
                            <li>点击组件右上角的删除按钮可移除组件</li>
                        </ul>
                    </div>
                </section>
            </main>
        </div>
    );
}
