import { KingdeeElement, track } from '@kdcloudjs/kwc';

// Shoelace 组件导入
import '@kdcloudjs/shoelace/dist/components/screen/screen.js';
import '@kdcloudjs/shoelace/dist/components/icon/icon.js';
import '@kdcloudjs/shoelace/dist/components/switch/switch.js';
import '@kdcloudjs/shoelace/dist/components/radio-group/radio-group.js';
import '@kdcloudjs/shoelace/dist/components/radio/radio.js';
import '@kdcloudjs/shoelace/dist/components/input/input.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';
import '@kdcloudjs/shoelace/dist/components/card/card.js';
import '@kdcloudjs/shoelace/dist/components/badge/badge.js';
import '@kdcloudjs/shoelace/dist/components/progress-bar/progress-bar.js';

export default class TEST_sl_screen extends KingdeeElement {
    // 当前激活的书签
    @track activeSection = 'case1';

    // 案例6：属性配置面板状态
    @track isStatic = false;
    @track isRemovable = true;
    @track cellHeight = 80;
    @track margin = 14;
    @track columnCount = 12;

    // 案例7：拖拽添加数据
    @track dragScreenData = [];
    _dragCounter = 0;

    // 防止重复绑定和初始化
    _eventsBound = false;
    _screensInitialized = false;
    _dragScreenInitialized = false;

    // 书签导航数据
    get bookmarks() {
        return [
            { id: 'case1', label: '基础用法', icon: 'grid-3x3' },
            { id: 'case2', label: '静态大屏展示', icon: 'lock' },
            { id: 'case3', label: '可删除元素', icon: 'trash' },
            { id: 'case4', label: '自定义配置', icon: 'sliders' },
            { id: 'case5', label: '嵌套内容展示', icon: 'layers' },
            { id: 'case6', label: '属性配置面板', icon: 'gear' },
            { id: 'case7', label: '拖拽添加卡片', icon: 'plus-square' }
        ].map(item => ({
            ...item,
            itemClass: this.activeSection === item.id ? 'bookmark-item active' : 'bookmark-item'
        }));
    }

    // 案例1：基础数据
    get basicData() {
        return [
            { x: 0, y: 0, w: 4, h: 2, content: '<div class="grid-item-content"><h3>指标卡 1</h3><p>销售额：¥128,000</p></div>' },
            { x: 4, y: 0, w: 4, h: 2, content: '<div class="grid-item-content"><h3>指标卡 2</h3><p>订单量：1,234</p></div>' },
            { x: 8, y: 0, w: 4, h: 2, content: '<div class="grid-item-content"><h3>指标卡 3</h3><p>用户数：5,678</p></div>' },
            { x: 0, y: 2, w: 6, h: 3, content: '<div class="grid-item-content chart"><h3>趋势图表</h3><div class="chart-placeholder">图表区域</div></div>' },
            { x: 6, y: 2, w: 6, h: 3, content: '<div class="grid-item-content chart"><h3>数据分布</h3><div class="chart-placeholder">图表区域</div></div>' }
        ];
    }

    // 案例2：静态展示数据
    get staticData() {
        return [
            { x: 0, y: 0, w: 3, h: 2, content: '<div class="grid-item-content info"><sl-icon name="people"></sl-icon><h4>在线用户</h4><span class="number">1,234</span></div>' },
            { x: 3, y: 0, w: 3, h: 2, content: '<div class="grid-item-content info success"><sl-icon name="check-circle"></sl-icon><h4>成功率</h4><span class="number">98.5%</span></div>' },
            { x: 6, y: 0, w: 3, h: 2, content: '<div class="grid-item-content info warning"><sl-icon name="clock"></sl-icon><h4>响应时间</h4><span class="number">120ms</span></div>' },
            { x: 9, y: 0, w: 3, h: 2, content: '<div class="grid-item-content info danger"><sl-icon name="exclamation-triangle"></sl-icon><h4>错误数</h4><span class="number">23</span></div>' },
            { x: 0, y: 2, w: 12, h: 3, content: '<div class="grid-item-content"><h3>监控大屏</h3><p>此为静态展示模式，元素不可拖拽和调整大小</p><div class="chart-placeholder">监控图表区域</div></div>' }
        ];
    }

