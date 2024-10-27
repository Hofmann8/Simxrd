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

export { fetchPresentations, savePresentationsToServer, fetchPresentationById, fetchSlidesByPresentationId };
