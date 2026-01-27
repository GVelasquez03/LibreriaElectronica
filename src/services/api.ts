import axios from "axios";
import { getToken, logout } from "./authService";

const api = axios.create({
    baseURL: "http://localhost:8080",
});

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Si el token expira → logout automático
api.interceptors.response.use(
    res => res,
    err => {
        if (err.response?.status === 401) {
            logout();
            window.location.href = "/login";
        }
        return Promise.reject(err);
    }
);

export default api;
