export interface Orden {
    id: number;
    montoTotal: number;
    estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
    fechaCreacion: string;

    idUsuario: number;
    nombreUsuario : string;
    emailUsuario : string;

    idLibro: number;
    tituloLibro?: string;
    autorLibro: string;

    idMetodoPago: number;
    nombreMetodoPago?: string;
    
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
