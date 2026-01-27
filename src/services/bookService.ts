import type { Book } from "../types/book";

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

// obtener libor por id
export async function getBookById(id: number): Promise<Book> {
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


// Crear un libro
export async function createBook(book: Omit<Book, "id">): Promise<Book> {
    const res = await fetch("http://localhost:8080/api/books", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
    });

    if (!res.ok) {
        throw new Error("Error al crear libro");
    }

    return res.json();
}


// Editar un libro
export const updateBook = async (id: number, book: Partial<Book>) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
    });

    if (!res.ok) throw new Error("Error al actualizar");
    return res.json();
};