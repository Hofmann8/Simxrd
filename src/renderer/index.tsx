import { createRoot } from 'react-dom/client';
import MainComponent from './components/MainComponent'; // 导入 MainComponent

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

// 渲染 MainComponent 到 #root 节点
root.render(<MainComponent />);

// IPC 通信逻辑
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  console.log(arg); // 接收并处理主进程的消息
});

window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']); // 向主进程发送 "ping" 消息

