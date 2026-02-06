import { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../../services/CategoryService";
import type { Categoria } from "../../types/categoria";
import { Plus, Edit2, Trash2, RefreshCw } from "lucide-react";

export default function AdminCategories() {
    const [categories, setCategories] = useState<Categoria[]>([]);
    const [newName, setNewName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const load = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getAllCategories();
            setCategories(data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "No se pudieron cargar las categorías",
                icon: "error",
                confirmButtonColor: "#3b82f6",
            });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const handleCreate = async () => {
        if (!newName.trim()) {
            Swal.fire({
                title: "Advertencia",
                text: "El nombre de la categoría no puede estar vacío",
                icon: "warning",
                confirmButtonColor: "#3b82f6",
            });
            return;
        }

        setIsCreating(true);
        try {
            // Solo creamos la categoría, no nos importa la respuesta
            await createCategory(newName);

            // Limpiamos el input
            setNewName("");

            // Recargamos las categorías
            await load();

            // Mostramos mensaje de éxito
            Swal.fire({
                title: "¡Éxito!",
                text: "Categoría creada correctamente",
                icon: "success",
                confirmButtonColor: "#10b981",
                timer: 1500,
            });
        } catch (error) {
            // Verificamos si es el error de JSON
            if (error instanceof SyntaxError && error.message.includes("Unexpected end of JSON")) {
                // Si es el error de JSON pero la categoría se creó, forzamos recarga
                await load();
                Swal.fire({
                    title: "Categoría creada",
                    text: "La categoría se ha creado correctamente",
                    icon: "success",
                    confirmButtonColor: "#10b981",
                    timer: 1500,
                });
            } else {
                // Si es otro error, lo mostramos
                Swal.fire({
                    title: "Error",
                    text: "No se pudo crear la categoría",
                    icon: "error",
                    confirmButtonColor: "#ef4444",
                });
            }
        } finally {
            setIsCreating(false);
        }
    };

    const handleEdit = async (cat: Categoria) => {
        const { value } = await Swal.fire({
            title: "Editar categoría",
            input: "text",
            inputValue: cat.name,
            showCancelButton: true,
            confirmButtonColor: "#3b82f6",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",
            inputValidator: (value) => {
                if (!value) {
                    return "El nombre de la categoría no puede estar vacío";
                }
            },
        });

        if (value) {
            try {
                await updateCategory(cat.id, value);
                await load();
                Swal.fire({
                    title: "¡Éxito!",
                    text: "Categoría actualizada correctamente",
                    icon: "success",
                    confirmButtonColor: "#10b981",
                    timer: 1500,
                });
            } catch (error) {
                // Manejo similar para errores de JSON en actualización
                if (error instanceof SyntaxError && error.message.includes("Unexpected end of JSON")) {
                    await load();
                    Swal.fire({
                        title: "Categoría actualizada",
                        text: "La categoría se ha actualizado correctamente",
                        icon: "success",
                        confirmButtonColor: "#10b981",
                        timer: 1500,
                    });
                } else {
                    Swal.fire({
                        title: "Error",
                        text: "No se pudo actualizar la categoría",
                        icon: "error",
                        confirmButtonColor: "#ef4444",
                    });
                }
            }
        }
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: "¿Eliminar categoría?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            try {
                await deleteCategory(id);
                await load();
                Swal.fire({
                    title: "Eliminada",
                    text: "La categoría ha sido eliminada",
                    icon: "success",
                    confirmButtonColor: "#10b981",
                    timer: 1500,
                });
            } catch (error) {
                // Manejo similar para errores de JSON en eliminación
                if (error instanceof SyntaxError && error.message.includes("Unexpected end of JSON")) {
                    await load();
                    Swal.fire({
                        title: "Categoría eliminada",
                        text: "La categoría se ha eliminado correctamente",
                        icon: "success",
                        confirmButtonColor: "#10b981",
                        timer: 1500,
                    });
                } else {
                    Swal.fire({
                        title: "Error",
                        text: "No se pudo eliminar la categoría",
                        icon: "error",
                        confirmButtonColor: "#ef4444",
                    });
                }
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header con botón de recargar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Gestión de Categorías</h2>
                        <p className="text-gray-300 text-sm md:text-base">Administra las categorías de tu tienda</p>
                    </div>
                    <button
                        onClick={load}
                        disabled={isLoading}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition flex items-center gap-2 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        {isLoading ? "Cargando..." : "Recargar"}
                    </button>
                </div>

                {/* Add Category Form */}
                <div className="bg-gray-800 rounded-xl p-4 md:p-6 mb-6 md:mb-8 shadow-lg border border-gray-700">
                    <h3 className="text-lg md:text-xl font-semibold text-white mb-3 md:mb-4">Agregar Nueva Categoría</h3>
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Ej: Novela, Ciencia Ficción, Historia..."
                                className="w-full px-4 py-2 md:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm md:text-base"
                                onKeyPress={(e) => e.key === "Enter" && !isCreating && handleCreate()}
                                disabled={isCreating}
                            />
                        </div>
                        <button
                            onClick={handleCreate}
                            disabled={isCreating || !newName.trim()}
                            className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 text-sm md:text-base"
                        >
                            {isCreating ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                    Creando...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4 md:w-5 md:h-5" />
                                    Agregar Categoría
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Categories List */}
                <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg border border-gray-700">
                    <div className="flex justify-between items-center mb-4 md:mb-6">
                        <h3 className="text-lg md:text-xl font-semibold text-white">Categorías Existentes</h3>
                        <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs md:text-sm">
                            {isLoading ? "Cargando..." : `${categories.length} categorías`}
                        </span>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-8 md:py-12">
                            <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="text-center py-8 md:py-12">
                            <div className="text-gray-400 mb-3 md:mb-4">No hay categorías registradas</div>
                            <p className="text-gray-500 text-sm md:text-base">Comienza agregando tu primera categoría</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    className="bg-gray-700 rounded-lg p-3 md:p-4 hover:bg-gray-650 transition group border border-gray-600"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-base md:text-lg font-medium text-white truncate">{cat.name}</h4>
                                            <p className="text-gray-400 text-xs md:text-sm mt-1">ID: {cat.id}</p>
                                        </div>
                                        <div className="flex gap-1 md:gap-2 ml-2">
                                            <button
                                                onClick={() => handleEdit(cat)}
                                                className="p-1.5 md:p-2 bg-blue-900/30 text-blue-400 hover:bg-blue-900/50 rounded-lg transition flex-shrink-0"
                                                title="Editar"
                                            >
                                                <Edit2 className="w-3 h-3 md:w-4 md:h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat.id)}
                                                className="p-1.5 md:p-2 bg-red-900/30 text-red-400 hover:bg-red-900/50 rounded-lg transition flex-shrink-0"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}