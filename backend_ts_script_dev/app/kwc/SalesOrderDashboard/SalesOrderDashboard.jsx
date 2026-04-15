import React, { useState, useCallback, useEffect, useRef } from 'react';
import { adapterApi } from '@kdcloudjs/kwc-shared-utils/api';
import SlCard from '@kdcloudjs/shoelace/dist/react/card/index.js';
import SlIcon from '@kdcloudjs/shoelace/dist/react/icon/index.js';
import SlSpinner from '@kdcloudjs/shoelace/dist/react/spinner/index.js';
import SlButton from '@kdcloudjs/shoelace/dist/react/button/index.js';
import SlBadge from '@kdcloudjs/shoelace/dist/react/badge/index.js';
import styles from './SalesOrderDashboard.module.scss';

/** 状态码 → 图标 & 颜色变体 */
const STATUS_CONFIG = {
  A: { icon: 'file-earmark',       variant: 'neutral',  label: '暂存' },
  B: { icon: 'send',               variant: 'warning',  label: '已提交' },
  C: { icon: 'check-circle',       variant: 'success',  label: '已审核' },
  D: { icon: 'lock',               variant: 'danger',   label: '已关闭' },
};

function SalesOrderDashboard({ config }) {
  // ---- state ----
  const [summary, setSummary] = useState([]);
  const [total, setTotal] = useState(0);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const summaryAdapterRef = useRef(null);
  const trendAdapterRef = useRef(null);

  // ---- 请求状态统计 ----
  const fetchStatusSummary = useCallback(() => {
    if (summaryAdapterRef.current) {
      summaryAdapterRef.current.disconnect();
    }

    const adapter = adapterApi.doGet(({ data, error: apiError }) => {
      if (apiError) {
        setError((prev) => prev + (prev ? '; ' : '') + (apiError.message || '获取状态统计失败'));
        return;
      }
      const rawSummary = typeof data?.summary === 'string' ? JSON.parse(data.summary) : data?.summary;
      const list = Array.isArray(rawSummary) ? rawSummary : [];
      setSummary(list);
      setTotal(typeof data?.total === 'number' ? data.total : 0);
    });

    summaryAdapterRef.current = adapter;

    adapter.update({
      endpointConfig: {
        isv: config?.isvId || 'kdtest',
        app: config?.app || 'kdtest_kwc_wenq',
        source: 'salesDashboard/statusSummary',
        version: 'v1',
      },
    });
  }, [config]);

  // ---- 请求趋势数据 ----
  const fetchSalesTrend = useCallback(() => {
    if (trendAdapterRef.current) {
      trendAdapterRef.current.disconnect();
    }

    const adapter = adapterApi.doGet(({ data, error: apiError }) => {
      if (apiError) {
        setError((prev) => prev + (prev ? '; ' : '') + (apiError.message || '获取趋势数据失败'));
        return;
      }
      const rawTrend = typeof data?.trend === 'string' ? JSON.parse(data.trend) : data?.trend;
      const list = Array.isArray(rawTrend) ? rawTrend : [];
      setTrend(list);
    });

    trendAdapterRef.current = adapter;

    adapter.update({
      endpointConfig: {
        isv: config?.isvId || 'kdtest',
        app: config?.app || 'kdtest_kwc_wenq',
        source: 'salesDashboard/salesTrend',
        version: 'v1',
      },
    });
  }, [config]);

  // ---- 统一刷新 ----
  const refresh = useCallback(() => {
    setLoading(true);
    setError('');
    setSummary([]);
    setTrend([]);
    fetchStatusSummary();
    fetchSalesTrend();
    // 简单延迟关闭 loading（两个请求均为异步回调）
    setTimeout(() => setLoading(false), 800);
  }, [fetchStatusSummary, fetchSalesTrend]);

  // 首次加载
  useEffect(() => {
    refresh();
  }, [refresh]);

  // ---- 趋势图计算 ----
  const maxCount = Math.max(...trend.map((t) => t.count), 1);

  return (
    <div className={styles.container}>
      {/* 标题栏 */}
      <div className={styles.header}>
        <h2 className={styles.title}>
          <SlIcon name="bar-chart-line" />
          费用申请单仪表盘
        </h2>
        <SlButton variant="default" size="small" onClick={refresh} loading={loading}>
          <SlIcon slot="prefix" name="arrow-clockwise" />
          刷新
        </SlButton>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {/* ===== 统计卡片区域 ===== */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>按单据状态统计</h3>

        <div className={styles.cardGrid}>
          {/* 总计卡片 */}
          <SlCard className={styles.statCard}>
            <div className={styles.cardInner}>
              <SlIcon name="clipboard-data" className={styles.cardIcon} />
              <div className={styles.cardInfo}>
                <span className={styles.cardLabel}>全部申请单</span>
                <span className={styles.cardCount}>{loading ? <SlSpinner /> : total}</span>
              </div>
            </div>
          </SlCard>

          {/* 各状态卡片 */}
          {Object.keys(STATUS_CONFIG).map((statusCode) => {
            const cfg = STATUS_CONFIG[statusCode];
            const item = summary.find((s) => s.status === statusCode);
            const count = item ? item.count : 0;

            return (
              <SlCard key={statusCode} className={styles.statCard}>
                <div className={styles.cardInner}>
                  <SlIcon name={cfg.icon} className={styles.cardIcon} />
                  <div className={styles.cardInfo}>
                    <span className={styles.cardLabel}>{cfg.label}</span>
                    <span className={styles.cardCount}>
                      {loading ? (
                        <SlSpinner />
                      ) : (
                        <SlBadge variant={cfg.variant} pill>
                          {count}
                        </SlBadge>
                      )}
                    </span>
                  </div>
                </div>
              </SlCard>
            );
          })}
        </div>
      </section>

      {/* ===== 趋势图区域 ===== */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>最近 1 年费用申请趋势</h3>

        {loading ? (
          <div className={styles.chartLoading}>
            <SlSpinner />
          </div>
        ) : (
          <div className={styles.chart}>
            <div className={styles.bars}>
              {trend.map((item) => {
                const heightPct = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                return (
                  <div key={item.date} className={styles.barGroup}>
                    <span className={styles.barValue}>{item.count}</span>
                    <div
                      className={styles.bar}
                      style={{ height: `${heightPct}%` }}
                      title={`${item.date}: ${item.count} 单`}
                    />
                    <span className={styles.barLabel}>
                      {item.date || ''}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default SalesOrderDashboard;
