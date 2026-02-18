package com.ebook.ebookapi.metodopago.dtos;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MetodoPagoDTO {
    private Long id;
    private String nombre;
    private String detalles;
    private String moneda;
}
