package com.ebook.ebookapi.auth.controller;

import com.ebook.ebookapi.auth.jwtservicio.JwtService;
import com.ebook.ebookapi.user.modelo.Usuario;
import com.ebook.ebookapi.auth.dtos.LoginRequest;
import com.ebook.ebookapi.auth.dtos.LoginResponse;
import com.ebook.ebookapi.auth.service.AuthService;
import com.ebook.ebookapi.user.repositorioUsuario.UsuarioRepositorio;
import com.ebook.ebookapi.user.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final UserService userService;
    private final UsuarioRepositorio usuarioRepositorio;

    // Inyeccion de dependencia
    public AuthController(AuthService authService, JwtService jwtService, UserService userService,
                          UsuarioRepositorio usuarioRepositorio) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.userService = userService;
        this.usuarioRepositorio =usuarioRepositorio;
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

    // Verificar el correo electronic
    @GetMapping("/verify")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        try {

            System.out.println("🔍 TOKEN RECIBIDO: " + token);

            // Buscar usuario por token
            Usuario user = userService.findByVerificationToken(token);
             // ← VER ESTO

            System.out.println("✅ USUARIO ENCONTRADO: " + user.getEmail());
            System.out.println("📅 Expira: " + user.getVerificationExpires());
            System.out.println("⏰ Ahora: " + LocalDateTime.now());

            // Verificar no expirado
            if (user.getVerificationExpires().isBefore(LocalDateTime.now())) {
                System.out.println("❌ TOKEN EXPIRADO");
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "El enlace de verificación ha expirado"));
            }

            // Marcar como verificado
            System.out.println("✅ Verificando usuario...");
            user.setVerified(true);
            user.setVerificationToken(null);
            user.setVerificationExpires(null);
            usuarioRepositorio.save(user);
            System.out.println("✅ Usuario verificado y guardado");

            return ResponseEntity.ok()
                    .body(Map.of("message", "Email verificado exitosamente. Ya puedes iniciar sesión."));

        } catch (RuntimeException e) {
            System.out.println("❌ EXCEPCIÓN: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Enlace de verificación inválido"));
        }
    }

}
