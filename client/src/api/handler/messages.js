import { api } from "../apiClient";

export const getMessages = () => null;

export const sendMessage = (channelId, data, onUploadProgress) =>
  api.post(`/messages/${channelId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

export const deleteMessage = () => null;

export const editMessage = () => null;
