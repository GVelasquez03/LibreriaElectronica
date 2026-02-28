package com.ebook.ebookapi.book.repository;

import com.ebook.ebookapi.book.modelo.Book;
import com.ebook.ebookapi.categoria.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book,Long> {
    // Opción A: Buscar por el nombre de la categoría (ignora mayúsculas/minúsculas)
    List<Book> findByCategoryNameIgnoreCase(String name);

    // Opción B: Buscar por el ID de la categoría (muy útil para filtros en el frontend)
    List<Book> findByCategoryId(Long id);

    // Buscar por titulo o autor
    List<Book> findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(
            String title, String author
    );
}
