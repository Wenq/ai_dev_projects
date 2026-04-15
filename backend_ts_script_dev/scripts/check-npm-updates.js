#!/usr/bin/env node

/**
 * NPM 包更新检查脚本
 * 检查指定包的最新版本，与本地版本对比，并发送通知
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// 要监控的包列表
const PACKAGES_TO_CHECK = [
    '@kdcloudjs/shoelace',
    '@kdcloudjs/cli'
];

// 项目根目录（可根据需要修改）
const PROJECT_ROOT = process.cwd();

/**
 * 获取本地安装的包版本
 */
function getLocalVersion(packageName) {
    try {
        const packageJsonPath = join(PROJECT_ROOT, 'package.json');
        if (!existsSync(packageJsonPath)) {
            return null;
        }
        
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
        const deps = {
            ...packageJson.dependencies,
            ...packageJson.devDependencies,
            ...packageJson.peerDependencies
        };
        
        const version = deps[packageName];
        if (!version) return null;
        
        // 移除版本前缀 (^, ~, >=, 等)
        return version.replace(/^[\^~>=<]+/, '');
    } catch {
        return null;
    }
}

/**
 * 获取 npm registry 上的最新版本信息
 */
function getRemoteVersionInfo(packageName) {
    try {
        const result = execSync(`npm view ${packageName} --json`, { 
            encoding: 'utf-8',
            stdio: ['pipe', 'pipe', 'pipe']
        });
        const data = JSON.parse(result);
        return {
            latest: data['dist-tags']?.latest || data.version,
            time: data.time?.[data['dist-tags']?.latest] || data.time?.[data.version] || 'unknown'
        };
    } catch {
        return null;
    }
}

/**
 * 格式化日期
 */
function formatDate(dateStr) {
    if (!dateStr || dateStr === 'unknown') return '未知';
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * 发送 macOS 通知
 */
function sendNotification(title, message) {
    try {
        const escapedTitle = title.replace(/"/g, '\\"');
        const escapedMessage = message.replace(/"/g, '\\"');
        execSync(`osascript -e 'display notification "${escapedMessage}" with title "${escapedTitle}"'`);
    } catch {
        // 忽略通知失败
    }
}

/**
 * 比较版本号
 */
function isNewerVersion(remote, local) {
    if (!local || !remote) return false;
    const r = remote.split('.').map(Number);
    const l = local.split('.').map(Number);
    for (let i = 0; i < Math.max(r.length, l.length); i++) {
        const rv = r[i] || 0;
        const lv = l[i] || 0;
        if (rv > lv) return true;
        if (rv < lv) return false;
    }
    return false;
}

/**
 * 主函数
 */
async function main() {
    console.log('='.repeat(60));
    console.log('📦 NPM 包更新检查');
    console.log(`🕐 检查时间: ${new Date().toLocaleString('zh-CN')}`);
    console.log('='.repeat(60));
    console.log();

    const updates = [];

    for (const pkg of PACKAGES_TO_CHECK) {
        console.log(`检查: ${pkg}`);
        
        const localVersion = getLocalVersion(pkg);
        const remoteInfo = getRemoteVersionInfo(pkg);
        
        if (!remoteInfo) {
            console.log(`  ❌ 无法获取远程版本信息\n`);
            continue;
        }

        const hasUpdate = isNewerVersion(remoteInfo.latest, localVersion);
        const statusIcon = hasUpdate ? '🆕' : '✅';
        
        console.log(`  ${statusIcon} 最新版本: ${remoteInfo.latest}`);
        console.log(`  📅 发布时间: ${formatDate(remoteInfo.time)}`);
        console.log(`  💻 本地版本: ${localVersion || '未安装'}`);
        
        if (hasUpdate) {
            console.log(`  ⚡ 有新版本可用！`);
            updates.push({
                name: pkg,
                local: localVersion || '未安装',
                remote: remoteInfo.latest,
                time: formatDate(remoteInfo.time)
            });
        }
        console.log();
    }

    // 发送通知
    if (updates.length > 0) {
        const title = `${updates.length} 个包有更新`;
        const message = updates.map(u => `${u.name}: ${u.local} → ${u.remote}`).join('\n');
        sendNotification(title, message);
        console.log('📢 已发送系统通知');
    } else {
        console.log('✨ 所有包都是最新版本');
    }

    console.log('='.repeat(60));
}

main().catch(console.error);
