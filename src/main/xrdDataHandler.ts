import path from 'path';
import fs from 'fs';
import { ipcMain, BrowserWindow } from 'electron';

const dataFilePath = path.join(__dirname, 'data.json');
let dataSource: any[] = [];

// 发送错误消息到渲染进程
function sendErrorToRenderer(mainWindow: BrowserWindow, message: string) {
  if (mainWindow) {
    mainWindow.webContents.send('error', message);
  }
}

// 初始化时读取数据文件
export const initData = () => {
  fs.readFile(dataFilePath, 'utf-8', (err, data) => {
    if (err) {
      console.error("Failed to read data file:", err.message);
    } else {
      try {
        dataSource = JSON.parse(data);
        if (!Array.isArray(dataSource) || dataSource.length === 0) {
          console.error("Data source is empty or invalid.");
        } else {
          console.log("Data loaded successfully.");
        }
      } catch (parseError) {
        if (parseError instanceof Error) {
          console.error(`Failed to parse data: ${parseError.message}`);
        } else {
          console.error('Unknown error during JSON parsing.');
        }
      }
    }
  });
};

// 处理渲染进程请求查找最近似数据的 IPC 事件
export const handleFindClosestXRD = (mainWindow: BrowserWindow) => {
  ipcMain.handle('findClosestXRD', (event, inputData) => {
    console.log("Received input data:", inputData);

    if (!inputData.sio2 || !inputData.na2o || !inputData.h2o || !inputData.time || !inputData.temperature) {
      const errorMessage = "Please fill in all required fields.";
      console.error(errorMessage, inputData);
      sendErrorToRenderer(mainWindow, errorMessage);
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
        return currDistance < prevDistance ? curr : prev;
      });

      if (!closestData) {
        throw new Error("No closest data found.");
      }
      console.log("Found closest data:", closestData);
    } catch (matchingError) {
      if (matchingError instanceof Error) {
        const errorMessage = `Error during data matching: ${matchingError.message}`;
        console.error(errorMessage);
        sendErrorToRenderer(mainWindow, errorMessage);
        return {
          img: path.join(__dirname, 'xrd_images', 'error.png'),
          source: errorMessage,
          result: "No match found"
        };
      } else {
        console.error('Unknown error during data matching.');
      }
    }

    const jsonFilePath = path.join(__dirname, 'xrd_data', `${closestData.source}.json`);
    let jsonData;
    try {
      const fileContent = fs.readFileSync(jsonFilePath, 'utf8');
      jsonData = JSON.parse(fileContent);
    } catch (fileError) {
      if (fileError instanceof Error) {
        const errorMessage = `Error loading XRD data from file: ${fileError.message}`;
        sendErrorToRenderer(mainWindow, errorMessage);
        return {
          img: path.join(__dirname, 'xrd_images', 'error.png'),
          source: `Error loading XRD data from file: ${closestData.source}`,
          result: "Data loading error"
        };
      } else {
        console.error('Unknown error during file reading.');
      }
    }

    return {
      img: path.join(__dirname, 'xrd_images', closestData.img),
      source: closestData.source,
      result: closestData.result,
      sio2: closestData.sio2,
      na2o: closestData.na2o,
      h2o: closestData.h2o,
      time: closestData.time,
      temperature: closestData.temperature,
      data: jsonData
    };
  });
};
