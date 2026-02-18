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
    private Long idUsuario;
    private Long idMetodoPago;
    private Long idLibro;
}
