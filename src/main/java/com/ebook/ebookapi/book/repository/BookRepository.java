package com.ebook.ebookapi.book.repository;

import com.ebook.ebookapi.book.modelo.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book,Long> {
    List<Book> findByCategoryIgnoreCase(String category);
}
