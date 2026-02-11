import axios from 'axios';

export const createApiInstance = (config) => {
  const api = axios.create(config);

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error(error);
      return Promise.reject(error);
    },
  );

  return api;
};

export const api = createApiInstance({
  baseURL: import.meta.env.VITE_API_URL + '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const removeAccessToken = () => {
  Cookies.remove('token');
};
