package com.ebook.ebookapi.categoria;

import java.util.List;

public interface ICategoryService {
     // Metodo Obtener Categorias
     List<Category> obtenerCategorias();

     // Inicializar datos (Para pruebas)
    void guardarCategoria(Category category);
}
