// src/pages/RealizarPago.tsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import {ArrowLeft,User,BookOpen,DollarSign,CreditCard,ShoppingCart,Wallet} from "lucide-react";

import { getUsuarioByEmail } from "../../services/ordenService";
import { getCurrentUser } from "../../services/authApi";
import { getAllMetodosPago } from "../../services/metodoPagoService";
import { createOrden } from "../../services/ordenService";
import type { MetodoPago } from "../../types/MetodoPago";

export default function RealizarPago() {
    const navigate = useNavigate();
    const location = useLocation();
    const { libro } = location.state || {}; // Recibe el libro desde BookDetail

    const [usuarioNombre, setUsuarioNombre] = useState("");
    const [usuarioId, setUsuarioId] = useState<number | null>(null);
    const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
    const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [cargandoDatos, setCargandoDatos] = useState(true);

    useEffect(() => {
        // Verificar si hay libro
        if (!libro) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se encontró información del libro",
                background: "#1f2937",
                color: "#fff",
            }).then(() => navigate("/"));
            return;
        }

        const cargarDatos = async () => {
            try {
                setCargandoDatos(true);

                // 1. Obtener usuario actual
                const tokenUser = getCurrentUser();
                if (!tokenUser?.email) {
                    navigate("/login");
                    return;
                }

                // 2. Obtener datos completos del usuario
                const userData = await getUsuarioByEmail(tokenUser.email);
                setUsuarioNombre(userData.nombreCompleto);
                setUsuarioId(userData.id);

                // 3. Cargar métodos de pago
                const metodos = await getAllMetodosPago();
                setMetodosPago(metodos);
                if (metodos.length > 0) {
                    setMetodoPagoSeleccionado(metodos[0].id);
                }

            } catch (error) {
                console.error("Error cargando datos:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudieron cargar los datos",
                    background: "#1f2937",
                    color: "#fff",
                });
            } finally {
                setCargandoDatos(false);
            }
        };

        cargarDatos();
    }, [libro, navigate]);

    const handleConfirmarPago = async () => {
        if (!metodoPagoSeleccionado) {
            Swal.fire({
                icon: "warning",
                title: "Selecciona un método",
                text: "Debes seleccionar un método de pago",
                background: "#1f2937",
                color: "#fff",
            });
            return;
        }

        try {
            setLoading(true);

            if (!usuarioId) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudo identificar al usuario",
                    background: "#1f2937",
                    color: "#fff",
                });
                return;
            }

            const ordenData = {
                idUsuario: usuarioId,
                idLibro: libro.id,
                idMetodoPago: metodoPagoSeleccionado,
                montoTotal: libro.price
            };

            await createOrden(ordenData);

            Swal.fire({
                icon: "success",
                title: "¡Compra exitosa!",
                html: `
                    <div class="text-left">
                        <p class="mb-2">Tu orden ha sido creada correctamente.</p>
                        <p class="text-sm text-gray-400">Libro: ${libro.title}</p>
                        <p class="text-sm text-gray-400">Total: $${libro.price.toFixed(2)}</p>
                    </div>
                `,
                confirmButtonColor: "#735CDB",
                background: "#1f2937",
                color: "#fff",
            }).then(() => {
                navigate("/mis-compras"); // O a donde quieras redirigir
            });

        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo procesar el pago",
                background: "#1f2937",
                color: "#fff",
            });
        } finally {
            setLoading(false);
        }
    };

    if (cargandoDatos) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#735CDB]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
            <div className="flex-1 p-4 md:p-6">
                <div className="max-w-2xl mx-auto">
                    {/* Botón volver */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-300 hover:text-white transition mb-6 group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1" />
                        <span>Volver al libro</span>
                    </button>

                    {/* Título */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-linear-to-br from-green-600 to-emerald-600 rounded-xl">
                            <ShoppingCart className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white">
                                Finalizar Compra
                            </h1>
                            <p className="text-gray-300 text-sm">
                                Revisa los detalles y confirma tu pago
                            </p>
                        </div>
                    </div>

                    {/* Formulario de pago */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-xl">

                        {/* Información del Usuario */}
                        <div className="mb-6 p-4 bg-gray-700/30 rounded-xl border border-gray-600">
                            <div className="flex items-center gap-3 mb-3">
                                <User className="w-5 h-5 text-blue-400" />
                                <h3 className="text-lg font-semibold text-white">Comprador</h3>
                            </div>
                            <p className="text-white ml-8">{usuarioNombre}</p>
                        </div>

                        {/* Información del Libro */}
                        <div className="mb-6 p-4 bg-gray-700/30 rounded-xl border border-gray-600">
                            <div className="flex items-center gap-3 mb-3">
                                <BookOpen className="w-5 h-5 text-purple-400" />
                                <h3 className="text-lg font-semibold text-white">Libro</h3>
                            </div>
                            <div className="ml-8 space-y-1">
                                <p className="text-white font-medium">{libro.title}</p>
                                <p className="text-gray-400 text-sm">por {libro.author}</p>
                            </div>
                        </div>

                        {/* Precio */}
                        <div className="mb-6 p-4 bg-linear-to-br from-orange-900/20 to-orange-800/10 rounded-xl border border-orange-700/30">
                            <div className="flex items-center gap-3 mb-2">
                                <DollarSign className="w-5 h-5 text-orange-400" />
                                <h3 className="text-lg font-semibold text-white">Total a pagar</h3>
                            </div>
                            <p className="text-md font-bold text-white ml-8">
                                ${libro.price.toFixed(2)}
                            </p>
                        </div>

                        {/* Método de Pago */}
                        <div className="mb-8 p-4 bg-gray-700/30 rounded-xl border border-gray-600">
                            <div className="flex items-center gap-3 mb-4">
                                <Wallet className="w-5 h-5 text-green-400" />
                                <h3 className="text-lg font-semibold text-white">Método de pago</h3>
                            </div>

                            <div className="ml-8 space-y-3">
                                <select
                                    value={metodoPagoSeleccionado}
                                    onChange={(e) => setMetodoPagoSeleccionado(Number(e.target.value))}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value={0} disabled>Selecciona un método</option>
                                    {metodosPago.map((metodo) => (
                                        <option key={metodo.id} value={metodo.id} className="bg-gray-800">
                                            {metodo.nombre} ({metodo.moneda})
                                        </option>
                                    ))}
                                </select>

                                {metodoPagoSeleccionado > 0 && (
                                    <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
                                        <p className="text-gray-300 text-sm">
                                            {metodosPago.find(m => m.id === metodoPagoSeleccionado)?.detalles}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-700">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmarPago}
                                disabled={loading || !metodoPagoSeleccionado}
                                className="flex-1 px-6 py-3 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                                        Procesando...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5" />
                                        Confirmar Pago
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}