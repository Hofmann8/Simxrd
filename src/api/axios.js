import axios from 'axios';

// 创建axios实例，并配置baseUrl
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5005',
});

// 请求拦截器
axiosInstance.interceptors.request.use(config => {
  // 尝试从localStorage获取Token
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});
export default axiosInstance;
