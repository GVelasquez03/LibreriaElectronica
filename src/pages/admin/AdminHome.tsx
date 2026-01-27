import { useEffect, useState} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";


import BookGrid from "../../components/BookGrid/BookGrid";
import type { Book } from "../../types/book";
import { getAllBooks, deleteBook, getBooksByCategory } from "../../services/bookService";

export default function AdminHome() {
    const navigate = useNavigate();
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const category = searchParams.get("category");

    useEffect(() => {
        loadBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category]);

    const loadBooks = async () => {
        try {
            if (category) {
                setLoading(true);
                const data = await getBooksByCategory(category);
                setBooks(data);
            }else{
                setLoading(true);
                const data = await getAllBooks();
                setBooks(data);
            } 
        } catch (error) {
            console.error("Error cargando los libros: "+error);
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
                Cargando libros...
            </div>
        );
    }

    return (
        
        <div className="min-h-screen bg-[#151515] px-6 py-6">
            {category && (
                <h2 className="text-xl text-[#735CDB] px-6 pt-6">
                    Categoría: <span className="font-semibold">{category}</span>
                </h2>
            )}

            {/* GRID */}
            <BookGrid
                books={books}
                isAdmin
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
}