    // 案例3：可删除元素数据
    get removableData() {
        return [
            { x: 0, y: 0, w: 4, h: 2, content: '<div class="grid-item-content removable"><h4>可删除卡片 1</h4><p>点击右上角删除按钮</p></div>' },
            { x: 4, y: 0, w: 4, h: 2, content: '<div class="grid-item-content removable"><h4>可删除卡片 2</h4><p>点击右上角删除按钮</p></div>' },
            { x: 8, y: 0, w: 4, h: 2, content: '<div class="grid-item-content removable"><h4>可删除卡片 3</h4><p>点击右上角删除按钮</p></div>' },
            { x: 0, y: 2, w: 6, h: 2, content: '<div class="grid-item-content removable"><h4>可删除卡片 4</h4><p>拖拽可调整位置和大小</p></div>' },
            { x: 6, y: 2, w: 6, h: 2, content: '<div class="grid-item-content removable"><h4>可删除卡片 5</h4><p>拖拽可调整位置和大小</p></div>' }
        ];
    }

    // 案例4：自定义配置数据
    get customData() {
        return [
            { x: 0, y: 0, w: 2, h: 1, content: '<div class="grid-item-content custom"><span>A</span></div>' },
            { x: 2, y: 0, w: 2, h: 1, content: '<div class="grid-item-content custom"><span>B</span></div>' },
            { x: 4, y: 0, w: 2, h: 1, content: '<div class="grid-item-content custom"><span>C</span></div>' },
            { x: 0, y: 1, w: 3, h: 2, content: '<div class="grid-item-content custom"><span>D</span></div>' },
            { x: 3, y: 1, w: 3, h: 2, content: '<div class="grid-item-content custom"><span>E</span></div>' }
        ];
    }

    // 案例4：自定义配置options
    get customOptions() {
        return { cellHeight: 100, margin: 20, column: 6 };
    }

    // 案例5：嵌套内容数据
    get nestedData() {
        return [
            { x: 0, y: 0, w: 4, h: 3, content: '<div class="grid-item-content nested"><sl-card><div slot="header">销售统计</div><sl-progress-bar value="75"></sl-progress-bar><p style="margin-top:10px">完成度: 75%</p></sl-card></div>' },
            { x: 4, y: 0, w: 4, h: 3, content: '<div class="grid-item-content nested"><sl-card><div slot="header">订单状态</div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"><sl-badge variant="success">已完成: 128</sl-badge><sl-badge variant="warning">进行中: 45</sl-badge><sl-badge variant="danger">待处理: 12</sl-badge></div></sl-card></div>' },
            { x: 8, y: 0, w: 4, h: 3, content: '<div class="grid-item-content nested"><sl-card><div slot="header">快捷操作</div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"><sl-button variant="primary" size="small">新建</sl-button><sl-button variant="default" size="small">导出</sl-button><sl-button variant="default" size="small">刷新</sl-button></div></sl-card></div>' },
            { x: 0, y: 3, w: 12, h: 2, content: '<div class="grid-item-content nested full"><h3>数据概览</h3><p>此区域可以放置更复杂的图表和数据展示组件</p></div>' }
        ];
    }

    // 案例6：配置面板数据
    get configData() {
        return [
            { x: 0, y: 0, w: 4, h: 2, content: '<div class="grid-item-content config"><h4>模块 A</h4><p>可拖拽调整</p></div>' },
            { x: 4, y: 0, w: 4, h: 2, content: '<div class="grid-item-content config"><h4>模块 B</h4><p>可拖拽调整</p></div>' },
            { x: 8, y: 0, w: 4, h: 2, content: '<div class="grid-item-content config"><h4>模块 C</h4><p>可拖拽调整</p></div>' },
            { x: 0, y: 2, w: 6, h: 2, content: '<div class="grid-item-content config"><h4>模块 D</h4><p>可拖拽调整</p></div>' },
            { x: 6, y: 2, w: 6, h: 2, content: '<div class="grid-item-content config"><h4>模块 E</h4><p>可拖拽调整</p></div>' }
        ];
    }

