import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
    ArrowLeft,
    Upload,
    CircleDollarSign,
    HandCoins,
    ReceiptText,
    Edit2,
    Trash2,
    RefreshCw,
    CreditCard,
    Wallet
} from "lucide-react";

import type { CreateMetodoPagoDTO, MetodoPago } from "../../types/MetodoPago";
import {
    createMetodoPago,
    getAllMetodosPago,
    updateMetodoPago,
    deleteMetodoPago
} from "../../services/metodoPagoService";

export default function AdminMetodoPago() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
    const [loadingList, setLoadingList] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [form, setForm] = useState<CreateMetodoPagoDTO>({
        nombre: "",
        moneda: "",
        detalles: "",
    });

    // Cargar métodos de pago
    const loadMetodosPago = async () => {
        try {
            setLoadingList(true);
            const data = await getAllMetodosPago();
            setMetodosPago(data);
        } catch (error) {
            console.error("Error cargando métodos de pago:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudieron cargar los métodos de pago",
                confirmButtonColor: "#ef4444",
                background: "#1f2937",
                color: "#fff",
            });
        } finally {
            setLoadingList(false);
        }
    };

    useEffect(() => {
        loadMetodosPago();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación básica
        const errors = [];
        if (!form.nombre.trim()) errors.push("nombre");
        if (!form.moneda.trim()) errors.push("moneda");
        if (!form.detalles.trim()) errors.push("detalles");

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

            if (editingId) {
                // Actualizar
                await updateMetodoPago(editingId, form);
                Swal.fire({
                    icon: "success",
                    title: "¡Método de Pago actualizado!",
                    timer: 2000,
                    showConfirmButton: false,
                    background: "#1f2937",
                    color: "#fff",
                });
            } else {
                // Crear nuevo
                await createMetodoPago(form);
                Swal.fire({
                    icon: "success",
                    title: "¡Método de Pago agregado!",
                    timer: 2000,
                    showConfirmButton: false,
                    background: "#1f2937",
                    color: "#fff",
                });
            }

            // Limpiar formulario y recargar lista
            setForm({ nombre: "", moneda: "", detalles: "" });
            setEditingId(null);
            await loadMetodosPago();

        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo guardar el método de pago",
                confirmButtonColor: "#ef4444",
                background: "#1f2937",
                color: "#fff",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (metodo: MetodoPago) => {
        setForm({
            nombre: metodo.nombre,
            moneda: metodo.moneda,
            detalles: metodo.detalles,
        });
        setEditingId(metodo.id);
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: "¿Eliminar método de pago?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            background: "#1f2937",
            color: "#fff",
        });

        if (result.isConfirmed) {
            try {
                await deleteMetodoPago(id);
                await loadMetodosPago();
                Swal.fire({
                    icon: "success",
                    title: "Eliminado",
                    text: "Método de pago eliminado",
                    timer: 1500,
                    showConfirmButton: false,
                    background: "#1f2937",
                    color: "#fff",
                });
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudo eliminar:"+error,
                    confirmButtonColor: "#ef4444",
                    background: "#1f2937",
                    color: "#fff",
                });
            }
        }
    };

    const handleCancel = () => {
        if (form.nombre || form.detalles || form.moneda) {
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
                    setForm({ nombre: "", moneda: "", detalles: "" });
                    setEditingId(null);
                }
            });
        } else {
            setForm({ nombre: "", moneda: "", detalles: "" });
            setEditingId(null);
        }
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
            <div className="flex-1 p-4 md:p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={() => navigate("/admin")}
                            className="flex items-center gap-2 text-gray-300 hover:text-white transition mb-4 group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span>Volver al panel</span>
                        </button>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                                <HandCoins className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white">
                                    {editingId ? "Editar" : "Añadir"} Método de Pago
                                </h1>
                                <p className="text-gray-300 text-sm">
                                    {editingId ? "Modifica los datos del método de pago" : "Completa todos los campos obligatorios (*)"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Formulario */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-xl mb-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Primera Fila */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nombre del Método de Pago */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        <HandCoins className="w-4 h-4" />
                                        Nombre del Método de Pago *
                                    </label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={form.nombre}
                                        onChange={handleChange}
                                        placeholder="Ej: PayPal, Tarjeta de Crédito"
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        required
                                    />
                                </div>

                                {/* Moneda */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        <CircleDollarSign className="w-4 h-4" />
                                        Moneda *
                                    </label>
                                    <input
                                        type="text"
                                        name="moneda"
                                        value={form.moneda}
                                        onChange={handleChange}
                                        placeholder="Ej: USD, EUR, COP"
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Detalles */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                    <ReceiptText className="w-4 h-4" />
                                    Detalles *
                                </label>
                                <textarea
                                    name="detalles"
                                    rows={3}
                                    value={form.detalles}
                                    onChange={handleChange}
                                    placeholder="Describe las instrucciones o detalles del método de pago..."
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                                    required
                                />
                            </div>

                            {/* Botones */}
                            <div className="pt-6 border-t border-gray-700">
                                <div className="flex flex-col sm:flex-row justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition font-medium flex items-center justify-center gap-2"
                                    >
                                        {editingId ? <ArrowLeft className="w-4 h-4" /> : null}
                                        {editingId ? "Cancelar edición" : "Limpiar"}
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                                {editingId ? "Actualizando..." : "Guardando..."}
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-5 h-5" />
                                                {editingId ? "Actualizar" : "Guardar"}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Lista de Métodos de Pago */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Wallet className="w-5 h-5 text-blue-400" />
                                Métodos de Pago Disponibles
                            </h2>
                            <button
                                onClick={loadMetodosPago}
                                disabled={loadingList}
                                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-gray-300"
                                title="Recargar"
                            >
                                <RefreshCw className={`w-4 h-4 ${loadingList ? 'animate-spin' : ''}`} />
                            </button>
                        </div>

                        {loadingList ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : metodosPago.length === 0 ? (
                            <div className="text-center py-12 bg-gray-700/30 rounded-xl border border-gray-600">
                                <CreditCard className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                                <p className="text-gray-300">No hay métodos de pago registrados</p>
                                <p className="text-gray-500 text-sm mt-2">Agrega tu primer método de pago</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {metodosPago.map((metodo) => (
                                    <div
                                        key={metodo.id}
                                        className="bg-gray-700/30 rounded-xl p-5 border border-gray-600 hover:border-blue-500/50 transition group"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="w-5 h-5 text-blue-400" />
                                                <h3 className="text-lg font-semibold text-white">
                                                    {metodo.nombre}
                                                </h3>
                                            </div>
                                            <span className="px-2 py-1 bg-gray-600 rounded text-xs font-mono text-gray-300">
                                                {metodo.moneda}
                                            </span>
                                        </div>

                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                            {metodo.detalles}
                                        </p>

                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(metodo)}
                                                className="p-2 bg-blue-900/30 text-blue-400 hover:bg-blue-900/50 rounded-lg transition"
                                                title="Editar"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(metodo.id)}
                                                className="p-2 bg-red-900/30 text-red-400 hover:bg-red-900/50 rounded-lg transition"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}