import { useState, useEffect, useRef } from 'react';
import styles from './TEST_sl_pagination.module.scss';

// 导入 Shoelace React 包装器
import {
    SlPagination,
    SlButton,
    SlIcon
} from '@kdcloudjs/shoelace/dist/react';

export default function TEST_sl_pagination(config) {
    // 书签导航状态
    const [activeSection, setActiveSection] = useState('case1');

    // 受控模式的状态
    const [controlledPage, setControlledPage] = useState(1);
    const [controlledPageSize, setControlledPageSize] = useState(20);

    // 事件日志
    const [eventLogs, setEventLogs] = useState([]);

    // 动态更新的 refs
    const dynamicPaginationRef = useRef(null);

    // 书签导航数据
    const bookmarks = [
        { id: 'case1', label: '基础分页器', icon: 'chevron-bar-left' },
        { id: 'case2', label: '设置总数据量', icon: 'database' },
        { id: 'case3', label: '自定义每页条数', icon: 'list-ol' },
        { id: 'case4', label: '自定义条数选项', icon: 'sliders' },
        { id: 'case5', label: '设置默认页码', icon: 'bookmark' },
        { id: 'case6', label: '受控模式', icon: 'toggles' },
        { id: 'case7', label: '简洁模式', icon: 'layout-text-sidebar' },
        { id: 'case8', label: '禁用状态', icon: 'ban' },
        { id: 'case9', label: '事件监听', icon: 'lightning' },
        { id: 'case10', label: '动态更新', icon: 'arrow-repeat' },
        { id: 'case11', label: '自定义样式', icon: 'palette' }
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

    // 记录事件日志
    const logEvent = (detail) => {
        const timestamp = new Date().toLocaleTimeString();
        setEventLogs(prev => [...prev.slice(-9), `[${timestamp}] 页码: ${detail.pageNumber}, 每页: ${detail.pageSize} 条`]);
    };

    // 受控模式的页码变化处理
    const handleControlledPageChange = (e) => {
        const { pageNumber, pageSize } = e.detail;
        setControlledPage(pageNumber);
        setControlledPageSize(pageSize);
        // 受控模式需手动更新组件属性
        e.target.currentPage = pageNumber;
        e.target.pageSize = pageSize;
    };

    // 动态更新操作
    const handleSetPage = (page) => {
        if (dynamicPaginationRef.current) {
            dynamicPaginationRef.current.currentPage = page;
        }
    };

    const handleSetPageSize = (size) => {
        if (dynamicPaginationRef.current) {
            dynamicPaginationRef.current.pageSize = size;
        }
    };

    const handleSetTotal = (total) => {
        if (dynamicPaginationRef.current) {
            dynamicPaginationRef.current.total = total;
        }
    };

    const handleResetPagination = () => {
        if (dynamicPaginationRef.current) {
            dynamicPaginationRef.current.currentPage = 1;
            dynamicPaginationRef.current.pageSize = 20;
            dynamicPaginationRef.current.total = 500;
        }
    };

    return (
        <div className={styles.pageWrapper}>
            {/* 侧边书签导航 */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <SlIcon name="bookmark-star" className={styles.sidebarIcon} />
                    <span>案例导航</span>
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
                <h1 className={styles.title}>Shoelace Pagination 分页器组件示例</h1>

                {/* ===== 案例 1: 基础分页器 ===== */}
                <section id="case1" className={styles.section}>
                    <h2>案例 1: 基础分页器</h2>
                    <p className={styles.desc}>使用默认配置，总条数默认为 5000，每页 20 条</p>
                    <div className={styles.demoBox}>
                        <SlPagination />
                    </div>
                </section>

                {/* ===== 案例 2: 设置总数据量 ===== */}
                <section id="case2" className={styles.section}>
                    <h2>案例 2: 设置总数据量</h2>
                    <p className={styles.desc}>通过 total 属性设置不同的总数据量</p>
                    <div className={styles.demoBox}>
                        <div className={styles.demoGroup}>
                            <div className={styles.demoLabel}>total=100</div>
                            <SlPagination total={100} />
                        </div>
                        <div className={styles.demoGroup}>
                            <div className={styles.demoLabel}>total=500</div>
                            <SlPagination total={500} />
                        </div>
                        <div className={styles.demoGroup}>
                            <div className={styles.demoLabel}>total=2000</div>
                            <SlPagination total={2000} />
                        </div>
                    </div>
                </section>

                {/* ===== 案例 3: 自定义每页条数 ===== */}
                <section id="case3" className={styles.section}>
                    <h2>案例 3: 自定义每页条数</h2>
                    <p className={styles.desc}>通过 pageSize 属性设置每页显示的条数</p>
                    <div className={styles.demoBox}>
                        <div className={styles.demoGroup}>
                            <div className={styles.demoLabel}>pageSize=10（总共 200 条）</div>
                            <SlPagination total={200} pageSize={10} />
                        </div>
                        <div className={styles.demoGroup}>
                            <div className={styles.demoLabel}>pageSize=50（总共 500 条）</div>
                            <SlPagination total={500} pageSize={50} />
                        </div>
                    </div>
                </section>

                {/* ===== 案例 4: 自定义每页条数选项 ===== */}
                <section id="case4" className={styles.section}>
                    <h2>案例 4: 自定义每页条数选项</h2>
                    <p className={styles.desc}>通过 pageSizeOpts 属性自定义下拉菜单中的选项</p>
                    <div className={styles.demoBox}>
                        <div className={styles.demoGroup}>
                            <div className={styles.demoLabel}>pageSizeOpts=[25, 50, 100, 200]</div>
                            <SlPagination
                                total={1000}
                                pageSize={25}
                                pageSizeOpts={[25, 50, 100, 200]}
                            />
                        </div>
                        <div className={styles.demoGroup}>
                            <div className={styles.demoLabel}>pageSizeOpts=[5, 10, 15, 20]</div>
                            <SlPagination
                                total={200}
                                pageSize={5}
                                pageSizeOpts={[5, 10, 15, 20]}
                            />
                        </div>
                    </div>
                </section>

                {/* ===== 案例 5: 设置默认页码 ===== */}
                <section id="case5" className={styles.section}>
                    <h2>案例 5: 设置默认页码</h2>
                    <p className={styles.desc}>通过 defaultCurrentPage 设置初始页码（非受控模式）</p>
                    <div className={styles.demoBox}>
                        <div className={styles.demoGroup}>
                            <div className={styles.demoLabel}>defaultCurrentPage=5</div>
                            <SlPagination total={500} defaultCurrentPage={5} />
                        </div>
                        <div className={styles.demoGroup}>
                            <div className={styles.demoLabel}>defaultCurrentPage=10</div>
                            <SlPagination total={500} defaultCurrentPage={10} />
                        </div>
                    </div>
                </section>

                {/* ===== 案例 6: 受控模式 ===== */}
                <section id="case6" className={styles.section}>
                    <h2>案例 6: 受控模式</h2>
                    <p className={styles.desc}>通过 currentPage 属性受控，需在 onSlPageChange 事件中手动更新</p>
                    <div className={styles.demoBox}>
                        <div className={styles.statusBar}>
                            <span>当前页码: <strong>{controlledPage}</strong></span>
                            <span>每页条数: <strong>{controlledPageSize}</strong></span>
                            <span>总条数: <strong>500</strong></span>
                        </div>
                        <SlPagination
                            total={500}
                            onSlPageChange={handleControlledPageChange}
                        />
                    </div>
                </section>

                {/* ===== 案例 7: 简洁模式 ===== */}
                <section id="case7" className={styles.section}>
                    <h2>案例 7: 简洁模式</h2>
                    <p className={styles.desc}>使用 simpleMode 属性启用简洁模式，隐藏页码输入框和总页数</p>
                    <div className={styles.demoBox}>
                        <div className={styles.demoGroup}>
                            <div className={styles.demoLabel}>简洁模式</div>
                            <SlPagination total={500} simpleMode />
                        </div>
                        <div className={styles.demoGroup}>
                            <div className={styles.demoLabel}>标准模式（对比）</div>
                            <SlPagination total={500} />
                        </div>
                    </div>
                </section>

                {/* ===== 案例 8: 禁用状态 ===== */}
                <section id="case8" className={styles.section}>
                    <h2>案例 8: 禁用状态</h2>
                    <p className={styles.desc}>使用 disabled 属性禁用分页器的所有交互</p>
                    <div className={styles.demoBox}>
                        <div className={styles.demoGroup}>
                            <div className={styles.demoLabel}>禁用状态</div>
                            <SlPagination total={500} disabled />
                        </div>
                        <div className={styles.demoGroup}>
                            <div className={styles.demoLabel}>正常状态（对比）</div>
                            <SlPagination total={500} />
                        </div>
                    </div>
                </section>

                {/* ===== 案例 9: 事件监听 ===== */}
                <section id="case9" className={styles.section}>
                    <h2>案例 9: 事件监听</h2>
                    <p className={styles.desc}>监听 onSlPageChange 事件获取页码和每页条数的变化</p>
                    <div className={styles.demoBox}>
                        <SlPagination
                            total={1000}
                            onSlPageChange={(e) => logEvent(e.detail)}
                        />

                        <div className={styles.eventLog}>
                            <h4>事件日志：</h4>
                            <div className={styles.logContent}>
                                {eventLogs.length === 0 ? (
                                    <p className={styles.noLog}>暂无事件记录，请操作分页器</p>
                                ) : (
                                    eventLogs.map((log, index) => (
                                        <div key={index} className={styles.logItem}>{log}</div>
                                    ))
                                )}
                            </div>
                            {eventLogs.length > 0 && (
                                <SlButton size="small" onClick={() => setEventLogs([])}>
                                    清除日志
                                </SlButton>
                            )}
                        </div>
                    </div>
                </section>

                {/* ===== 案例 10: 动态更新 ===== */}
                <section id="case10" className={styles.section}>
                    <h2>案例 10: 动态更新</h2>
                    <p className={styles.desc}>通过 JavaScript 动态更新分页器的属性</p>
                    <div className={styles.demoBox}>
                        <div className={styles.controlPanel}>
                            <div className={styles.controlRow}>
                                <span>跳转页码：</span>
                                <SlButton size="small" onClick={() => handleSetPage(1)}>第1页</SlButton>
                                <SlButton size="small" onClick={() => handleSetPage(5)}>第5页</SlButton>
                                <SlButton size="small" onClick={() => handleSetPage(10)}>第10页</SlButton>
                            </div>
                            <div className={styles.controlRow}>
                                <span>每页条数：</span>
                                <SlButton size="small" onClick={() => handleSetPageSize(10)}>10条</SlButton>
                                <SlButton size="small" onClick={() => handleSetPageSize(20)}>20条</SlButton>
                                <SlButton size="small" onClick={() => handleSetPageSize(50)}>50条</SlButton>
                            </div>
                            <div className={styles.controlRow}>
                                <span>总条数：</span>
                                <SlButton size="small" onClick={() => handleSetTotal(100)}>100条</SlButton>
                                <SlButton size="small" onClick={() => handleSetTotal(500)}>500条</SlButton>
                                <SlButton size="small" onClick={() => handleSetTotal(2000)}>2000条</SlButton>
                            </div>
                            <div className={styles.controlRow}>
                                <SlButton size="small" variant="warning" onClick={handleResetPagination}>
                                    重置全部
                                </SlButton>
                            </div>
                        </div>
                        <SlPagination
                            ref={dynamicPaginationRef}
                            total={500}
                        />
                    </div>
                </section>

                {/* ===== 案例 11: 自定义样式 ===== */}
                <section id="case11" className={styles.section}>
                    <h2>案例 11: 自定义样式</h2>
                    <p className={styles.desc}>通过 CSS 自定义属性调整分页器外观</p>
                    <div className={styles.demoBox}>
                        <div className={styles.demoGroup}>
                            <div className={styles.demoLabel}>自定义颜色和大小</div>
                            <SlPagination
                                total={500}
                                className={styles.customPagination}
                            />
                        </div>
                        <div className={styles.demoGroup}>
                            <div className={styles.demoLabel}>加宽输入框</div>
                            <SlPagination
                                total={500}
                                className={styles.widePagination}
                            />
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}
