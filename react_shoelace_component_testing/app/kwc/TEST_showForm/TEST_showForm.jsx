import styles from './TEST_showForm.module.scss';
import { SlButton, SlCard, SlIcon, SlInput, SlSelect, SlOption, SlDivider } from '@kdcloudjs/shoelace/dist/react';
import { useState } from 'react';
import { showForm } from '@kdcloudjs/kwc-shared-utils/sendBosPlatformEvent';

// 打开方式选项
const openStyleOptions = [
    { value: '0', label: '当前页打开（默认）', showType: 0 },
    { value: '10', label: '新浏览器页签打开', showType: 10 },
    { value: '6', label: '模态弹窗打开', showType: 6 },
];

export default function TEST_showForm() {
    const [formId, setFormId] = useState('kdtest_ziduan01'); //sit环境上单据
    const [openStyle, setOpenStyle] = useState('10');
    const [version, setVersion] = useState('v1');
    const [isv, setIsv] = useState('kd');
    const [app, setApp] = useState('bos');

    // 处理 showForm 调用
    const handleShowForm = () => {
        const selectedStyle = openStyleOptions.find(opt => opt.value === openStyle);
        
        const formConfig = {
            formId: formId,
            parentPageId: '',
            params: {
                openStyle: { showType: selectedStyle?.showType || 10 }
            }
        };

        const config = {
            version: version,
            isv: isv,
            app: app
        };

        showForm(formConfig, config);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>
                <SlIcon name="window-stack" />
                showForm - 打开苍穹表单
            </h2>
            
            <p className={styles.description}>
                <code>showForm</code> 指令用于展示另一个表单，是苍穹平台 KWC 组件与后端交互的核心能力之一。
            </p>

            <SlDivider />

            {/* 配置区域 */}
            <div className={styles.configSection}>
                <SlCard className={styles.configCard}>
                    <div slot="header" className={styles.cardHeader}>
                        <SlIcon name="gear" />
                        表单配置 (formConfig) - 【打开的表单及方式】
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label>formId - 表单标识</label>
                        <SlInput 
                            value={formId}
                            placeholder="输入要打开的表单ID"
                            onSlInput={(e) => setFormId(e.target.value)}
                        />
                        <span className={styles.hint}>需要打开的目标表单的 formId</span>
                    </div>

                    <div className={styles.formGroup}>
                        <label>openStyle - 打开方式</label>
                        <SlSelect 
                            value={openStyle}
                            onSlChange={(e) => setOpenStyle(e.target.value)}
                        >
                            {openStyleOptions.map(opt => (
                                <SlOption key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SlOption>
                            ))}
                        </SlSelect>
                        <span className={styles.hint}>showType: 0=当前页, 6=模态弹窗, 10=新页签</span>
                    </div>
                </SlCard>

                <SlCard className={styles.configCard}>
                    <div slot="header" className={styles.cardHeader}>
                        <SlIcon name="sliders" />
                        接口配置 (config) - 【服务端访问路径】
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label>version - 接口版本</label>
                        <SlInput 
                            value={version}
                            placeholder="v1"
                            onSlInput={(e) => setVersion(e.target.value)}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>isv - ISV标识</label>
                        <SlInput 
                            value={isv}
                            placeholder="kd"
                            onSlInput={(e) => setIsv(e.target.value)}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>app - 应用标识</label>
                        <SlInput 
                            value={app}
                            placeholder="bos"
                            onSlInput={(e) => setApp(e.target.value)}
                        />
                    </div>
                </SlCard>
            </div>

            <SlDivider />

            {/* 操作按钮 */}
            <div className={styles.actionSection}>
                <SlButton variant="primary" size="large" onClick={handleShowForm}>
                    <SlIcon slot="prefix" name="box-arrow-up-right" />
                    调用 showForm 打开表单
                </SlButton>
            </div>

            <SlDivider />

            {/* 代码示例 */}
            <SlCard className={styles.codeCard}>
                <div slot="header" className={styles.cardHeader}>
                    <SlIcon name="code-slash" />
                    代码示例 (LWC 写法)
                </div>
                <pre className={styles.codeBlock}>
{`import { KingdeeElement } from '@kdcloudjs/kwc';
import { showForm } from 'kingdee/sendBosPlatformEvent';

export default class OpenForm extends KingdeeElement {
    handleClick() {
        const formConfig = {
            formId: '${formId}',
            parentPageId: '',
            params: {
                openStyle: { showType: ${openStyleOptions.find(o => o.value === openStyle)?.showType || 10} }
            }
        };

        const config = {
            version: '${version}',
            isv: '${isv}',
            app: '${app}'
        };

        showForm(formConfig, config);
    }
}`}
                </pre>
            </SlCard>

            {/* API 说明 */}
            <SlCard className={styles.apiCard}>
                <div slot="header" className={styles.cardHeader}>
                    <SlIcon name="book" />
                    API 说明
                </div>
                <div className={styles.apiContent}>
                    <h4>showForm(formConfig, config)</h4>
                    <table className={styles.apiTable}>
                        <thead>
                            <tr>
                                <th>参数</th>
                                <th>字段</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td rowSpan={3}>formConfig</td>
                                <td>formId</td>
                                <td>需要打开的表单标识</td>
                            </tr>
                            <tr>
                                <td>parentPageId</td>
                                <td>当前页面的 pageId（可选）</td>
                            </tr>
                            <tr>
                                <td>params.openStyle.showType</td>
                                <td>打开方式：0=当前页，6=弹窗，10=新页签</td>
                            </tr>
                            <tr>
                                <td rowSpan={3}>config</td>
                                <td>version</td>
                                <td>接口版本，如 "v1"</td>
                            </tr>
                            <tr>
                                <td>isv</td>
                                <td>ISV 标识，如 "kd"</td>
                            </tr>
                            <tr>
                                <td>app</td>
                                <td>应用标识，如 "bos"</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </SlCard>
        </div>
    );
}
