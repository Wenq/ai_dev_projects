---
name: "shoelace-components"
description: "在UI页面开发或组件开发时，使用@kdcloudjs/shoelace库中的基础组件。当需要开发界面或组件时调用。"
---

# Shoelace 组件使用指南

## 功能描述

该技能用于指导在UI页面开发或组件开发时，使用@kdcloudjs/shoelace库中的基础组件，确保界面开发的一致性和高效性。

## 使用场景

- 当需要开发UI页面时
- 当需要开发组件时
- 当需要使用基础UI组件时

## 组件库引入方式

### CDN引入

```html
<!-- 引入样式 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@kdcloudjs/shoelace/dist/themes/light.css">

<!-- 引入组件 -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@kdcloudjs/shoelace/dist/shoelace.js"></script>
```

### NPM引入

```bash
npm install @kdcloudjs/shoelace
```

## 常用组件示例

### 按钮 (Button)

```html
<sl-button variant="primary">主要按钮</sl-button>
<sl-button variant="default">默认按钮</sl-button>
<sl-button variant="ghost">幽灵按钮</sl-button>
<sl-button variant="danger">危险按钮</sl-button>

<!-- 带图标按钮 -->
<sl-button variant="primary">
  <sl-icon slot="prefix" name="check-lg"></sl-icon>
  保存
</sl-button>

<!-- 小尺寸按钮 -->
<sl-button variant="primary" size="small">保存</sl-button>
```

### 输入框 (Input)

```html
<sl-input placeholder="请输入内容" label="输入框"></sl-input>

<!-- 带图标的输入框 -->
<sl-input placeholder="请输入URL">
  <sl-icon slot="prefix" name="link"></sl-icon>
</sl-input>

<!-- 禁用状态 -->
<sl-input placeholder="请输入内容" disabled></sl-input>
```

### 选择器 (Select)

```html
<sl-select label="选择项">
  <sl-option value="option1">选项1</sl-option>
  <sl-option value="option2">选项2</sl-option>
  <sl-option value="option3">选项3</sl-option>
</sl-select>

<!-- 带默认值 -->
<sl-select value="option2">
  <sl-option value="option1">选项1</sl-option>
  <sl-option value="option2">选项2</sl-option>
  <sl-option value="option3">选项3</sl-option>
</sl-select>
```

### 复选框 (Checkbox)

```html
<sl-checkbox>同意协议</sl-checkbox>

<!-- 选中状态 -->
<sl-checkbox checked>已选中</sl-checkbox>

<!-- 禁用状态 -->
<sl-checkbox disabled>禁用状态</sl-checkbox>
```

### 图标 (Icon)

```html
<sl-icon name="check"></sl-icon>
<sl-icon name="x"></sl-icon>
<sl-icon name="info-circle"></sl-icon>
<sl-icon name="warning"></sl-icon>
<sl-icon name="gear"></sl-icon>
<sl-icon name="search"></sl-icon>
<sl-icon name="download"></sl-icon>
<sl-icon name="upload"></sl-icon>
<sl-icon name="user"></sl-icon>
<sl-icon name="bell"></sl-icon>
```

## 组件样式定制

### 自定义主题色

```html
<sl-button variant="primary" style="--sl-color-primary-600: #5b6ee1;">紫色按钮</sl-button>
```

### 自定义尺寸

```html
<sl-input style="max-width: 300px;"></sl-input>
```

## 最佳实践

1. **保持一致性**：在整个项目中使用相同的组件风格和配置
2. **响应式设计**：确保组件在不同屏幕尺寸下正常显示
3. **可访问性**：使用组件的accessibility属性，确保界面对所有用户可用
4. **性能优化**：按需引入组件，避免一次性加载所有组件
5. **文档参考**：参考官方文档了解组件的完整功能和属性

## 注意事项

- 确保正确引入组件库的样式和脚本
- 注意组件的属性和事件用法
- 合理使用组件的插槽(slot)功能
- 注意组件的版本兼容性

## 参考文档

- [Shoelace 官方文档](https://shoelace.style/)
- [@kdcloudjs/shoelace 文档](https://www.npmjs.com/package/@kdcloudjs/shoelace)