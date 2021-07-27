import { api } from "../apiClient";

export const getUserDMs = () => api.get("/channels/me/dm");

export const getOrCreateDirectMessage = id => api.post(`/channels/${id}/dm`);

export const closeDirectMessage = id => api.delete(`/channels/${id}/dm`);
