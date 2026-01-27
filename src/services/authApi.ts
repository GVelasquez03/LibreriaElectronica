const API_URL = "http://localhost:8080";

interface LoginResponse {
    token: string;
    role: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error("Credenciales inválidas");
    }

    return response.json();
}
