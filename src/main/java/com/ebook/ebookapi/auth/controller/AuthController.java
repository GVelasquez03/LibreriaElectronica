package com.ebook.ebookapi.auth.controller;

import com.ebook.ebookapi.auth.jwtservicio.JwtService;
import com.ebook.ebookapi.user.modelo.Usuario;
import com.ebook.ebookapi.auth.dtos.LoginRequest;
import com.ebook.ebookapi.auth.dtos.LoginResponse;
import com.ebook.ebookapi.auth.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    // Inyeccion de dependencia
    public AuthController(AuthService authService, JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    //Login
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        // Autenticar usuario
        Usuario user = authService.authenticate(
                request.getEmail(),
                request.getPassword()
        );

        // Generar token real con JwtService
        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        return new LoginResponse(token, user.getRole().name());
    }
}
