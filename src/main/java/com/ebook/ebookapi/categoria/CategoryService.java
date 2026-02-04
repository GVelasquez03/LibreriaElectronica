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
        categoryRepository.save(new Category(dto.getName()));
    }


}
