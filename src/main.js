const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
let mainWindow = null;
const mode = process.argv[2];

function makeSingleInstance() {
  if (process.mas) return;
  const gotTheLock = app.requestSingleInstanceLock();

  if (!gotTheLock) {
    app.quit();
  } else {
    app.on("second-instance", () => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
      }
    });
  }
}

async function createDevTools() {
  const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require("electron-devtools-installer");
  try {
    await installExtension(REACT_DEVELOPER_TOOLS);
    await installExtension(REDUX_DEVTOOLS);
    console.log("Development extensions installed.");
  } catch (err) {
    console.error("Error installing dev tools:", err);
  }
}

function createWindow() {
  const windowOptions = {
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true, // 从 Electron 12 开始，推荐启用 contextIsolation
      enableRemoteModule: false, // 从 Electron 10 开始，推荐禁用 remote 模块
    },
  };

  mainWindow = new BrowserWindow(windowOptions);

  if (mode === "dev") {
    mainWindow.loadURL("http://localhost:3000/");
    mainWindow.webContents.openDevTools();
    createDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "..", "build", "index.html")); // 更正路径拼接方法
  }

  ipcMain.on("min", () => {
    mainWindow.minimize();
  });

  ipcMain.on("max", () => {
    mainWindow.maximize();
  });

  ipcMain.on("login", () => {
    mainWindow.maximize();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

makeSingleInstance();

app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
