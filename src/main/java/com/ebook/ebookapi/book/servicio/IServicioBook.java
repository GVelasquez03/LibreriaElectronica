package com.ebook.ebookapi.book.servicio;

import com.ebook.ebookapi.book.modelo.Book;

import java.util.List;

public interface IServicioBook {
    //Lista de libros
    List<Book> ObtenerLibros();

    // Encontrar un libro
    Book EncontrarPorId(Long id);

    //Crear un libro
    Book crear(Book book);

    //Actualizar un libro
    Book actualizar(Long id, Book book);

    //Eliminar un libro
    void eliminar(Long id);

    // Listado de libros por categorias
    List<Book> encontrarPorCategoria(String category);
}
