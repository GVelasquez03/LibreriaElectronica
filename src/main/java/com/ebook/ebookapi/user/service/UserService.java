package com.ebook.ebookapi.user.service;

import com.ebook.ebookapi.user.dtos.RegisterRequest;
import com.ebook.ebookapi.user.dtos.UserOrdenDTO;
import com.ebook.ebookapi.user.mapper.UserMapper;
import com.ebook.ebookapi.user.modelo.Role;
import com.ebook.ebookapi.user.modelo.Usuario;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.ebook.ebookapi.user.repositorioUsuario.UsuarioRepositorio;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

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
        Usuario user = UserMapper.toEntity(request);

        // Encoodear password
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Usar el token que enviá el frontend
        user.setVerificationToken(request.getVerificationToken());
        user.setVerificationExpires(LocalDateTime.now().plusHours(24));

        return userRepositorio.save(user);
    }

    // Encontrar usuario por email
    @Override
    public UserOrdenDTO obtenerUsuarioByEmail(String email) {
        Usuario usuario = userRepositorio.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email user no encontrado"));
        return UserMapper.toOrdenDTO(usuario);
    }

    // Encontrar

    // Verificar token Emailjs
    public Usuario findByVerificationToken(String token) {
        return userRepositorio.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Token de verificación no encontrado"));
    }

}
