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
    const response = await fetch('/final_merged_data.json');
    const data = await response.json();

    // 从 final_merged_data.json 中查找对应 id 的数据
    const xrdInfo = data.find(item => item.id === id);
    if (!xrdInfo) {
      throw new Error('XRD data not found');
    }

    // 加载对应的 XRD 数据文件
    const dataResponse = await fetch(`/xrd_data/${xrdInfo.data}`);
    const xrdData = await dataResponse.json();

    return {
      data: xrdData,
      img: `/xrd_images/${xrdInfo.img}`,
      result: xrdInfo.result,
      source: xrdInfo.source,
      metadata: {
        sio2: xrdInfo.sio2,
        na2o: xrdInfo.na2o,
        h2o: xrdInfo.h2o,
        time: xrdInfo.time,
        temperature: xrdInfo.temperature
      }
    };
  } catch (error) {
    console.error('Failed to fetch XRD data:', error);
    throw error;
  }
};

export { fetchPresentations, savePresentationsToServer, fetchPresentationById, fetchSlidesByPresentationId, fetchXRDData };
