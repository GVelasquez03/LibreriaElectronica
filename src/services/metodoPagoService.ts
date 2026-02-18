import api from "./api";
import type { CreateMetodoPagoDTO, MetodoPago } from "../types/MetodoPago";

// Crear un Metodo de Pago
export const createMetodoPago = async (data: CreateMetodoPagoDTO) => {
    const response = await api.post("/api/metodos-pago", data);
    return response.data;
};

// Obtener Metodos de Pago
export const getAllMetodosPago = async (): Promise<MetodoPago[]> => {
    const response = await api.get("/api/metodos-pago");
    return response.data;
};

// Actualizar Metodo de Pago
export const updateMetodoPago = async (id: number, data: CreateMetodoPagoDTO) => {
    const response = await api.put(`/api/metodos-pago/${id}`, data);
    return response.data;
};

// Eliminar Metodo de Pago
export const deleteMetodoPago = async (id: number) => {
    const response = await api.delete(`/api/metodos-pago/${id}`);
    return response.data;
};