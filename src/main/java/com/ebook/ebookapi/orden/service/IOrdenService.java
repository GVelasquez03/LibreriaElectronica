package com.ebook.ebookapi.orden.service;

import com.ebook.ebookapi.orden.dtos.OrdenDTO;
import com.ebook.ebookapi.orden.dtos.OrdenRequest;

import java.util.List;

public interface IOrdenService {
    // Listado de las órdenes
    List<OrdenDTO> listarTodas();

    // Obtener orden por identificador
    OrdenDTO obtenerPorId(Long id);

    // Listar Orden por Usuario
    List<OrdenDTO> listarPorUsuario(Long idUsuario);

    // Crear una orden
    OrdenDTO crearOrden(OrdenRequest request);

    // Actualizar estado de la orden
    OrdenDTO actualizarEstado(Long id, String nuevoEstado);


}
