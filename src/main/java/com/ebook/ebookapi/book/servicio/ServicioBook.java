package com.ebook.ebookapi.book.servicio;

import com.ebook.ebookapi.book.modelo.Book;
import com.ebook.ebookapi.book.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServicioBook implements IServicioBook{

    private final BookRepository bookrepository;

    //Inyeccion de dependencia
    public ServicioBook(BookRepository repository) {
        this.bookrepository = repository;
    }

    //Servicio encontrar libros
    @Override
    public List<Book> ObtenerLibros() {
        return bookrepository.findAll();
    }

    //Servicio encontrar libro por ID
    @Override
    public Book EncontrarPorId(Long id) {
        return bookrepository.findById(id).orElseThrow(() -> new RuntimeException("Libro no encontrado"));
    }

    //Servicio crear libro
    @Override
    public Book crear(Book book) {
        return bookrepository.save(book);
    }

    // Servicio para actualizar un libro
    @Override
    public Book actualizar(Long id, Book updated) {
        Book book = bookrepository.findById(id).orElseThrow(()-> new RuntimeException("Libro no encontrado"));

        book.setTitle(updated.getTitle());
        book.setAuthor(updated.getAuthor());
        book.setDescription(updated.getDescription());
        book.setCategory(updated.getCategory());
        book.setCover(updated.getCover());
        book.setPrice(updated.getPrice());

        return bookrepository.save(book);
    }

    //Servicio para eliminar un libro
    @Override
    public void eliminar(Long id) {
        bookrepository.deleteById(id);
    }

    // Servicio para listar libros por categorias
    @Override
    public List<Book> encontrarPorCategoria(String category) {
        return bookrepository.findByCategoryIgnoreCase(category);
    }
}