    // 案例6：当前配置options
    get configOptions() {
        return { cellHeight: this.cellHeight, margin: this.margin, column: this.columnCount };
    }

    // 案例6：静态模式标志
    get configIsStatic() {
        return this.isStatic;
    }

    // 案例6：可删除标志
    get configIsRemovable() {
        return !this.isStatic && this.isRemovable;
    }

    // 案例6：配置JSON显示
    get configDisplayJson() {
        return JSON.stringify({
            static: this.isStatic,
            removable: !this.isStatic && this.isRemovable,
            options: { cellHeight: this.cellHeight, margin: this.margin, column: this.columnCount }
        }, null, 2);
    }

    // 案例6：显示标签
    get staticLabel() {
        return this.isStatic ? '开启' : '关闭';
    }

    get removableLabel() {
        return this.isRemovable ? '开启' : '关闭';
    }

    get cellHeightLabel() {
        return `单元格高度 (Cell Height): ${this.cellHeight}px`;
    }

    get marginLabel() {
        return `边距 (Margin): ${this.margin}px`;
    }

    get columnCountLabel() {
        return `列数 (Column): ${this.columnCount}`;
    }

    // 案例6：列数字符串（用于 radio-group 绑定）
    get columnCountStr() {
        return String(this.columnCount);
    }

    get removableSwitchDisabled() {
        return this.isStatic;
    }

    // 案例7：可拖拽组件列表
    get draggableComponents() {
        return [
            { id: 'indicator', name: '指标卡', icon: 'speedometer2', color: '#667eea', w: 4, h: 2 },
            { id: 'chart', name: '图表组件', icon: 'bar-chart', color: '#f093fb', w: 6, h: 3 },
            { id: 'table', name: '数据表格', icon: 'table', color: '#4facfe', w: 6, h: 3 },
            { id: 'progress', name: '进度组件', icon: 'hourglass-split', color: '#43e97b', w: 4, h: 2 },
            { id: 'status', name: '状态卡片', icon: 'activity', color: '#fa709a', w: 3, h: 2 },
            { id: 'text', name: '文本区块', icon: 'file-text', color: '#a8edea', w: 4, h: 2 }
        ].map(comp => ({
            ...comp,
            sizeLabel: `${comp.w}x${comp.h}`,
            iconStyle: `background: ${comp.color}`,
            itemStyle: `--item-color: ${comp.color}`
        }));
    }

    // 案例7：是否有拖拽数据
    get hasDragData() {
        return this.dragScreenData.length > 0;
    }

    // 案例7：是否显示空状态
    get showEmptyState() {
        return this.dragScreenData.length === 0;
    }

    connectedCallback() {
        // 页面滚动监听
        this._scrollHandler = this.handleScroll.bind(this);
        window.addEventListener('scroll', this._scrollHandler);
    }

    disconnectedCallback() {
        window.removeEventListener('scroll', this._scrollHandler);
        this.unbindShoelaceEvents();
        this._eventsBound = false;
    }

    renderedCallback() {
        // 初始化所有 sl-screen 的 data/options
        if (!this._screensInitialized) {
            this._screensInitialized = true;
            this.initializeScreens();
        }

        // 绑定 Shoelace 事件
        if (!this._eventsBound) {
            this._eventsBound = true;
            this.bindShoelaceEvents();
        }

        // 更新案例6的 screen 数据
        this.updateConfigScreen();

        // 更新案例7的 screen 数据
        this.updateDragScreen();
    }

