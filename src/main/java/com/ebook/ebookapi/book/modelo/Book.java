package com.ebook.ebookapi.book.modelo;

import com.ebook.ebookapi.categoria.Category;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "books") //Nombre de la tabla en postgresql
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Book {
    @Id //Clave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private String cover;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

}
