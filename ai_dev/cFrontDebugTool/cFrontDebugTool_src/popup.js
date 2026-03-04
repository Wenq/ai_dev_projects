// 存储配置的键名
const STORAGE_KEY = 'kdweb_cdn_value';
// 公共参数常量
const KCDC_PARAM = 'kdcdc';
const DEBUG_PARAM = 'kdweb_debug';  // 新增调试参数常量
const CDN_PARAM = 'kdweb_cdn';      // 新增CDN参数常量
// 在文件顶部添加checkbox变量声明
let debugCheckbox;

document.addEventListener('DOMContentLoaded', function () {
  console.log('Popup initialized'); // 添加初始化日志

  // 获取文档信息
  document.getElementById('getTechArticleInfo').addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // 新增域名检测逻辑
      const currentUrl = new URL(tabs[0].url);
      if (currentUrl.host !== 'fd.kingdee.com:9001') {
        alert('非苍穹前端技术文档页面，无法提取相关信息');
        return;
      }

      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {

          //文档标题
          let titleId = 'magicdomid2';
          //文档操作记录表
          let recodeDomId1 = 'magicdomid3';
          let recodeDomId2 = 'magicdomid4';
          let recodeDomId = recodeDomId1;
          if (document.querySelector('#' + recodeDomId1 + ' table.table tr:nth-child(2) td:nth-child(1)')?.textContent) {
            recodeDomId = recodeDomId1;
          }
          else if (document.querySelector('#' + recodeDomId2 + ' table.table tr:nth-child(2) td:nth-child(1)')?.textContent) {
            recodeDomId = recodeDomId2;
          } else {
            alert('未找到文档操作记录表【可尝试F5刷新页面后，再次获取】');
          }

          // 解析文档信息
          const docInfo = {
            url: location.href,
            title: document.getElementById(titleId)?.textContent?.trim() ?? '未找到',
            author: document.querySelector('#' + recodeDomId + ' table.table tr:nth-child(2) td:nth-child(1)')?.textContent?.trim() ?? '未知',
            createTime: document.querySelector('#' + recodeDomId + ' table.table tr:nth-child(2) td:nth-child(2)')?.textContent?.trim() ?? '未知',
            reviewers: Array.from(document.querySelectorAll('#' + recodeDomId + ' table tr:nth-child(n+3) td:nth-child(3)'))
              .map(td => td.textContent.trim()).filter(Boolean),
            conclusions: Array.from(document.querySelectorAll('#' + recodeDomId + ' table tr:nth-child(n+3) td:nth-child(6)'))
              .map(td => td.textContent.trim()).filter(Boolean)
          };

          // 构建展示信息（带标题）和剪贴板数据（纯值）
          const displayTextForAlert = [
            `方案链接：${docInfo.url}`,
            `方案名称：${docInfo.title}`,
            `创建人：${docInfo.author}`,
            `创建日期：${docInfo.createTime}`,
            '审核人：' + (docInfo.reviewers.join(', ') || '无'),
            '审核结论：' + (docInfo.conclusions.join(', ') || '无')
          ].join('\n');

          //这里的位置顺序要与“技术方案评审记录”里的列信息一致
          const clipboardText = [
            docInfo.url,
            docInfo.title,
            docInfo.author,
            docInfo.createTime,
            '',
            // 平铺前4个审核人，不足4个用空字符串填充
            ...docInfo.reviewers.slice(0, 4).map(v => v || ''),
            ...Array(Math.max(4 - docInfo.reviewers.length, 0)).fill(''),
            docInfo.conclusions.join(', ') || '无'
          ].join('\t');

          return {
            displayText: displayTextForAlert,
            clipboardText: clipboardText
          };
        }
      }, ([result]) => {
        if (chrome.runtime.lastError) {
          console.error('脚本执行错误:', chrome.runtime.lastError);
          return;
        }
        // alert(JSON.stringify(result));
        if (result?.result) {
          // 保持原生confirm对话框
          const userConfirmed = confirm(`文档信息：\n${result.result.displayText}\n\n点击"确定"复制信息`);
          if (userConfirmed) {
            navigator.clipboard.writeText(result.result.clipboardText)
              .then(() => showToast('✓ 信息已复制到剪贴板'))
              .catch(err => console.error('复制失败:', err));
          }
        } else {
          alert('未找到文档信息');
        }
      });
    });
  });

  // 批量获取文档信息
  document.getElementById('getBatchTechArticleInfo').addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // 检测是否技术文档网站
      const currentUrl = new URL(tabs[0].url);
      if (currentUrl.host !== 'fd.kingdee.com:9001') {
        alert('当前页面非苍穹前端技术文档【fd.kingdee.com:9001】，无法提取相关信息');
        return;
      }

      //插件逻辑
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          // 新增评审链接提取逻辑
          const unReviewedSpan = Array.from(document.querySelectorAll('span'))
            .find(span => span.textContent.trim() === '未评审');

          if (!unReviewedSpan) {
            alert('在页面上未找到【未评审】DOM节点');
            return;
          }
          //节点dom路径
          const parentLi = unReviewedSpan.closest('li');
          const linkList = parentLi?.querySelector('ul');

          if (!linkList) {
            alert('未找到【未评审】文章列表，请确认页面上的【未评审】节点已展开？');
            return;
          }

          // 提取全部文档信息（链接、文档名称）
          const links = Array.from(linkList.querySelectorAll('li')).map(li => {
            const aTag = li.querySelector('a');
            return {
              href: aTag?.href || '无链接',
              text: aTag?.textContent.trim() || '无文本'
            };
          });

          // 构建展示信息
          // const displayContent = links.map((link, index) =>
          //   `${index + 1}. 链接: ${link.href}\n   文本: ${link.text}`
          // ).join('\n\n');

          return {
            // displayText: displayContent,
            // clipboardText: displayContent,
            links: links
          };
        }
      }, ([result]) => {
        if (chrome.runtime.lastError) {
          console.error('脚本执行错误:', chrome.runtime.lastError);
          return;
        }

        // 修改批量获取文档信息的结果处理部分
        if (result?.result) {
          const links = result.result.links;

          // 新增确认对话框
          const startProcess = confirm(`已找到【${links.length}】条待处理记录，点击【确定】开始批量处理`);
          if (!startProcess) {
            showToast('操作已取消');
            return;
          }

          const allResults = [];
          let currentIndex = 0;
          let isCompleted = false;

          const processNextLink = () => {
            if (currentIndex >= links.length) {
              // alert('【复制到剪切板的数据】：' + JSON.stringify(allResults))
              // 处理完成，全部数据复制到剪切板
              navigator.clipboard.writeText(allResults.join('\n'))
                .then(() => {
                  showToast(`已复制【 ${links.length} 】条文档数据到剪切板`);
                  //打开评审记录在线文档
                  const doArchive = confirm('技术文档解析完成，所有文档信息已拷贝到剪切板。点击【确定】打开在线文档，粘贴并完成归档');
                  if (doArchive) {
                    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                      chrome.tabs.create({
                        url: 'https://iknow.kingdee.com/preview.html?fileid=4ba6c070-9c2b-4658-adb5-9555e6a0e353&sharecode=16522&shareperm=15&displayControl=32768',
                        index: tabs[0].index + 1,  // 在右侧新建页签
                        active: true
                      });
                    });
                  }
                })
                .catch(err => console.error('复制到剪切板失败:', err));
              return;
            }

            const link = links[currentIndex];
            currentIndex++;

            // 修复点1：设置active为true确保页签可见
            chrome.tabs.create({
              url: link.href,
              active: false,
              index: tabs[0].index + 1
            }, (newTab) => {
              const tabId = newTab.id;
              const onUpdated = (updatedTabId, changeInfo) => {
                if (updatedTabId === tabId && changeInfo.status === 'complete') {
                  isCompleted = true;
                  showToast('技术文档解析进度: ' + currentIndex + "/" + links.length)
                  // 修复点2：修正DOM查询对象为document
                  chrome.scripting.executeScript({
                    target: { tabId, allFrames: true },
                    func: () => {
                      // console.log('start anayly article')
                      // 文档标题的dom id
                      let titleId = 'magicdomid2';
                      // 文档操作记录表的dom id
                      let recodeDomId1 = 'magicdomid3';
                      let recodeDomId2 = 'magicdomid4';
                      let recodeDomId = recodeDomId1;
                      if (document.querySelector('#' + recodeDomId1 + ' table.table tr:nth-child(2) td:nth-child(1)')?.textContent) {
                        recodeDomId = recodeDomId1;
                      }
                      else if (document.querySelector('#' + recodeDomId2 + ' table.table tr:nth-child(2) td:nth-child(1)')?.textContent) {
                        recodeDomId = recodeDomId2;
                      } else {
                        alert('未找到文档操作记录表【可尝试F5刷新页面后，再次获取】');
                      }

                      // 解析文档信息(根据DOM结构)
                      const docInfo = {
                        url: location.href,
                        title: document.getElementById(titleId)?.textContent?.trim() ?? '未找到',
                        author: document.querySelector('#' + recodeDomId + ' table.table tr:nth-child(2) td:nth-child(1)')?.textContent?.trim() ?? '未知',
                        createTime: document.querySelector('#' + recodeDomId + ' table.table tr:nth-child(2) td:nth-child(2)')?.textContent?.trim() ?? '未知',
                        reviewers: Array.from(document.querySelectorAll('#' + recodeDomId + ' table tr:nth-child(n+3) td:nth-child(3)'))
                          .map(td => td.textContent.trim()).filter(Boolean),
                        conclusions: Array.from(document.querySelectorAll('#' + recodeDomId + ' table tr:nth-child(n+3) td:nth-child(6)'))
                          .map(td => td.textContent.trim()).filter(Boolean)
                      };

                      // 构建展示信息（带标题）和剪贴板数据（纯值）
                      // const displayTextForAlert = [
                      //   `方案链接：${docInfo.url}`,
                      //   `方案名称：${docInfo.title}`,
                      //   `创建人：${docInfo.author}`,
                      //   `创建日期：${docInfo.createTime}`,
                      //   '审核人：' + (docInfo.reviewers.join(', ') || '无'),
                      //   '审核结论：' + (docInfo.conclusions.join(', ') || '无')
                      // ].join('\n');

                      //这里的位置顺序要与“技术方案评审记录”里的列信息一致
                      const clipboardText = [
                        docInfo.url,
                        docInfo.title,
                        docInfo.author,
                        docInfo.createTime,
                        '',
                        // 平铺前4个审核人，不足4个用空字符串填充
                        ...docInfo.reviewers.slice(0, 4).map(v => v || ''),
                        ...Array(Math.max(4 - docInfo.reviewers.length, 0)).fill(''),
                        docInfo.conclusions.join(', ') || '无'
                      ].join('\t');

                      console.log("文档信息: " + JSON.stringify(clipboardText))
                      return {
                        // displayText: displayTextForAlert,
                        clipboardText: clipboardText
                      };
                    }
                  }, (htmlResult) => {
                    // 修复点3：增强错误处理
                    if (chrome.runtime.lastError) {
                      alert(`脚本执行错误: ${chrome.runtime.lastError.message}`);
                      return;
                    }

                    //alert('12: ' + JSON.stringify(htmlResult))
                    // 修复点4：添加空值检查
                    if (htmlResult?.[0]?.result) {
                      //alert('13: ' + htmlResult[0].result.clipboardText)
                      allResults.push(htmlResult[0].result.clipboardText);
                    }

                    // 修复点5：添加超时处理
                    setTimeout(() => {
                      chrome.tabs.remove(tabId, () => {
                        chrome.tabs.onUpdated.removeListener(onUpdated);
                        processNextLink(); // 处理下一个链接
                      });
                    }, 1000);
                  });
                }
              };

              // 15秒超时处理
              // setTimeout(() => {
              //   if (!isCompleted) {
              //     chrome.tabs.remove(tabId);
              //     processNextLink();
              //   }
              // }, 15000);

              chrome.tabs.onUpdated.addListener(onUpdated);
            });
          };

          // 修复点6：启动处理流程
          if (startProcess) {
            alert('【重要提示】处理过程中请不要关闭该插件、不要切换浏览器页面，耐心等待一会～')
            processNextLink();
          }
        }
      });
    });
  });

  // 在文件顶部添加新按钮的事件监听
  document.getElementById('copyTabBtn').addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]) {
        chrome.tabs.create({
          url: tabs[0].url,
          index: tabs[0].index + 1, // 在当前页签右侧创建
          active: true
        });
      }
    });
  });

  // Debug模式按钮
  document.getElementById('debugBtn').addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentUrl = new URL(tabs[0].url);
      const urlParams = new URLSearchParams(currentUrl.search);

      // 检查是否已存在调试参数（使用常量）
      if (!urlParams.has(DEBUG_PARAM)) {
        const hasQuery = currentUrl.search !== '';
        currentUrl.search += (hasQuery ? '&' : '?') + DEBUG_PARAM + '=true';
        chrome.tabs.create({ url: currentUrl.href, index: tabs[0].index + 1 });
      } else {
        alert('当前环境已是debug模式');
        return;
      }
    });
  });

  // 进入无代码（根据当前页面生成新URL）
  document.getElementById('nocode').addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      try {
        const currentUrl = new URL(tabs[0].url);
        const urlParams = new URLSearchParams();
        // 移除 formId 参数设置

        // 使用CDN常量
        const existingCdn = currentUrl.searchParams.get(CDN_PARAM);
        if (existingCdn) {
          urlParams.set(CDN_PARAM, existingCdn);
        }

        // 新增：保留原有kdcdc参数
        const existingKdcdc = currentUrl.searchParams.get(KCDC_PARAM);
        if (existingKdcdc) {
          urlParams.set(KCDC_PARAM, existingKdcdc);
        }

        // 修改路径拼接方式，添加 /nocode/ 子目录
        const newUrl = `${currentUrl.origin}${currentUrl.pathname}nocode/?${urlParams.toString()}`;
        chrome.tabs.create({ url: newUrl, index: tabs[0].index + 1 });
      } catch (e) {
        console.error('URL解析失败:', e);
      }
    });
  });

  // 初始化调试复选框
  debugCheckbox = document.getElementById('debugCheckbox');

  // 读取存储状态
  chrome.storage.local.get('debugMode', ({ debugMode }) => {
    debugCheckbox.checked = debugMode || false;
  });

  // 保存勾选状态
  debugCheckbox.addEventListener('change', () => {
    event.stopPropagation(); // 阻止事件冒泡
    chrome.storage.local.set({ debugMode: debugCheckbox.checked });
  });

  // 旧开发平台按钮（根据当前页面生成新URL）
  document.getElementById('oldPlatform').addEventListener('click', function (event) {
    // 排除复选框点击事件
    if (event.target.id === 'debugCheckbox') return;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      try {
        const currentUrl = new URL(tabs[0].url);
        const urlParams = new URLSearchParams();
        urlParams.set('formId', 'pc_devportal_main');

        // 使用CDN常量
        const existingCdn = currentUrl.searchParams.get(CDN_PARAM);
        if (existingCdn) {
          urlParams.set(CDN_PARAM, existingCdn);
        }

        // 新增：保留原有kdcdc参数
        const existingKdcdc = currentUrl.searchParams.get(KCDC_PARAM);
        if (existingKdcdc) {
          urlParams.set(KCDC_PARAM, existingKdcdc);
        }

        // 新增调试参数判断
        if (debugCheckbox.checked) {
          urlParams.set(DEBUG_PARAM, 'true');
        }

        const newUrl = `${currentUrl.origin}${currentUrl.pathname}?${urlParams.toString()}`;
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
        const urlParams = new URLSearchParams();
        urlParams.set('formId', 'bos_devpn_portal_grid');

        // 使用CDN常量
        const existingCdn = currentUrl.searchParams.get(CDN_PARAM);
        if (existingCdn) {
          urlParams.set(CDN_PARAM, existingCdn);
        }

        // 新增：保留原有kdcdc参数
        const existingKdcdc = currentUrl.searchParams.get(KCDC_PARAM);
        if (existingKdcdc) {
          urlParams.set(KCDC_PARAM, existingKdcdc);
        }

        const newUrl = `${currentUrl.origin}${currentUrl.pathname}?${urlParams.toString()}`;
        chrome.tabs.create({ url: newUrl, index: tabs[0].index + 1 });
      } catch (e) {
        console.error('URL解析失败:', e);
      }
    });
  });

  // 新增运行单据按钮
  // 预览单据按钮逻辑修改
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
            // 新增参数处理逻辑
            const urlParams = new URLSearchParams();
            urlParams.set('formId', encodeURIComponent(formId));

            // 保留原有 CDN 参数
            const existingCdn = currentUrl.searchParams.get(CDN_PARAM);
            if (existingCdn) {
              urlParams.set(CDN_PARAM, existingCdn);
            }

            // 保留原有 kdcdc 参数
            const existingKdcdc = currentUrl.searchParams.get(KCDC_PARAM);
            if (existingKdcdc) {
              urlParams.set(KCDC_PARAM, existingKdcdc);
            }

            const newUrl = `${currentUrl.origin}${currentUrl.pathname}?${urlParams.toString()}`;
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
            // 构建新的URL参数
            const urlParams = new URLSearchParams({
              form: encodeURIComponent(formId)
            });

            // 保留原有 CDN 参数
            const existingCdn = currentUrl.searchParams.get(CDN_PARAM);
            if (existingCdn) {
              urlParams.set(CDN_PARAM, existingCdn);
            }

            // 保留原有kdcdc参数
            const existingKdcdc = currentUrl.searchParams.get(KCDC_PARAM);
            if (existingKdcdc) {
              urlParams.set(KCDC_PARAM, existingKdcdc);
            }

            const newUrl = `${currentUrl.origin}${currentUrl.pathname}mobile.html?${urlParams.toString()}`;
            chrome.tabs.create({ url: newUrl, index: tabs[0].index + 1 });
          }
        } catch (e) {
          console.error('表单打开失败:', e);
        }
      });
    });
  });

  // 挂载本地环境按钮
  document.getElementById('loadLocalEnv').addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.storage.local.get([STORAGE_KEY], function (result) {
        const currentUrl = new URL(tabs[0].url);
        // 使用调试参数常量
        if (currentUrl.searchParams.has(DEBUG_PARAM)) {
          currentUrl.searchParams.delete(DEBUG_PARAM);
        }

        const cachedValue = result[STORAGE_KEY]; // 修复此处，从result获取存储值
        if (cachedValue) {
          applyCdnConfig(currentUrl, cachedValue, tabs[0].index);
        } else {
          const userInput = prompt('请输入本地环境CDN地址：', 'http://localhost:3000/ierp/feature_dev');
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
      const userInput = prompt('设置本地环境CDN地址：', result[STORAGE_KEY] || 'http://localhost:3000/ierp/feature_dev');
      if (userInput) {
        chrome.storage.local.set({ [STORAGE_KEY]: userInput });
      }
    });
  });

  // 公共处理函数
  function applyCdnConfig(currentUrl, cdnValue, tabIndex) {
    currentUrl.searchParams.set(CDN_PARAM, cdnValue);  // 使用CDN常量
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

  //DOMContentLoaded结束
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
        currentUrl.searchParams.set(CDN_PARAM, env.address);  // 使用CDN常量
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

// 添加下拉面板控制逻辑（同时处理两个按钮）
function setupDropdown(buttonId) {
  const btn = document.getElementById(buttonId);
  const menu = btn.nextElementSibling;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  });

  // 点击其他区域关闭面板
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target)) {
      menu.style.display = 'none';
    }
  });
}

// 初始化两个下拉按钮
document.addEventListener('DOMContentLoaded', () => {
  setupDropdown('openTestEnv');
  setupDropdown('mountTestEnv');  // 新增这行代码
  setupDropdown('docArchiveBtn');
  setupDropdown('otherMenu');
});

// 在文件顶部添加提示条函数
function showToast(message, duration = 2000) {
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, duration);
}

// 修改结果处理部分（约第91行）
// if (result?.result) {
//   const userConfirmed = confirm(`文档信息：\n${result.result.displayText}\n\n点击"确定"复制信息（不含标题）`);
//   if (userConfirmed) {
//     navigator.clipboard.writeText(result.result.clipboardText)
//       .then(() => alert('信息已复制，可直接粘贴到Excel'))
//       .catch(err => console.error('复制失败:', err));
//   }
// }