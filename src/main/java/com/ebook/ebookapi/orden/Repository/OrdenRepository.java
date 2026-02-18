package com.ebook.ebookapi.orden.Repository;

import com.ebook.ebookapi.orden.modelo.Orden;
import com.ebook.ebookapi.user.modelo.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdenRepository extends JpaRepository<Orden,Long> {
    List<Orden> findByUsuario(Usuario usuario);
    List<Orden> findByEstado(String estado);
}
