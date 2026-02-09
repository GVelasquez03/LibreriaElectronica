import type { Categoria } from "./categoria";

export interface Book {
    id: number;
    title: string;
    author: string;
    description: string;
    categoryId: number;
    cover: string;
    price: number;
    pdfFileName?: string; // Nuevo campo opcional
}

export interface BookRequest{
    id: number;
    title: string;
    author: string;
    description: string;
    category: Categoria;
    cover: string;
    price: number;
    pdfFilename?: string; // Nuevo campo opcional
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