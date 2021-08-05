import { api } from "../apiClient";

export const getChannels = id => api.get(`/channels/${id}`);

export const createChannel = (id, body) => api.post(`/channels/${id}`, body);

export const editChannel = (guildId, channelId, body) =>
  api.put(`/channels/${guildId}/${channelId}`, body);

export const deleteChannel = () => null;

export const getPrivateChannelMembers = () => null;
