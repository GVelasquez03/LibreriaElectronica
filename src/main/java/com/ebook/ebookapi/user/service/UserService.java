package com.ebook.ebookapi.user.service;

import com.ebook.ebookapi.user.dtos.RegisterRequest;
import com.ebook.ebookapi.user.modelo.Role;
import com.ebook.ebookapi.user.modelo.Usuario;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.ebook.ebookapi.user.repositorioUsuario.UsuarioRepositorio;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserService implements IUserService {

    private final UsuarioRepositorio userRepositorio;
    private final PasswordEncoder passwordEncoder;

    // Inyeccion de dependencia
    public UserService(UsuarioRepositorio userRepositorio, PasswordEncoder passwordEncoder){
        this.userRepositorio = userRepositorio;
        this.passwordEncoder = passwordEncoder;

    }

    // Servicio Registra usuario + password cifrada
    @Override
    public Usuario register(RegisterRequest request) {
        if (userRepositorio.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email: "+ request.getEmail()+" ya esta registrado");
        }
        Usuario user = new Usuario();
        user.setEmail(request.getEmail());
        user.setNombreCompleto(request.getNombreCompleto());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFechaNacimiento(request.getFechaNacimiento());
        user.setPais(request.getPais());
        user.setRole(Role.USER);
        user.setVerified(false);

        // ✅ 3. USAR EL TOKEN QUE ENVÍA EL FRONTEND
        user.setVerificationToken(request.getVerificationToken());
        user.setVerificationExpires(LocalDateTime.now().plusHours(24));
        user.setVerified(false);

        return userRepositorio.save(user);
    }

    // Verificar token Emailjs
    public Usuario findByVerificationToken(String token) {
        return userRepositorio.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Token de verificación no encontrado"));
    }
}
