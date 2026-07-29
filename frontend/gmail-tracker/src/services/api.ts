import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // after 10 second of waiting change it to the error
  timeout: 10000,
});

export default api;
