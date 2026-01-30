package com.ebook.ebookapi.user.service;

import com.ebook.ebookapi.user.dtos.RegisterRequest;
import com.ebook.ebookapi.user.modelo.Usuario;

public interface IUserService {
    // Registrar usuario
    Usuario register(RegisterRequest request);
}
