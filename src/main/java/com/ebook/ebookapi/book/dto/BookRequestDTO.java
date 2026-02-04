package com.ebook.ebookapi.book.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Data
@Setter
@Getter
public class BookRequestDTO {
    @NotBlank(message = "El título es obligatorio")
    private String title;

    @NotBlank(message = "El autor es obligatorio")
    private String author;

    private String description;
    @NotBlank(message = "El cover es obligatorio")
    private String cover;

    @NotNull(message = "El precio es obligatorio")
    private BigDecimal price;

    @NotNull(message = "Debes asignar una categoría al libro")
    private Long categoryId;

}
