import axios from 'axios';

console.log(import.meta.env.VITE_API_URL)
const BASE_URL = import.meta.env.VITE_API_URL;
console.log(BASE_URL)

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ts_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem('ts_token');
      localStorage.removeItem('ts_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ──────────────────────────────────────────────────────
export const authApi = {
  signup: (data) => axios.post(`${BASE_URL}/auth/signup`, data),
  login: (data) => axios.post(`${BASE_URL}/auth/login`, data),
};

// ─── Department ───────────────────────────────────────────────
export const departmentApi = {
  getAll: () => api.get('/department/get-department'),
  add: (data) => api.post('/department/add-department', data),
  update: (id, data) => api.put(`/department/update-department/${id}`, data),
  delete: (id) => api.delete(`/department/delete-department/${id}`),
};

// ─── Designation ──────────────────────────────────────────────
export const designationApi = {
  getAll: () => api.get('/designation/get-all-designation'),
  add: (data) => api.post('/designation/add-designation', data),
  update: (id, data) => api.put(`/designation/update-designation/${id}`, data),
  delete: (id) => api.delete(`/designation/delete-designation/${id}`),
};

// ─── Employee ─────────────────────────────────────────────────
export const employeeApi = {
  getAll: () => api.get('/employee/get-all-employee'),
  add: (data) => api.post('/employee/add-employee', data),
  update: (id, data) => api.put(`/employee/update-employee/${id}`, data),
  delete: (id) => api.delete(`/employee/delete-employee/${id}`),
  search: (name) => api.get(`/employee/search?name=${encodeURIComponent(name)}`),
};

export default api;
