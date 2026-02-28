package com.ebook.ebookapi.orden.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrdenDTO {
    private Long id;
    private BigDecimal montoTotal;
    private String estado;
    private LocalDateTime fechaCreacion;

    //Datos del usuario
    private Long idUsuario;
    private String nombreUsuario;     // ← NUEVO
    private String emailUsuario;

    //Datos del Metodo de pago
    private Long idMetodoPago;
    private String nombreMetodoPago;

    //Datos del libro
    private Long idLibro;
    private String tituloLibro;        // ← NUEVO
    private String autorLibro;
    private String pdfFileName;
}
