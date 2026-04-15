import { useState, useRef, useCallback, useEffect } from 'react';
import styles from './TEST_sl_lookupF7.module.scss';

// 导入 Shoelace React 包装器（按 rule.md 规范使用单独路径）
import SlButton from '@kdcloudjs/shoelace/dist/react/button/index.js';
import SlIcon from '@kdcloudjs/shoelace/dist/react/icon/index.js';
import SlInput from '@kdcloudjs/shoelace/dist/react/input/index.js';
import SlLookup from '@kdcloudjs/shoelace-biz/dist/react/lookup/index.js';

// ========== 书签数据 ==========
const bookmarks = [
    { id: 'case1', label: '基础用法', icon: 'play-circle' },
    { id: 'case2', label: '自定义列', icon: 'list-columns' },
    { id: 'case3', label: '多选模式', icon: 'check2-square' },
    { id: 'case4', label: '显示字段配置', icon: 'pencil-square' },
    { id: 'case5', label: '页脚按钮', icon: 'layout-text-window' },
    { id: 'case6', label: '不同尺寸', icon: 'arrows-angle-expand' },
    { id: 'case7', label: '禁用与必填', icon: 'lock' },
    { id: 'case8', label: 'Label与前后缀', icon: 'tag' },
    { id: 'case9', label: '编辑触发模式', icon: 'toggles' },
    { id: 'case10', label: '表单验证消息', icon: 'shield-exclamation' },
    { id: 'case11', label: '事件监听', icon: 'broadcast' },
    { id: 'case12', label: 'Ref 控制', icon: 'cursor' },
    { id: 'case13', label: 'BOS 平台集成', icon: 'cloud' },
    { id: 'case14', label: '表单集成', icon: 'card-list' },
    { id: 'case15', label: 'CSS Parts 样式', icon: 'palette' },
];

// ========== 通用列配置 ==========
const employeeColumns = [
    { field: 'number', header: '编码', width: '100px' },
    { field: 'name', header: '名称', width: '120px' },
];

const detailedColumns = [
    { field: 'number', header: '编码', width: '100px' },
    { field: 'name', header: '名称', width: '120px' },
    { field: 'department', header: '部门', width: '100px' },
];

