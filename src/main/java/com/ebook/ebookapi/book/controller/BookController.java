package com.ebook.ebookapi.book.controller;

import com.ebook.ebookapi.book.modelo.Book;
import com.ebook.ebookapi.book.servicio.ServicioBook;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "http://localhost:5173")
public class BookController {

    private final ServicioBook servicioBook;

    //Inyeccion de dependencia
    public BookController(ServicioBook servicioBook) {
        this.servicioBook = servicioBook;
    }

    // Obtener todos libros
    @GetMapping
    public List<Book> obtenerLibros() {
        return servicioBook.ObtenerLibros();
    }

    // Obtener libros por ID
    @GetMapping("/{id}")
    public ResponseEntity<Book> ObtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(servicioBook.EncontrarPorId(id));
    }

    // Crear libro
    @PostMapping
    public Book crearLibro(@RequestBody Book book) {
        return servicioBook.crear(book);
    }

    // Actualizar libro
    @PutMapping("/{id}")
    public Book actualizarLibro(
            @PathVariable Long id,
            @RequestBody Book book
    ) {
        return servicioBook.actualizar(id, book);
    }

    // Eliminar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarLibro(@PathVariable Long id) {
        servicioBook.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // Por categoría
    @GetMapping("/category/{category}")
    public List<Book> getByCategory(@PathVariable String category) {
        return servicioBook.encontrarPorCategoria(category);
    }
}
