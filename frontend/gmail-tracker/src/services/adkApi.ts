import axios from "axios";

export const adkApi = axios.create({
  baseURL: import.meta.env.VITE_ADK_API_URL,
  withCredentials: true,
  // after 10 second of waiting change it to the error
  timeout: Infinity,
});

// call fastapi /agent/chat
export const agentApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  // after 10 second of waiting change it to the error
  timeout: Infinity,
});
