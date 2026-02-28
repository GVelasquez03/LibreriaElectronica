const API_URL = "http://localhost:8080";
import type { Orden } from "../types/orden";
import type { LoginResponse, RegisterData, UserInfoToken} from "../types/registerData";
import api from "./api";
import { getToken } from "./authService";

// VERIFICAR EL INICIO DE SESION 
export async function login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) { throw new Error("Credenciales inválidas"); }

    return response.json();
}

// SERVICIO PARA REGISTRAR USUARIOS 
export const register = async (data: RegisterData) => {
    const response = await api.post("/user/register", data);
    return response.data;
};

// SERVICIO PARA VERIFICAR EL EMAIL CON EL TOKEN 
export const verifyEmailToken = async (token: string) => {
    try {
        const response = await api.get(`/api/auth/verify?token=${token}`);
        return response.data;
    } catch (error) {
        console.error("Error verificando email:", error);
        throw error;
    }
};

// REENVIAR EMAIL DE VERIFICACION (no usado todavia)
export const resendVerificationEmail = async (email: string) => {
    try {
        const response = await api.post("/auth/resend-verification", { email });
        return response.data;
    } catch (error) {
        console.error("Error reenviando verificación:", error);
        throw error;
    }
};

// OBTENER DATOS DEL USUARIO ATRAVES DEL TOKEN 
export const getCurrentUser = (): UserInfoToken | null => {
    try {
        const token = getToken();
        if (!token) return null;

        // Decodificar el token JWT (parte del payload)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));

        return {
            email: payload.email || payload.sub,
            role: payload.role || 'USER'
        };
    } catch (error) {
        console.error('Error obteniendo usuario:', error);
        return null;
    }
};


// OBTENER LISTADO DE ORDENES DE UN USUARIO
export const getOrdenesByEmail = async (email: string): Promise<Orden[]> => {
    try {
        // URL encode para manejar caracteres especiales en el email
        const emailEncoded = encodeURIComponent(email);
        const response = await api.get(`/api/ordenes/compras?email=${emailEncoded}`);
        return response.data;
    } catch (error) {
        console.error("Error obteniendo órdenes por email:", error);
        throw error;
    }
};