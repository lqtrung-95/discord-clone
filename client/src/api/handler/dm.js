import { api } from "../apiClient";

export const getUserDMs = () => null;

export const getOrCreateDirectMessage = id => api.post(`/channels/${id}/dm`);

export const closeDirectMessage = () => null;
