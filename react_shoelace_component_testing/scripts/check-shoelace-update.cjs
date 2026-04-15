#!/usr/bin/env node
/**
 * KD 开发工具版本更新检测脚本
 * 打开工程时自动运行，检测以下内容：
 * - @kdcloudjs/shoelace（项目依赖）是否有新版本
 * - @kdcloudjs/cli（全局 CLI 工具）是否有新版本
 * - Skills（kwc-lwc-development、kingscript-code-generator）是否定义了版本号
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI 颜色代码
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m'
};

function log(message, color = '') {
    console.log(`${color}${message}${colors.reset}`);
}

function logBox(lines, color = colors.cyan) {
    const maxLen = Math.max(...lines.map(l => l.length));
    const border = '═'.repeat(maxLen + 2);
    
    console.log(`${color}╔${border}╗${colors.reset}`);
    lines.forEach(line => {
        const padding = ' '.repeat(maxLen - line.length);
        console.log(`${color}║${colors.reset} ${line}${padding} ${color}║${colors.reset}`);
    });
    console.log(`${color}╚${border}╝${colors.reset}`);
}

function compareVersions(current, latest) {
    if (!current || !latest) return false;
    const currentParts = current.split('.').map(Number);
    const latestParts = latest.split('.').map(Number);
    
    for (let i = 0; i < 3; i++) {
        if ((latestParts[i] || 0) > (currentParts[i] || 0)) {
            return true; // 有新版本
        }
        if ((latestParts[i] || 0) < (currentParts[i] || 0)) {
            return false;
        }
    }
    return false; // 版本相同
}

function getLatestVersion(packageName) {
    try {
        const result = execSync(`npm view ${packageName} version`, { 
            encoding: 'utf-8',
            stdio: ['pipe', 'pipe', 'pipe']
        });
        return result.trim();
    } catch (error) {
        return null;
    }
}

// 检测项目依赖版本（从 package.json）
function getProjectDepVersion(packageName) {
    try {
        const packageJsonPath = path.join(process.cwd(), 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        
        const version = packageJson.dependencies?.[packageName] 
            || packageJson.devDependencies?.[packageName];
        
        if (!version) return null;
        return version.replace(/^[\^~>=<]+/, '');
    } catch (error) {
        return null;
    }
}

// 检测全局 CLI 版本
function getGlobalCliVersion() {
    try {
        const result = execSync('kd --version', { 
            encoding: 'utf-8',
            stdio: ['pipe', 'pipe', 'pipe']
        });
        // 输出格式可能是 "x.x.x" 或 "kd/x.x.x"
        const match = result.trim().match(/(\d+\.\d+\.\d+)/);
        return match ? match[1] : null;
    } catch (error) {
        return null;
    }
}

// 检测 Shoelace 组件库
function checkShoelace() {
    const packageName = '@kdcloudjs/shoelace';
    log('🔍 检测 Shoelace 组件库版本...', colors.blue);
    
    const currentVersion = getProjectDepVersion(packageName);
    if (!currentVersion) {
        log(`   ⚠️  未找到 ${packageName} 依赖`, colors.yellow);
        return;
    }
    
    const latestVersion = getLatestVersion(packageName);
    if (!latestVersion) {
        log('   ⚠️  无法获取最新版本信息', colors.yellow);
        return;
    }
    
    if (compareVersions(currentVersion, latestVersion)) {
        logBox([
            `🎉 ${packageName} 有新版本可用！`,
            ``,
            `   当前版本: ${currentVersion}`,
            `   最新版本: ${latestVersion}`,
            ``,
            `如需更新，请运行:`,
            `   npm install ${packageName}@latest`
        ], colors.yellow);
    } else {
        log(`   ✅ ${packageName} 已是最新版本 (${currentVersion})`, colors.green);
    }
}

// 检测 KD CLI 工具
function checkKdCli() {
    const packageName = '@kdcloudjs/cli';
    log('🔍 检测 KD CLI 工具版本...', colors.magenta);
    
    const currentVersion = getGlobalCliVersion();
    if (!currentVersion) {
        log(`   ⚠️  未检测到 kd 命令，可能未安装 ${packageName}`, colors.yellow);
        return;
    }
    
    const latestVersion = getLatestVersion(packageName);
    if (!latestVersion) {
        log('   ⚠️  无法获取最新版本信息', colors.yellow);
        return;
    }
    
    if (compareVersions(currentVersion, latestVersion)) {
        logBox([
            `🎉 ${packageName} 有新版本可用！`,
            ``,
            `   当前版本: ${currentVersion}`,
            `   最新版本: ${latestVersion}`,
            ``,
            `如需更新，请运行:`,
            `   npm install -g ${packageName}@latest`,
            `   或: kd update`
        ], colors.yellow);
    } else {
        log(`   ✅ ${packageName} 已是最新版本 (${currentVersion})`, colors.green);
    }
}

// 从 SKILL.md frontmatter 中提取版本号
function getSkillVersion(skillDir) {
    const skillMd = path.join(skillDir, 'SKILL.md');
    if (!fs.existsSync(skillMd)) return null;

    const content = fs.readFileSync(skillMd, 'utf-8');
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch) return null;

    const versionMatch = fmMatch[1].match(/\bversion\s*:\s*(\S+)/);
    return versionMatch ? versionMatch[1] : null;
}

// 检测指定 Skills 是否定义了版本号
function checkSkillsVersion() {
    const skillsDir = path.join(require('os').homedir(), '.agents', 'skills');
    const targetSkills = ['kwc-lwc-development', 'kingscript-code-generator'];

    log('🔍 检测 Skills 版本定义...', colors.blue);

    if (!fs.existsSync(skillsDir)) {
        log(`   ⚠️  未找到 Skills 目录 (${skillsDir})`, colors.yellow);
        return;
    }

    const missing = [];

    for (const name of targetSkills) {
        const dir = path.join(skillsDir, name);
        if (!fs.existsSync(dir)) {
            log(`   ⚠️  未找到 Skill: ${name}`, colors.yellow);
            continue;
        }

        const version = getSkillVersion(dir);
        if (version) {
            log(`   ✅ ${name} (v${version})`, colors.green);
        } else {
            missing.push(name);
        }
    }

    if (missing.length > 0) {
        logBox([
            `⚠️  以下 Skill 未定义版本号:`,
            ``,
            ...missing.map(n => `   • ${n}`),
            ``,
            `建议在 SKILL.md frontmatter 中添加:`,
            `   metadata:`,
            `     version: 1.0.0`
        ], colors.yellow);
    }
}

function main() {
    console.log('');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.cyan);
    log('       KD 开发工具版本检测', colors.cyan);
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.cyan);
    console.log('');
    
    checkShoelace();
    console.log('');
    checkKdCli();
    console.log('');
    checkSkillsVersion();
    
    console.log('');
}

main();
