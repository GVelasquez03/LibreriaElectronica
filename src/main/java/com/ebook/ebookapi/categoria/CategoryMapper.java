package com.ebook.ebookapi.categoria;

// Mapper de categorias
public class CategoryMapper {

    // Convierte una dto a categoria
    public static Category toEntity(DtoCategoria dtoCategoria){
        return  new Category(dtoCategoria.getName());
    }

    //  Convierte una Categoria a un dto
    public static DtoCategoria toDto(Category category){
        DtoCategoria dtoCategoria = new DtoCategoria();
        dtoCategoria.setName(category.getName());
        return dtoCategoria;
    }
}
