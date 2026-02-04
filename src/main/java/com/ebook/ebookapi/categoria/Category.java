package com.ebook.ebookapi.categoria;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.ebook.ebookapi.book.modelo.Book;

import java.util.ArrayList;
import java.util.List;

@Entity
// Usamos plural por convención, pero puede ser "category"
@Table(name = "categories")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    // Constructor Un parametro
    public Category(String nombre){
        this.name = nombre;
    }


    // Relación inversa (opcional pero recomendada)
    @OneToMany(mappedBy = "category")
    @JsonIgnore
    private List<Book> books = new ArrayList<>();
}
