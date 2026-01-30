package com.ebook.ebookapi.user.service;

import com.ebook.ebookapi.user.dtos.RegisterRequest;
import com.ebook.ebookapi.user.modelo.Role;
import com.ebook.ebookapi.user.modelo.Usuario;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.ebook.ebookapi.user.repositorioUsuario.UsuarioRepositorio;
import org.springframework.stereotype.Service;

@Service
public class UserService implements IUserService {

    private final UsuarioRepositorio userRepositorio;
    private final PasswordEncoder passwordEncoder;

    // Inyeccion de dependencia
    public UserService(UsuarioRepositorio userRepositorio, PasswordEncoder passwordEncoder ){
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
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);

        return userRepositorio.save(user);
    }
}
