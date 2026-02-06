package com.ebook.ebookapi.categoria;
import org.springframework.stereotype.Service;

import java.util.List;



@Service
public class CategoryService implements ICategoryService{

    private final CategoryRepository categoryRepository;

    // Inyeccion de dependencias
    public CategoryService (CategoryRepository categoryRepository){
        this.categoryRepository = categoryRepository;
    }

    // Encontrar Todas las categorias
    @Override
    public List<Category> obtenerCategorias() {
        return categoryRepository.findAll();
    }

    // Guardar categoria
    @Override
    public void guardarCategoria(DtoCategoria dto) {
        // Verificar si la categoria existe
        if (categoryRepository.existsByNameIgnoreCase(dto.getName())) {
            throw new RuntimeException("La categoría ya existe");
        }
        categoryRepository.save(new Category(dto.getName()));
    }

    // Editar categoria
    public Category update(Long id, Category data) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        System.out.println(category);
        category.setName(data.getName());
        return categoryRepository.save(category);

    }

    // eliminar categoria
    public void delete(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        if (!category.getBooks().isEmpty()) {
            throw new RuntimeException("No se puede eliminar una categoría con libros");
        }

        categoryRepository.delete(category);
    }

}
