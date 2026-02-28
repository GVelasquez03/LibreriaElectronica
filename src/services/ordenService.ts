import api from "./api";
import type { Orden, OrdenRequest } from "../types/orden";
import type { UserOrden } from "../types/registerData";

// OBTENER TODAS LAS ORDENES
export const getAllOrdenes = async (): Promise<Orden[]> => {
    const response = await api.get("/api/ordenes");
    return response.data;
};

// OBTENER ORDEN POR ID
export const getOrdenById = async (id: number): Promise<Orden> => {
    const response = await api.get(`/api/ordenes/${id}`);
    return response.data;
};

// OBTENER ORDENES POR ID USUARIOS 
export const getOrdenesByUsuario = async (idUsuario: number): Promise<Orden[]> => {
    try{
        const response = await api.get(`/api/ordenes/usuario/${idUsuario}`);
        return response.data;
    } catch(error) {
        console.error("Error obteniendo órdenes del usuario:", error);
        throw error;
    }
    
};

// OBTENER UN USUARIO POR EMAIL
export const getUsuarioByEmail = async (email: string): Promise<UserOrden> => {
    try {
        const response = await api.get(`/api/ordenes/buscar?email=${email}`);
        return response.data;

    } catch (error) {
        console.error('Error obteniendo usuario:', error);
        throw error;
    }
};


// CREAR UNA ORDEN
export const createOrden = async (ordenData: OrdenRequest): Promise<Orden> => {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch("http://localhost:8080/api/ordenes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token ? `Bearer ${token}` : ""
            },
            body: JSON.stringify(ordenData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("❌ Error en createOrden:", error);
        throw error;
    }
};

// ACTUALIZAR EL ESTADO DE UNA ORDEN
export const updateEstadoOrden = async (id: number, estado: string): Promise<Orden> => {
    const response = await api.patch(`/api/ordenes/${id}/estado?estado=${estado}`);
    return response.data;
};
