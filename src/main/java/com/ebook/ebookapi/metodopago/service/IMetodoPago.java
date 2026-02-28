package com.ebook.ebookapi.metodopago.service;

import com.ebook.ebookapi.metodopago.dtos.MetodoPagoDTO;
import com.ebook.ebookapi.metodopago.modelo.MetodoPago;

import java.util.List;

public interface IMetodoPago {

    // Obtener todos los metodos de pago
    List<MetodoPagoDTO> listarTodos();

    // Obtener metodo por identificador
    MetodoPagoDTO obtenerPorId(Long id);

    // Crear metodo pago
    MetodoPagoDTO crear(MetodoPagoDTO metodoPagoDTO);

    // Actualizar metodo de pago
    MetodoPagoDTO actualizar(Long id, MetodoPagoDTO metodoPagoDTO);

    // Eliminar Metodo de pago
    String eliminar(Long id);

}
