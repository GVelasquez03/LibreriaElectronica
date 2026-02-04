import type { Book, CreateBookDTO } from "../types/book";

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

// CREAR BOOK CON EL DTO
export async function createBook(book: CreateBookDTO): Promise<Book> {
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
// Cambiamos Partial<Book> por Partial<CreateBookDTO> 
// para que el ID de la categoría se envíe como 'categoryId: 5' y no como un objeto.
export const updateBook = async (id: number, book: Partial<CreateBookDTO>): Promise<Book> => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
    });

    if (!res.ok) throw new Error("Error al actualizar");
    return res.json();
};