import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";

import BookGrid from "../../components/BookGrid/BookGrid";
import type { Book } from "../../types/book";
import { getAllBooks, deleteBook, getBooksByCategory, searchBooks } from "../../services/bookService";

export default function AdminHome() {
    const navigate = useNavigate();
    const [books, setBooks] = useState<Book[]>([]);
    console.log(books);
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const category = searchParams.get("category");
    const searchQuery = searchParams.get("search") || "";

    useEffect(() => {
        loadBooks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category, searchQuery]);

    const loadBooks = async () => {
        try {
            setLoading(true);
            let data: Book[] = [];

            // 1. Prioridad: búsqueda por texto
            if (searchQuery) {
                data = await searchBooks(searchQuery);
            }
            // 2. Si no hay búsqueda, filtrar por categoría
            else if (category) {
                data = await getBooksByCategory(category);
            }
            // 3. Si no hay filtros, traer todos
            else {
                data = await getAllBooks();
            }

            setBooks(data);
            setFilteredBooks(data);

        } catch (error) {
            console.error("Error cargando los libros: " + error);
        } finally {
            setLoading(false);
        }
    };

    // ✏️ EDITAR
    const handleEdit = (book: Book) => {
        navigate(`/admin/edit/${book.id}`);
    };

    // 🗑 ELIMINAR con SweetAlert
    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: "¿Eliminar libro?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            background: "#0f172a",
            color: "#fbbf24",
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#334155",
        });

        if (!result.isConfirmed) return;

        try {
            await deleteBook(id);

            setBooks((prev) => prev.filter((b) => b.id !== id));
            setFilteredBooks((prev) => prev.filter((b) => b.id !== id));

            Swal.fire({
                icon: "success",
                title: "Eliminado",
                text: "El libro fue eliminado correctamente",
                background: "#0f172a",
                color: "#fbbf24",
                confirmButtonColor: "#f59e0b",
                timer: 1400,
                showConfirmButton: false,
            });
        } catch {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo eliminar el libro",
                background: "#0f172a",
                color: "#fbbf24",
                confirmButtonColor: "#ef4444",
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#151515] text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#735CDB]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#151515] px-6 py-6">
            {/* Mostrar filtros activos */}
            <div className="mb-6 px-6">
                
                    {searchQuery && (
                        <span className="inline-flex items-center gap-2 bg-[#735CDB]/20 text-[#735CDB] px-3 py-1 rounded-full text-sm mt-2.5">
                            Búsqueda: "{searchQuery}"
                            <button
                                onClick={() => {
                                    const params = new URLSearchParams(searchParams);
                                    params.delete("search");
                                    navigate(`/admin?${params.toString()}`);
                                }}
                                className="hover:text-white text-lg"
                            >
                                ×
                            </button>
                        </span>
                    )}
                
            </div>

            {/* Título y contador */}
            <div className="px-6 mb-4">
                <h2 className="text-xl text-[#735CDB]">
                    {filteredBooks.length} libro{filteredBooks.length !== 1 ? 's' : ''} encontrado{filteredBooks.length !== 1 ? 's' : ''}
                </h2>
            </div>

            {/* GRID */}
            <BookGrid
                books={filteredBooks}
                isAdmin
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Mensaje si no hay resultados */}
            {filteredBooks.length === 0 && (
                <div className="text-center py-12 text-gray-400 bg-gray-800/30 rounded-xl mx-6">
                    <p className="text-lg mb-2">No se encontraron libros</p>
                    <p className="text-sm">
                        {searchQuery
                            ? `Intenta con otra palabra clave o `
                            : category
                                ? `No hay libros en esta categoría o `
                                : ``
                        }
                        <button
                            onClick={() => navigate("/admin")}
                            className="text-[#735CDB] hover:underline"
                        >
                            ver todos los libros
                        </button>
                    </p>
                </div>
            )}
        </div>
    );
}
