package com.ebook.ebookapi.orden.Mapper;

import com.ebook.ebookapi.book.modelo.Book;
import com.ebook.ebookapi.metodopago.modelo.MetodoPago;
import com.ebook.ebookapi.orden.dtos.OrdenDTO;
import com.ebook.ebookapi.orden.dtos.OrdenRequest;
import com.ebook.ebookapi.orden.modelo.Orden;
import com.ebook.ebookapi.user.modelo.Usuario;

import java.time.LocalDateTime;

public class OrdenMapper {
    // Convertir un orden a un dto
    public static OrdenDTO  toDTO(Orden orden){
        OrdenDTO ordenDTO = new OrdenDTO();
        ordenDTO.setId(orden.getId());
        ordenDTO.setFechaCreacion(orden.getFechaCreacion());
        ordenDTO.setMontoTotal(orden.getMontoTotal());
        ordenDTO.setEstado(orden.getEstado());

        // Datos del usuario
        ordenDTO.setIdUsuario(orden.getUsuario().getId());
        ordenDTO.setNombreUsuario(orden.getUsuario().getNombreCompleto());
        ordenDTO.setEmailUsuario(orden.getUsuario().getEmail());

        // Datos del libro
        ordenDTO.setIdLibro(orden.getLibro().getId());
        ordenDTO.setTituloLibro(orden.getLibro().getTitle());
        ordenDTO.setAutorLibro(orden.getLibro().getAuthor());
        ordenDTO.setPdfFileName(orden.getLibro().getPdfFilename());

        // Datos del Metodo de pago
        ordenDTO.setIdMetodoPago(orden.getMetodoPago().getId());
        ordenDTO.setNombreMetodoPago(orden.getMetodoPago().getNombre());

        return ordenDTO;
    }

    // Metodo para guardar una orden
    public static  Orden ordenTransformation(Usuario usuario, Book libro, MetodoPago metodoPago){
        Orden orden = new Orden();
        orden.setUsuario(usuario);
        orden.setMetodoPago(metodoPago);
        orden.setLibro(libro);
        orden.setEstado("PENDIENTE");
        orden.setFechaCreacion(LocalDateTime.now());
        return orden;
    }
}
