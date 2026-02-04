package com.ebook.ebookapi.book.servicio;

import com.ebook.ebookapi.book.dto.BookRequestDTO;
import com.ebook.ebookapi.book.modelo.Book;

import java.util.List;

public interface IServicioBook {
    //Lista de libros
    List<Book> ObtenerLibros();

    // Encontrar un libro
    Book EncontrarPorId(Long id);

    //Crear un libro
    Book crear(BookRequestDTO book);

    //Actualizar un libro
    Book actualizar(Long id, BookRequestDTO dto);

    //Eliminar un libro
    void eliminar(Long id);

    // Listado de libros por categorias
    List<Book> encontrarPorCategoria(String category);
}
