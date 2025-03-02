# SimXRD-DUT 应用

这是一个用于模拟 XRD 数据和显示晶体结构的应用程序。

## 最新更新

### 2024-02-28
- 优化了参数匹配算法
- 添加了智能参数建议功能
  - 当匹配度低于70%时，系统会分析每个参数
  - 只显示确实可以提升到70%匹配度的参数建议区间
  - 在滑动条下方可视化显示建议区间
  - 当所有参数都无法单独调整到70%时，给出整体调整建议
- 改进了数据加载的错误处理
- 将表单配置抽离到独立的配置文件
- 优化了代码结构和性能

## 功能特点

- XRD 数据模拟与分析
- 晶体结构三维可视化
- 支持多种晶体结构模型
- 支持 Web 和桌面应用模式

## 使用说明

1. 输入实验参数
2. 点击"开始模拟"
3. 查看模拟结果和匹配建议
4. 根据建议调整参数

## 开发环境

- Node.js
- React
- Bootstrap
- ECharts

## 安装与运行

### Web 应用

```bash
npm install
npm start
```

### Electron 桌面应用

```bash
npm install
npm run build
npm run electron
```

## 项目结构

```
src/
  ├── components/        # 组件
  ├── config/           # 配置文件
  ├── utils/            # 工具函数
  ├── pages/            # 页面组件
  └── App.js           # 主应用
```

## 注意事项

- 在 Electron 模式下，晶体结构查看器需要正确配置文件路径
- 确保 `public/jsmol` 和 `public/xyz_data` 目录包含所需的所有文件
- 如果遇到文件加载问题，请检查控制台错误信息

## 技术栈

- React
- Electron
- JSmol (用于分子结构可视化)
- ECharts (用于数据可视化)

## 常见问题解决

### 在 React 中使用 Node.js 模块

React 应用在浏览器环境中运行，不能直接使用 Node.js 模块（如 path、fs 等）。在 Electron 应用中，我们通过以下方式解决这个问题：

1. 使用 contextBridge 在预加载脚本中暴露安全的 API
2. 在渲染进程中通过 window.electronAPI 调用这些 API
3. 避免在 React 组件中直接导入 Node.js 模块

### 文件路径问题

在 Electron 中，文件路径需要特殊处理：

1. 使用 file:// 协议加载本地文件
2. 注册自定义协议处理器处理文件请求
3. 使用绝对路径而非相对路径
```

