import React, { useState, useCallback } from 'react';
import SlButton from '@kdcloudjs/shoelace/dist/react/button/index.js';
import SlInput from '@kdcloudjs/shoelace/dist/react/input/index.js';
import SlTextarea from '@kdcloudjs/shoelace/dist/react/textarea/index.js';
import SlCard from '@kdcloudjs/shoelace/dist/react/card/index.js';
import SlIcon from '@kdcloudjs/shoelace/dist/react/icon/index.js';
import SlSpinner from '@kdcloudjs/shoelace/dist/react/spinner/index.js';
import SlAlert from '@kdcloudjs/shoelace/dist/react/alert/index.js';
import SlSelect from '@kdcloudjs/shoelace/dist/react/select/index.js';
import SlOption from '@kdcloudjs/shoelace/dist/react/option/index.js';
import SlDivider from '@kdcloudjs/shoelace/dist/react/divider/index.js';
import styles from './ServerCommTest.module.scss';

function ServerCommTest() {
    const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');
    const [method, setMethod] = useState('GET');
    const [requestBody, setRequestBody] = useState('{\n  "title": "Test Post",\n  "body": "This is a test",\n  "userId": 1\n}');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [statusCode, setStatusCode] = useState(null);
    const [responseTime, setResponseTime] = useState(null);

    const sendRequest = useCallback(async () => {
        setLoading(true);
        setError('');
        setResponse('');
        setStatusCode(null);
        setResponseTime(null);

        const startTime = performance.now();

        try {
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            if (method !== 'GET' && method !== 'HEAD') {
                options.body = requestBody;
            }

            const res = await fetch(url, options);
            const endTime = performance.now();
            setResponseTime(Math.round(endTime - startTime));
            setStatusCode(res.status);

            const contentType = res.headers.get('content-type');
            let data;
            if (contentType && contentType.includes('application/json')) {
                data = await res.json();
                setResponse(JSON.stringify(data, null, 2));
            } else {
                data = await res.text();
                setResponse(data);
            }
        } catch (err) {
            setError(err.message || 'Request failed');
        } finally {
            setLoading(false);
        }
    }, [url, method, requestBody]);

    const clearAll = () => {
        setResponse('');
        setError('');
        setStatusCode(null);
        setResponseTime(null);
    };

    const getStatusVariant = () => {
        if (!statusCode) return 'neutral';
        if (statusCode >= 200 && statusCode < 300) return 'success';
        if (statusCode >= 400) return 'danger';
        return 'warning';
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>
                <SlIcon name="hdd-network" style={{ marginRight: 'var(--sl-spacing-small)' }}></SlIcon>
                服务端通信测试
            </h1>

            <SlCard className={styles.requestCard}>
                <div slot="header" className={styles.cardHeader}>
                    <SlIcon name="send"></SlIcon>
                    <span>请求配置</span>
                </div>

                <div className={styles.formGroup}>
                    <div className={styles.urlRow}>
                        <SlSelect
                            value={method}
                            onSlChange={(e) => setMethod(e.target.value)}
                            className={styles.methodSelect}
                        >
                            <SlOption value="GET">GET</SlOption>
                            <SlOption value="POST">POST</SlOption>
                            <SlOption value="PUT">PUT</SlOption>
                            <SlOption value="DELETE">DELETE</SlOption>
                            <SlOption value="PATCH">PATCH</SlOption>
                        </SlSelect>

                        <SlInput
                            className={styles.urlInput}
                            placeholder="输入请求 URL"
                            value={url}
                            onSlInput={(e) => setUrl(e.target.value)}
                        ></SlInput>
                    </div>
                </div>

                {method !== 'GET' && method !== 'HEAD' && (
                    <div className={styles.formGroup}>
                        <label className={styles.label}>请求体 (JSON)</label>
                        <SlTextarea
                            className={styles.textarea}
                            rows={6}
                            value={requestBody}
                            onSlInput={(e) => setRequestBody(e.target.value)}
                            placeholder="输入 JSON 请求体"
                        ></SlTextarea>
                    </div>
                )}

                <div className={styles.buttonGroup}>
                    <SlButton
                        variant="primary"
                        size="large"
                        onClick={sendRequest}
                        disabled={loading || !url}
                        loading={loading}
                    >
                        <SlIcon slot="prefix" name="play-fill"></SlIcon>
                        发送请求
                    </SlButton>
                    <SlButton
                        variant="default"
                        size="large"
                        onClick={clearAll}
                    >
                        <SlIcon slot="prefix" name="trash"></SlIcon>
                        清空
                    </SlButton>
                </div>
            </SlCard>

            <SlCard className={styles.responseCard}>
                <div slot="header" className={styles.cardHeader}>
                    <SlIcon name="reception-4"></SlIcon>
                    <span>响应结果</span>
                    {statusCode && (
                        <span className={`${styles.statusBadge} ${styles[getStatusVariant()]}`}>
                            {statusCode}
                        </span>
                    )}
                    {responseTime && (
                        <span className={styles.timeBadge}>
                            {responseTime}ms
                        </span>
                    )}
                </div>

                {loading && (
                    <div className={styles.loadingContainer}>
                        <SlSpinner style={{ fontSize: '3rem' }}></SlSpinner>
                        <p>请求中...</p>
                    </div>
                )}

                {error && (
                    <SlAlert variant="danger" open>
                        <SlIcon slot="icon" name="exclamation-octagon"></SlIcon>
                        <strong>请求失败</strong>
                        <p>{error}</p>
                    </SlAlert>
                )}

                {response && !loading && (
                    <pre className={styles.responseBody}>{response}</pre>
                )}

                {!response && !loading && !error && (
                    <div className={styles.placeholder}>
                        <SlIcon name="inbox" style={{ fontSize: '3rem' }}></SlIcon>
                        <p>发送请求后在此查看响应</p>
                    </div>
                )}
            </SlCard>

            <SlDivider></SlDivider>

            <div className={styles.presetSection}>
                <h3>快捷测试 API</h3>
                <div className={styles.presetButtons}>
                    <SlButton
                        size="small"
                        onClick={() => {
                            setMethod('GET');
                            setUrl('https://jsonplaceholder.typicode.com/posts/1');
                        }}
                    >
                        GET Post
                    </SlButton>
                    <SlButton
                        size="small"
                        onClick={() => {
                            setMethod('GET');
                            setUrl('https://jsonplaceholder.typicode.com/users');
                        }}
                    >
                        GET Users
                    </SlButton>
                    <SlButton
                        size="small"
                        onClick={() => {
                            setMethod('POST');
                            setUrl('https://jsonplaceholder.typicode.com/posts');
                            setRequestBody('{\n  "title": "New Post",\n  "body": "Post content here",\n  "userId": 1\n}');
                        }}
                    >
                        POST Create
                    </SlButton>
                    <SlButton
                        size="small"
                        onClick={() => {
                            setMethod('PUT');
                            setUrl('https://jsonplaceholder.typicode.com/posts/1');
                            setRequestBody('{\n  "id": 1,\n  "title": "Updated Title",\n  "body": "Updated body",\n  "userId": 1\n}');
                        }}
                    >
                        PUT Update
                    </SlButton>
                    <SlButton
                        size="small"
                        onClick={() => {
                            setMethod('DELETE');
                            setUrl('https://jsonplaceholder.typicode.com/posts/1');
                        }}
                    >
                        DELETE Post
                    </SlButton>
                </div>
            </div>
        </div>
    );
}

export default ServerCommTest;
