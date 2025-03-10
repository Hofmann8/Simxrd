import React, { useEffect, useRef } from 'react';

// 简单的path模块实现
const pathModule = {
  basename: (path) => {
    if (!path) return '';
    const parts = path.split(/[\/\\]/);
    return parts[parts.length - 1] || '';
  }
};

// 将getLightingScript函数移到组件外部
const getLightingScript = (lighting) => {
  switch (lighting) {
    case 'soft':
      return `
        set ambientPercent 60;
        set diffusePercent 70;
        set specularPercent 30;
        set specularPower 40;
      `;
    case 'sharp':
      return `
        set ambientPercent 30;
        set diffusePercent 90;
        set specularPercent 70;
        set specularPower 100;
      `;
    case 'flat':
      return `
        set ambientPercent 80;
        set diffusePercent 50;
        set specularPercent 0;
      `;
    default: // 'default'
      return `
        set ambientPercent 45;
        set diffusePercent 85;
        set specularPercent 45;
        set specularPower 80;
      `;
  }
};

const CrystalStructureViewer = ({ filePath, displayOptions, saveViewerState }) => {
  const viewerRef = useRef(null);
  const isElectron = window.isElectron || !!window.electronAPI;
  const jsmolInitializedRef = useRef(false);
  const prevOptionsRef = useRef(displayOptions);
  const filePathRef = useRef(filePath);

  // 初始化 JSmol - 使用 useRef 来避免重复初始化
  useEffect(() => {
    // 检查filePath是否为null或undefined
    if (!filePath) {
      console.error('文件路径为空，无法加载晶体结构');
      return;
    }

    // 如果已经初始化了相同的文件，则不重新初始化
    if (jsmolInitializedRef.current && filePathRef.current === filePath) {
      return;
    }

    // 更新当前文件路径引用
    filePathRef.current = filePath;

    // 检查JSmol库是否已加载
    if (!window.Jmol) {
      console.error('JSmol 库未加载');

      // 尝试等待JSmol加载
      const checkJmol = setInterval(() => {
        if (window.Jmol) {
          console.log('JSmol库已加载，继续初始化');
          clearInterval(checkJmol);
          initJSmol();
        }
      }, 500);

      // 10秒后如果仍未加载，则放弃
      setTimeout(() => {
        clearInterval(checkJmol);
        if (!window.Jmol) {
          console.error('等待JSmol库加载超时');
          const viewerContainer = viewerRef.current;
          if (viewerContainer) {
            viewerContainer.innerHTML = `<div class="alert alert-danger">JSmol库加载失败，请刷新页面重试。</div>`;
          }
        }
      }, 10000);

      return;
    }

    initJSmol();

    // 清理函数
    return () => {
      try {
        if (window.jmolApplet0) {
          const state = {
            rotation: window.Jmol.evaluateVar(window.jmolApplet0, 'quaternion()'),
            zoom: window.Jmol.evaluateVar(window.jmolApplet0, 'zoom'),
            translation: window.Jmol.evaluateVar(window.jmolApplet0, 'translate()'),
            slab: window.Jmol.evaluateVar(window.jmolApplet0, 'slab')
          };
          saveViewerState(state);
        }
      } catch (e) {
        console.error('Error saving JSmol state:', e);
      }
    };
  }, [filePath, isElectron, saveViewerState]);

  // 初始化JSmol的函数
  const initJSmol = () => {
    const viewerContainer = viewerRef.current;
    if (!viewerContainer) {
      console.error('查看器容器不可用');
      return;
    }

    // 处理 Electron 环境下的文件路径
    let processedFilePath = filePath;
    if (isElectron && window.electronAPI) {
      if (window.electronAPI.convertFilePath) {
        processedFilePath = window.electronAPI.convertFilePath(filePath);
        console.log('转换后的文件路径:', processedFilePath);
      }

      // 检查文件是否存在
      if (window.electronAPI.fileExists) {
        const fileExists = window.electronAPI.fileExists(filePath);
        console.log('文件是否存在:', fileExists);

        // 如果文件不存在，尝试使用getResourcePath获取路径
        if (!fileExists && window.electronAPI.getResourcePath) {
          try {
            // 去掉开头的斜杠
            const relativePath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
            const resourcePath = window.electronAPI.getResourcePath(relativePath);
            if (resourcePath) {
              processedFilePath = `file://${resourcePath}`;
              console.log('使用资源路径:', processedFilePath);
            }
          } catch (error) {
            console.error('获取资源路径失败:', error);
          }
        }
      }
    }

    // 检测文件格式
    const fileExtension = processedFilePath.toLowerCase().split('.').pop();
    console.log('文件扩展名:', fileExtension);

    // 提取文件名
    const fileName = pathModule.basename(filePath);
    console.log('文件名:', fileName);

    // 尝试使用fetch加载文件内容
    if (fileExtension === 'xyz') {
      // 使用相对路径
      const relativeUrl = `./${fileName}`;
      console.log('尝试使用fetch加载文件:', relativeUrl);

      fetch(relativeUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        })
        .then(content => {
          console.log('文件内容加载成功，长度:', content.length);
          console.log('文件内容前100个字符:', content.substring(0, 100));

          // 初始化JSmol
          initJSmolWithContent(content);
        })
        .catch(error => {
          console.error('加载文件内容失败:', error);

          // 回退到普通加载方式
          initJSmolWithPath();
        });
    } else {
      // 其他文件格式，使用普通加载方式
      initJSmolWithPath();
    }

    // 使用文件路径初始化JSmol
    function initJSmolWithPath() {
      // 根据文件格式设置加载选项
      let loadCommand = '';

      if (fileExtension === 'xyz') {
        // 使用最简单的加载命令
        loadCommand = `load "${fileName}";`;
        console.log('使用简单的加载命令:', loadCommand);
      } else {
        // 其他情况，使用原始路径
        loadCommand = `load "${processedFilePath}";`;
        console.log('使用原始路径加载文件:', loadCommand);
      }

      // 初始化脚本
      const initScript = createInitScript(loadCommand);

      // 创建JSmol对象
      createJSmolApplet(initScript);
    }

    // 使用文件内容初始化JSmol
    function initJSmolWithContent(content) {
      // 使用load data命令加载文件内容
      const loadCommand = `load data "xyz"\n${content}\nend "xyz";`;
      console.log('使用load data命令加载文件内容');

      // 初始化脚本
      const initScript = createInitScript(loadCommand);

      // 创建JSmol对象
      createJSmolApplet(initScript);
    }

    // 创建初始化脚本
    function createInitScript(loadCommand) {
      return `
        set antialiasdisplay true;
        background ${displayOptions.backgroundColor || 'white'};
        
        # 基本设置
        set specular true;
        set ambientPercent 45;
        set diffusePercent 85;
        
        # 加载文件
        ${loadCommand}
        
        # 显示设置
        select all;
        ${displayOptions.frameworkStyle === 'wireframe' ?
          'wireframe 0.1; spacefill 0%;' :
          displayOptions.frameworkStyle === 'ballStick' ?
            'wireframe 0.15; spacefill 25%;' :
            'wireframe off; spacefill 100%;'}
        color cpk;
        center selected;
        zoom 100;
        
        # 坐标轴设置
        ${displayOptions.showAxes ? 'axes on;' : 'axes off;'}
        
        # 自旋设置
        ${displayOptions.spinning ? 'spin on;' : 'spin off;'}
        
        # 刷新显示
        refresh;
      `;
    }

    // 创建JSmol对象
    function createJSmolApplet(initScript) {
      // 获取 j2sPath - 在 Web 环境中使用默认路径
      let j2sPath = './jsmol/j2s';
      console.log('使用JSmol路径:', j2sPath);

      const jmolInfo = {
        width: '100%',
        height: '100%',
        use: 'HTML5',
        j2sPath: j2sPath,
        script: initScript,
        disableJ2SLoadMonitor: false,
        disableInitialConsole: false,
        debug: true,
        allowJavaScript: true,
        readyFunction: (applet) => {
          console.log('JSmol readyFunction被调用，applet:', applet);
          jsmolInitializedRef.current = true;

          // 应用初始显示选项
          try {
            if (window.jmolApplet0) {
              // 等待一段时间，确保分子结构已加载
              setTimeout(() => {
                try {
                  // 检查是否有原子被加载
                  const atomCount = window.Jmol.evaluateVar(window.jmolApplet0, "atomCount");
                  console.log('加载的原子数:', atomCount);

                  if (atomCount > 0) {
                    console.log('JSmol初始化成功，原子数:', atomCount);
                  } else {
                    console.error('JSmol加载了0个原子，可能文件格式不正确或文件路径有误');

                    // 尝试重新加载文件
                    if (fileExtension === 'xyz') {
                      // 尝试使用不同的方法加载文件
                      console.log('尝试使用文件名加载:', fileName);

                      // 尝试不同的加载方式
                      const loadCommands = [
                        `load "./xyz_data/${fileName}";`,
                        `load "xyz_data/${fileName}";`,
                        `load "${fileName}";`,
                        `load "${processedFilePath}";`
                      ];

                      // 依次尝试不同的加载命令
                      let commandIndex = 0;

                      const tryNextCommand = () => {
                        if (commandIndex < loadCommands.length) {
                          const cmd = loadCommands[commandIndex];
                          console.log(`尝试加载命令 ${commandIndex + 1}/${loadCommands.length}:`, cmd);

                          window.Jmol.script(window.jmolApplet0, cmd);

                          // 检查是否加载成功
                          setTimeout(() => {
                            const atomCount = window.Jmol.evaluateVar(window.jmolApplet0, "atomCount");
                            console.log(`命令 ${commandIndex + 1} 加载后的原子数:`, atomCount);

                            if (atomCount > 0) {
                              console.log('文件加载成功，应用显示设置');
                              applyDisplayStyle(displayOptions.frameworkStyle);
                            } else {
                              // 尝试下一个命令
                              commandIndex++;
                              tryNextCommand();
                            }
                          }, 1000);
                        } else {
                          console.error('所有加载命令都失败了');
                        }
                      };

                      // 开始尝试加载命令
                      tryNextCommand();
                    }
                  }
                } catch (error) {
                  console.error('检查原子数时出错:', error);
                }
              }, 1000);
            } else {
              console.error('readyFunction被调用，但jmolApplet0不存在');
            }
          } catch (error) {
            console.error('在readyFunction中应用设置时出错:', error);
          }

          // 保存初始选项
          prevOptionsRef.current = { ...displayOptions };
        }
      };

      // 清除容器内容
      viewerContainer.innerHTML = '';
      jsmolInitializedRef.current = false;

      // 创建 JSmol 对象
      try {
        console.log('开始初始化JSmol，使用路径:', j2sPath);
        console.log('初始化脚本:', initScript);

        // 检查JSmol库是否已加载
        if (typeof window.Jmol === 'undefined' || typeof window.Jmol.getAppletHtml !== 'function') {
          console.error('JSmol库未正确加载，Jmol对象:', window.Jmol);
          viewerContainer.innerHTML = `<div class="alert alert-danger">JSmol库未正确加载，请检查网络连接或刷新页面重试。</div>`;
          return;
        }

        const jmolHtml = window.Jmol.getAppletHtml("jmolApplet0", jmolInfo);
        console.log('生成的JSmol HTML:', jmolHtml.substring(0, 100) + '...');
        viewerContainer.innerHTML = jmolHtml;

        // 检查JSmol是否成功初始化
        setTimeout(() => {
          if (typeof window.jmolApplet0 === 'undefined') {
            console.error('JSmol初始化失败，jmolApplet0对象不存在');
            viewerContainer.innerHTML += `<div class="alert alert-warning mt-3">JSmol初始化失败，请刷新页面重试。</div>`;
          } else {
            console.log('JSmol初始化成功，jmolApplet0对象:', window.jmolApplet0);
          }
        }, 2000);
      } catch (error) {
        console.error('JSmol 初始化错误:', error);
        viewerContainer.innerHTML = `<div class="alert alert-danger">JSmol 初始化错误: ${error.message}</div>`;
      }
    }
  };

  // 应用显示风格
  const applyDisplayStyle = (style) => {
    if (!window.jmolApplet0 || !window.Jmol) {
      console.error('无法应用显示风格，JSmol未初始化');
      return;
    }

    try {
      console.log('应用显示风格:', style);

      // 先选择所有原子
      window.Jmol.script(window.jmolApplet0, 'select all;');

      switch (style) {
        case 'wireframe':
          window.Jmol.script(window.jmolApplet0, 'wireframe 0.1; spacefill 0%; color cpk;');
          break;
        case 'ballStick':
          window.Jmol.script(window.jmolApplet0, 'wireframe 0.15; spacefill 25%; color cpk;');
          break;
        case 'spacefill':
          window.Jmol.script(window.jmolApplet0, 'wireframe off; spacefill 100%; color cpk;');
          break;
        default:
          window.Jmol.script(window.jmolApplet0, 'wireframe 0.1; spacefill 0%; color cpk;');
      }

      // 确保分子结构可见
      window.Jmol.script(window.jmolApplet0, 'center selected; zoom 100; refresh;');

      console.log('显示风格应用完成');
    } catch (error) {
      console.error('应用显示风格时出错:', error);
    }
  };

  // 单独处理显示选项变化
  useEffect(() => {
    if (!jsmolInitializedRef.current || !window.jmolApplet0) return;

    try {
      // 只有当显示风格变化时才更新
      if (prevOptionsRef.current.frameworkStyle !== displayOptions.frameworkStyle) {
        applyDisplayStyle(displayOptions.frameworkStyle);
      }

      // 只有当坐标轴显示设置变化时才更新
      if (prevOptionsRef.current.showAxes !== displayOptions.showAxes) {
        if (displayOptions.showAxes) {
          window.Jmol.script(window.jmolApplet0, 'axes on;');
        } else {
          window.Jmol.script(window.jmolApplet0, 'axes off;');
        }
      }

      // 只有当背景颜色变化时才更新
      if (prevOptionsRef.current.backgroundColor !== displayOptions.backgroundColor) {
        window.Jmol.script(window.jmolApplet0, `background ${displayOptions.backgroundColor};`);
      }

      // 只有当光照效果变化时才更新
      if (prevOptionsRef.current.lighting !== displayOptions.lighting) {
        window.Jmol.script(window.jmolApplet0, getLightingScript(displayOptions.lighting));
      }

      // 只有当自旋状态变化时才更新
      if (prevOptionsRef.current.spinning !== displayOptions.spinning) {
        window.Jmol.script(window.jmolApplet0, displayOptions.spinning ? 'spin on;' : 'spin off;');
      }

      // 更新之前的选项引用
      prevOptionsRef.current = { ...displayOptions };
    } catch (error) {
      console.error('应用显示选项错误:', error);
    }
  }, [displayOptions]);

  return (
    <div
      ref={viewerRef}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
    />
  );
};

export default CrystalStructureViewer;
