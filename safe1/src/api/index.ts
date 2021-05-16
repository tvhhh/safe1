import { API_URL } from "react-native-dotenv";

const apiUrl = API_URL || "http://localhost:8080";

export const chatUrl = `${apiUrl}/chat`;
export const controlUrl = `${apiUrl}/control`;
export const dataUrl = `${apiUrl}/data`;