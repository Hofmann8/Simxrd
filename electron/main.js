const { BrowserWindow } = require('electron');

app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,  // 注意：仅在开发环境使用
      allowRunningInsecureContent: true  // 注意：仅在开发环境使用
    }
  });

  // 添加 CSP 头
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob:",
          "connect-src 'self' file: data: blob:"
        ].join('; ')
      }
    });
  });

  // ... 其他代码
}); 