import type { Book, BookRequest, CreateBookDTO } from "../types/book";
import api from "./api";

const API_URL = "http://localhost:8080/api/books";

// obtener todos los libros
export async function getAllBooks(): Promise<Book[]> {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Error al obtener los libros");
    }

    return response.json();
}

//Eliminar un libro
export async function deleteBook(id: number) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });

    if (!res.ok) throw new Error("Error al eliminar libro");
}

// obtener libor por id  >>>>>>>>>>>>>  /// modifique para que me devuelva un bookRelation no "book"
export async function getBookById(id: number): Promise<BookRequest> {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
        throw new Error("Libro no encontrado");
    }

    return response.json();
}

// obtener libro por categoria
export async function getBooksByCategory(category: string): Promise<Book[]> {
    const res = await fetch(`${API_URL}/category/${category}`);

    if (!res.ok) {
        throw new Error("Error al cargar libros");
    }

    return res.json();
}

// Crear un libro con o sin PDF :)
export const createBook = async (bookData: CreateBookDTO, pdfFile?: File) => {
    try {
        // 1. Crear FormData
        const formData = new FormData();

        // 2. Agregar datos del libro como JSON string
        formData.append("bookData", JSON.stringify(bookData));

        // 3. Agregar archivo PDF si existe
        if (pdfFile) {
            formData.append("pdfFile", pdfFile);
        }

        console.log("Enviando FormData con:", {
            bookData: formData,
            hasPdf: !!pdfFile
        });

        // 4. Enviar petición
        const response = await fetch(`${API_URL}`, {
            method: "POST",
            body: formData,
            // NO agregar headers 'Content-Type' - fetch lo hace automático con boundary
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log("Libro creado exitosamente:", result);
        return result;

    } catch (error) {
        console.error("Error creando libro:", error);
        throw error;
    }
};

// Función para descargar PDF
export const downloadBookPdf = async (filename: string) => {
    try {
        const response = await fetch(`${API_URL}/pdf/download/${filename}`);

        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error("Error descargando PDF:", error);
        throw error;
    }
};

// Función para ver PDF en nueva pestaña
export const viewBookPdf = (filename: string): void => {
    const url = `${API_URL}/books/pdf/${filename}`;
    window.open(url, "_blank");
};


// EDITAR UN BOOK
export const updateBook = async (id: number, book: Partial<CreateBookDTO>): Promise<Book> => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
    });

    if (!res.ok) throw new Error("Error al actualizar");
    return res.json();
};


// Encontraar libro para el Buscador
export const searchBooks = async (query: string): Promise<Book[]> => {
    try {
        const response = await api.get(`/api/books/search?q=${encodeURIComponent(query)}`);
        return response.data;
    } catch (error) {
        console.error("Error buscando libros:", error);
        // Fallback: filtrar localmente si el endpoint no existe
        const allBooks = await getAllBooks();
        const lowerQuery = query.toLowerCase();
        return allBooks.filter(book =>
            book.title.toLowerCase().includes(lowerQuery) ||
            book.author.toLowerCase().includes(lowerQuery)
        );
    }
};