package com.ebook.ebookapi.user.modelo;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "usuario")
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Data
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    @Column(name = "nombre_completo")
    private String nombreCompleto;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    private String pais;

    // Campos de autenticación email
    @Column(name = "verification_token")
    private String verificationToken;

    @Column(name = "is_verified")
    private boolean isVerified = false;

    @Column(name = "verification_expires")
    private LocalDateTime verificationExpires;

}
