import axios from "axios";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL,
});

export function setRefreshAPIToken(token) {
  api.defaults.headers.common["x-refresh-token"] = token;
}

export const refreshAPI = async () => {
  try {
    const response = await api.get("/auth/refresh");
    const status = response.status;
    const data = response.data;
    return { status, data, error: false };
  } catch (error) {
    const status = error?.response?.status || 4000;
    const data = error?.response?.data || {};
    return { status, data, error: true };
  }
};
