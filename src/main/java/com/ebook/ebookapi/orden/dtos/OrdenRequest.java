package com.ebook.ebookapi.orden.dtos;

import lombok.Data;
// dto para la orden
import java.math.BigDecimal;
@Data
public class OrdenRequest {
    private Long idUsuario;
    private Long idLibro;
    private Long idMetodoPago;
    private BigDecimal montoTotal;
}
