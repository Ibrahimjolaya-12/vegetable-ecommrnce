import axios from "axios";

// Central Backend API Instance
const api = axios.create({
  baseURL: "http://localhost:3000/api", // Apne backend port ke mutabiq check kar lena (e.g. 5000 ya 3000)
  withCredentials: true,
});

// Request Interceptor: Token automatically attach karega
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;