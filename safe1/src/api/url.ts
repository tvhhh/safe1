import { API_URL } from '@env';

const apiUrl = API_URL || "http://localhost:8081";

export const chatUrl = `${apiUrl}/chat`;
export const controlUrl = `${apiUrl}/control`;
export const dataUrl = `${apiUrl}/data`;