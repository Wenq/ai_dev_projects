import React, { useState, useCallback, useRef } from 'react';
import { adapterApi } from '@kdcloudjs/kwc-shared-utils/api';
import SlButton from '@kdcloudjs/shoelace/dist/react/button/index.js';
import SlIcon from '@kdcloudjs/shoelace/dist/react/icon/index.js';
import SlSpinner from '@kdcloudjs/shoelace/dist/react/spinner/index.js';
import SlBadge from '@kdcloudjs/shoelace/dist/react/badge/index.js';
import styles from './GetUserCountCtrl.module.scss';

function GetUserCountCtrl({ config }) {
    const [userCount, setUserCount] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const adapterRef = useRef(null);

    const fetchUserCount = useCallback(() => {
        setLoading(true);
        setError('');

        // 断开之前的连接
        if (adapterRef.current) {
            adapterRef.current.disconnect();
        }

        // 使用 adapterApi.doGet 调用后端 controller
        const adapter = adapterApi.doGet(({ data, error: apiError }) => {
            setLoading(false);
            
            if (apiError) {
                setError(apiError.message || '获取人员数量失败');
                return;
            }
            
            // 从响应中提取人员数量
            setUserCount(data?.count ?? 0);
        });

        adapterRef.current = adapter;

        // 配置请求参数
        adapter.update({
            endpointConfig: {
                isv: config?.isvId || 'kdtest',
                app: config?.app || 'kdtest_kwc_wenq',
                source: 'userCount/count',  // 对应 controller URL: /userCount/count
                version: 'v1'
            },
            params: {},
            headers: {}
        });
    }, [config]);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>
                <SlIcon name="people-fill"></SlIcon>
                获取人员数量
            </h2>

            <div className={styles.content}>
                <div className={styles.countDisplay}>
                    <span className={styles.label}>人员数量：</span>
                    {loading ? (
                        <SlSpinner className={styles.spinner}></SlSpinner>
                    ) : userCount !== null ? (
                        <SlBadge variant="primary" pill className={styles.badge}>
                            {userCount}
                        </SlBadge>
                    ) : (
                        <span className={styles.placeholder}>--</span>
                    )}
                </div>

                {error && (
                    <p className={styles.error}>{error}</p>
                )}

                <SlButton
                    variant="primary"
                    size="medium"
                    onClick={fetchUserCount}
                    disabled={loading}
                    loading={loading}
                    className={styles.fetchButton}
                >
                    <SlIcon slot="prefix" name="arrow-clockwise"></SlIcon>
                    获取人员数量
                </SlButton>
            </div>
        </div>
    );
}

export default GetUserCountCtrl;
