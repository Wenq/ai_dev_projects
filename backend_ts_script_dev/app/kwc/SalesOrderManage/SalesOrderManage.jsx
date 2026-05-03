import React, { useState, useCallback, useEffect, useRef } from 'react';
import { adapterApi } from '@kdcloudjs/kwc-shared-utils/api';
import SlButton from '@kdcloudjs/shoelace/dist/react/button/index.js';
import SlIcon from '@kdcloudjs/shoelace/dist/react/icon/index.js';
import SlInput from '@kdcloudjs/shoelace/dist/react/input/index.js';
import SlSpinner from '@kdcloudjs/shoelace/dist/react/spinner/index.js';
import SlBadge from '@kdcloudjs/shoelace/dist/react/badge/index.js';
import SlTable from '@kdcloudjs/shoelace/dist/react/table/index.js';
import SlCard from '@kdcloudjs/shoelace/dist/react/card/index.js';
import SlSelect from '@kdcloudjs/shoelace/dist/react/select/index.js';
import SlOption from '@kdcloudjs/shoelace/dist/react/option/index.js';
import SlAlert from '@kdcloudjs/shoelace/dist/react/alert/index.js';
import SlDivider from '@kdcloudjs/shoelace/dist/react/divider/index.js';
import SlTextarea from '@kdcloudjs/shoelace/dist/react/textarea/index.js';
import styles from './SalesOrderManage.module.scss';

/** 状态码 → 显示配置 */
const STATUS_CONFIG = {
    A: { variant: 'neutral', label: '暂存' },
    B: { variant: 'warning', label: '已提交' },
    C: { variant: 'success', label: '已审核' },
    D: { variant: 'danger', label: '已关闭' }
};

/** SlTable 列定义 */
const TABLE_COLUMNS = [
    { dataIndex: 'billno', title: '单据编号' },
    { dataIndex: 'billstatusName', title: '单据状态', slot: true },
    { dataIndex: 'kdtest_datefield', title: '日期' },
    { dataIndex: 'kdtest_textfield4', title: '文本4' },
    { dataIndex: 'kdtest_integerfield1', title: '整数1' },
    { dataIndex: 'kdtest_decimalfield1', title: '小数1' },
    { dataIndex: 'creator', title: '创建人' },
    { dataIndex: 'createtime', title: '创建时间' },
    { dataIndex: 'action', title: '操作', slot: true },
];

/** 表单初始值 */
const EMPTY_FORM = {
    id: '',
    billno: '',
    billstatus: 'A',
    kdtest_textfield4: '',
    kdtest_textfield5: '',
    kdtest_integerfield1: '',
    kdtest_integerfield2: '',
    kdtest_decimalfield1: '',
    kdtest_bigintfield1: '',
    kdtest_textareafield: '',
    kdtest_largetextfield: '',
    kdtest_datefield: '',
    kdtest_datetimefield: '',
};

