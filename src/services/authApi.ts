const API_URL = "http://localhost:8080";
import type { LoginResponse, RegisterData} from "../types/registerData";
import api from "./api";

// Verificar el logout
export async function login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) { throw new Error("Credenciales inválidas");}

    return response.json();
}

// Servicio para el registro del Usuario
export const register = async (data: RegisterData) => {
    const response = await api.post("/user/register", data);
    return response.data;
};

// Servicio para verificar el email con token
export const verifyEmailToken = async (token: string) => {
    try {
        const response = await api.get(`/api/auth/verify?token=${token}`);
        return response.data;
    } catch (error) {
        console.error("Error verificando email:", error);
        throw error;
    }
};

// NUEVO: Reenviar email de verificación
export const resendVerificationEmail = async (email: string) => {
    try {
        const response = await api.post("/auth/resend-verification", { email });
        return response.data;
    } catch (error) {
        console.error("Error reenviando verificación:", error);
        throw error;
    }
};