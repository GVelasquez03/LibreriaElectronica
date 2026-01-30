import type { Categoria } from "../types/categoria";

// Ajusta la URL base a tu configuración
const API_URL = "http://localhost:8080/api/categories";

export const getAllCategories = async (): Promise<Categoria[]> => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Error al obtener categorías");
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};