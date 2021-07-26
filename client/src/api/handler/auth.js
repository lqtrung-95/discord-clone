import { api } from "../apiClient";

export const register = body => api.post("/account/register", body);

export const login = body => api.post("/account/login", body);

export const logout = () => null;

export const forgotPassword = email =>
  api.post("/account/forgot-password", { email });

export const changePassword = () => null;

export const resetPassword = body => api.post("/account/reset-password", body);
