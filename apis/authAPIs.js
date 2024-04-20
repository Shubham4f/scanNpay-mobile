import axios from "axios";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL,
});

export const sendOTPAPI = async ({ phoneNumber }) => {
  try {
    const response = await api.post("/auth/otp", {
      phoneNumber,
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

export const signUpAPI = async ({
  firstName,
  lastName,
  phoneNumber,
  password,
  paymentPin,
  otp,
}) => {
  try {
    const response = await api.post("/auth/signup", {
      firstName,
      lastName,
      phoneNumber,
      password,
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

export const signInAPI = async ({ phoneNumber, password }) => {
  try {
    const response = await api.post("/auth/signin", {
      phoneNumber,
      password,
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

export const resetPasswordAPI = async ({ phoneNumber, password, otp }) => {
  try {
    const response = await api.patch("/auth/reset/password", {
      phoneNumber,
      password,
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
