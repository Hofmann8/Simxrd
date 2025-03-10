import axiosInstance from './axios';

const fetchPresentations = async () => {
  try {
    const response = await axiosInstance.get('/store');
    // 假设演示文稿数据存储在response.data.store.presentations中
    if (response.data.store && response.data.store.presentations) {
      return response.data.store.presentations
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch presentations:', error);
  }
};

const savePresentationsToServer = async (presentations) => {
  try {
    await axiosInstance.put('/store', {
      store: {
        presentations,
      },
    });
  } catch (error) {
    console.error('Failed to save presentations:', error);
  }
};

// fetchPresentationById是异步函数，根据presentationId获取演示文稿详情
const fetchPresentationById = async (id) => {
  // 先获取所有presentation然后筛选出特定Id
  const presentations = await fetchPresentations();
  return presentations.find(p => p.id === id);
}

const fetchSlidesByPresentationId = async (presentationId) => {
  // 先获取当前presentation然后获取slides
  const presentation = await fetchPresentationById(presentationId);
  return presentation.slides;
}

const fetchXRDData = async (id) => {
  try {
    // 检测是否在Electron环境中
    const isElectron = window.electronAPI !== undefined;
    let xrdInfo = null;

    // 加载主数据文件
    if (isElectron && window.electronAPI) {
      try {
        // 在Electron环境中使用electronAPI读取文件
        const resourcePath = await window.electronAPI.getResourcePath('final_merged_data.json');
        if (resourcePath) {
          const content = await window.electronAPI.readFile(resourcePath);
          if (content) {
            const data = JSON.parse(content);
            xrdInfo = data.find(item => item.id === id);
          }
        }
      } catch (error) {
        console.error('使用electronAPI读取主数据文件失败:', error);
      }
    }

    // 如果在Electron中没有成功加载，或者在Web环境中，使用fetch
    if (!xrdInfo) {
      const response = await fetch('/final_merged_data.json');
      const data = await response.json();
      xrdInfo = data.find(item => item.id === id);
    }

    if (!xrdInfo) {
      throw new Error('XRD数据未找到');
    }

    // 加载对应的XRD数据文件
    let xrdData = null;

    if (isElectron && window.electronAPI) {
      try {
        // 在Electron环境中使用electronAPI读取XRD数据文件
        const dataPath = `xrd_data/${xrdInfo.data}`;
        const resourcePath = await window.electronAPI.getResourcePath(dataPath);
        if (resourcePath) {
          const content = await window.electronAPI.readFile(resourcePath);
          if (content) {
            xrdData = JSON.parse(content);
          }
        }
      } catch (error) {
        console.error('使用electronAPI读取XRD数据文件失败:', error);
      }
    }

    // 如果在Electron中没有成功加载，或者在Web环境中，使用fetch
    if (!xrdData) {
      const dataResponse = await fetch(`/xrd_data/${xrdInfo.data}`);
      xrdData = await dataResponse.json();
    }

    // 构建图像路径
    let imgPath = `/xrd_images/${xrdInfo.img}`;
    if (isElectron) {
      // 在Electron环境中，使用相对路径
      imgPath = `./xrd_images/${xrdInfo.img}`;
    }

    return {
      data: xrdData,
      img: imgPath,
      result: xrdInfo.result,
      source: xrdInfo.source,
      similarity: xrdInfo.similarity || 85, // 添加默认匹配度
      metadata: {
        sio2: xrdInfo.sio2,
        na2o: xrdInfo.na2o,
        h2o: xrdInfo.h2o,
        time: xrdInfo.time,
        temperature: xrdInfo.temperature
      }
    };
  } catch (error) {
    console.error('获取XRD数据失败:', error);
    throw error;
  }
};

export { fetchPresentations, savePresentationsToServer, fetchPresentationById, fetchSlidesByPresentationId, fetchXRDData };
