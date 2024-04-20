import axios from "axios";
import { setRefreshAPIToken } from "./refreshAPI.js";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL,
});

export function setRefreshToken(token) {
  api.defaults.headers.common["x-refresh-token"] = token;
  setRefreshAPIToken(token);
}

export function setAccessToken(token) {
  api.defaults.headers.common["authorization"] = `Bearer ${token}`;
}

//Reset Payment Pin

export const resetPaymentPinAPI = async ({ phoneNumber, paymentPin, otp }) => {
  try {
    const response = await api.patch("/auth/reset/pin", {
      phoneNumber,
      paymentPin,
      otp,
    });
    const status = response.status;
    const data = response.data;
    return { status, data, error: false };
  } catch (error) {
    const status = error?.response?.status || 4000;
    const data = error?.response?.data || {};
    return { status, data, error: true };
  }
};

// User

export const balanceAPI = async () => {
  try {
    const response = await api.get("/user/balance");
    const status = response.status;
    const data = response.data;
    return { status, data, error: false };
  } catch (error) {
    const status = error?.response?.status || 4000;
    const data = error?.response?.data || {};
    return { status, data, error: true };
  }
};

export const detailsAPI = async ({ phoneNumber }) => {
  try {
    const response = await api.get(`/user/details/${phoneNumber}`);
    const status = response.status;
    const data = response.data;
    return { status, data, error: false };
  } catch (error) {
    const status = error?.response?.status || 4000;
    const data = error?.response?.data || {};
    return { status, data, error: true };
  }
};

//Transaction

export const depositAPI = async ({ amount }) => {
  try {
    const response = await api.post("/transaction/deposit", { amount });
    const status = response.status;
    const data = response.data;
    return { status, data, error: false };
  } catch (error) {
    const status = error?.response?.status || 4000;
    const data = error?.response?.data || {};
    return { status, data, error: true };
  }
};

export const verifyAPI = async ({
  razorpay_payment_id,
  razorpay_signature,
}) => {
  try {
    const response = await api.post("/transaction/verify", {
      razorpay_payment_id,
      razorpay_signature,
    });
    const status = response.status;
    const data = response.data;
    return { status, data, error: false };
  } catch (error) {
    const status = error?.response?.status || 4000;
    const data = error?.response?.data || {};
    return { status, data, error: true };
  }
};

export const transferAPI = async ({ receiver_id, amount, paymentPin }) => {
  try {
    const response = await api.post("/transaction/transfer", {
      receiver_id,
      amount,
      paymentPin,
    });
    const status = response.status;
    const data = response.data;
    return { status, data, error: false };
  } catch (error) {
    const status = error?.response?.status || 4000;
    const data = error?.response?.data || {};
    return { status, data, error: true };
  }
};

export const withdrawAPI = async ({
  beneficiary,
  accountNumber,
  ifsc,
  amount,
  paymentPin,
}) => {
  try {
    const response = await api.post("/transaction/withdraw", {
      beneficiary,
      accountNumber,
      ifsc,
      amount,
      paymentPin,
    });
    const status = response.status;
    const data = response.data;
    return { status, data, error: false };
  } catch (error) {
    const status = error?.response?.status || 4000;
    const data = error?.response?.data || {};
    return { status, data, error: true };
  }
};

export const historyAPI = async ({ page, limit }) => {
  try {
    const response = await api.get(
      `/transaction/history?page=${page}&limit=${limit}`
    );
    const status = response.status;
    const data = response.data;
    return { status, data, error: false };
  } catch (error) {
    const status = error?.response?.status || 4000;
    const data = error?.response?.data || {};
    return { status, data, error: true };
  }
};
