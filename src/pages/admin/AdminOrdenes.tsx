import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {ArrowLeft,ShoppingBag,RefreshCw,Eye,CheckCircle,XCircle,Clock,Search,Filter} from "lucide-react";

import type { Orden } from "../../types/orden";
import { getAllOrdenes, updateEstadoOrden } from "../../services/ordenService";

export default function AdminOrdenes() {
    const navigate = useNavigate();
    const [ordenes, setOrdenes] = useState<Orden[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtroEstado, setFiltroEstado] = useState<string>("TODOS");
    const [busqueda, setBusqueda] = useState("");

    const loadOrdenes = async () => {
        try {
            setLoading(true);
            const data = await getAllOrdenes();
            setOrdenes(data);
        } catch (error) {
            console.error("Error cargando órdenes:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudieron cargar las órdenes",
                background: "#1f2937",
                color: "#fff",
                confirmButtonColor: "#ef4444",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrdenes();
    }, []);

    const handleCambiarEstado = async (id: number, nuevoEstado: string) => {
        const result = await Swal.fire({
            title: "Cambiar estado",
            text: `¿Cambiar estado a ${nuevoEstado}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#735CDB",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Sí, cambiar",
            cancelButtonText: "Cancelar",
            background: "#1f2937",
            color: "#fff",
        });

        if (result.isConfirmed) {
            try {
                await updateEstadoOrden(id, nuevoEstado);
                await loadOrdenes();
                Swal.fire({
                    icon: "success",
                    title: "Estado actualizado",
                    text: `Orden #${id} ahora está ${nuevoEstado}`,
                    timer: 2000,
                    showConfirmButton: false,
                    background: "#1f2937",
                    color: "#fff",
                });
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudo actualizar el estado:"+error,
                    background: "#1f2937",
                    color: "#fff",
                    confirmButtonColor: "#ef4444",
                });
            }
        }
    };

    const handleVerDetalle = (id: number) => {
        navigate(`/admin/ordenes/${id}`);
    };

    // Filtrar órdenes
    const ordenesFiltradas = ordenes.filter(orden => {
        // Filtro por estado
        if (filtroEstado !== "TODOS" && orden.estado !== filtroEstado) {
            return false;
        }

        // Búsqueda por ID o email (si está disponible)
        if (busqueda) {
            const searchLower = busqueda.toLowerCase();
            return orden.id.toString().includes(searchLower) ||
                (orden.emailUsuario?.toLowerCase().includes(searchLower) || false);
        }

        return true;
    });

    const getEstadoIcon = (estado: string) => {
        switch (estado) {
            case 'PENDIENTE': return <Clock className="w-4 h-4 text-yellow-400" />;
            case 'APROBADO': return <CheckCircle className="w-4 h-4 text-green-400" />;
            case 'RECHAZADO': return <XCircle className="w-4 h-4 text-red-400" />;
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

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
            <div className="flex-1 p-4 md:p-6">
                <div className="max-w-7xl mx-auto">
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
                            <div className="p-3 bg-linear-to-br from-green-600 to-emerald-600 rounded-xl">
                                <ShoppingBag className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white">
                                    Gestión de Órdenes
                                </h1>
                                <p className="text-gray-300 text-sm">
                                    Administra y da seguimiento a las compras de los usuarios
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Filtros y búsqueda */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700 shadow-xl mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar por email"
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-gray-400" />
                                <select
                                    value={filtroEstado}
                                    onChange={(e) => setFiltroEstado(e.target.value)}
                                    className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="TODOS">Todos los estados</option>
                                    <option value="PENDIENTE">Pendiente</option>
                                    <option value="APROBADO">Aprobado</option>
                                    <option value="RECHAZADO">Rechazado</option>

                                </select>
                                <button
                                    onClick={loadOrdenes}
                                    disabled={loading}
                                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-gray-300"
                                >
                                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Lista de órdenes */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-green-400" />
                                Órdenes ({ordenesFiltradas.length})
                            </h2>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                            </div>
                        ) : ordenesFiltradas.length === 0 ? (
                            <div className="text-center py-12 bg-gray-700/30 rounded-xl border border-gray-600">
                                <ShoppingBag className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                                <p className="text-gray-300">No hay órdenes</p>
                                <p className="text-gray-500 text-sm mt-2">
                                    {busqueda || filtroEstado !== "TODOS"
                                        ? "Intenta con otros filtros"
                                        : "Los usuarios aún no han realizado compras"}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {ordenesFiltradas.map((orden) => (
                                    <div
                                        key={orden.id}
                                        className="bg-gray-700/30 rounded-xl p-5 border border-gray-600 hover:border-green-500/50 transition group"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            {/* Información principal */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-2xl font-bold text-white">
                                                        #{orden.id}
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getEstadoColor(orden.estado)} flex items-center gap-1`}>
                                                        {getEstadoIcon(orden.estado)}
                                                        {orden.estado}
                                                    </span>
                                                </div>

                                                 {/* Datos del Usuario*/}
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3">
                                                    <div>
                                                        <p className="text-gray-400 text-xs">Email del Usuario</p>
                                                        <p className="text-white text-sm font-medium">
                                                            {orden.emailUsuario}
                                                        </p>
                                                    </div>

                                                    {/* Titulo del libro */}
                                                    <div>
                                                        <p className="text-gray-400 text-xs">Libro</p>
                                                        <p className="text-white text-sm font-medium">
                                                            {orden.tituloLibro}
                                                        </p>
                                                    </div>
                                                    {/* Monto de la orden */}
                                                    <div>
                                                        <p className="text-gray-400 text-xs">Monto</p>
                                                        <p className="text-white text-sm font-medium">
                                                            ${orden.montoTotal.toFixed(2)}
                                                        </p>
                                                    </div>

                                                    {/*Referencia falsa*/}
                                                    <div>
                                                        <p className="text-gray-400 text-xs">Referencia</p>
                                                        <p className="text-white text-shadow-sm font-medium">
                                                            {Math.random().toFixed(8)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <p className="text-gray-500 text-xs mt-2">
                                                    {new Date(orden.fechaCreacion).toLocaleString()}
                                                </p>
                                            </div>

                                            {/* Acciones */}
                                            <div className="flex items-center gap-2">
                                                <select
                                                    onChange={(e) => handleCambiarEstado(orden.id, e.target.value)}
                                                    value=""
                                                    className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                                >
                                                    <option value="" disabled>Cambiar estado</option>
                                                    <option value="PENDIENTE">Pendiente</option>
                                                    <option value="APROBADO">Aprobado</option>
                                                    <option value="RECHAZADO">Rechazado</option>
                                                </select>
                                                <button
                                                    onClick={() => handleVerDetalle(orden.id)}
                                                    className="p-2 bg-blue-900/30 text-blue-400 hover:bg-blue-900/50 rounded-lg transition"
                                                    title="Ver detalle"
                                                >
                                                    <Eye className="w-4 h-4" />
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
        </div>
    );
}