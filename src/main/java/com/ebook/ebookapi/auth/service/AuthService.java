package com.ebook.ebookapi.auth.service;

import com.ebook.ebookapi.user.modelo.Usuario;
import com.ebook.ebookapi.user.repositorioUsuario.UsuarioRepositorio;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UsuarioRepositorio userRepository;
    private final PasswordEncoder passwordEncoder;

    // Inyeccion de dependencia
    public AuthService(UsuarioRepositorio userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Validar las credenciales del usuario para el acceso
    public Usuario authenticate(String email, String password) {
        Usuario user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        return user;
    }
}
