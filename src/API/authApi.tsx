import axios from "axios";
import type { AxiosInstance } from "axios";

const BASE_URL = "http://localhost:6969/api";

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
