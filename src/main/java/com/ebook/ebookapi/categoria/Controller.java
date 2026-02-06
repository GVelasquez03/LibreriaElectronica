package com.ebook.ebookapi.categoria;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
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

    // Metodo obtener lista de Categorias
    @GetMapping
    public List<Category> obtenerCategorias(){
       return categoryService.obtenerCategorias();
    }

    // Agregar una Categoria
    @PostMapping
    public void agregarCategoria(@Valid @RequestBody DtoCategoria dto){
        categoryService.guardarCategoria(dto);
    }

    // Actualizar categoria
    @PutMapping("/{id}")
    public ResponseEntity<Category> update(
            @PathVariable Long id,
            @RequestBody Category category
    ) {
        return ResponseEntity.ok(categoryService.update(id, category));
    }

    // Eliminar categoria
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
