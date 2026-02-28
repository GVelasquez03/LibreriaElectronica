// src/pages/MiCompraDetalle.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
    ArrowLeft, ShoppingBag, User, BookOpen, DollarSign, Calendar, CheckCircle, XCircle, Clock, Download
} from "lucide-react";

import { getOrdenById } from "../../services/ordenService";
import { getCurrentUser} from "../../services/authApi";
import type { Orden } from "../../types/orden";

export default function MiCompraDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [orden, setOrden] = useState<Orden | null>(null);
    const [loading, setLoading] = useState(true);
    const [, setUsuarioId] = useState<number | null>(null);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                // 1. Obtener email del token
                const tokenUser = getCurrentUser();
                if (!tokenUser?.email) {
                    navigate("/login");
                    return;
                }

                // 2. Obtener la orden por ID
                const ordenData = await getOrdenById(Number(id));

                // 3. Verificar que la orden pertenezca al usuario (comparando emails)
                if (ordenData.emailUsuario !== tokenUser.email) {
                    Swal.fire({
                        icon: "error",
                        title: "Acceso denegado",
                        text: "No tienes permiso para ver esta orden",
                        background: "#1f2937",
                        color: "#fff",
                    }).then(() => navigate("/mis-compras"));
                    return;
                }

                setOrden(ordenData);
                setUsuarioId(ordenData.idUsuario); // Si aún necesitas el ID

            } catch (error) {
                console.error("Error:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudo cargar la orden",
                    background: "#1f2937",
                    color: "#fff",
                }).then(() => navigate("/mis-compras"));
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, [id, navigate]);

    const getEstadoIcon = (estado: string) => {
        switch (estado) {
            case 'PENDIENTE': return <Clock className="w-6 h-6 text-yellow-400" />;
            case 'APROBADO': return <CheckCircle className="w-6 h-6 text-green-400" />;
            case 'RECHAZADO': return <XCircle className="w-6 h-6 text-red-400" />;
            default: return null;
        }
    };

    const handleDescargarPDF = () => {
        // Aquí implementarías la descarga del PDF
        Swal.fire({
            icon: "info",
            title: "Descarga de PDF",
            text: "Función próximamente disponible",
            background: "#1f2937",
            color: "#fff",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#735CDB]"></div>
            </div>
        );
    }

    if (!orden) return null;

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
            <div className="flex-1 p-4 md:p-6">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => navigate("/mis-compras")}
                        className="flex items-center gap-2 text-gray-300 hover:text-white transition mb-4 group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1" />
                        <span>Volver a mis compras</span>
                    </button>

                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-linear-to-br from-purple-600 to-pink-600 rounded-xl">
                                <ShoppingBag className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white">
                                    Detalle de Compra #{orden.id}
                                </h1>
                                <div className="flex items-center gap-2 mt-1">
                                    {getEstadoIcon(orden.estado)}
                                    <span className="text-gray-300">Estado: {orden.estado}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Información del Usuario */}
                            <div className="bg-gray-700/30 rounded-xl p-4">
                                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                    <User className="w-5 h-5 text-blue-400" />
                                    Tu información
                                </h3>
                                <p className="text-gray-300">Nombre: {orden.nombreUsuario}</p>
                                {orden.emailUsuario && (
                                    <p className="text-gray-300">Email: {orden.emailUsuario}</p>
                                )}
                            </div>

                            {/* Información del Libro */}
                            <div className="bg-gray-700/30 rounded-xl p-4">
                                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-purple-400" />
                                    Libro adquirido
                                </h3>
                            
                                {orden.tituloLibro && (
                                    <>
                                        <p className="text-white font-medium mt-2">{orden.tituloLibro}</p>
                                        {orden.autorLibro && (
                                            <p className="text-gray-400 text-sm">por {orden.autorLibro}</p>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Información de Pago */}
                            <div className="bg-gray-700/30 rounded-xl p-4">
                                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-green-400" />
                                    Detalles del pago
                                </h3>
                                <p className="text-gray-300">
                                    Monto: <span className="text-white font-bold">${orden.montoTotal.toFixed(2)}</span>
                                </p>
                                <p className="text-gray-300 mt-2">Método de Pago:</p>
                                {orden.nombreMetodoPago && (
                                    <div className="mt-3 p-2 bg-gray-800 rounded-lg">
                                        <p className="text-green-400 text-sm">{orden.nombreMetodoPago}</p>
                                    </div>
                                )}
                            </div>

                            {/* Fecha */}
                            <div className="bg-gray-700/30 rounded-xl p-4">
                                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-orange-400" />
                                    Fecha de compra
                                </h3>
                                <p className="text-gray-300">
                                    {new Date(orden.fechaCreacion).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* Botón de descarga si está aprobado */}
                        {orden.estado === 'APROBADO' && (
                            <div className="mt-8 pt-6 border-t border-gray-700">
                                <button
                                    onClick={handleDescargarPDF}
                                    className="w-full px-6 py-4 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition font-medium flex items-center justify-center gap-2"
                                >
                                    <Download className="w-5 h-5" />
                                    Descargar PDF del libro
                                </button>
                                <p className="text-gray-500 text-xs text-center mt-3">
                                    El libro estará disponible para descargar una vez que el pago sea aprobado
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}