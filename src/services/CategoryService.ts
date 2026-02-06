import type { Categoria } from "../types/categoria";

// Ajusta la URL base a tu configuración
const API_URL = "http://localhost:8080/api/categories";

// Obtener todos las categorias
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

// Crear una categoria
// export async function createCategory(name: string): Promise<Categoria> {
//     const res = await fetch(API_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name }),
//     });

//     if (!res.ok) throw new Error("Error creando categoría");
//     return res.json();
// }

export const createCategory = async (name: string) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify({ name }),
        });

        // Verifica si la respuesta está vacía
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            return data;
        } else {
            // Si no hay JSON, verifica si fue exitoso
            if (response.ok) {
                return { success: true, id: Date.now() }; // O algún identificador temporal
            } else {
                throw new Error("Error al crear categoría");
            }
        }
    } catch (error) {
        console.error("Error creando categoría:", error);
        throw error;
    }
};

// Actualizar la categoria
export async function updateCategory(id: number, name: string): Promise<Categoria> {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });

    if (!res.ok) throw new Error("Error actualizando categoría");
    return res.json();
}

// Eliminar categoria
export async function deleteCategory(id: number) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });

    if (!res.ok) throw new Error("No se puede eliminar la categoría");
}