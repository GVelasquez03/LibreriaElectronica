package com.ebook.ebookapi.book.controller;

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

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Backend funcionando: " + new Date());
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

//    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<Book> createBookSimple(@RequestBody BookRequestDTO bookRequestDTO) {
//        Book book = servicioBook.crear(bookRequestDTO);
//        return ResponseEntity.ok(book);
//    }

    // endpoint para descargar un libro
    @GetMapping("/pdf/{filename}")
    public ResponseEntity<Resource> getPdf(@PathVariable String filename) {
        Resource resource = fileStorageService.loadFileAsResource(filename);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .body(resource);
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
}
