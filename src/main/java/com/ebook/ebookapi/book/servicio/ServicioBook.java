package com.ebook.ebookapi.book.servicio;

import com.ebook.ebookapi.book.dto.BookRequestDTO;
import com.ebook.ebookapi.book.modelo.Book;
import com.ebook.ebookapi.book.repository.BookRepository;
import com.ebook.ebookapi.categoria.Category;
import com.ebook.ebookapi.categoria.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServicioBook implements IServicioBook{

    private final BookRepository bookrepository;
    private final CategoryRepository categoryRepository;

    //Inyeccion de dependencia
    public ServicioBook(BookRepository bookrepository, CategoryRepository categoryRepository) {
        this.bookrepository = bookrepository;
        this.categoryRepository = categoryRepository;
    }

    //Servicio encontrar libros
    @Override
    public List<Book> ObtenerLibros() {
        return bookrepository.findAll();
    }

    //Servicio encontrar libro por ID
    @Override
    public Book EncontrarPorId(Long id) {
        if (id == null) {
            throw new RuntimeException("El ID proporcionado no puede ser nulo.");
        }
        return bookrepository.findById(id).orElseThrow(
                () -> new RuntimeException("Libro con ID"+ id +" no encontrado"));
    }

    // Servicio crear libro con BookRequestDTO
    @Override
    public Book crear(BookRequestDTO dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        Book book = new Book();
        book.setTitle(dto.getTitle());
        book.setAuthor(dto.getAuthor());
        book.setDescription(dto.getDescription());
        book.setCover(dto.getCover());
        book.setPrice(dto.getPrice());
        book.setCategory(category);

        return bookrepository.save(book);
    }

    // Servicio para actualizar un libro
    @Override
    public Book actualizar(Long id, BookRequestDTO dto) { // BookRequestDTO
        Book book = bookrepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Libro no encontrado"));

        // Buscamos la nueva categoría si el ID cambió
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        book.setTitle(dto.getTitle());
        book.setAuthor(dto.getAuthor());
        book.setDescription(dto.getDescription());
        book.setPrice(dto.getPrice());
        book.setCover(dto.getCover());

        // Aquí es donde vinculas la entidad completa
        book.setCategory(category);

        return bookrepository.save(book);
    }

    //Servicio para eliminar un libro
    @Override
    public void eliminar(Long id) {
        bookrepository.deleteById(id);
    }

    // Servicio para listar libros por categorias
    @Override
    public List<Book> encontrarPorCategoria(String categoryName) {
        // Usamos el metodo corregido
        return bookrepository.findByCategoryNameIgnoreCase(categoryName);
    }
}
