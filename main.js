const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron'); // 确保 ipcMain 被声明
const path = require('path');
const fs = require('fs');

let mainWindow;

const dataFilePath = path.join(__dirname, 'data.json');
let dataSource = [];

function sendErrorToRenderer(message) {
    if (mainWindow) {
        mainWindow.webContents.send('error', message);
    }
}

// 读取外部 JSON 数据源并处理错误
fs.readFile(dataFilePath, 'utf-8', (err, data) => {
    if (err) {
        console.error("Failed to read data file:", err);
        sendErrorToRenderer(`Error reading data file: ${err.message}`);
    } else {
        try {
            dataSource = JSON.parse(data);
            if (!Array.isArray(dataSource) || dataSource.length === 0) {
                const message = "Data source is empty or invalid.";
                console.error(message);
                sendErrorToRenderer(message);
            } else {
                console.log("Data loaded successfully.");
            }
        } catch (parseError) {
            const message = `Failed to parse data: ${parseError.message}`;
            console.error(message);
            sendErrorToRenderer(message);
        }
    }
});

function createWindow() {
    const mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
      },
      icon: path.join(__dirname, 'simxrd.png'),  // 使用 path 模块指定图标
      autoHideMenuBar: true  // 自动隐藏菜单栏
    });
  
    mainWindow.loadFile('index.html');  // 加载应用的HTML文件
  
    // 注册快捷键 Ctrl+Shift+I 来打开开发者工具
    globalShortcut.register('Control+Shift+I', () => {
      mainWindow.webContents.openDevTools();
    });
  
    mainWindow.on('closed', () => {
      globalShortcut.unregisterAll();
    });
  }
  
  app.whenReady().then(() => {
    createWindow();
  
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });
  
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });

  // 取消所有快捷键注册，当应用退出时
app.on('will-quit', () => {
    globalShortcut.unregisterAll();
  });

ipcMain.handle('findClosestXRD', (event, inputData) => {
    console.log("Received input data:", inputData);  // 输出收到的输入数据

    if (!inputData.sio2 || !inputData.na2o || !inputData.h2o || !inputData.time || !inputData.temperature) {
        const errorMessage = "Please fill in all required fields.";
        console.error(errorMessage, inputData);  // 输出未提供的值
        sendErrorToRenderer(errorMessage);
        return {
            img: path.join(__dirname, 'xrd_images', 'error.png'),
            source: errorMessage,
            result: "Incomplete input"
        };
    }

    let closestData;
    try {
        closestData = dataSource.reduce((prev, curr) => {
            const prevDistance = Math.sqrt(
                Math.pow(prev.sio2 - inputData.sio2, 2) +
                Math.pow(prev.na2o - inputData.na2o, 2) +
                Math.pow(prev.h2o - inputData.h2o, 2) +
                Math.pow(prev.time - inputData.time, 2) +
                Math.pow(prev.temperature - inputData.temperature, 2)
            );
            const currDistance = Math.sqrt(
                Math.pow(curr.sio2 - inputData.sio2, 2) +
                Math.pow(curr.na2o - inputData.na2o, 2) +
                Math.pow(curr.h2o - inputData.h2o, 2) +
                Math.pow(curr.time - inputData.time, 2) +
                Math.pow(curr.temperature - inputData.temperature, 2)
            );
            console.log(`Comparing distances: prev=${prevDistance}, curr=${currDistance}`);  // 输出每次的距离比较
            return currDistance < prevDistance ? curr : prev;
        });

        if (!closestData) {
            throw new Error("No closest data found.");
        }
        console.log("Found closest data:", closestData);  // 输出找到的最近似数据
    } catch (error) {
        const errorMessage = `Error during data matching: ${error.message}`;
        console.error(errorMessage);
        sendErrorToRenderer(errorMessage);  // 将错误发送到前端
        return {
            img: path.join(__dirname, 'xrd_images', 'error.png'),
            source: errorMessage,
            result: "No match found"
        };
    }

    // 返回所有找到的最近似结果数据
    return {
        img: path.join(__dirname, 'xrd_images', closestData.img),
        source: closestData.source,
        result: closestData.result,
        sio2: closestData.sio2,  // 返回最近似数据
        na2o: closestData.na2o,
        h2o: closestData.h2o,
        time: closestData.time,
        temperature: closestData.temperature
    };
});

