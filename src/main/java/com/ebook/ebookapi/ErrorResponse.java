package com.ebook.ebookapi;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

// CLASE PARA DETECTAR ERRORES
@Data
@AllArgsConstructor
public class ErrorResponse {
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
}