function SalesOrderManage({ config }) {
    // ---- 列表状态 ----
    const [orders, setOrders] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // ---- 表单状态 ----
    const [showForm, setShowForm] = useState(false);
    const [formMode, setFormMode] = useState('create');
    const [formData, setFormData] = useState({ ...EMPTY_FORM });
    const [formLoading, setFormLoading] = useState(false);
    const [editSysInfo, setEditSysInfo] = useState(null); // 编辑时的系统信息

    // ---- 删除确认 ----
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const queryAdapterRef = useRef(null);

    // ---- 通用 endpointConfig ----
    const getEndpointConfig = useCallback((source) => ({
        isv: config?.isvId || 'kdtest',
        app: config?.moduleId || 'kdtest_kwc_wenq',
        source: `salesOrderManage/${source}`,
        version: 'v1'
    }), [config]);

    // ---- 查询订单列表 ----
    const fetchOrders = useCallback((searchPage) => {
        const currentPage = searchPage || page;
        setLoading(true);
        setError('');

        if (queryAdapterRef.current) {
            queryAdapterRef.current.disconnect();
        }

        const adapter = adapterApi.doGet(({ data, error: apiError }) => {
            setLoading(false);
            if (apiError) {
                setError(apiError.message || '查询销售订单失败');
                return;
            }
            const rawData = typeof data?.data === 'string' ? JSON.parse(data.data) : data?.data;
            const list = Array.isArray(rawData) ? rawData : [];
            setOrders(list);
            setTotal(typeof data?.total === 'number' ? data.total : 0);
        });

        queryAdapterRef.current = adapter;

        adapter.update({
            endpointConfig: getEndpointConfig('query'),
            params: { keyword, page: currentPage, pageSize },
            headers: {}
        });
    }, [config, keyword, page, pageSize, getEndpointConfig]);

    useEffect(() => { fetchOrders(1); }, []);
    useEffect(() => {
        return () => { if (queryAdapterRef.current) queryAdapterRef.current.disconnect(); };
    }, []);

    const handleSearch = useCallback(() => { setPage(1); fetchOrders(1); }, [fetchOrders]);
    const handlePageChange = useCallback((newPage) => { setPage(newPage); fetchOrders(newPage); }, [fetchOrders]);

    // ---- 打开新增表单 ----
    const handleCreate = useCallback(() => {
        setFormMode('create');
        setFormData({ ...EMPTY_FORM, kdtest_datefield: new Date().toISOString().split('T')[0] });
        setEditSysInfo(null);
        setShowForm(true);
        setSuccessMsg('');
    }, []);

    // ---- 打开编辑表单 ----
    const handleEdit = useCallback((order) => {
        setFormMode('edit');
        setFormData({
            id: order.id,
            billno: order.billno,
            billstatus: order.billstatus,
            kdtest_textfield4: order.kdtest_textfield4 || '',
            kdtest_textfield5: order.kdtest_textfield5 || '',
            kdtest_integerfield1: order.kdtest_integerfield1 || '',
            kdtest_integerfield2: order.kdtest_integerfield2 || '',
            kdtest_decimalfield1: order.kdtest_decimalfield1 || '',
            kdtest_bigintfield1: order.kdtest_bigintfield1 || '',
            kdtest_textareafield: order.kdtest_textareafield || '',
            kdtest_largetextfield: order.kdtest_largetextfield || '',
            kdtest_datefield: order.kdtest_datefield || '',
            kdtest_datetimefield: order.kdtest_datetimefield || '',
        });
        setEditSysInfo({
            creator: order.creator,
            modifier: order.modifier,
            auditor: order.auditor,
            auditdate: order.auditdate,
            createtime: order.createtime,
            modifytime: order.modifytime,
        });
        setShowForm(true);
        setSuccessMsg('');
    }, []);

    // ---- 提交表单 ----
    const handleSubmit = useCallback(() => {
        if (!formData.billno) { setError('单据编号不能为空'); return; }
        setFormLoading(true);
        setError('');

        const source = formMode === 'create' ? 'create' : 'update';
        const adapter = adapterApi.doPost(({ data, error: apiError }) => {
            setFormLoading(false);
            if (apiError) { setError(apiError.message || (formMode === 'create' ? '新增失败' : '修改失败')); return; }
            setSuccessMsg(formMode === 'create' ? '新增销售订单成功' : '修改销售订单成功');
            setShowForm(false);
            fetchOrders(page);
        });

        adapter.update({
            endpointConfig: getEndpointConfig(source),
            params: { ...formData },
            headers: { 'Content-Type': 'application/json' }
        });
    }, [formData, formMode, fetchOrders, page, getEndpointConfig]);

    // ---- 删除订单 ----
    const handleDelete = useCallback((order) => { setDeleteConfirm(order); setSuccessMsg(''); }, []);
    const confirmDelete = useCallback(() => {
        if (!deleteConfirm) return;
        setLoading(true);
        setError('');

        const adapter = adapterApi.doPost(({ data, error: apiError }) => {
            setLoading(false);
            if (apiError) { setError(apiError.message || '删除失败'); return; }
            setSuccessMsg('删除销售订单成功');
            setDeleteConfirm(null);
            fetchOrders(page);
        });

        adapter.update({
            endpointConfig: getEndpointConfig('delete'),
            params: { id: deleteConfirm.id },
            headers: { 'Content-Type': 'application/json' }
        });
    }, [deleteConfirm, fetchOrders, page, getEndpointConfig]);

    const totalPages = Math.ceil(total / pageSize) || 1;

    /** 表单字段变更 */
    const updateField = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

    return (
        <div className={styles.page}>
            {(successMsg || error) && (
                <div className={styles.alertArea}>
                    {successMsg && (
                        <SlAlert variant="success" open closable onSlAfterHide={() => setSuccessMsg('')}>
                            <SlIcon slot="icon" name="check2-circle" />
                            {successMsg}
                        </SlAlert>
                    )}
                    {error && (
                        <SlAlert variant="danger" open closable onSlAfterHide={() => setError('')}>
                            <SlIcon slot="icon" name="exclamation-octagon" />
                            {error}
                        </SlAlert>
                    )}
                </div>
            )}

            {/* 主内容卡片 */}
            <div className={styles.mainCard}>
                {/* 卡片头部：标题 + 新增按钮 */}
                <div className={styles.cardHeader}>
                    <h2 className={styles.title}>
                        <SlIcon name="receipt" />
                        销售订单管理
                    </h2>
                    <SlButton variant="primary" size="small" onClick={handleCreate}>
                        <SlIcon slot="prefix" name="plus-lg" />
                        新增订单
                    </SlButton>
                </div>
                {/* 工具栏 */}
                <div className={styles.toolbar}>
                    <SlInput className={styles.searchInput} placeholder="搜索单据编号..." value={keyword}
                        size="small"
                        onSlInput={(e) => setKeyword(e.target.value)} clearable onSlClear={() => setKeyword('')}>
                        <SlIcon name="search" slot="prefix" />
                    </SlInput>
                    <SlButton variant="default" size="small" onClick={handleSearch} loading={loading}>
                        <SlIcon slot="prefix" name="search" />查询
                    </SlButton>
                    <SlButton variant="default" size="small" onClick={() => { setKeyword(''); setPage(1); fetchOrders(1); }}>
                        <SlIcon slot="prefix" name="arrow-clockwise" />刷新
                    </SlButton>
                </div>

            {/* 数据表格 */}
            <SlTable
                rowKey="id"
                columns={TABLE_COLUMNS}
                dataSource={orders.map(o => ({
                    ...o,
                    kdtest_datefield: o.kdtest_datefield || '-',
                    kdtest_textfield4: o.kdtest_textfield4 || '-',
                    kdtest_integerfield1: o.kdtest_integerfield1 || '-',
                    kdtest_decimalfield1: o.kdtest_decimalfield1 || '-',
                    creator: o.creator || '-',
                    createtime: o.createtime || '-',
                }))
                }
                loading={loading}
                pagination={{
                    total,
                    currentPage: page,
                    pageSize,
                    position: 'bottomEnd',
                }}
                onChange={(e) => {
                    const detail = e.detail;
                    if (detail.changeType === 'pagination' && detail.pagination) {
                        const newPage = detail.pagination.pageNumber || 1;
                        setPage(newPage);
                        fetchOrders(newPage);
                    }
                }}
            >
                {/* 状态列 slot */}
                {orders.map((order) => {
                    const statusCfg = STATUS_CONFIG[order.billstatus] || STATUS_CONFIG.A;
                    return (
                        <span key={`status-${order.id}`} slot={`custom-cell-billstatusName-${order.id}`}>
                            <SlBadge variant={statusCfg.variant} pill>{statusCfg.label}</SlBadge>
                        </span>
                    );
                })}
                {/* 操作列 slot */}
                {orders.map((order) => (
                    <span key={`action-${order.id}`} slot={`custom-cell-action-${order.id}`} className={styles.actionCell}>
                        <SlButton size="small" variant="text" onClick={() => handleEdit(order)}>
                            编辑
                        </SlButton>
                        <SlButton size="small" variant="text" style={{ color: 'var(--sl-color-danger-600)' }} onClick={() => handleDelete(order)}>
                            删除
                        </SlButton>
                    </span>
                ))}
            </SlTable>
            </div>

            {/* 新增/编辑表单弹层 */}
            {showForm && (
                <div className={styles.modalOverlay} onClick={() => setShowForm(false)}>
                    <SlCard className={styles.formCard} onClick={(e) => e.stopPropagation()}>
                        <div slot="header" className={styles.formHeader}>
                            <SlIcon name={formMode === 'create' ? 'plus-circle' : 'pencil-square'} />
                            <span>{formMode === 'create' ? '新增销售订单' : '编辑销售订单'}</span>
                        </div>

                        <div className={styles.formBody}>
                            {/* ---- 必录字段区 ---- */}
                            <div className={styles.formSection}>
                                <h4 className={styles.sectionTitle}>基本信息</h4>
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>单据编号 <span className={styles.required}>*</span></label>
                                        <SlInput value={formData.billno} onSlInput={(e) => updateField('billno', e.target.value)}
                                            placeholder="请输入单据编号" disabled={formMode === 'edit'} required />
                                    </div>
                                    {formMode === 'edit' && (
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>单据状态 <span className={styles.required}>*</span></label>
                                            <SlSelect value={formData.billstatus} onSlChange={(e) => updateField('billstatus', e.target.value)}>
                                                <SlOption value="A">暂存</SlOption>
                                                <SlOption value="B">已提交</SlOption>
                                                <SlOption value="C">已审核</SlOption>
                                                <SlOption value="D">已关闭</SlOption>
                                            </SlSelect>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <SlDivider />

                            {/* ---- 日期字段区 ---- */}
                            <div className={styles.formSection}>
                                <h4 className={styles.sectionTitle}>日期信息</h4>
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>日期</label>
                                        <SlInput type="date" value={formData.kdtest_datefield}
                                            onSlInput={(e) => updateField('kdtest_datefield', e.target.value)} />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>长日期1</label>
                                        <SlInput type="datetime-local" value={formData.kdtest_datetimefield}
                                            onSlInput={(e) => updateField('kdtest_datetimefield', e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            <SlDivider />

                            {/* ---- 数值字段区 ---- */}
                            <div className={styles.formSection}>
                                <h4 className={styles.sectionTitle}>数值信息</h4>
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>整数1</label>
                                        <SlInput type="number" value={formData.kdtest_integerfield1}
                                            onSlInput={(e) => updateField('kdtest_integerfield1', e.target.value)} placeholder="请输入整数" />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>整数2</label>
                                        <SlInput type="number" value={formData.kdtest_integerfield2}
                                            onSlInput={(e) => updateField('kdtest_integerfield2', e.target.value)} placeholder="请输入整数" />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>小数1</label>
                                        <SlInput type="number" value={formData.kdtest_decimalfield1} step="0.01"
                                            onSlInput={(e) => updateField('kdtest_decimalfield1', e.target.value)} placeholder="请输入小数" />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>长整数1</label>
                                        <SlInput type="number" value={formData.kdtest_bigintfield1}
                                            onSlInput={(e) => updateField('kdtest_bigintfield1', e.target.value)} placeholder="请输入长整数" />
                                    </div>
                                </div>
                            </div>

                            <SlDivider />

                            {/* ---- 文本字段区 ---- */}
                            <div className={styles.formSection}>
                                <h4 className={styles.sectionTitle}>文本信息</h4>
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>文本4</label>
                                        <SlInput value={formData.kdtest_textfield4}
                                            onSlInput={(e) => updateField('kdtest_textfield4', e.target.value)} placeholder="请输入文本" />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>wenq5</label>
                                        <SlInput value={formData.kdtest_textfield5}
                                            onSlInput={(e) => updateField('kdtest_textfield5', e.target.value)} placeholder="请输入文本" />
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>多行文本</label>
                                    <SlTextarea value={formData.kdtest_textareafield} rows={3}
                                        onSlInput={(e) => updateField('kdtest_textareafield', e.target.value)} placeholder="请输入多行文本" />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>大文本</label>
                                    <SlTextarea value={formData.kdtest_largetextfield} rows={3}
                                        onSlInput={(e) => updateField('kdtest_largetextfield', e.target.value)} placeholder="请输入大文本" />
                                </div>
                            </div>

                            {/* ---- 编辑模式下展示系统信息 ---- */}
                            {formMode === 'edit' && editSysInfo && (
                                <>
                                    <SlDivider />
                                    <div className={styles.formSection}>
                                        <h4 className={styles.sectionTitle}>系统信息（只读）</h4>
                                        <div className={styles.sysInfoGrid}>
                                            <div className={styles.sysInfoItem}>
                                                <span className={styles.sysLabel}>创建人</span>
                                                <span className={styles.sysValue}>{editSysInfo.creator || '-'}</span>
                                            </div>
                                            <div className={styles.sysInfoItem}>
                                                <span className={styles.sysLabel}>创建时间</span>
                                                <span className={styles.sysValue}>{editSysInfo.createtime || '-'}</span>
                                            </div>
                                            <div className={styles.sysInfoItem}>
                                                <span className={styles.sysLabel}>修改人</span>
                                                <span className={styles.sysValue}>{editSysInfo.modifier || '-'}</span>
                                            </div>
                                            <div className={styles.sysInfoItem}>
                                                <span className={styles.sysLabel}>修改时间</span>
                                                <span className={styles.sysValue}>{editSysInfo.modifytime || '-'}</span>
                                            </div>
                                            <div className={styles.sysInfoItem}>
                                                <span className={styles.sysLabel}>审核人</span>
                                                <span className={styles.sysValue}>{editSysInfo.auditor || '-'}</span>
                                            </div>
                                            <div className={styles.sysInfoItem}>
                                                <span className={styles.sysLabel}>审核日期</span>
                                                <span className={styles.sysValue}>{editSysInfo.auditdate || '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className={styles.formFooter}>
                            <SlButton variant="default" onClick={() => setShowForm(false)}>取消</SlButton>
                            <SlButton variant="primary" onClick={handleSubmit} loading={formLoading} disabled={formLoading}>
                                <SlIcon slot="prefix" name="check-lg" />
                                {formMode === 'create' ? '新增' : '保存'}
                            </SlButton>
                        </div>
                    </SlCard>
                </div>
            )}

            {/* 删除确认弹层 */}
            {deleteConfirm && (
                <div className={styles.modalOverlay} onClick={() => setDeleteConfirm(null)}>
                    <SlCard className={styles.confirmCard} onClick={(e) => e.stopPropagation()}>
                        <div slot="header" className={styles.confirmHeader}>
                            <SlIcon name="exclamation-triangle" /><span>确认删除</span>
                        </div>
                        <p className={styles.confirmText}>
                            确定要删除订单 <strong>{deleteConfirm.billno}</strong> 吗？此操作不可撤销。
                        </p>
                        <SlDivider />
                        <div className={styles.formFooter}>
                            <SlButton variant="default" onClick={() => setDeleteConfirm(null)}>取消</SlButton>
                            <SlButton variant="danger" onClick={confirmDelete} loading={loading}>
                                <SlIcon slot="prefix" name="trash" />确认删除
                            </SlButton>
                        </div>
                    </SlCard>
                </div>
            )}
        </div>
    );
}

export default SalesOrderManage;
