package com.ebook.ebookapi.user.service;

import com.ebook.ebookapi.user.dtos.RegisterRequest;
import com.ebook.ebookapi.user.dtos.UserOrdenDTO;
import com.ebook.ebookapi.user.modelo.Usuario;
import java.util.Optional;

public interface IUserService {
    // Registrar usuario
    Usuario register(RegisterRequest request);

    // Encontrar usuario por email
    UserOrdenDTO obtenerUsuarioByEmail(String email);
}
