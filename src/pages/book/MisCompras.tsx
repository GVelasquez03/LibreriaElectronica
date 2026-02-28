// src/pages/MisCompras.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {ArrowLeft,ShoppingBag,BookOpen,DollarSign,Calendar,CheckCircle,XCircle,Clock,Eye
} from "lucide-react";

import { getCurrentUser, getOrdenesByEmail } from "../../services/authApi";
import type { Orden } from "../../types/orden";

export default function MisCompras() {
    const navigate = useNavigate();
    const [ordenes, setOrdenes] = useState<Orden[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarOrdenes = async () => {
            try {
                // 1. Obtener usuario actual
                const tokenUser = getCurrentUser();
                if (!tokenUser?.email) {
                    navigate("/login");
                    return;
                }

                // 3. Obtener órdenes por email
                const data = await getOrdenesByEmail(tokenUser.email);
                setOrdenes(data);

            } catch (error) {
                console.error("Error cargando compras:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudieron cargar tus compras",
                    background: "#1f2937",
                    color: "#fff",
                });
            } finally {
                setLoading(false);
            }
        };

        cargarOrdenes();
    }, [navigate]);

    const getEstadoIcon = (estado: string) => {
        switch (estado) {
            case 'PENDIENTE': return <Clock className="w-5 h-5 text-yellow-400" />;
            case 'APROBADO': return <CheckCircle className="w-5 h-5 text-green-400" />;
            case 'RECHAZADO': return <XCircle className="w-5 h-5 text-red-400" />;
            default: return null;
        }
    };

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'PENDIENTE': return 'bg-yellow-900/30 text-yellow-300 border-yellow-700/50';
            case 'APROBADO': return 'bg-green-900/30 text-green-300 border-green-700/50';
            case 'RECHAZADO': return 'bg-red-900/30 text-red-300 border-red-700/50';
            default: return 'bg-gray-900/30 text-gray-300 border-gray-700/50';
        }
    };

    const verDetalleOrden = (id: number) => {
        navigate(`/mis-compras/${id}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#735CDB]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
            <div className="flex-1 p-4 md:p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2 text-gray-300 hover:text-white transition mb-4 group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span>Volver al catálogo</span>
                        </button>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-linear-to-br from-purple-600 to-pink-600 rounded-xl">
                                <ShoppingBag className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white">
                                    Mis Compras
                                </h1>
                                <p className="text-gray-300 text-sm">
                                    Historial de tus órdenes y compras realizadas
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Lista de órdenes */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-xl">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                            <ShoppingBag className="w-5 h-5 text-purple-400" />
                            Tus órdenes ({ordenes.length})
                        </h2>

                        {ordenes.length === 0 ? (
                            <div className="text-center py-12 bg-gray-700/30 rounded-xl border border-gray-600">
                                <ShoppingBag className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                                <p className="text-gray-300">No tienes compras realizadas</p>
                                <p className="text-gray-500 text-sm mt-2">
                                    ¡Explora nuestro catálogo y encuentra tu próximo libro!
                                </p>
                                <button
                                    onClick={() => navigate("/")}
                                    className="mt-6 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition"
                                >
                                    Ver catálogo
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {ordenes.map((orden) => (
                                    <div
                                        key={orden.id}
                                        className="bg-gray-700/30 rounded-xl p-5 border border-gray-600 hover:border-purple-500/50 transition group"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            {/* Información principal */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="text-xl font-bold text-white">
                                                        Orden #{orden.id}
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getEstadoColor(orden.estado)} flex items-center gap-1`}>
                                                        {getEstadoIcon(orden.estado)}
                                                        {orden.estado}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="flex items-start gap-2">
                                                        <BookOpen className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                                                        <div>
                                                            <p className="text-gray-400 text-xs">Libro</p>
                                                            <p className="text-white text-sm font-medium">
                                                                {orden.tituloLibro || `ID: ${orden.idLibro}`}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-2">
                                                        <DollarSign className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                                                        <div>
                                                            <p className="text-gray-400 text-xs">Total</p>
                                                            <p className="text-white text-sm font-medium">
                                                                ${orden.montoTotal.toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-2">
                                                        <Calendar className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                                                        <div>
                                                            <p className="text-gray-400 text-xs">Fecha</p>
                                                            <p className="text-white text-sm">
                                                                {new Date(orden.fechaCreacion).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Botón ver detalle */}
                                            <button
                                                onClick={() => verDetalleOrden(orden.id)}
                                                className="px-4 py-2 bg-purple-900/30 text-purple-400 hover:bg-purple-900/50 rounded-lg transition flex items-center gap-2 "
                                            >
                                                <Eye className="w-4 h-4" />
                                                Ver detalle
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