    // 初始化所有 sl-screen 组件
    initializeScreens() {
        // 案例1：基础用法
        const basicScreen = this.template.querySelector('.screen-basic');
        if (basicScreen) {
            basicScreen.data = this.basicData;
        }

        // 案例2：静态大屏
        const staticScreen = this.template.querySelector('.screen-static');
        if (staticScreen) {
            staticScreen.data = this.staticData;
        }

        // 案例3：可删除元素
        const removableScreen = this.template.querySelector('.screen-removable');
        if (removableScreen) {
            removableScreen.data = this.removableData;
        }

        // 案例4：自定义配置
        const customScreen = this.template.querySelector('.screen-custom');
        if (customScreen) {
            customScreen.data = this.customData;
            customScreen.options = this.customOptions;
        }

        // 案例5：嵌套内容
        const nestedScreen = this.template.querySelector('.screen-nested');
        if (nestedScreen) {
            nestedScreen.data = this.nestedData;
        }

        // 案例6：配置面板
        const configScreen = this.template.querySelector('.screen-config');
        if (configScreen) {
            configScreen.data = this.configData;
            configScreen.options = this.configOptions;
        }
    }

    // 更新案例6的 screen
    updateConfigScreen() {
        const configScreen = this.template.querySelector('.screen-config');
        if (configScreen) {
            configScreen.options = this.configOptions;
            // 动态设置 static 和 removable 属性
            if (this.isStatic) {
                configScreen.setAttribute('static', '');
                configScreen.removeAttribute('removable');
            } else {
                configScreen.removeAttribute('static');
                if (this.isRemovable) {
                    configScreen.setAttribute('removable', '');
                } else {
                    configScreen.removeAttribute('removable');
                }
            }
        }
    }

    // 更新案例7的 screen
    updateDragScreen() {
        const dragScreen = this.template.querySelector('.screen-drag');
        if (dragScreen && this.dragScreenData.length > 0) {
            dragScreen.data = this.dragScreenData;
        }
    }

    // Shoelace 事件绑定配置
    get shoelaceEventBindings() {
        return [
            ['.switch-static', 'sl-change', this.handleStaticChange],
            ['.switch-removable', 'sl-change', this.handleRemovableChange],
            ['.input-cell-height', 'sl-input', this.handleCellHeightInput],
            ['.input-margin', 'sl-input', this.handleMarginInput],
            ['.radio-column', 'sl-change', this.handleColumnChange]
        ];
    }

    bindShoelaceEvents() {
        this._boundHandlers = this.shoelaceEventBindings.map(([selector, event, handler]) => {
            const el = this.template.querySelector(selector);
            if (el) {
                const boundHandler = handler.bind(this);
                el.addEventListener(event, boundHandler);
                return { el, event, boundHandler };
            }
            return null;
        }).filter(Boolean);
    }

    unbindShoelaceEvents() {
        if (this._boundHandlers) {
            this._boundHandlers.forEach(({ el, event, boundHandler }) => {
                el.removeEventListener(event, boundHandler);
            });
            this._boundHandlers = [];
        }
    }

    // 页面滚动监听
    handleScroll() {
        const sections = ['case1', 'case2', 'case3', 'case4', 'case5', 'case6', 'case7'];
        const scrollPosition = window.scrollY + 150;

        for (let i = sections.length - 1; i >= 0; i--) {
            const section = this.template.querySelector(`.${sections[i]}`);
            if (section && section.offsetTop <= scrollPosition) {
                if (this.activeSection !== sections[i]) {
                    this.activeSection = sections[i];
                }
                break;
            }
        }
    }

