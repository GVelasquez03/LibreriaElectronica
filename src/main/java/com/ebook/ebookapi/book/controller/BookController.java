package com.ebook.ebookapi.book.controller;

import com.ebook.ebookapi.book.dto.BookRequestDTO;
import com.ebook.ebookapi.book.modelo.Book;
import com.ebook.ebookapi.book.servicio.ServicioBook;
import jakarta.validation.Valid;
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
    public ResponseEntity<Book> crearLibro( @Valid @RequestBody BookRequestDTO dto) {
        return ResponseEntity.ok(servicioBook.crear(dto));
    }

    // Actualizar libro
    @PutMapping("/{id}")
    public ResponseEntity<Book> actualizarLibro(@Valid @PathVariable Long id, @RequestBody BookRequestDTO dto) {
        // Agregamos ResponseEntity para mantener el estándar
        return ResponseEntity.ok(servicioBook.actualizar(id, dto));
    }

    // Eliminar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarLibro(@PathVariable Long id) {
        servicioBook.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // Encontrar por Categoria
    @GetMapping("/category/{categoryName}")
    public List<Book> getByCategory(@PathVariable String categoryName) {
        // Este método funcionará siempre que el Service use 'findByCategoryNameIgnoreCase'
        return servicioBook.encontrarPorCategoria(categoryName);
    }
}
