// 环境配置常量
const ENVIRONMENTS = {
    dev:
    {
        address: 'https://feature.kingdee.com:1026/feature_dev/',
        des: '平台分支(feature_dev)'
    },
    sit:
    {
        address: 'https://feature.kingdee.com:1026/feature_sit/',
        des: '平台主干(feature_sit)'
    },
    bos_baseline_smoke:
    {
        address: 'https://feature.kingdee.com:2019/bos_baseline_smoke/',
        des: '平台基线冒烟(bos_baseline_smoke)'
    }
    ,
    bos_baseline_a:
    {
        address: 'https://feature.kingdee.com:1026/bos_baseline_a/',
        des: '平台基线(bos_baseline_a)'
    },
    baseline_a:
    {
        address: 'https://feature.kingdee.com:2024/baseline_a/',
        des: '业务基线(baseline_a)'
    }
};

// 平台配置常量
const PLATFORM_CONFIG = {
    HOSTNAME: 'feature.kingdee.com',
    PORT: '1026'
};
