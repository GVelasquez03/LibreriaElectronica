package com.ebook.ebookapi.categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    // Podemos agregar métodos extras si los necesitamos
}
