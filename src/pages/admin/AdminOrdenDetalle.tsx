import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
    ArrowLeft,
    ShoppingBag,
    User,
    BookOpen,
    DollarSign,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    Truck
} from "lucide-react";

import { getOrdenById } from "../../services/ordenService";
import type { Orden } from "../../types/orden";

export default function AdminOrdenDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [orden, setOrden] = useState<Orden | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrden = async () => {
            try {
                const data = await getOrdenById(Number(id));
                setOrden(data);
            } catch (error) {
                console.error("Error cargando orden:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudo cargar la orden",
                    background: "#1f2937",
                    color: "#fff",
                }).then(() => navigate("/admin/ordenes"));
            } finally {
                setLoading(false);
            }
        };
        loadOrden();
    }, [id, navigate]);

    const getEstadoIcon = (estado: string) => {
        switch (estado) {
            case 'PENDIENTE': return <Clock className="w-6 h-6 text-yellow-400" />;
            case 'APROBADO': return <CheckCircle className="w-6 h-6 text-green-400" />;
            case 'RECHAZADO': return <XCircle className="w-6 h-6 text-red-400" />;
            case 'ENTREGADO': return <Truck className="w-6 h-6 text-blue-400" />;
            default: return null;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (!orden) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
            <div className="flex-1 p-4 md:p-6">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => navigate("/admin/ordenes")}
                        className="flex items-center gap-2 text-gray-300 hover:text-white transition mb-4 group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1" />
                        <span>Volver a órdenes</span>
                    </button>

                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl">
                                <ShoppingBag className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white">
                                    Orden #{orden.id}
                                </h1>
                                <div className="flex items-center gap-2 mt-1">
                                    {getEstadoIcon(orden.estado)}
                                    <span className="text-gray-300">Estado: {orden.estado}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="bg-gray-700/30 rounded-xl p-4">
                                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                        <User className="w-5 h-5 text-blue-400" />
                                        Información del Usuario
                                    </h3>
                                    <p className="text-gray-300">ID: {orden.idUsuario}</p>
                                    {orden.emailUsuario && (
                                        <p className="text-gray-300">Email: {orden.emailUsuario}</p>
                                    )}
                                </div>

                                <div className="bg-gray-700/30 rounded-xl p-4">
                                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-purple-400" />
                                        Información del Libro
                                    </h3>
                                    <p className="text-gray-300">ID: {orden.idLibro}</p>
                                    {orden.tituloLibro && (
                                        <p className="text-gray-300">Título: {orden.tituloLibro}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-gray-700/30 rounded-xl p-4">
                                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                        <DollarSign className="w-5 h-5 text-green-400" />
                                        Información de Pago
                                    </h3>
                                    <p className="text-gray-300">
                                        Monto Total: <span className="text-white font-bold">${orden.montoTotal.toFixed(2)}</span>
                                    </p>
                                    <p className="text-gray-300">Método de Pago ID: {orden.idMetodoPago}</p>
                                    {orden.nombreMetodoPago && (
                                        <p className="text-gray-300">Método: {orden.nombreMetodoPago}</p>
                                    )}
                                </div>

                                <div className="bg-gray-700/30 rounded-xl p-4">
                                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-orange-400" />
                                        Fechas
                                    </h3>
                                    <p className="text-gray-300">
                                        Creación: {new Date(orden.fechaCreacion).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}