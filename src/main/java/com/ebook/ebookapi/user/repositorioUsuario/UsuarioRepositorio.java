package com.ebook.ebookapi.user.repositorioUsuario;

import com.ebook.ebookapi.user.modelo.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepositorio extends JpaRepository<Usuario, Long> {
    // Encontrar usuario por email
    Optional<Usuario> findByEmail(String email);

    // Existe email user
    boolean existsByEmail(String username);
}
