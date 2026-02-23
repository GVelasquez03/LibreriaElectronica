export interface Orden {
    id: number;
    montoTotal: number;
    estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'ENTREGADO';
    fechaCreacion: string;
    idUsuario: number;
    emailUsuario?: string;
    idMetodoPago: number;
    nombreMetodoPago?: string;
    idLibro: number;
    tituloLibro?: string;
}

export interface OrdenRequest {
    idUsuario: number;
    idLibro: number;
    idMetodoPago: number;
    montoTotal: number;
}

export interface UpdateEstadoRequest {
    estado: string;
}