    // 书签点击
    handleBookmarkClick(event) {
        const target = event.currentTarget;
        const sectionId = target.dataset.sectionId;
        const section = this.template.querySelector(`.${sectionId}`);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            this.activeSection = sectionId;
        }
    }

    // 案例6：控制面板事件
    handleStaticChange(event) {
        this.isStatic = event.target.checked;
    }

    handleRemovableChange(event) {
        this.isRemovable = event.target.checked;
    }

    handleCellHeightInput(event) {
        this.cellHeight = Number(event.target.value);
    }

    handleMarginInput(event) {
        this.margin = Number(event.target.value);
    }

    handleColumnChange(event) {
        this.columnCount = Number(event.target.value);
    }

    // 获取网格数据
    handleGetGridData() {
        const screenRef = this.template.querySelector('.screen-config');
        if (screenRef) {
            const data = screenRef.getGridData();
            alert(`当前网格数据:\n${JSON.stringify(data, null, 2)}`);
        }
    }

    // 案例7：拖拽相关
    handleDragStart(event) {
        const compId = event.currentTarget.dataset.compId;
        event.dataTransfer.setData('text/plain', compId);
        event.dataTransfer.effectAllowed = 'copy';
    }

    handleDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    }

    handleDrop(event) {
        event.preventDefault();
        const componentId = event.dataTransfer.getData('text/plain');
        const component = this.draggableComponents.find(c => c.id === componentId);
        if (component) {
            this._dragCounter += 1;
            const newItem = {
                x: 0,
                y: 0,
                w: component.w,
                h: component.h,
                content: this.getComponentContent(componentId, this._dragCounter)
            };
            this.dragScreenData = [...this.dragScreenData, newItem];
        }
    }

    // 获取组件内容
    getComponentContent(id, counter) {
        const contents = {
            indicator: `<div class="grid-item-content drag-indicator" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                <sl-icon name="speedometer2" style="font-size: 24px; color: #fff;"></sl-icon>
                <h4 style="color: #fff; margin: 8px 0 4px;">指标卡 #${counter}</h4>
                <span style="font-size: 24px; font-weight: bold; color: #fff;">¥128,000</span>
            </div>`,
            chart: `<div class="grid-item-content drag-chart" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                <sl-icon name="bar-chart" style="font-size: 24px; color: #fff;"></sl-icon>
                <h4 style="color: #fff; margin: 8px 0;">图表 #${counter}</h4>
                <div style="height: 60px; background: rgba(255,255,255,0.2); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #fff;">图表区域</div>
            </div>`,
            table: `<div class="grid-item-content drag-table" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                <sl-icon name="table" style="font-size: 24px; color: #fff;"></sl-icon>
                <h4 style="color: #fff; margin: 8px 0;">表格 #${counter}</h4>
                <div style="background: rgba(255,255,255,0.2); border-radius: 4px; padding: 8px; color: #fff; font-size: 12px;">
                    <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.3); padding: 4px 0;">
                        <span>列1</span><span>列2</span><span>列3</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 4px 0;">
                        <span>数据</span><span>数据</span><span>数据</span>
                    </div>
                </div>
            </div>`,
            progress: `<div class="grid-item-content drag-progress" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
                <sl-icon name="hourglass-split" style="font-size: 24px; color: #fff;"></sl-icon>
                <h4 style="color: #fff; margin: 8px 0 4px;">进度 #${counter}</h4>
                <sl-progress-bar value="65" style="--height: 8px;"></sl-progress-bar>
                <span style="color: #fff; font-size: 12px; margin-top: 4px;">完成度: 65%</span>
            </div>`,
            status: `<div class="grid-item-content drag-status" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
                <sl-icon name="activity" style="font-size: 24px; color: #fff;"></sl-icon>
                <h4 style="color: #fff; margin: 8px 0 4px;">状态 #${counter}</h4>
                <sl-badge variant="success">运行中</sl-badge>
            </div>`,
            text: `<div class="grid-item-content drag-text" style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);">
                <sl-icon name="file-text" style="font-size: 24px; color: #333;"></sl-icon>
                <h4 style="color: #333; margin: 8px 0 4px;">文本 #${counter}</h4>
                <p style="color: #666; font-size: 12px; margin: 0;">这是一段描述文本内容...</p>
            </div>`
        };
        return contents[id] || '';
    }

    // 清空大屏
    handleClearScreen() {
        this.dragScreenData = [];
        this._dragCounter = 0;
    }
}
