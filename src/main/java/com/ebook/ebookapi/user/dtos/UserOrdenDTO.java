package com.ebook.ebookapi.user.dtos;
import lombok.Data;

// DTO BUSCAR UN USUARIO Y PROCEDER A CREAR UNA ORDEN
@Data
public class UserOrdenDTO {
    private long id;
    private String nombreCompleto;
    private String pais;
}

