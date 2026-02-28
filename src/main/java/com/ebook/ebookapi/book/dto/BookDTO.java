package com.ebook.ebookapi.book.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class BookDTO {
    private Long id;
    private String title;
    private String author;
    private String description;
    private BigDecimal price;
    private String cover;
    private Long categoryId;
    private String pdfFilename;
}
