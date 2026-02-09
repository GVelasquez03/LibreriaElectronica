import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createBook } from "../../services/bookService";
import Swal from "sweetalert2";
import { getAllCategories } from "../../services/CategoryService";
import {ArrowLeft,BookOpen,Upload,DollarSign,User,Image,Tag,FileText,X,CheckCircle} from "lucide-react";
import type { Categoria } from "../../types/categoria";
import type { CreateBookDTO } from "../../types/book";


export default function AdminAdd() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(false);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);

    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [pdfPreview, setPdfPreview] = useState<string>("");
    const [pdfSize, setPdfSize] = useState<string>("");

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

    const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            // Validar que sea PDF
            if (file.type !== "application/pdf") {
                Swal.fire({
                    icon: "error",
                    title: "Formato inválido",
                    text: "Solo se permiten archivos PDF",
                    confirmButtonColor: "#ef4444",
                    background: "#1f2937",
                    color: "#fff",
                });
                e.target.value = "";
                return;
            }

            // Validar tamaño (50MB máximo)
            const maxSize = 50 * 1024 * 1024; // 50MB
            if (file.size > maxSize) {
                Swal.fire({
                    icon: "error",
                    title: "Archivo muy grande",
                    text: `El archivo PDF no debe superar los 50MB (tienes: ${(file.size / (1024 * 1024)).toFixed(2)}MB)`,
                    confirmButtonColor: "#ef4444",
                    background: "#1f2937",
                    color: "#fff",
                });
                e.target.value = "";
                return;
            }

            setPdfFile(file);
            setPdfPreview(file.name);
            setPdfSize((file.size / (1024 * 1024)).toFixed(2) + " MB");
        }
    };

    const handleRemovePdf = () => {
        setPdfFile(null);
        setPdfPreview("");
        setPdfSize("");
        const fileInput = document.getElementById("pdfFile") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación
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

            // Preparar payload
            const payload = {
                title: form.title,
                author: form.author,
                description: form.description || "",
                categoryId: form.categoryId,
                cover: form.cover,
                price: form.price
            };

            console.log("Enviando libro con payload:", payload);
            console.log("PDF adjunto:", pdfFile ? pdfFile.name : "Ninguno");

            const createdBook = await createBook(payload, pdfFile || undefined);
            console.log("Libro creado:", createdBook);

            // Éxito
            Swal.fire({
                icon: "success",
                title: "¡Libro agregado!",
                html: `<div class="text-left">
                    <p>El libro se registró correctamente</p>
                    ${pdfFile ? `<p class="mt-2 text-green-400">✓ PDF adjunto: ${pdfFile.name}</p>` : ''}
                </div>`,
                confirmButtonColor: "#10b981",
                background: "#1f2937",
                color: "#fff",
                showConfirmButton: false,
                timer: 3000,
            }).then(() => {
                navigate("/admin");
            });

        }catch (error: unknown) {
            console.error("Error completo:", error);

            let errorMessage = "No se pudo guardar el libro. Intenta nuevamente.";

            if (error instanceof Error) {
                if (error.message.includes("Error 415")) {
                    errorMessage = "Error en el formato de datos. Verifica que todos los campos sean válidos.";
                } else if (error.message.includes("Error 500")) {
                    errorMessage = "Error interno del servidor. Verifica la consola del backend.";
                }
            }

            Swal.fire({
                icon: "error",
                title: "Error al guardar",
                text: errorMessage,
                confirmButtonColor: "#ef4444",
                background: "#1f2937",
                color: "#fff",
            });
        }   
    };

    const handleCancel = () => {
        if (form.title || form.author || form.description || form.cover || pdfFile) {
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
                {/* Header */}
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

                {/* Formulario */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Primera Fila */}
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

                        {/* Segunda Fila */}
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
                                        step="any"
                                        name="price"
                                        value={form.price}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        min="0"
                        
                                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* URL de Portada */}
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

                        {/* Subir PDF */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                <FileText className="w-4 h-4" />
                                Archivo PDF (Opcional)
                                {pdfFile && <CheckCircle className="w-4 h-4 text-green-500 ml-1" />}
                            </label>

                            <div className="relative">
                                <input
                                    id="pdfFile"
                                    type="file"
                                    accept=".pdf,application/pdf"
                                    onChange={handlePdfChange}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                />
                            </div>

                            {/* Preview del PDF seleccionado */}
                            {pdfPreview && (
                                <div className="mt-3 p-4 bg-gray-700/50 rounded-lg border border-green-500/30">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-green-400" />
                                            <div>
                                                <p className="text-white font-medium truncate max-w-xs">
                                                    {pdfPreview}
                                                </p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-gray-400 text-sm">
                                                        {pdfSize}
                                                    </span>
                                                    <span className="text-xs bg-green-900/50 text-green-300 px-2 py-1 rounded">
                                                        ✓ Listo para subir
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleRemovePdf}
                                            className="p-2 hover:bg-gray-600 rounded-lg transition"
                                            title="Eliminar PDF"
                                        >
                                            <X className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <p className="text-gray-500 text-xs mt-1">
                                Máximo 50MB. Solo archivos PDF. Este campo es opcional.
                            </p>
                        </div>

                        {/* Descripción */}
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

                        {/* Preview de Portada */}
                        {form.cover && (
                            <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                                <h4 className="text-sm font-medium text-gray-300 mb-3">
                                    Vista previa de la portada
                                </h4>
                                <div className="flex items-center gap-4">
                                    <div className="w-24 h-32 bg-gradient-to-br from-gray-600 to-gray-800 rounded-md overflow-hidden flex-shrink-0 border border-gray-500">
                                        <img
                                            src={form.cover}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                const parent = e.currentTarget.parentElement;
                                                if (parent) {
                                                    parent.innerHTML = '<div class="flex items-center justify-center h-full text-gray-500">Imagen no disponible</div>';
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        <p className="font-medium text-white mb-1">URL válida</p>
                                        <p className="truncate max-w-md text-xs">{form.cover}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Botones */}
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

                {/* Nota */}
                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm">
                        <span className="text-yellow-500">*</span> Campos obligatorios
                    </p>
                </div>
            </div>
        </div>
    );
}