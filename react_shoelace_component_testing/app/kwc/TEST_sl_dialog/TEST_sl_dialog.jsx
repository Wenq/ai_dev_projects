import { useState, useEffect } from 'react';
import styles from './TEST_sl_dialog.module.scss';

// 使用 React 包装器方式导入 Shoelace 组件
import {
    SlDialog,
    SlButton,
    SlIcon,
    SlInput,
    SlTextarea,
    SlBadge
} from '@kdcloudjs/shoelace/dist/react';

export default function TEST_sl_dialog(config) {
    // 各案例的对话框开关状态（受控模式）
    const [dialogs, setDialogs] = useState({
        basic: false,
        header: false,
        footer: false,
        noHeader: false,
        form: false,
        nested: false,
        inner: false,
        confirm: false,
        customWidth: false,
        preventClose: false,
        event: false,
        scroll: false,
        maskClosableTrue: false,
        maskClosableFalse: false
    });

    // 打开/关闭对话框的辅助函数
    const openDialog = (name) => setDialogs(prev => ({ ...prev, [name]: true }));
    const closeDialog = (name) => setDialogs(prev => ({ ...prev, [name]: false }));

    // mask-closable 状态跟踪
    const [maskClickCount, setMaskClickCount] = useState({ enabled: 0, disabled: 0 });

    // 书签导航状态
    const [activeSection, setActiveSection] = useState('case1');

    // 表单数据
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    // 事件日志
    const [eventLogs, setEventLogs] = useState([]);

    // 书签导航数据
    const bookmarks = [
        { id: 'case1', label: '基础对话框', icon: 'chat-square' },
        { id: 'case2', label: '自定义标题', icon: 'card-heading' },
        { id: 'case3', label: '自定义底部', icon: 'box-arrow-down' },
        { id: 'case4', label: '无标题对话框', icon: 'x-square' },
        { id: 'case5', label: '表单对话框', icon: 'ui-checks' },
        { id: 'case6', label: '嵌套对话框', icon: 'layers' },
        { id: 'case7', label: '确认对话框', icon: 'question-circle' },
        { id: 'case8', label: '自定义宽度', icon: 'arrows-expand' },
        { id: 'case9', label: '阻止关闭', icon: 'shield-lock' },
        { id: 'case10', label: '事件处理', icon: 'lightning' },
        { id: 'case11', label: '滚动内容', icon: 'file-text' },
        { id: 'case12', label: '禁用遮罩关闭', icon: 'shield-x' }
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
    const logEvent = (eventName, detail) => {
        const timestamp = new Date().toLocaleTimeString();
        setEventLogs(prev => [...prev.slice(-9), `[${timestamp}] ${eventName}: ${JSON.stringify(detail || {})}`]);
    };

    // 处理表单提交
    const handleFormSubmit = () => {
        alert(`表单提交成功！\n姓名：${formData.name}\n邮箱：${formData.email}\n留言：${formData.message}`);
        closeDialog('form');
        setFormData({ name: '', email: '', message: '' });
    };

    // 确认对话框处理
    const handleConfirm = () => {
        alert('您点击了确认！');
        closeDialog('confirm');
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
                <h1 className={styles.title}>Shoelace Dialog 对话框组件示例</h1>

                {/* ===== 案例 1: 基础对话框 ===== */}
                <section id="case1" className={styles.section}>
                    <h2>案例 1: 基础对话框</h2>
                    <p className={styles.desc}>最基本的对话框用法，包含标题和内容</p>
                    <div className={styles.demoBox}>
                        <SlButton variant="primary" onClick={() => openDialog('basic')}>
                            打开基础对话框
                        </SlButton>

                        <SlDialog
                            open={dialogs.basic}
                            label="基础对话框"
                            onSlAfterHide={() => closeDialog('basic')}
                        >
                            这是一个基础对话框的内容。
                            <br /><br />
                            对话框（Dialog）用于向用户展示重要信息或请求用户输入。
                            <SlButton slot="footer" variant="primary" onClick={() => closeDialog('basic')}>
                                关闭
                            </SlButton>
                        </SlDialog>
                    </div>
                </section>

                {/* ===== 案例 2: 自定义标题 ===== */}
                <section id="case2" className={styles.section}>
                    <h2>案例 2: 自定义标题（带图标）</h2>
                    <p className={styles.desc}>使用 slot="label" 自定义标题内容，添加图标等</p>
                    <div className={styles.demoBox}>
                        <SlButton variant="primary" onClick={() => openDialog('header')}>
                            打开自定义标题对话框
                        </SlButton>

                        <SlDialog
                            open={dialogs.header}
                            onSlAfterHide={() => closeDialog('header')}
                        >
                            <div slot="label" className={styles.customHeader}>
                                <SlIcon name="info-circle" className={styles.headerIcon} />
                                <span>系统提示</span>
                            </div>
                            这是一个带有自定义标题的对话框，标题区域可以包含图标、样式等自定义内容。
                            <SlButton slot="footer" variant="primary" onClick={() => closeDialog('header')}>
                                我知道了
                            </SlButton>
                        </SlDialog>
                    </div>
                </section>

                {/* ===== 案例 3: 自定义底部 ===== */}
                <section id="case3" className={styles.section}>
                    <h2>案例 3: 自定义底部按钮</h2>
                    <p className={styles.desc}>使用 slot="footer" 自定义底部操作按钮</p>
                    <div className={styles.demoBox}>
                        <SlButton variant="primary" onClick={() => openDialog('footer')}>
                            打开自定义底部对话框
                        </SlButton>

                        <SlDialog
                            open={dialogs.footer}
                            label="自定义底部"
                            onSlAfterHide={() => closeDialog('footer')}
                        >
                            这个对话框有多个操作按钮，您可以根据需要进行选择。
                            <div slot="footer" className={styles.footerButtons}>
                                <SlButton variant="default" onClick={() => closeDialog('footer')}>
                                    取消
                                </SlButton>
                                <SlButton variant="warning" onClick={() => alert('稍后处理')}>
                                    稍后处理
                                </SlButton>
                                <SlButton variant="primary" onClick={() => { alert('已保存'); closeDialog('footer'); }}>
                                    保存
                                </SlButton>
                            </div>
                        </SlDialog>
                    </div>
                </section>

                {/* ===== 案例 4: 无标题对话框 ===== */}
                <section id="case4" className={styles.section}>
                    <h2>案例 4: 无标题对话框</h2>
                    <p className={styles.desc}>使用 noHeader 属性隐藏标题栏</p>
                    <div className={styles.demoBox}>
                        <SlButton variant="primary" onClick={() => openDialog('noHeader')}>
                            打开无标题对话框
                        </SlButton>

                        <SlDialog
                            open={dialogs.noHeader}
                            noHeader
                            onSlAfterHide={() => closeDialog('noHeader')}
                        >
                            <div className={styles.noHeaderContent}>
                                <SlIcon name="check-circle" className={styles.successIcon} />
                                <h3>操作成功！</h3>
                                <p>您的操作已经成功完成。</p>
                                <SlButton variant="primary" onClick={() => closeDialog('noHeader')}>
                                    确定
                                </SlButton>
                            </div>
                        </SlDialog>
                    </div>
                </section>

                {/* ===== 案例 5: 表单对话框 ===== */}
                <section id="case5" className={styles.section}>
                    <h2>案例 5: 表单对话框</h2>
                    <p className={styles.desc}>在对话框中嵌入表单进行数据输入</p>
                    <div className={styles.demoBox}>
                        <SlButton variant="primary" onClick={() => openDialog('form')}>
                            打开表单对话框
                        </SlButton>

                        <SlDialog
                            open={dialogs.form}
                            label="联系我们"
                            onSlAfterHide={() => closeDialog('form')}
                        >
                            <div className={styles.formContainer}>
                                <div className={styles.formItem}>
                                    <label>姓名</label>
                                    <SlInput
                                        placeholder="请输入您的姓名"
                                        value={formData.name}
                                        onSlInput={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                </div>
                                <div className={styles.formItem}>
                                    <label>邮箱</label>
                                    <SlInput
                                        type="email"
                                        placeholder="请输入您的邮箱"
                                        value={formData.email}
                                        onSlInput={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    />
                                </div>
                                <div className={styles.formItem}>
                                    <label>留言</label>
                                    <SlTextarea
                                        placeholder="请输入您的留言"
                                        rows={3}
                                        value={formData.message}
                                        onSlInput={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div slot="footer" className={styles.footerButtons}>
                                <SlButton variant="default" onClick={() => closeDialog('form')}>
                                    取消
                                </SlButton>
                                <SlButton variant="primary" onClick={handleFormSubmit}>
                                    提交
                                </SlButton>
                            </div>
                        </SlDialog>
                    </div>
                </section>

                {/* ===== 案例 6: 嵌套对话框 ===== */}
                <section id="case6" className={styles.section}>
                    <h2>案例 6: 嵌套对话框</h2>
                    <p className={styles.desc}>在对话框内打开另一个对话框</p>
                    <div className={styles.demoBox}>
                        <SlButton variant="primary" onClick={() => openDialog('nested')}>
                            打开外层对话框
                        </SlButton>

                        <SlDialog
                            open={dialogs.nested}
                            label="外层对话框"
                            onSlAfterHide={() => closeDialog('nested')}
                        >
                            这是外层对话框的内容。点击下方按钮可以打开内层对话框。
                            <br /><br />
                            <SlButton variant="warning" onClick={() => openDialog('inner')}>
                                打开内层对话框
                            </SlButton>

                            <SlDialog
                                open={dialogs.inner}
                                label="内层对话框"
                                onSlAfterHide={() => closeDialog('inner')}
                            >
                                这是内层对话框的内容。
                                <SlButton slot="footer" variant="primary" onClick={() => closeDialog('inner')}>
                                    关闭内层
                                </SlButton>
                            </SlDialog>

                            <SlButton slot="footer" variant="primary" onClick={() => closeDialog('nested')}>
                                关闭外层
                            </SlButton>
                        </SlDialog>
                    </div>
                </section>

                {/* ===== 案例 7: 确认对话框 ===== */}
                <section id="case7" className={styles.section}>
                    <h2>案例 7: 确认对话框</h2>
                    <p className={styles.desc}>常用于删除确认等操作</p>
                    <div className={styles.demoBox}>
                        <SlButton variant="danger" onClick={() => openDialog('confirm')}>
                            <SlIcon slot="prefix" name="trash" />
                            删除项目
                        </SlButton>

                        <SlDialog
                            open={dialogs.confirm}
                            label="确认删除"
                            onSlAfterHide={() => closeDialog('confirm')}
                        >
                            <div className={styles.confirmContent}>
                                <SlIcon name="exclamation-triangle" className={styles.warningIcon} />
                                <p>您确定要删除此项目吗？此操作不可撤销。</p>
                            </div>
                            <div slot="footer" className={styles.footerButtons}>
                                <SlButton variant="default" onClick={() => closeDialog('confirm')}>
                                    取消
                                </SlButton>
                                <SlButton variant="danger" onClick={handleConfirm}>
                                    确认删除
                                </SlButton>
                            </div>
                        </SlDialog>
                    </div>
                </section>

                {/* ===== 案例 8: 自定义宽度 ===== */}
                <section id="case8" className={styles.section}>
                    <h2>案例 8: 自定义宽度</h2>
                    <p className={styles.desc}>通过 CSS 变量自定义对话框宽度</p>
                    <div className={styles.demoBox}>
                        <SlButton variant="primary" onClick={() => openDialog('customWidth')}>
                            打开宽对话框
                        </SlButton>

                        <SlDialog
                            open={dialogs.customWidth}
                            label="自定义宽度对话框"
                            style={{ '--width': '80vw', '--max-width': '1000px' }}
                            onSlAfterHide={() => closeDialog('customWidth')}
                        >
                            <div className={styles.wideContent}>
                                <p>这是一个自定义宽度的对话框，使用 CSS 变量 --width 和 --max-width 来控制宽度。</p>
                                <div className={styles.wideGrid}>
                                    <div className={styles.gridItem}>
                                        <SlIcon name="folder" className={styles.gridIcon} />
                                        <span>文件夹</span>
                                    </div>
                                    <div className={styles.gridItem}>
                                        <SlIcon name="file-earmark" className={styles.gridIcon} />
                                        <span>文档</span>
                                    </div>
                                    <div className={styles.gridItem}>
                                        <SlIcon name="image" className={styles.gridIcon} />
                                        <span>图片</span>
                                    </div>
                                    <div className={styles.gridItem}>
                                        <SlIcon name="music-note" className={styles.gridIcon} />
                                        <span>音频</span>
                                    </div>
                                    <div className={styles.gridItem}>
                                        <SlIcon name="camera-video" className={styles.gridIcon} />
                                        <span>视频</span>
                                    </div>
                                    <div className={styles.gridItem}>
                                        <SlIcon name="archive" className={styles.gridIcon} />
                                        <span>压缩包</span>
                                    </div>
                                </div>
                            </div>
                            <SlButton slot="footer" variant="primary" onClick={() => closeDialog('customWidth')}>
                                关闭
                            </SlButton>
                        </SlDialog>
                    </div>
                </section>

                {/* ===== 案例 9: 阻止关闭 ===== */}
                <section id="case9" className={styles.section}>
                    <h2>案例 9: 阻止关闭（需确认）</h2>
                    <p className={styles.desc}>通过 onSlRequestClose 事件阻止对话框关闭</p>
                    <div className={styles.demoBox}>
                        <SlButton variant="primary" onClick={() => openDialog('preventClose')}>
                            打开需确认关闭的对话框
                        </SlButton>

                        <SlDialog
                            open={dialogs.preventClose}
                            label="重要提示"
                            onSlRequestClose={(e) => {
                                if (e.detail.source === 'overlay' || e.detail.source === 'keyboard') {
                                    e.preventDefault();
                                    alert('请点击底部按钮关闭对话框');
                                }
                            }}
                            onSlAfterHide={() => closeDialog('preventClose')}
                        >
                            <p>此对话框不能通过点击遮罩层或按 ESC 键关闭。</p>
                            <p>您必须点击下方的"我已阅读"按钮来关闭它。</p>
                            <SlButton slot="footer" variant="primary" onClick={() => closeDialog('preventClose')}>
                                我已阅读
                            </SlButton>
                        </SlDialog>
                    </div>
                </section>

                {/* ===== 案例 10: 事件处理 ===== */}
                <section id="case10" className={styles.section}>
                    <h2>案例 10: 事件处理</h2>
                    <p className={styles.desc}>监听对话框的各种事件（查看下方日志）</p>
                    <div className={styles.demoBox}>
                        <SlButton variant="primary" onClick={() => openDialog('event')}>
                            打开事件测试对话框
                        </SlButton>

                        <SlDialog
                            open={dialogs.event}
                            label="事件测试"
                            onSlShow={() => logEvent('sl-show', { message: '对话框即将显示' })}
                            onSlAfterShow={() => logEvent('sl-after-show', { message: '对话框已完全显示' })}
                            onSlHide={() => logEvent('sl-hide', { message: '对话框即将隐藏' })}
                            onSlAfterHide={() => { logEvent('sl-after-hide', { message: '对话框已完全隐藏' }); closeDialog('event'); }}
                            onSlInitialFocus={() => logEvent('sl-initial-focus', { message: '对话框获得初始焦点' })}
                            onSlRequestClose={(e) => logEvent('sl-request-close', { source: e.detail.source })}
                        >
                            尝试通过不同方式关闭对话框（点击遮罩、按 ESC、点击关闭按钮），观察事件日志的变化。
                            <SlButton slot="footer" variant="primary" onClick={() => closeDialog('event')}>
                                关闭
                            </SlButton>
                        </SlDialog>

                        {/* 事件日志显示 */}
                        <div className={styles.eventLog}>
                            <h4>事件日志：</h4>
                            <div className={styles.logContent}>
                                {eventLogs.length === 0 ? (
                                    <p className={styles.noLog}>暂无事件记录，请打开对话框进行测试</p>
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

                {/* ===== 案例 11: 滚动内容 ===== */}
                <section id="case11" className={styles.section}>
                    <h2>案例 11: 滚动内容</h2>
                    <p className={styles.desc}>当内容超出对话框高度时自动显示滚动条</p>
                    <div className={styles.demoBox}>
                        <SlButton variant="primary" onClick={() => openDialog('scroll')}>
                            打开长内容对话框
                        </SlButton>

                        <SlDialog
                            open={dialogs.scroll}
                            label="服务条款"
                            onSlAfterHide={() => closeDialog('scroll')}
                        >
                            <div className={styles.scrollContent}>
                                <h3>第一章 总则</h3>
                                <p>欢迎使用本服务。请仔细阅读以下条款，使用本服务即表示您同意遵守这些条款。</p>
                                
                                <h3>第二章 用户注册</h3>
                                <p>用户在使用本服务前需要注册账号。注册时应提供真实、准确、完整的个人信息。</p>
                                <p>用户应妥善保管账号和密码，因账号密码泄露造成的损失由用户自行承担。</p>
                                
                                <h3>第三章 服务内容</h3>
                                <p>本服务提供的具体内容以实际提供的为准。我们保留随时修改服务内容的权利。</p>
                                <p>服务可能因系统维护、升级等原因暂时中断，我们会尽量提前通知用户。</p>
                                
                                <h3>第四章 用户行为规范</h3>
                                <p>用户在使用本服务时，应遵守相关法律法规，不得利用本服务从事违法活动。</p>
                                <p>用户不得发布违法、违规、侵权等不良信息。</p>
                                
                                <h3>第五章 知识产权</h3>
                                <p>本服务中的所有内容，包括但不限于文字、图片、音频、视频、软件等，其知识产权归我们所有。</p>
                                
                                <h3>第六章 隐私保护</h3>
                                <p>我们重视用户隐私保护，会依法保护用户个人信息。详细内容请参阅隐私政策。</p>
                                
                                <h3>第七章 免责声明</h3>
                                <p>对于因不可抗力或非我们原因造成的服务中断或数据丢失，我们不承担责任。</p>
                                
                                <h3>第八章 条款修改</h3>
                                <p>我们保留修改本条款的权利，修改后的条款将在本页面公布。</p>
                            </div>
                            <div slot="footer" className={styles.footerButtons}>
                                <SlButton variant="default" onClick={() => closeDialog('scroll')}>
                                    不同意
                                </SlButton>
                                <SlButton variant="primary" onClick={() => { alert('感谢您的同意！'); closeDialog('scroll'); }}>
                                    同意并继续
                                </SlButton>
                            </div>
                        </SlDialog>
                    </div>
                </section>

                {/* ===== 案例 12: 禁用遮罩关闭 ===== */}
                <section id="case12" className={styles.section}>
                    <h2>案例 12: maskClosable 属性对比</h2>
                    <p className={styles.desc}>
                        <code>maskClosable</code> 属性控制点击遮罩层是否关闭对话框。
                        默认值为 <code>true</code>（允许点击遮罩关闭）。
                    </p>
                    <div className={styles.demoBox}>
                        <div className={styles.maskClosableDemo}>
                            {/* 左侧：默认允许遮罩关闭 */}
                            <div className={styles.maskClosableCard}>
                                <div className={styles.maskClosableHeader}>
                                    <SlIcon name="check-circle" className={styles.enabledIcon} />
                                    <span>maskClosable={'{true}'} (默认)</span>
                                </div>
                                <p className={styles.maskClosableDesc}>点击遮罩层可以关闭对话框</p>
                                <div className={styles.maskClosableStats}>
                                    <span>遮罩点击关闭次数：</span>
                                    <SlBadge variant="primary">{maskClickCount.enabled}</SlBadge>
                                </div>
                                <SlButton variant="primary" onClick={() => openDialog('maskClosableTrue')}>
                                    打开对话框
                                </SlButton>
                            </div>

                            {/* 右侧：禁用遮罩关闭 */}
                            <div className={styles.maskClosableCard}>
                                <div className={styles.maskClosableHeader}>
                                    <SlIcon name="x-circle" className={styles.disabledIcon} />
                                    <span>maskClosable={'{false}'}</span>
                                </div>
                                <p className={styles.maskClosableDesc}>点击遮罩层不会关闭对话框</p>
                                <div className={styles.maskClosableStats}>
                                    <span>尝试点击遮罩次数：</span>
                                    <SlBadge variant="neutral">{maskClickCount.disabled}</SlBadge>
                                </div>
                                <SlButton variant="warning" onClick={() => openDialog('maskClosableFalse')}>
                                    打开对话框
                                </SlButton>
                            </div>
                        </div>

                        {/* 重置按钮 */}
                        {(maskClickCount.enabled > 0 || maskClickCount.disabled > 0) && (
                            <SlButton 
                                size="small" 
                                variant="text" 
                                onClick={() => setMaskClickCount({ enabled: 0, disabled: 0 })}
                            >
                                <SlIcon slot="prefix" name="arrow-counterclockwise" />
                                重置计数
                            </SlButton>
                        )}

                        {/* 对话框 1：允许遮罩关闭 */}
                        <SlDialog
                            open={dialogs.maskClosableTrue}
                            label="允许遮罩关闭"
                            maskClosable={true}
                            onSlRequestClose={(e) => {
                                if (e.detail.source === 'overlay') {
                                    setMaskClickCount(prev => ({ ...prev, enabled: prev.enabled + 1 }));
                                }
                            }}
                            onSlAfterHide={() => closeDialog('maskClosableTrue')}
                        >
                            <div className={styles.confirmContent}>
                                <SlIcon name="check-circle" className={styles.successIcon} />
                                <div>
                                    <p><strong>maskClosable={'{true}'}</strong></p>
                                    <p>这是默认行为。</p>
                                    <p>试试点击对话框外部的灰色遮罩层，对话框会关闭。</p>
                                </div>
                            </div>
                            <SlButton slot="footer" variant="primary" onClick={() => closeDialog('maskClosableTrue')}>
                                关闭
                            </SlButton>
                        </SlDialog>

                        {/* 对话框 2：禁用遮罩关闭 */}
                        <SlDialog
                            open={dialogs.maskClosableFalse}
                            label="禁用遮罩关闭"
                            maskClosable={false}
                            onSlRequestClose={(e) => {
                                if (e.detail.source === 'overlay') {
                                    setMaskClickCount(prev => ({ ...prev, disabled: prev.disabled + 1 }));
                                }
                            }}
                            onSlAfterHide={() => closeDialog('maskClosableFalse')}
                        >
                            <div className={styles.confirmContent}>
                                <SlIcon name="shield-x" className={styles.warningIcon} />
                                <div>
                                    <p><strong>maskClosable={'{false}'}</strong></p>
                                    <p>试试点击对话框外部的灰色遮罩层，对话框不会关闭。</p>
                                    <p>只能通过以下方式关闭：</p>
                                    <ul>
                                        <li>点击右上角关闭按钮</li>
                                        <li>按下 ESC 键</li>
                                        <li>点击底部关闭按钮</li>
                                    </ul>
                                </div>
                            </div>
                            <SlButton slot="footer" variant="primary" onClick={() => closeDialog('maskClosableFalse')}>
                                关闭对话框
                            </SlButton>
                        </SlDialog>

                        {/* 代码示例 */}
                        <div className={styles.codeExample}>
                            <h4>代码示例</h4>
                            <pre className={styles.codeBlock}>{`// 允许点击遮罩关闭（默认行为）
<SlDialog open={isOpen} maskClosable={true}>...</SlDialog>

// 禁止点击遮罩关闭
<SlDialog open={isOpen} maskClosable={false}>...</SlDialog>`}</pre>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}
