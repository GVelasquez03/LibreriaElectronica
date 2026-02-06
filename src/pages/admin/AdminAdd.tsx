import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createBook } from "../../services/bookService";
import Swal from "sweetalert2";
import { getAllCategories } from "../../services/CategoryService";
import { ArrowLeft, BookOpen, Upload, DollarSign, User, Image, Tag } from "lucide-react";
import type { Categoria } from "../../types/categoria";
import type { CreateBookDTO } from "../../types/book";

export default function AdminAdd() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(false);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);

    const [form, setForm] = useState<CreateBookDTO>({
        title: "",
        author: "",
        description: "",
        categoryId: 0,
        cover: "",
        price: 0,
    });

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setIsLoadingCategories(true);
                const data = await getAllCategories();
                setCategories(data);
            } catch (error) {
                console.error("Error cargando categorías:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudieron cargar las categorías",
                    confirmButtonColor: "#ef4444",
                    background: "#1f2937",
                    color: "#fff",
                });
            } finally {
                setIsLoadingCategories(false);
            }
        };
        loadCategories();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: (name === "price" || name === "categoryId") ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación mejorada
        const errors = [];
        if (!form.title.trim()) errors.push("título");
        if (!form.author.trim()) errors.push("autor");
        if (!form.categoryId || form.categoryId === 0) errors.push("categoría");
        if (!form.cover.trim()) errors.push("URL de portada");
        if (!form.price || form.price <= 0) errors.push("precio válido");

        if (errors.length > 0) {
            Swal.fire({
                icon: "warning",
                title: "Campos incompletos",
                html: `<div class="text-left"><p class="mb-2">Por favor completa:</p><ul class="list-disc pl-4">${errors.map(err => `<li class="text-yellow-300">${err}</li>`).join('')}</ul></div>`,
                confirmButtonColor: "#3b82f6",
                background: "#1f2937",
                color: "#fff",
            });
            return;
        }

        try {
            setLoading(true);
            const payload: CreateBookDTO = {
                ...form,
                categoryId: Number(form.categoryId)
            };

            await createBook(payload);

            Swal.fire({
                icon: "success",
                title: "¡Libro agregado!",
                text: "El libro se registró correctamente",
                confirmButtonColor: "#10b981",
                background: "#1f2937",
                color: "#fff",
                showConfirmButton: false,
                timer: 2000,
            }).then(() => {
                navigate("/admin");
            });

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error al guardar",
                text: "No se pudo guardar el libro. Por favor, intenta nuevamente.",
                confirmButtonColor: "#ef4444",
                background: "#1f2937",
                color: "#fff",
            });
            console.error("Error al crear libro:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (form.title || form.author || form.description || form.cover) {
            Swal.fire({
                title: "¿Cancelar cambios?",
                text: "Los cambios no guardados se perderán",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#ef4444",
                cancelButtonColor: "#6b7280",
                confirmButtonText: "Sí, cancelar",
                cancelButtonText: "Continuar editando",
                background: "#1f2937",
                color: "#fff",
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/admin");
                }
            });
        } else {
            navigate("/admin");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header Compacto */}
                <div className="mb-8">
                    <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 text-gray-300 hover:text-white transition mb-4 group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Volver al panel</span>
                    </button>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                            <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white">
                                Agregar Nuevo Libro
                            </h1>
                            <p className="text-gray-300 text-sm">
                                Completa todos los campos obligatorios (*)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Formulario Compacto en Grid 2x2 */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Primera Fila - 2 columnas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Título */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                    <BookOpen className="w-4 h-4" />
                                    Título del Libro *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="Ej: Cien años de soledad"
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    required
                                />
                            </div>

                            {/* Autor */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                    <User className="w-4 h-4" />
                                    Autor *
                                </label>
                                <input
                                    type="text"
                                    name="author"
                                    value={form.author}
                                    onChange={handleChange}
                                    placeholder="Ej: Gabriel García Márquez"
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    required
                                />
                            </div>
                        </div>

                        {/* Segunda Fila - 2 columnas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Categoría */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                    <Tag className="w-4 h-4" />
                                    Categoría *
                                </label>
                                <select
                                    name="categoryId"
                                    value={form.categoryId}
                                    onChange={handleChange}
                                    disabled={isLoadingCategories}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none disabled:opacity-50"
                                    required
                                >
                                    <option value="">{isLoadingCategories ? "Cargando categorías..." : "Selecciona una categoría"}</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id} className="bg-gray-800">
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Precio */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                    <DollarSign className="w-4 h-4" />
                                    Precio *
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        $
                                    </span>
                                    <input
                                        type="number"
                                        name="price"
                                        value={form.price}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Tercera Fila - URL de Portada (Full width) */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                <Image className="w-4 h-4" />
                                URL de la Portada *
                            </label>
                            <input
                                type="url"
                                name="cover"
                                value={form.cover}
                                onChange={handleChange}
                                placeholder="https://ejemplo.com/imagen.jpg"
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                required
                            />
                        </div>

                        {/* Cuarta Fila - Descripción (Full width) */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                <BookOpen className="w-4 h-4" />
                                Descripción
                            </label>
                            <textarea
                                name="description"
                                rows={3}
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describe el libro, su sinopsis, características importantes..."
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                            />
                        </div>

                        {/* Preview de Imagen Simple */}
                        {form.cover && (
                            <div className="mt-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                                <h4 className="text-sm font-medium text-gray-300 mb-3">
                                    Vista previa de la portada
                                </h4>
                                <div className="flex items-center gap-4">
                                    <div className="w-24 h-32 bg-gradient-to-br from-gray-600 to-gray-800 rounded-md overflow-hidden flex-shrink-0">
                                        <img
                                            src={form.cover}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        <p className="font-medium text-white mb-1">URL válida</p>
                                        <p className="truncate max-w-md">{form.cover}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Botones de Acción */}
                        <div className="pt-6 border-t border-gray-700">
                            <div className="flex flex-col sm:flex-row justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition font-medium flex items-center justify-center gap-2 order-2 sm:order-1"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-5 h-5" />
                                            Guardar Libro
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Nota de Campos Obligatorios */}
                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm">
                        <span className="text-yellow-500">*</span> Campos obligatorios
                    </p>
                </div>
            </div>
        </div>
    );
}