import { API_URL } from '@env';

const apiUrl = API_URL || "localhost:3000";

export const chatUrl = `ws://${apiUrl}/chat`;
export const controlUrl = `ws://${apiUrl}/control`;
export const dataUrl = `http://${apiUrl}/data`;