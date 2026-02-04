package com.ebook.ebookapi.categoria;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Setter
@Getter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DtoCategoria {
    // Nombre solito
    @NotBlank(message = "El nombre de la categoria es obligatorio")
    private String name;

}
