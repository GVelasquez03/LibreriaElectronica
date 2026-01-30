package com.ebook.ebookapi.categoria;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:5173")
public class Controller {
    private final CategoryService categoryService;

    // Inyeccion de dependencias
    public Controller(CategoryService categoryService){
        this.categoryService = categoryService;
    }

    // Metodo obtener Categorias
    @GetMapping
    public List<Category> obtenerCategorias(){
       return categoryService.obtenerCategorias();
    }

    // Agregar una Categoria
    @PostMapping()
    public void agregarCategoria(Category category){
        categoryService.guardarCategoria(category);
    }
}
