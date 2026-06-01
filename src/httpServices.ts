import axios from "axios";

const app = axios.create({
  withCredentials: true,
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});

export const http = {
  get: app.get,
  post: app.post,
  put: app.put,
  delete: app.delete,
  patch: app.patch,
};
