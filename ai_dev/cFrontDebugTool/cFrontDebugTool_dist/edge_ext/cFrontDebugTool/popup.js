document.addEventListener('DOMContentLoaded', function () {
  console.log('Popup initialized'); // 添加初始化日志

  // Debug模式按钮
  document.getElementById('debugBtn').addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentUrl = new URL(tabs[0].url);
      const urlParams = new URLSearchParams(currentUrl.search);

      // 检查是否已存在调试参数
      if (!urlParams.has('kdweb_debug')) {
        const hasQuery = currentUrl.search !== '';
        currentUrl.search += (hasQuery ? '&' : '?') + 'kdweb_debug=true';
        // 在新标签页打开调试URL
        chrome.tabs.create({ url: currentUrl.href, index: tabs[0].index + 1 });
      }
    });
  });

  // 旧开发平台按钮（根据当前页面生成新URL）
  document.getElementById('oldPlatform').addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      try {
        const currentUrl = new URL(tabs[0].url);
        // 构建新URL（保留协议/域名/端口/路径，重置参数）
        const newUrl = `${currentUrl.origin}${currentUrl.pathname}?formId=pc_devportal_main`;
        chrome.tabs.create({ url: newUrl, index: tabs[0].index + 1 });
      } catch (e) {
        console.error('URL解析失败:', e);
      }
    });
  });

  // 新开发平台按钮（根据当前页面生成新URL）
  document.getElementById('newPlatform').addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      try {
        const currentUrl = new URL(tabs[0].url);
        // 构建新URL（保留协议/域名/端口/路径，重置参数）
        const newUrl = `${currentUrl.origin}${currentUrl.pathname}?formId=bos_devpn_portal_grid`;
        chrome.tabs.create({ url: newUrl, index: tabs[0].index + 1 });
      } catch (e) {
        console.error('URL解析失败:', e);
      }
    });
  });

  // 新增运行单据按钮
  document.getElementById('previewForm').addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // 获取用户选中的文本
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          return window.getSelection().toString().replace(/[^\w]/g, '');
        }
      }, ([selection]) => {
        try {
          const defaultFormId = selection?.result || '';
          const formId = prompt('请输入要预览单据的formId（标识）：', defaultFormId);
          
          if (formId) {
            const currentUrl = new URL(tabs[0].url);
            const newUrl = `${currentUrl.origin}${currentUrl.pathname}?formId=${encodeURIComponent(formId)}`;
            chrome.tabs.create({
              url: newUrl,
              index: tabs[0].index + 1
            });
          }
        } catch (e) {
          console.error('表单打开失败:', e);
        }
      });
    });
  });

  // 运行移动端单据按钮
  document.getElementById('previewMobileForm').addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // 获取用户选中的文本
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          return window.getSelection().toString().replace(/[^\w]/g, '');
        }
      }, ([selection]) => {
        try {
          const defaultFormId = selection?.result || '';
          const formId = prompt('请输入要预览mobile单据的formId（标识）：', defaultFormId);
          
          if (formId) {
            const currentUrl = new URL(tabs[0].url);
            const newUrl = `${currentUrl.origin}${currentUrl.pathname}mobile.html#/form/${encodeURIComponent(formId)}`;
            chrome.tabs.create({ url: newUrl, index: tabs[0].index + 1 });
          }
        } catch (e) {
          console.error('表单打开失败:', e);
        }
      });
    });
  });


  // 存储配置的键名
  const STORAGE_KEY = 'kdweb_cdn_value';

  // 挂载本地环境按钮
  document.getElementById('loadLocalEnv').addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.storage.local.get([STORAGE_KEY], function (result) {
        const cachedValue = result[STORAGE_KEY];
        const currentUrl = new URL(tabs[0].url);

        if (cachedValue) {
          applyCdnConfig(currentUrl, cachedValue, tabs[0].index);
        } else {
          const userInput = prompt('请输入本地环境CDN地址：', 'http://localhost:3000/');
          if (userInput) {
            chrome.storage.local.set({ [STORAGE_KEY]: userInput }, function () {
              applyCdnConfig(currentUrl, userInput, tabs[0].index);
            });
          }
        }
      });
    });
  });

  // 设置按钮
  document.getElementById('localSettingsBtn').addEventListener('click', function () {
    //   alert('按钮点击成功'); // 先测试是否能触发点击事件
    chrome.storage.local.get([STORAGE_KEY], function (result) {
      const userInput = prompt('设置本地环境CDN地址：', result[STORAGE_KEY] || 'http://localhost:8080/ierp/feature_dev');
      if (userInput) {
        chrome.storage.local.set({ [STORAGE_KEY]: userInput });
      }
    });
  });

  // 公共处理函数
  function applyCdnConfig(currentUrl, cdnValue, tabIndex) {
    currentUrl.searchParams.set('kdweb_cdn', cdnValue);
    chrome.tabs.create({
      url: currentUrl.href,
      index: tabIndex + 1
    });
  }

  // 在DOMContentLoaded回调中添加
  const dropdownBtn = document.getElementById('openTestEnv');
  const dropdownMenu = document.querySelector('.dropdown-menu');

  // 生成下拉项
  Object.entries(ENVIRONMENTS).forEach(([key, env]) => {
    const li = document.createElement('li');
    li.textContent = env.des;
    li.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.create({
          url: env.address,
          index: tabs[0].index + 1
        });
      });
    });
    dropdownMenu.appendChild(li);
  });

  // 切换下拉菜单
  dropdownBtn.addEventListener('click', () => {
    document.querySelector('.dropdown').classList.toggle('active');
  });

  // 点击外部关闭
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
    }
  });

});

// 在DOMContentLoaded回调中添加
const mountBtn = document.getElementById('mountTestEnv');
const mountMenu = mountBtn.nextElementSibling;

// 生成下拉项
Object.entries(ENVIRONMENTS).forEach(([key, env]) => {
  const li = document.createElement('li');
  li.textContent = env.des;
  li.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      try {
        const currentUrl = new URL(tabs[0].url);
        currentUrl.searchParams.set('kdweb_cdn', env.address);
        chrome.tabs.create({
          url: currentUrl.href,
          index: tabs[0].index + 1
        });
      } catch (e) {
        console.error('URL处理失败:', e);
      }
    });
  });
  mountMenu.appendChild(li);
});

// 切换下拉菜单（复用原有逻辑）
mountBtn.addEventListener('click', (e) => {
  // 移除 e.stopPropagation() 以允许事件冒泡
  document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
  mountBtn.parentElement.classList.add('active');
});