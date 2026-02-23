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

//NUEVO:Interfaz para usuario actual
export interface UserInfoToken {
    email: string;
    role: string;
}

//NUEVO:Interfaz para usuario actual
export interface UserOrden {
    id: number;
    nombreCompleto?: string;
    pais: string;
}