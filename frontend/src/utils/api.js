import axios from 'axios';                       // 1

const API = axios.create({                       // 2
  baseURL: 'http://localhost:5000/api'           // 3
});

// attach token to each request if present
API.interceptors.request.use((config) => {       // 4
  const token = localStorage.getItem('token');  // 5
  if (token) config.headers.Authorization = `Bearer ${token}`; // 6
  return config;                                 // 7
});

export default API;                              // 8
