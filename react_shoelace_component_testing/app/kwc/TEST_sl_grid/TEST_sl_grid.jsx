import { useState, useEffect } from 'react';
import styles from './TEST_sl_grid.module.scss';

// 导入 Shoelace React 包装器
import {
    SlRow,
    SlCol,
    SlIcon,
    SlSwitch,
    SlRadioGroup,
    SlRadio,
    SlInput
} from '@kdcloudjs/shoelace/dist/react';

export default function TEST_sl_grid() {
    // ===== 功能组合案例的状态管理 =====
    const [gutter, setGutter] = useState(16);
    const [verticalGutter, setVerticalGutter] = useState(16);
    const [justify, setJustify] = useState('start');
    const [align, setAlign] = useState('top');
    const [wrap, setWrap] = useState(true);
    const [activeSection, setActiveSection] = useState('case1');

    // 书签导航数据
    const bookmarks = [
        { id: 'case1', label: '基础栅格布局', icon: 'grid' },
        { id: 'case2', label: '栅格间距', icon: 'distribute-horizontal' },
        { id: 'case3', label: '响应式布局', icon: 'phone' },
        { id: 'case4', label: '列偏移', icon: 'arrow-right' },
        { id: 'case5', label: '对齐方式', icon: 'align-center' },
        { id: 'case6', label: 'Flex 布局', icon: 'layout-wtf' },
        { id: 'case7', label: '功能组合案例', icon: 'sliders' }
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

    // 渲染栅格列（带背景色）
    const renderCol = (span, content, colorIndex = 0) => {
        const colors = [
            styles.colBg1,
            styles.colBg2
        ];
        return (
            <SlCol span={span}>
                <div className={`${styles.colContent} ${colors[colorIndex % 2]}`}>
                    {content || `col-${span}`}
                </div>
            </SlCol>
        );
    };

    return (
        <div className={styles.pageWrapper}>
            {/* 侧边书签导航 */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <SlIcon name="grid-3x3" className={styles.sidebarIcon} />
                    <span>Grid 布局</span>
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
                <h1 className={styles.title}>Shoelace Grid 栅格布局组件示例</h1>

                {/* ===== 案例 1: 基础栅格布局 ===== */}
                <section id="case1" className={styles.section}>
                    <h2>案例 1: 基础栅格布局 (24 列系统)</h2>
                    <p className={styles.desc}>
                        栅格系统基于 24 列布局。通过 SlRow 和 SlCol 组件实现。
                        使用 span 属性指定列宽（1-24）。
                    </p>
                    <div className={styles.demoBox}>
                        <div className={styles.demoLabel}>等分布局：</div>
                        <SlRow gutter={16}>
                            {renderCol(24, 'col-24 (100%)', 0)}
                        </SlRow>
                        <SlRow gutter={16}>
                            {renderCol(12, 'col-12 (50%)', 0)}
                            {renderCol(12, 'col-12 (50%)', 1)}
                        </SlRow>
                        <SlRow gutter={16}>
                            {renderCol(8, 'col-8 (33.3%)', 0)}
                            {renderCol(8, 'col-8 (33.3%)', 1)}
                            {renderCol(8, 'col-8 (33.3%)', 0)}
                        </SlRow>
                        <SlRow gutter={16}>
                            {renderCol(6, 'col-6 (25%)', 0)}
                            {renderCol(6, 'col-6 (25%)', 1)}
                            {renderCol(6, 'col-6 (25%)', 0)}
                            {renderCol(6, 'col-6 (25%)', 1)}
                        </SlRow>

                        <div className={styles.demoLabel} style={{ marginTop: '24px' }}>不等分布局：</div>
                        <SlRow gutter={16}>
                            {renderCol(4, 'col-4', 0)}
                            {renderCol(20, 'col-20', 1)}
                        </SlRow>
                        <SlRow gutter={16}>
                            {renderCol(6, 'col-6', 0)}
                            {renderCol(18, 'col-18', 1)}
                        </SlRow>
                        <SlRow gutter={16}>
                            {renderCol(8, 'col-8', 0)}
                            {renderCol(8, 'col-8', 1)}
                            {renderCol(4, 'col-4', 0)}
                            {renderCol(4, 'col-4', 1)}
                        </SlRow>
                    </div>
                </section>

                {/* ===== 案例 2: 栅格间距 ===== */}
                <section id="case2" className={styles.section}>
                    <h2>案例 2: 栅格间距 (Gutter)</h2>
                    <p className={styles.desc}>
                        通过 gutter 属性设置列之间的间距。可以是单一数值（水平间距），
                        也可以是数组 [水平间距, 垂直间距]。
                    </p>
                    <div className={styles.demoBox}>
                        <div className={styles.demoLabel}>gutter = 8:</div>
                        <SlRow gutter={8}>
                            {renderCol(6, 'col-6', 0)}
                            {renderCol(6, 'col-6', 1)}
                            {renderCol(6, 'col-6', 0)}
                            {renderCol(6, 'col-6', 1)}
                        </SlRow>

                        <div className={styles.demoLabel}>gutter = 16:</div>
                        <SlRow gutter={16}>
                            {renderCol(6, 'col-6', 0)}
                            {renderCol(6, 'col-6', 1)}
                            {renderCol(6, 'col-6', 0)}
                            {renderCol(6, 'col-6', 1)}
                        </SlRow>

                        <div className={styles.demoLabel}>gutter = 32:</div>
                        <SlRow gutter={32}>
                            {renderCol(6, 'col-6', 0)}
                            {renderCol(6, 'col-6', 1)}
                            {renderCol(6, 'col-6', 0)}
                            {renderCol(6, 'col-6', 1)}
                        </SlRow>

                        <div className={styles.demoLabel}>gutter = [16, 24] (水平16px, 垂直24px):</div>
                        <SlRow gutter={[16, 24]}>
                            {renderCol(6, 'col-6', 0)}
                            {renderCol(6, 'col-6', 1)}
                            {renderCol(6, 'col-6', 0)}
                            {renderCol(6, 'col-6', 1)}
                            {renderCol(6, 'col-6', 0)}
                            {renderCol(6, 'col-6', 1)}
                            {renderCol(6, 'col-6', 0)}
                            {renderCol(6, 'col-6', 1)}
                        </SlRow>
                    </div>
                </section>

                {/* ===== 案例 3: 响应式布局 ===== */}
                <section id="case3" className={styles.section}>
                    <h2>案例 3: 响应式布局 (Responsive)</h2>
                    <p className={styles.desc}>
                        通过 xs、sm、md、lg、xl、xxl 属性实现响应式布局。
                        断点：xs(&lt;576px)、sm(≥576px)、md(≥768px)、lg(≥992px)、xl(≥1200px)、xxl(≥1600px)
                    </p>
                    <div className={styles.demoBox}>
                        <div className={styles.demoLabel}>响应式栅格（调整浏览器宽度查看效果）：</div>
                        <SlRow gutter={16}>
                            <SlCol xs={24} sm={12} md={8} lg={6} xl={4}>
                                <div className={`${styles.colContent} ${styles.colBg1}`}>
                                    xs:24 sm:12 md:8 lg:6 xl:4
                                </div>
                            </SlCol>
                            <SlCol xs={24} sm={12} md={8} lg={6} xl={4}>
                                <div className={`${styles.colContent} ${styles.colBg2}`}>
                                    xs:24 sm:12 md:8 lg:6 xl:4
                                </div>
                            </SlCol>
                            <SlCol xs={24} sm={12} md={8} lg={6} xl={4}>
                                <div className={`${styles.colContent} ${styles.colBg1}`}>
                                    xs:24 sm:12 md:8 lg:6 xl:4
                                </div>
                            </SlCol>
                            <SlCol xs={24} sm={12} md={8} lg={6} xl={4}>
                                <div className={`${styles.colContent} ${styles.colBg2}`}>
                                    xs:24 sm:12 md:8 lg:6 xl:4
                                </div>
                            </SlCol>
                        </SlRow>

                        <div className={styles.demoLabel} style={{ marginTop: '24px' }}>
                            响应式配置对象（可同时设置 span 和 offset）：
                        </div>
                        <SlRow gutter={16}>
                            <SlCol
                                xs={{ span: 24 }}
                                sm={{ span: 12 }}
                                md={{ span: 8, offset: 2 }}
                                lg={{ span: 6, offset: 0 }}
                            >
                                <div className={`${styles.colContent} ${styles.colBg1}`}>
                                    响应式 + 偏移
                                </div>
                            </SlCol>
                            <SlCol
                                xs={{ span: 24 }}
                                sm={{ span: 12 }}
                                md={{ span: 8, offset: 2 }}
                                lg={{ span: 6, offset: 0 }}
                            >
                                <div className={`${styles.colContent} ${styles.colBg2}`}>
                                    响应式 + 偏移
                                </div>
                            </SlCol>
                        </SlRow>
                    </div>
                </section>

                {/* ===== 案例 4: 列偏移 ===== */}
                <section id="case4" className={styles.section}>
                    <h2>案例 4: 列偏移 (Offset)</h2>
                    <p className={styles.desc}>
                        使用 offset 属性可以将列向右偏移指定的列数。
                    </p>
                    <div className={styles.demoBox}>
                        <div className={styles.demoLabel}>offset = 8:</div>
                        <SlRow gutter={16}>
                            <SlCol span={8}>
                                <div className={`${styles.colContent} ${styles.colBg1}`}>col-8</div>
                            </SlCol>
                            <SlCol span={8} offset={8}>
                                <div className={`${styles.colContent} ${styles.colBg2}`}>col-8 offset-8</div>
                            </SlCol>
                        </SlRow>

                        <div className={styles.demoLabel}>不同偏移量：</div>
                        <SlRow gutter={16}>
                            <SlCol span={6} offset={6}>
                                <div className={`${styles.colContent} ${styles.colBg1}`}>col-6 offset-6</div>
                            </SlCol>
                            <SlCol span={6} offset={6}>
                                <div className={`${styles.colContent} ${styles.colBg2}`}>col-6 offset-6</div>
                            </SlCol>
                        </SlRow>

                        <SlRow gutter={16}>
                            <SlCol span={12} offset={6}>
                                <div className={`${styles.colContent} ${styles.colBg1}`}>col-12 offset-6</div>
                            </SlCol>
                        </SlRow>

                        <SlRow gutter={16}>
                            <SlCol span={6}>
                                <div className={`${styles.colContent} ${styles.colBg1}`}>col-6</div>
                            </SlCol>
                            <SlCol span={6} offset={3}>
                                <div className={`${styles.colContent} ${styles.colBg2}`}>col-6 offset-3</div>
                            </SlCol>
                            <SlCol span={6} offset={3}>
                                <div className={`${styles.colContent} ${styles.colBg1}`}>col-6 offset-3</div>
                            </SlCol>
                        </SlRow>
                    </div>
                </section>

                {/* ===== 案例 5: 对齐方式 ===== */}
                <section id="case5" className={styles.section}>
                    <h2>案例 5: 对齐方式 (Justify & Align)</h2>
                    <p className={styles.desc}>
                        使用 justify 设置水平对齐（start/center/end/space-around/space-between/space-evenly），
                        使用 align 设置垂直对齐（top/middle/bottom）。
                    </p>
                    <div className={styles.demoBox}>
                        <div className={styles.demoLabel}>justify="start" (默认):</div>
                        <SlRow gutter={16} justify="start" className={styles.alignDemo}>
                            <SlCol span={4}>
                                <div className={`${styles.colContent} ${styles.colBg1}`}>col-4</div>
                            </SlCol>
                            <SlCol span={4}>
                                <div className={`${styles.colContent} ${styles.colBg2}`}>col-4</div>
                            </SlCol>
                            <SlCol span={4}>
                                <div className={`${styles.colContent} ${styles.colBg1}`}>col-4</div>
                            </SlCol>
                        </SlRow>

                        <div className={styles.demoLabel}>justify="center":</div>
                        <SlRow gutter={16} justify="center" className={styles.alignDemo}>
                            <SlCol span={4}>
                                <div className={`${styles.colContent} ${styles.colBg1}`}>col-4</div>
                            </SlCol>
                            <SlCol span={4}>
                                <div className={`${styles.colContent} ${styles.colBg2}`}>col-4</div>
                            </SlCol>
                            <SlCol span={4}>
                                <div className={`${styles.colContent} ${styles.colBg1}`}>col-4</div>
                            </SlCol>
                        </SlRow>

                        <div className={styles.demoLabel}>justify="end":</div>
                        <SlRow gutter={16} justify="end" className={styles.alignDemo}>
                            <SlCol span={4}>
                                <div className={`${styles.colContent} ${styles.colBg1}`}>col-4</div>
                            </SlCol>
                            <SlCol span={4}>
                                <div className={`${styles.colContent} ${styles.colBg2}`}>col-4</div>
                            </SlCol>
                            <SlCol span={4}>
                                <div className={`${styles.colContent} ${styles.colBg1}`}>col-4</div>
                            </SlCol>
                        </SlRow>

                        <div className={styles.demoLabel}>justify="space-between":</div>
                        <SlRow gutter={16} justify="space-between" className={styles.alignDemo}>
                            <SlCol span={4}>
                                <div className={`${styles.colContent} ${styles.colBg1}`}>col-4</div>
                            </SlCol>
                            <SlCol span={4}>
                                <div className={`${styles.colContent} ${styles.colBg2}`}>col-4</div>
                            </SlCol>
                            <SlCol span={4}>
                                <div className={`${styles.colContent} ${styles.colBg1}`}>col-4</div>
                            </SlCol>
                        </SlRow>

                        <div className={styles.demoLabel}>justify="space-around":</div>
                        <SlRow gutter={16} justify="space-around" className={styles.alignDemo}>
                            <SlCol span={4}>
                                <div className={`${styles.colContent} ${styles.colBg1}`}>col-4</div>
                            </SlCol>
                            <SlCol span={4}>
                                <div className={`${styles.colContent} ${styles.colBg2}`}>col-4</div>
                            </SlCol>
                            <SlCol span={4}>
                                <div className={`${styles.colContent} ${styles.colBg1}`}>col-4</div>
                            </SlCol>
                        </SlRow>

                        <div className={styles.demoLabel}>justify="space-evenly":</div>
                        <SlRow gutter={16} justify="space-evenly" className={styles.alignDemo}>
                            <SlCol span={4}>
                                <div className={`${styles.colContent} ${styles.colBg1}`}>col-4</div>
                            </SlCol>
                            <SlCol span={4}>
                                <div className={`${styles.colContent} ${styles.colBg2}`}>col-4</div>
                            </SlCol>
                            <SlCol span={4}>
                                <div className={`${styles.colContent} ${styles.colBg1}`}>col-4</div>
                            </SlCol>
                        </SlRow>

                        <div className={styles.demoLabel} style={{ marginTop: '32px' }}>垂直对齐 (align):</div>
                        <div className={styles.alignRow}>
                            <div className={styles.alignItem}>
                                <div className={styles.alignLabel}>align="top"</div>
                                <SlRow gutter={16} align="top" className={styles.alignDemoTall}>
                                    <SlCol span={8}>
                                        <div className={`${styles.colContent} ${styles.colBg1} ${styles.colTall}`}>高</div>
                                    </SlCol>
                                    <SlCol span={8}>
                                        <div className={`${styles.colContent} ${styles.colBg2}`}>普通</div>
                                    </SlCol>
                                    <SlCol span={8}>
                                        <div className={`${styles.colContent} ${styles.colBg1} ${styles.colShort}`}>矮</div>
                                    </SlCol>
                                </SlRow>
                            </div>
                            <div className={styles.alignItem}>
                                <div className={styles.alignLabel}>align="middle"</div>
                                <SlRow gutter={16} align="middle" className={styles.alignDemoTall}>
                                    <SlCol span={8}>
                                        <div className={`${styles.colContent} ${styles.colBg1} ${styles.colTall}`}>高</div>
                                    </SlCol>
                                    <SlCol span={8}>
                                        <div className={`${styles.colContent} ${styles.colBg2}`}>普通</div>
                                    </SlCol>
                                    <SlCol span={8}>
                                        <div className={`${styles.colContent} ${styles.colBg1} ${styles.colShort}`}>矮</div>
                                    </SlCol>
                                </SlRow>
                            </div>
                            <div className={styles.alignItem}>
                                <div className={styles.alignLabel}>align="bottom"</div>
                                <SlRow gutter={16} align="bottom" className={styles.alignDemoTall}>
                                    <SlCol span={8}>
                                        <div className={`${styles.colContent} ${styles.colBg1} ${styles.colTall}`}>高</div>
                                    </SlCol>
                                    <SlCol span={8}>
                                        <div className={`${styles.colContent} ${styles.colBg2}`}>普通</div>
                                    </SlCol>
                                    <SlCol span={8}>
                                        <div className={`${styles.colContent} ${styles.colBg1} ${styles.colShort}`}>矮</div>
                                    </SlCol>
                                </SlRow>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== 案例 6: Flex 布局 ===== */}
                <section id="case6" className={styles.section}>
                    <h2>案例 6: Flex 布局</h2>
                    <p className={styles.desc}>
                        使用 flex 属性可以更灵活地控制列宽。支持 &quot;auto&quot;、数字、或具体尺寸。
                        使用 order 属性可以改变列的排列顺序。使用 push/pull 可以推拉列位置。
                    </p>
                    <div className={styles.demoBox}>
                        <div className={styles.demoLabel}>flex="auto" (自动填充剩余空间):</div>
                        <SlRow gutter={16}>
                            <SlCol flex="100px">
                                <div className={`${styles.colContent} ${styles.colBg1}`}>100px</div>
                            </SlCol>
                            <SlCol flex="auto">
                                <div className={`${styles.colContent} ${styles.colBg2}`}>auto</div>
                            </SlCol>
                            <SlCol flex="100px">
                                <div className={`${styles.colContent} ${styles.colBg1}`}>100px</div>
                            </SlCol>
                        </SlRow>

                        <div className={styles.demoLabel}>flex 比例分配:</div>
                        <SlRow gutter={16}>
                            <SlCol flex={1}>
                                <div className={`${styles.colContent} ${styles.colBg1}`}>flex: 1</div>
                            </SlCol>
                            <SlCol flex={2}>
                                <div className={`${styles.colContent} ${styles.colBg2}`}>flex: 2</div>
                            </SlCol>
                            <SlCol flex={1}>
                                <div className={`${styles.colContent} ${styles.colBg1}`}>flex: 1</div>
                            </SlCol>
                        </SlRow>

                        <div className={styles.demoLabel}>order 排序（改变显示顺序）:</div>
                        <SlRow gutter={16}>
                            <SlCol span={6} order={4}>
                                <div className={`${styles.colContent} ${styles.colBg1}`}>1st (order: 4)</div>
                            </SlCol>
                            <SlCol span={6} order={3}>
                                <div className={`${styles.colContent} ${styles.colBg2}`}>2nd (order: 3)</div>
                            </SlCol>
                            <SlCol span={6} order={2}>
                                <div className={`${styles.colContent} ${styles.colBg1}`}>3rd (order: 2)</div>
                            </SlCol>
                            <SlCol span={6} order={1}>
                                <div className={`${styles.colContent} ${styles.colBg2}`}>4th (order: 1)</div>
                            </SlCol>
                        </SlRow>

                        <div className={styles.demoLabel}>push/pull 推拉:</div>
                        <SlRow gutter={16}>
                            <SlCol span={8} push={16}>
                                <div className={`${styles.colContent} ${styles.colBg1}`}>col-8 push-16</div>
                            </SlCol>
                            <SlCol span={16} pull={8}>
                                <div className={`${styles.colContent} ${styles.colBg2}`}>col-16 pull-8</div>
                            </SlCol>
                        </SlRow>

                        <div className={styles.demoLabel}>wrap=false (不换行):</div>
                        <SlRow gutter={16} wrap={false}>
                            <SlCol flex="200px">
                                <div className={`${styles.colContent} ${styles.colBg1}`}>200px</div>
                            </SlCol>
                            <SlCol flex="auto">
                                <div className={`${styles.colContent} ${styles.colBg2}`}>auto (压缩)</div>
                            </SlCol>
                            <SlCol flex="200px">
                                <div className={`${styles.colContent} ${styles.colBg1}`}>200px</div>
                            </SlCol>
                            <SlCol flex="200px">
                                <div className={`${styles.colContent} ${styles.colBg2}`}>200px</div>
                            </SlCol>
                        </SlRow>
                    </div>
                </section>

                {/* ===== 案例 7: 功能组合案例 ===== */}
                <section id="case7" className={`${styles.section} ${styles.fullWidthSection}`}>
                    <h2>案例 7: 功能组合案例（属性开关）</h2>
                    <p className={styles.desc}>通过下方控制面板调整栅格的各项属性，实时预览效果</p>

                    {/* 控制面板 */}
                    <div className={styles.controlPanel}>
                        <h3>属性控制面板</h3>
                        <div className={styles.controls}>
                            <div className={styles.controlItem}>
                                <label>水平间距 (Gutter H): {gutter}px</label>
                                <SlInput
                                    type="number"
                                    value={gutter}
                                    min="0"
                                    max="64"
                                    onSlInput={(e) => setGutter(Number(e.target.value))}
                                    style={{ width: '120px' }}
                                />
                            </div>

                            <div className={styles.controlItem}>
                                <label>垂直间距 (Gutter V): {verticalGutter}px</label>
                                <SlInput
                                    type="number"
                                    value={verticalGutter}
                                    min="0"
                                    max="64"
                                    onSlInput={(e) => setVerticalGutter(Number(e.target.value))}
                                    style={{ width: '120px' }}
                                />
                            </div>

                            <div className={styles.controlItem}>
                                <label>水平对齐 (Justify):</label>
                                <SlRadioGroup value={justify} onSlChange={(e) => setJustify(e.target.value)}>
                                    <SlRadio value="start">start</SlRadio>
                                    <SlRadio value="center">center</SlRadio>
                                    <SlRadio value="end">end</SlRadio>
                                    <SlRadio value="space-between">between</SlRadio>
                                    <SlRadio value="space-around">around</SlRadio>
                                </SlRadioGroup>
                            </div>

                            <div className={styles.controlItem}>
                                <label>垂直对齐 (Align):</label>
                                <SlRadioGroup value={align} onSlChange={(e) => setAlign(e.target.value)}>
                                    <SlRadio value="top">top</SlRadio>
                                    <SlRadio value="middle">middle</SlRadio>
                                    <SlRadio value="bottom">bottom</SlRadio>
                                </SlRadioGroup>
                            </div>

                            <div className={styles.controlItem}>
                                <label>换行 (Wrap):</label>
                                <SlSwitch checked={wrap} onSlChange={(e) => setWrap(e.target.checked)}>
                                    {wrap ? '开启' : '关闭'}
                                </SlSwitch>
                            </div>
                        </div>
                    </div>

                    {/* 预览区域 */}
                    <div className={styles.demoBox}>
                        <SlRow
                            gutter={[gutter, verticalGutter]}
                            justify={justify}
                            align={align}
                            wrap={wrap}
                            className={styles.previewRow}
                        >
                            <SlCol span={4}>
                                <div className={`${styles.colContent} ${styles.colBg1} ${styles.colTall}`}>col-4 高</div>
                            </SlCol>
                            <SlCol span={4}>
                                <div className={`${styles.colContent} ${styles.colBg2}`}>col-4</div>
                            </SlCol>
                            <SlCol span={4}>
                                <div className={`${styles.colContent} ${styles.colBg1} ${styles.colShort}`}>col-4 矮</div>
                            </SlCol>
                            <SlCol span={4}>
                                <div className={`${styles.colContent} ${styles.colBg2}`}>col-4</div>
                            </SlCol>
                            <SlCol span={4}>
                                <div className={`${styles.colContent} ${styles.colBg1}`}>col-4</div>
                            </SlCol>
                            <SlCol span={4}>
                                <div className={`${styles.colContent} ${styles.colBg2} ${styles.colTall}`}>col-4 高</div>
                            </SlCol>
                            <SlCol span={8}>
                                <div className={`${styles.colContent} ${styles.colBg1}`}>col-8</div>
                            </SlCol>
                            <SlCol span={8}>
                                <div className={`${styles.colContent} ${styles.colBg2}`}>col-8</div>
                            </SlCol>
                            <SlCol span={8}>
                                <div className={`${styles.colContent} ${styles.colBg1}`}>col-8</div>
                            </SlCol>
                        </SlRow>
                    </div>

                    {/* 当前配置显示 */}
                    <div className={styles.configDisplay}>
                        <h4>当前配置:</h4>
                        <pre>{JSON.stringify({
                            gutter: [gutter, verticalGutter],
                            justify,
                            align,
                            wrap
                        }, null, 2)}</pre>
                    </div>
                </section>
            </main>
        </div>
    );
}
