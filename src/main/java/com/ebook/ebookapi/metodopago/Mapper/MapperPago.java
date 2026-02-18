package com.ebook.ebookapi.metodopago.Mapper;

import com.ebook.ebookapi.metodopago.dtos.MetodoPagoDTO;
import com.ebook.ebookapi.metodopago.modelo.MetodoPago;

public class MapperPago {

    // Convertir metodo de pago a dto
    public static MetodoPagoDTO toDTO(MetodoPago metodoPago){
        MetodoPagoDTO metodoPagoDTO = new MetodoPagoDTO();
        metodoPagoDTO.setId(metodoPago.getId());
        metodoPagoDTO.setNombre(metodoPago.getNombre());
        metodoPagoDTO.setDetalles(metodoPago.getDetalles());
        metodoPagoDTO.setMoneda(metodoPago.getMoneda());
        return metodoPagoDTO;
    }

    // Mapper para Actualizar
    public static MetodoPago actualizarEntidad(MetodoPago entidad,MetodoPagoDTO metodoPagoDTO){
        entidad.setNombre(metodoPagoDTO.getNombre());
        entidad.setDetalles(metodoPagoDTO.getDetalles());
        entidad.setMoneda(metodoPagoDTO.getMoneda());
        return entidad;
    }

    // Convertir dto a metodo de pago
    public static MetodoPago toEntity(MetodoPagoDTO metodoPagoDTO){
       MetodoPago metodoPago = new MetodoPago();
       metodoPago.setId(metodoPagoDTO.getId());
       metodoPago.setNombre(metodoPagoDTO.getNombre());
       metodoPago.setDetalles(metodoPagoDTO.getDetalles());
       metodoPago.setMoneda(metodoPagoDTO.getMoneda());
       return metodoPago;
    }
}
