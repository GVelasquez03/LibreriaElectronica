export interface RegisterData {
    email: string;
    password: string;
    nombreCompleto?: string;
    fechaNacimiento?: string;
    pais?: string;
    verificationToken?: string;
    isVerified?: boolean;
}

export interface LoginResponse {
    token: string;
    role: string;
}
