package com.ebook.ebookapi.user.dtos;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;


@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String nombreCompleto;
    private LocalDate fechaNacimiento;
    private String pais;
    private String verificationToken;
}
