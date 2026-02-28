package com.ebook.ebookapi.book.controller;

import com.ebook.ebookapi.book.dto.BookDTO;
import com.ebook.ebookapi.book.dto.BookRequestDTO;
import com.ebook.ebookapi.book.modelo.Book;
import com.ebook.ebookapi.book.servicio.FileStorageService;
import com.ebook.ebookapi.book.servicio.ServicioBook;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "http://localhost:5173")
public class BookController {

    private final ServicioBook servicioBook;
    private final FileStorageService fileStorageService;

    //Inyeccion de dependencia
    public BookController(ServicioBook servicioBook, FileStorageService fileStorageService) {
        this.servicioBook = servicioBook;
        this.fileStorageService = fileStorageService;
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

    // Nuevo endpoint para guardar un libro con un pdf
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Book> crearLibro(
            @RequestPart("bookData") String bookDataJson,
            @RequestPart(value = "pdfFile", required = false) MultipartFile pdfFile) {

        // Agrega esto para debug:
        System.out.println("JSON RECIBIDO: " + bookDataJson);

        try {
            // Convertir JSON a DTO
            ObjectMapper objectMapper = new ObjectMapper();
            BookRequestDTO bookRequestDTO = objectMapper.readValue(bookDataJson, BookRequestDTO.class);

            // Asignar archivo
            bookRequestDTO.setPdfFile(pdfFile);

            Book createdBook = servicioBook.crear(bookRequestDTO);
            return new ResponseEntity<>(createdBook, HttpStatus.CREATED);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // endpoint para obtener un libro
    @GetMapping("/pdf/{filename}")
    public ResponseEntity<Resource> getPdf(@PathVariable String filename) {
        Resource resource = fileStorageService.loadFileAsResource(filename);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .body(resource);
    }

    // Obtener pdf con solo dos pag
    @GetMapping("/pdf/preview/{filename:.+}")
    public ResponseEntity<Resource> getPdfPreview(@PathVariable String filename) {
        try {
            Resource resource = fileStorageService.getTwoPagePreview(filename);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"preview_" + filename + "\"")
                    // CAMBIO AQUÍ: Reemplazamos X-Frame-Options por CSP frame-ancestors
                    .header("Content-Security-Policy", "frame-ancestors 'self' http://localhost:5173")
                    .header("Cache-Control", "no-store, must-revalidate")
                    .header("Pragma", "no-cache")
                    .header("Expires", "0")
                    .body(resource);

        } catch (IOException e) {
            Resource resource = fileStorageService.loadFileAsResource(filename);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + filename + "\"")
                    // También añade el CSP aquí para el fallback
                    .header("Content-Security-Policy", "frame-ancestors 'self' http://localhost:5173")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }


    // Para descargar (forzar descarga)
    @GetMapping("/pdf/download/{filename}")
    public ResponseEntity<Resource> downloadPdf(@PathVariable String filename) {
        Resource resource = fileStorageService.loadFileAsResource(filename);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + filename + "\"")
                .body(resource);
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

    // Buscar un libro por Autor y titulo
    @GetMapping("/search")
    public ResponseEntity<List<BookDTO>> searchBooks(@RequestParam String q) {
        if (q == null || q.trim().isEmpty()) {
            return ResponseEntity.ok(List.of()); // Lista vacía
        }

        List<BookDTO> books = servicioBook.searchBooks(q.trim());
        return ResponseEntity.ok(books);
    }
}
