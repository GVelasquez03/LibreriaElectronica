package com.ebook.ebookapi.categoria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
public interface CategoryRepository extends JpaRepository<Category, Long> {
    // Para buscar una categoría específica por su nombre
    Optional<Category> findByNameIgnoreCase(String name);

    // Para verificar si ya existe antes de crear una nueva
    boolean existsByNameIgnoreCase(String name);
}