export default function TEST_sl_lookupF7(config) {
    const [activeSection, setActiveSection] = useState('case1');
    const [eventLogs, setEventLogs] = useState([]);
    const [validationMsg, setValidationMsg] = useState('点击左侧按钮触发验证');

    // ref 控制案例
    const lookupRef = useRef(null);

    // 事件监听案例 ref
    const eventLookupRef = useRef(null);

    // 验证案例 ref
    const validationRef = useRef(null);

    // 事件日志
    const logEvent = useCallback((eventName, detail) => {
        const time = new Date().toLocaleTimeString();
        setEventLogs(prev => [`[${time}] ${eventName}: ${JSON.stringify(detail)}`, ...prev].slice(0, 20));
    }, []);

    // 通过 ref + addEventListener 绑定事件（shoelace-biz React 包装器不支持 onSlXxx 事件属性）
    useEffect(() => {
        const el = eventLookupRef.current;
        if (!el) return;

        const onSearch = (e) => logEvent('sl-lookup-search', e.detail);
        const onChange = (e) => logEvent('sl-lookup-change', e.detail);
        const onClear = () => logEvent('sl-lookup-clear', {});
        const onFocus = () => logEvent('sl-focus', {});
        const onBlur = () => logEvent('sl-blur', {});
        const onAdd = () => logEvent('sl-lookup-add', { message: '点击新增按钮' });
        const onMore = () => logEvent('sl-lookup-more', { message: '点击更多按钮或按 F7' });

        el.addEventListener('sl-lookup-search', onSearch);
        el.addEventListener('sl-lookup-change', onChange);
        el.addEventListener('sl-lookup-clear', onClear);
        el.addEventListener('sl-focus', onFocus);
        el.addEventListener('sl-blur', onBlur);
        el.addEventListener('sl-lookup-add', onAdd);
        el.addEventListener('sl-lookup-more', onMore);

        return () => {
            el.removeEventListener('sl-lookup-search', onSearch);
            el.removeEventListener('sl-lookup-change', onChange);
            el.removeEventListener('sl-lookup-clear', onClear);
            el.removeEventListener('sl-focus', onFocus);
            el.removeEventListener('sl-blur', onBlur);
            el.removeEventListener('sl-lookup-add', onAdd);
            el.removeEventListener('sl-lookup-more', onMore);
        };
    }, [logEvent]);

    // ref 控制方法
    const handleHide = useCallback(async () => {
        if (lookupRef.current) await lookupRef.current.hide();
    }, []);

    const handleRefFocus = useCallback(() => {
        if (lookupRef.current) lookupRef.current.focus();
    }, []);

    const handleCheckValidity = useCallback(() => {
        if (lookupRef.current) {
            const isValid = lookupRef.current.checkValidity();
            alert(`表单验证结果: ${isValid ? '有效' : '无效'}`);
        }
    }, []);

    // 验证案例方法
    const handleReportValidity = useCallback(() => {
        if (validationRef.current) {
            const isValid = validationRef.current.reportValidity();
            setValidationMsg(`reportValidity() 返回: ${isValid}\n${isValid ? '✅ 验证通过' : '❌ 验证失败，浏览器已显示验证消息'}`);
        }
    }, []);

    const handleSetCustomValidity = useCallback(() => {
        if (validationRef.current) {
            validationRef.current.setCustomValidity('这是一条自定义验证消息');
            validationRef.current.reportValidity();
            setValidationMsg('setCustomValidity("这是一条自定义验证消息")\nℹ️ 已设置自定义消息并触发 reportValidity');
        }
    }, []);

    const handleClearCustomValidity = useCallback(() => {
        if (validationRef.current) {
            validationRef.current.setCustomValidity('');
            setValidationMsg('setCustomValidity("")\n✅ 自定义验证消息已清除');
        }
    }, []);

    // 书签导航
    const handleBookmarkClick = (id) => {
        setActiveSection(id);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
                <h1 className={styles.title}>F7 Lookup 弹出选择器</h1>
                <p className={styles.subtitle}>
                    SlLookup 是 F7 风格的远程搜索弹出选择器组件，必须配置 <code>app</code> + <code>entity</code> 属性，
                    由组件自动调用后端 API 获取数据。支持搜索、单选/多选、自定义列显示，可与 BOS 平台集成。
                </p>
                <p className={styles.notice}>
                    <SlIcon name="info-circle" />
                    <span>注意：此组件依赖低代码平台后端 API，需通过 <code>kd debug</code> 在苍穹平台上预览才能正常工作。</span>
                </p>

                {/* ===== 案例 1: 基础用法 ===== */}
                <section id="case1" className={styles.section}>
                    <h2>案例 1: 基础用法</h2>
                    <p className={styles.desc}>
                        最简单的用法，配置 <code>app</code> 和 <code>entity</code> 后组件自动调用后端 API 搜索数据。
                    </p>
                    <div className={styles.demoBox}>
                        <div className={styles.demoItem}>
                            <label>选择用户：</label>
                            <SlLookup
                                app="bos"
                                entity="bos_user"
                                placeholder="请输入搜索关键词"
                            />
                        </div>
                    </div>
                    <div className={styles.codeHint}>
                        <code>{`<SlLookup app="bos" entity="bos_user" placeholder="请输入搜索关键词" onSlLookupChange={handleChange} />`}</code>
                    </div>
                </section>

                {/* ===== 案例 2: 自定义列 ===== */}
                <section id="case2" className={styles.section}>
                    <h2>案例 2: 自定义列</h2>
                    <p className={styles.desc}>
                        使用 <code>columns</code> 属性配置面板显示的列，包括字段名、表头和列宽。
                    </p>
                    <div className={styles.demoBox}>
                        <div className={styles.demoItem}>
                            <label>带自定义列的搜索：</label>
                            <SlLookup
                                app="bos"
                                entity="bos_user"
                                columns={detailedColumns}
                                placeholder="搜索员工"
                            />
                        </div>
                    </div>
                    <div className={styles.codeHint}>
                        <code>{`columns={[{ field: 'number', header: '编码', width: '100px' }, { field: 'name', header: '名称' }, { field: 'department', header: '部门' }]}`}</code>
                    </div>
                </section>

                {/* ===== 案例 3: 多选模式 ===== */}
                <section id="case3" className={styles.section}>
                    <h2>案例 3: 多选模式</h2>
                    <p className={styles.desc}>
                        使用 <code>multiple</code> 属性开启多选，选中的多个值以分号分隔显示。
                        <code>sl-lookup-change</code> 事件的 <code>detail.value</code> 为数组格式。
                    </p>
                    <div className={styles.demoBox}>
                        <div className={styles.demoItem}>
                            <label>多选用户：</label>
                            <SlLookup
                                app="bos"
                                entity="bos_user"
                                multiple
                                columns={employeeColumns}
                                placeholder="选择标签（可多选）"
                            />
                        </div>
                    </div>
                    <div className={styles.codeHint}>
                        <code>{`<SlLookup app="bos" entity="bos_user" multiple columns={columns} />`}</code>
                    </div>
                </section>

                {/* ===== 案例 4: 显示字段配置 ===== */}
                <section id="case4" className={styles.section}>
                    <h2>案例 4: displayFields 和 editFields</h2>
                    <p className={styles.desc}>
                        <code>displayFields</code> 控制选中后输入框显示的字段，
                        <code>editFields</code> 控制获焦编辑时显示的字段。
                    </p>
                    <div className={styles.demoBox}>
                        <div className={styles.demoRow}>
                            <div className={styles.demoItem}>
                                <label>显示名称，编辑时显示编码：</label>
                                <SlLookup
                                    app="bos"
                                    entity="bos_user"
                                    columns={employeeColumns}
                                    displayFields={['name']}
                                    editFields={['number']}
                                    placeholder="选择后显示名称"
                                />
                            </div>
                            <div className={styles.demoItem}>
                                <label>显示编码+名称：</label>
                                <SlLookup
                                    app="bos"
                                    entity="bos_user"
                                    columns={employeeColumns}
                                    displayFields={['number', 'name']}
                                    editFields={['number', 'name']}
                                    separator=" - "
                                    placeholder="选择后显示编码-名称"
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.codeHint}>
                        <code>{`displayFields={['number', 'name']} editFields={['number']} separator=" - "`}</code>
                    </div>
                </section>

                {/* ===== 案例 5: 页脚按钮 ===== */}
                <section id="case5" className={styles.section}>
                    <h2>案例 5: 页脚按钮</h2>
                    <p className={styles.desc}>
                        通过 <code>showAddButton</code> 和 <code>showMoreButton</code> 控制面板底部的"新增"和"更多"按钮。
                    </p>
                    <div className={styles.demoBox}>
                        <div className={styles.demoRow}>
                            <div className={styles.demoItem}>
                                <label>显示新增和更多：</label>
                                <SlLookup
                                    app="bos"
                                    entity="bos_user"
                                    showAddButton
                                    showMoreButton
                                    placeholder="显示新增和更多按钮"
                                />
                            </div>
                            <div className={styles.demoItem}>
                                <label>仅更多按钮：</label>
                                <SlLookup
                                    app="bos"
                                    entity="bos_user"
                                    showAddButton={false}
                                    showMoreButton
                                    placeholder="仅显示更多按钮"
                                />
                            </div>
                            <div className={styles.demoItem}>
                                <label>隐藏所有按钮：</label>
                                <SlLookup
                                    app="bos"
                                    entity="bos_user"
                                    showAddButton={false}
                                    showMoreButton={false}
                                    placeholder="隐藏所有页脚按钮"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== 案例 6: 不同尺寸 ===== */}
                <section id="case6" className={styles.section}>
                    <h2>案例 6: 不同尺寸</h2>
                    <p className={styles.desc}>支持 <code>small</code>、<code>medium</code>（默认）、<code>large</code> 三种尺寸。</p>
                    <div className={styles.demoBox}>
                        <div className={styles.demoRow}>
                            <div className={styles.demoItem}>
                                <label>Small：</label>
                                <SlLookup
                                    app="bos"
                                    entity="bos_user"
                                    size="small"
                                    placeholder="小尺寸 (small)"
                                />
                            </div>
                            <div className={styles.demoItem}>
                                <label>Medium：</label>
                                <SlLookup
                                    app="bos"
                                    entity="bos_user"
                                    size="medium"
                                    placeholder="中尺寸 (medium)"
                                />
                            </div>
                            <div className={styles.demoItem}>
                                <label>Large：</label>
                                <SlLookup
                                    app="bos"
                                    entity="bos_user"
                                    size="large"
                                    placeholder="大尺寸 (large)"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== 案例 7: 禁用与必填 ===== */}
                <section id="case7" className={styles.section}>
                    <h2>案例 7: 禁用与必填</h2>
                    <p className={styles.desc}>使用 <code>disabled</code> 禁用组件，使用 <code>required</code> 设置必填验证。</p>
                    <div className={styles.demoBox}>
                        <div className={styles.demoRow}>
                            <div className={styles.demoItem}>
                                <label>禁用状态：</label>
                                <SlLookup
                                    label="禁用状态"
                                    disabled
                                    value="已选择的值"
                                    placeholder="禁用的 lookup"
                                />
                            </div>
                            <div className={styles.demoItem}>
                                <label>必填状态：</label>
                                <SlLookup
                                    app="bos"
                                    entity="bos_user"
                                    label="必填字段"
                                    required
                                    placeholder="此字段为必填"
                                    helpText="请选择一个选项"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== 案例 8: Label 与前后缀 ===== */}
                <section id="case8" className={styles.section}>
                    <h2>案例 8: Label、Prefix 与 Suffix</h2>
                    <p className={styles.desc}>
                        使用 <code>label</code> 设置输入框标签，<code>helpText</code> 设置帮助提示。
                        通过 <code>prefix</code>/<code>suffix</code> 插槽在输入框前后放置图标或文字，<code>filled</code> 使用填充样式。
                    </p>
                    <div className={styles.demoBox}>
                        <div className={styles.demoRow}>
                            <div className={styles.demoItem}>
                                <SlLookup
                                    app="bos"
                                    entity="bos_user"
                                    label="选择用户"
                                    helpText="请输入关键词搜索用户"
                                    placeholder="搜索用户"
                                />
                            </div>
                            <div className={styles.demoItem}>
                                <SlLookup
                                    app="bos"
                                    entity="bos_user"
                                    label="带前缀图标"
                                    placeholder="搜索用户"
                                >
                                    <SlIcon name="person" slot="prefix" />
                                </SlLookup>
                            </div>
                            <div className={styles.demoItem}>
                                <SlLookup
                                    app="bos"
                                    entity="bos_user"
                                    label="带后缀图标"
                                    placeholder="搜索用户"
                                >
                                    <SlIcon name="search" slot="suffix" />
                                </SlLookup>
                            </div>
                        </div>
                        <div className={styles.demoRow} style={{ marginTop: '16px' }}>
                            <div className={styles.demoItem}>
                                <SlLookup
                                    app="bos"
                                    entity="bos_user"
                                    label="前后缀组合"
                                    helpText="同时使用 prefix 和 suffix 插槽"
                                    placeholder="搜索用户"
                                >
                                    <SlIcon name="person-circle" slot="prefix" />
                                    <SlIcon name="arrow-right-circle" slot="suffix" />
                                </SlLookup>
                            </div>
                            <div className={styles.demoItem}>
                                <SlLookup
                                    app="bos"
                                    entity="bos_user"
                                    label="填充样式（filled）"
                                    filled
                                    placeholder="filled 风格"
                                >
                                    <SlIcon name="person" slot="prefix" />
                                </SlLookup>
                            </div>
                        </div>
                    </div>
                    <div className={styles.codeHint}>
                        <code>{`<SlLookup label="选择用户" helpText="提示"><SlIcon name="person" slot="prefix" /></SlLookup>`}</code>
                    </div>
                </section>

                {/* ===== 案例 9: 编辑触发模式 ===== */}
                <section id="case9" className={styles.section}>
                    <h2>案例 9: 编辑触发模式（editStyle）</h2>
                    <p className={styles.desc}>
                        <code>editStyle</code> 控制编辑触发方式：<code>'input'</code>（默认）允许直接在输入框中键入搜索，
                        <code>'button'</code> 模式下输入框只读，必须点击搜索按钮或按 F7 打开面板。
                    </p>
                    <div className={styles.demoBox}>
                        <div className={styles.demoRow}>
                            <div className={styles.demoItem}>
                                <label>input 模式（默认）：</label>
                                <SlLookup
                                    app="bos"
                                    entity="bos_user"
                                    editStyle="input"
                                    label="input 模式"
                                    placeholder="可直接输入搜索"
                                />
                            </div>
                            <div className={styles.demoItem}>
                                <label>button 模式：</label>
                                <SlLookup
                                    app="bos"
                                    entity="bos_user"
                                    editStyle="button"
                                    label="button 模式"
                                    placeholder="点击按钮或按 F7 搜索"
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.codeHint}>
                        <code>{`<SlLookup editStyle="button" /> vs <SlLookup editStyle="input" />`}</code>
                    </div>
                </section>

                {/* ===== 案例 10: 表单验证消息 ===== */}
                <section id="case10" className={styles.section}>
                    <h2>案例 10: 表单验证消息</h2>
                    <p className={styles.desc}>
                        使用 <code>reportValidity()</code> 触发浏览器原生验证消息，
                        <code>setCustomValidity()</code> 设置自定义验证消息。配合 <code>required</code> 属性使用。
                    </p>
                    <div className={styles.demoBox}>
                        <div className={styles.demoRow}>
                            <div className={styles.demoItem}>
                                <label>必填验证：</label>
                                <SlLookup
                                    ref={validationRef}
                                    app="bos"
                                    entity="bos_user"
                                    label="必填字段"
                                    required
                                    placeholder="不选择时点击下方验证"
                                    helpText="此字段为必填"
                                />
                                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                    <SlButton size="small" onClick={handleReportValidity}>
                                        reportValidity()
                                    </SlButton>
                                    <SlButton size="small" onClick={handleSetCustomValidity}>
                                        setCustomValidity()
                                    </SlButton>
                                    <SlButton size="small" variant="default" onClick={handleClearCustomValidity}>
                                        清除自定义消息
                                    </SlButton>
                                </div>
                            </div>
                            <div className={styles.demoItem}>
                                <label>验证结果：</label>
                                <textarea
                                    className={styles.logTextarea}
                                    readOnly
                                    rows={5}
                                    value={validationMsg}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.codeHint}>
                        <code>{`ref.current.reportValidity() // 显示浏览器验证消息\nref.current.setCustomValidity('自定义错误') // 自定义消息`}</code>
                    </div>
                </section>

                {/* ===== 案例 11: 事件监听 ===== */}
                <section id="case11" className={styles.section}>
                    <h2>案例 11: 事件监听</h2>
                    <p className={styles.desc}>
                        监听 search、change、clear、focus、blur 等事件处理用户交互。直接使用 React 事件属性绑定。
                    </p>
                    <div className={styles.demoBox}>
                        <div className={styles.eventRow}>
                            <div className={styles.demoItem}>
                                <label>操作后查看事件日志：</label>
                                <SlLookup
                                    ref={eventLookupRef}
                                    app="bos"
                                    entity="bos_user"
                                    clearable
                                    placeholder="操作后查看事件日志"
                                />
                            </div>
                            <div className={styles.eventLogArea}>
                                <label>事件日志：</label>
                                <textarea
                                    className={styles.logTextarea}
                                    readOnly
                                    rows={10}
                                    value={eventLogs.length === 0 ? '暂无事件记录，请操作左侧 Lookup 进行测试' : eventLogs.join('\n')}
                                />
                                {eventLogs.length > 0 && (
                                    <SlButton size="small" style={{ marginTop: '8px' }} onClick={() => setEventLogs([])}>
                                        清除日志
                                    </SlButton>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== 案例 12: Ref 控制 ===== */}
                <section id="case12" className={styles.section}>
                    <h2>案例 12: 通过 ref 控制</h2>
                    <p className={styles.desc}>
                        使用 ref 操作 <code>show()</code>/<code>hide()</code>/<code>focus()</code>/<code>checkValidity()</code> 等方法。
                    </p>
                    <div className={styles.demoBox}>
                        <div className={styles.demoItem}>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                                <SlButton size="small" onClick={handleHide}>hide()</SlButton>
                                <SlButton size="small" onClick={handleRefFocus}>focus()</SlButton>
                                <SlButton size="small" onClick={handleCheckValidity}>checkValidity()</SlButton>
                            </div>
                            <SlLookup
                                ref={lookupRef}
                                app="bos"
                                entity="bos_user"
                                required
                                label="通过 ref 控制"
                                placeholder="使用上方按钮控制"
                            />
                        </div>
                    </div>
                </section>

                {/* ===== 案例 13: BOS 平台集成 ===== */}
                <section id="case13" className={styles.section}>
                    <h2>案例 13: BOS 平台集成</h2>
                    <p className={styles.desc}>
                        配置 <code>formId</code>、<code>parentPageId</code> 等参数与 BOS showconfig 弹窗集成。
                        点击"更多"按钮或按 F7 键时，组件会根据配置参数自动打开 BOS 弹窗。
                    </p>
                    <div className={styles.demoBox}>
                        <div className={styles.demoItem}>
                            <label>BOS 集成搜索：</label>
                            <SlLookup
                                app="bos"
                                entity="bos_user"
                                formId="bos_user_list"
                                parentPageId="page_001"
                                checkRightAppId="bos"
                                callBackId="callback_001"
                                columns={employeeColumns}
                                showMoreButton
                                placeholder="点击更多或按 F7 打开 BOS 弹窗"
                            />
                        </div>
                    </div>
                    <div className={styles.codeHint}>
                        <code>{`<SlLookup app="bos" entity="bos_user" formId="bos_user_list" parentPageId="page_001" showMoreButton />`}</code>
                    </div>
                </section>

                {/* ===== 案例 14: 表单集成 ===== */}
                <section id="case14" className={styles.section}>
                    <h2>案例 14: 表单集成</h2>
                    <p className={styles.desc}>
                        Lookup 作为表单控件使用，配合其他表单元素组成完整表单。
                    </p>
                    <div className={styles.demoBox}>
                        <div className={styles.formContainer}>
                            <div className={styles.formItem}>
                                <label>订单编号：</label>
                                <SlInput placeholder="请输入订单编号" value="ORD-20260413-001" />
                            </div>
                            <div className={styles.formItem}>
                                <label>员工（F7）：</label>
                                <SlLookup
                                    app="bos"
                                    entity="bos_user"
                                    columns={employeeColumns}
                                    placeholder="请选择员工"
                                    helpText="按名称或编码搜索"
                                />
                            </div>
                            <div className={styles.formItem}>
                                <label>数量：</label>
                                <SlInput type="number" placeholder="请输入数量" value="100" />
                            </div>
                            <div className={styles.formItem}>
                                <label>备注：</label>
                                <SlInput placeholder="请输入备注信息" />
                            </div>
                            <div className={styles.formActions}>
                                <SlButton variant="primary">提交</SlButton>
                                <SlButton variant="default">重置</SlButton>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== 案例 15: CSS Parts 自定义样式 ===== */}
                <section id="case15" className={styles.section}>
                    <h2>案例 15: 通过 CSS Parts 自定义样式</h2>
                    <p className={styles.desc}>
                        使用 <code>::part()</code> 伪元素选择器修改组件内部样式。Lookup 暴露了
                        <code>combobox</code>、<code>display-input</code>、<code>search-button</code>、
                        <code>panel</code>、<code>form-control-label</code> 等 CSS Part。
                    </p>
                    <div className={styles.demoBox}>
                        <div className={styles.demoRow}>
                            <div className={styles.demoItem}>
                                <label>自定义边框与背景：</label>
                                <SlLookup
                                    className={styles.partsCustomBorder}
                                    app="bos"
                                    entity="bos_user"
                                    label="自定义边框"
                                    placeholder="圆角 + 蓝色边框"
                                />
                            </div>
                            <div className={styles.demoItem}>
                                <label>自定义标签与帮助文本：</label>
                                <SlLookup
                                    className={styles.partsCustomLabel}
                                    app="bos"
                                    entity="bos_user"
                                    label="加粗彩色标签"
                                    helpText="自定义帮助文本样式"
                                    placeholder="查看标签与帮助文本"
                                />
                            </div>
                        </div>
                        <div className={styles.demoRow} style={{ marginTop: '16px' }}>
                            <div className={styles.demoItem}>
                                <label>自定义搜索按钮与面板：</label>
                                <SlLookup
                                    className={styles.partsCustomPanel}
                                    app="bos"
                                    entity="bos_user"
                                    label="自定义面板"
                                    placeholder="点击搜索查看面板样式"
                                />
                            </div>
                            <div className={styles.demoItem}>
                                <label>紧凑暗色主题：</label>
                                <SlLookup
                                    className={styles.partsCompactDark}
                                    app="bos"
                                    entity="bos_user"
                                    label="暗色主题"
                                    placeholder="紧凑暗色风格"
                                >
                                    <SlIcon name="search" slot="prefix" />
                                </SlLookup>
                            </div>
                        </div>
                    </div>
                    <div className={styles.codeHint}>
                        <code>{`.my-lookup::part(combobox) { border: 2px solid blue; }\n.my-lookup::part(form-control-label) { font-weight: bold; }\n.my-lookup::part(panel) { box-shadow: 0 8px 24px rgba(0,0,0,.15); }`}</code>
                    </div>
                </section>

                {/* API 参考 */}
                <section className={styles.section}>
                    <h2>API 参考</h2>
                    <h3>Properties</h3>
                    <div className={styles.apiTable}>
                        <table>
                            <thead>
                                <tr>
                                    <th>属性</th>
                                    <th>HTML 属性</th>
                                    <th>类型</th>
                                    <th>默认值</th>
                                    <th>说明</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>name</td><td>name</td><td>string</td><td>''</td><td>表单提交时的字段名</td></tr>
                                <tr><td>value</td><td>value</td><td>string</td><td>''</td><td>当前选中值</td></tr>
                                <tr><td>defaultValue</td><td>-</td><td>string</td><td>''</td><td>表单控制的默认值</td></tr>
                                <tr><td>label</td><td>label</td><td>string</td><td>''</td><td>输入框标签</td></tr>
                                <tr><td>helpText</td><td>help-text</td><td>string</td><td>''</td><td>帮助文本</td></tr>
                                <tr><td>placeholder</td><td>placeholder</td><td>string</td><td>''</td><td>占位提示文本</td></tr>
                                <tr><td>size</td><td>size</td><td>'small' | 'medium' | 'large'</td><td>'medium'</td><td>控件尺寸</td></tr>
                                <tr><td>disabled</td><td>disabled</td><td>boolean</td><td>false</td><td>是否禁用</td></tr>
                                <tr><td>required</td><td>required</td><td>boolean</td><td>false</td><td>是否必填</td></tr>
                                <tr><td>clearable</td><td>clearable</td><td>boolean</td><td>true</td><td>是否显示清除按钮</td></tr>
                                <tr><td>filled</td><td>filled</td><td>boolean</td><td>false</td><td>使用填充样式</td></tr>
                                <tr><td>open</td><td>open</td><td>boolean</td><td>false</td><td>下拉面板是否打开</td></tr>
                                <tr><td>hoist</td><td>hoist</td><td>boolean</td><td>true</td><td>防止面板在 overflow 容器中被裁剪</td></tr>
                                <tr><td>placement</td><td>placement</td><td>'top' | 'bottom' | ...</td><td>'bottom-start'</td><td>面板首选位置</td></tr>
                                <tr><td>multiple</td><td>multiple</td><td>boolean</td><td>false</td><td>是否多选</td></tr>
                                <tr><td>columns</td><td>-</td><td>LookupColumn[]</td><td>[]</td><td>面板列定义</td></tr>
                                <tr><td>results</td><td>-</td><td>LookupResult[]</td><td>[]</td><td>搜索结果数据数组</td></tr>
                                <tr><td>displayFields</td><td>display-fields</td><td>string[]</td><td>['name']</td><td>选中后显示的字段</td></tr>
                                <tr><td>editFields</td><td>edit-fields</td><td>string[]</td><td>['name']</td><td>编辑时显示的字段</td></tr>
                                <tr><td>editStyle</td><td>edit-style</td><td>'button' | 'input'</td><td>'input'</td><td>编辑触发模式</td></tr>
                                <tr><td>separator</td><td>separator</td><td>string</td><td>','</td><td>多字段拼接分隔符</td></tr>
                                <tr><td>debounce</td><td>debounce</td><td>number</td><td>300</td><td>搜索防抖延迟(ms)</td></tr>
                                <tr><td>showAddButton</td><td>show-add-button</td><td>boolean</td><td>true</td><td>显示新增按钮</td></tr>
                                <tr><td>showMoreButton</td><td>show-more-button</td><td>boolean</td><td>true</td><td>显示更多按钮</td></tr>
                                <tr><td>app</td><td>app</td><td>string</td><td>''</td><td>API 应用编码（必填）</td></tr>
                                <tr><td>entity</td><td>entity</td><td>string</td><td>''</td><td>API 实体名称（必填）</td></tr>
                                <tr><td>formId</td><td>form-id</td><td>string</td><td>''</td><td>BOS showconfig 子页面标识</td></tr>
                                <tr><td>parentPageId</td><td>parent-page-id</td><td>string</td><td>''</td><td>BOS showconfig 父页面 ID</td></tr>
                                <tr><td>checkRightAppId</td><td>check-right-app-id</td><td>string</td><td>''</td><td>BOS 权限检查应用 ID</td></tr>
                                <tr><td>callBackId</td><td>call-back-id</td><td>string</td><td>''</td><td>BOS showconfig 回调 ID</td></tr>
                                <tr><td>apiUrl</td><td>api-url</td><td>string</td><td>''</td><td>自定义 API 基础 URL</td></tr>
                                <tr><td>form</td><td>form</td><td>string</td><td>''</td><td>关联的表单 ID</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <h3>Events</h3>
                    <div className={styles.apiTable}>
                        <table>
                            <thead>
                                <tr>
                                    <th>事件名</th>
                                    <th>React 属性</th>
                                    <th>说明</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>sl-lookup-search</td><td>onSlLookupSearch</td><td>点击搜索或输入时触发</td></tr>
                                <tr><td>sl-lookup-change</td><td>onSlLookupChange</td><td>选中项变化时触发</td></tr>
                                <tr><td>sl-lookup-clear</td><td>onSlLookupClear</td><td>点击清除按钮时触发</td></tr>
                                <tr><td>sl-clear</td><td>onSlClear</td><td>清除按钮（向后兼容）</td></tr>
                                <tr><td>sl-lookup-add</td><td>onSlLookupAdd</td><td>点击新增按钮时触发</td></tr>
                                <tr><td>sl-lookup-more</td><td>onSlLookupMore</td><td>点击更多或按 F7 时触发</td></tr>
                                <tr><td>sl-focus</td><td>onSlFocus</td><td>获得焦点时触发</td></tr>
                                <tr><td>sl-blur</td><td>onSlBlur</td><td>失去焦点时触发</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <h3>Public Methods</h3>
                    <div className={styles.apiTable}>
                        <table>
                            <thead>
                                <tr>
                                    <th>方法</th>
                                    <th>返回值</th>
                                    <th>说明</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>show()</td><td>Promise&lt;void&gt;</td><td>显示下拉面板</td></tr>
                                <tr><td>hide()</td><td>Promise&lt;void&gt;</td><td>隐藏下拉面板</td></tr>
                                <tr><td>focus(options?)</td><td>void</td><td>设置焦点</td></tr>
                                <tr><td>blur()</td><td>void</td><td>移除焦点</td></tr>
                                <tr><td>checkValidity()</td><td>boolean</td><td>检查有效性</td></tr>
                                <tr><td>reportValidity()</td><td>boolean</td><td>检查并显示验证消息</td></tr>
                                <tr><td>setCustomValidity(message)</td><td>void</td><td>设置自定义验证消息</td></tr>
                                <tr><td>getForm()</td><td>HTMLFormElement | null</td><td>获取关联表单</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <h3>Slots</h3>
                    <div className={styles.apiTable}>
                        <table>
                            <thead>
                                <tr>
                                    <th>插槽名称</th>
                                    <th>描述</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>label</td><td>标签的插槽</td></tr>
                                <tr><td>prefix</td><td>输入框前的图标或元素</td></tr>
                                <tr><td>suffix</td><td>输入框后的图标或元素</td></tr>
                                <tr><td>search-icon</td><td>搜索按钮图标</td></tr>
                                <tr><td>clear-icon</td><td>清除按钮图标</td></tr>
                                <tr><td>empty</td><td>无结果时显示的内容（默认 '暂无数据'）</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <h3>CSS Parts</h3>
                    <div className={styles.apiTable}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Part 名称</th>
                                    <th>描述</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>form-control</td><td>表单控制顶层容器</td></tr>
                                <tr><td>form-control-label</td><td>标签容器</td></tr>
                                <tr><td>form-control-input</td><td>输入框容器</td></tr>
                                <tr><td>form-control-help-text</td><td>帮助文本容器</td></tr>
                                <tr><td>combobox</td><td>包装前缀、输入框、按钮的容器</td></tr>
                                <tr><td>display-input</td><td>实际的 input 元素</td></tr>
                                <tr><td>clear-button</td><td>清除按钮</td></tr>
                                <tr><td>search-button</td><td>搜索按钮</td></tr>
                                <tr><td>panel</td><td>下拉面板容器</td></tr>
                                <tr><td>panel-header</td><td>面板表头</td></tr>
                                <tr><td>panel-body</td><td>面板主体</td></tr>
                                <tr><td>panel-footer</td><td>面板页脚</td></tr>
                                <tr><td>empty</td><td>空状态区域</td></tr>
                                <tr><td>prefix</td><td>前缀区域</td></tr>
                                <tr><td>suffix</td><td>后缀区域</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}
