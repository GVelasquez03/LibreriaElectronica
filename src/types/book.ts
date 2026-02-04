import type { Categoria } from "./categoria";

export interface Book {
    id: number;
    title: string;
    author: string;
    description: string;
    cover: string;
    price: number;
    category: Categoria;
}

// Esta interfaz representa tu 'BookRequestDTO' de Java
export interface CreateBookDTO {
    title: string;
    author: string;
    description: string;
    categoryId: number;
    cover: string;
    price: number;
}