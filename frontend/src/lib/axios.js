import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true // send cookies automatically
});

// Attach Clerk JWT token dynamically if logged in
axiosInstance.interceptors.request.use(async (config) => {
  try {
    if (window.Clerk?.session) {
      const token = await window.Clerk.session.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.error("Error setting auth token:", error);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;