// Esta interfaz representa tu 'BookRequestDTO' de Java
export interface CreateMetodoPagoDTO {
    nombre: string;
    moneda: string;
    detalles: string;
}

export interface MetodoPago {
    id : number;
    nombre: string;
    moneda: string;
    detalles: string;
}

export interface PagoInfo {
    usuarioId: number;
    usuarioNombre: string;
    libroId: number;
    libroTitulo: string;
    libroPrecio: number;
    metodoPagoId: number;
}