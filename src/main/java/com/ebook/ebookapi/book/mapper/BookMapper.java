package com.ebook.ebookapi.book.mapper;

import com.ebook.ebookapi.book.dto.BookDTO;
import com.ebook.ebookapi.book.modelo.Book;

public class BookMapper {
    // Convertir libro a dto
    public static BookDTO toDTO(Book book){
        BookDTO bookDTO = new BookDTO();
        bookDTO.setId(book.getId());
        bookDTO.setTitle(book.getTitle());
        bookDTO.setAuthor(book.getAuthor());
        bookDTO.setDescription(book.getDescription());
        bookDTO.setPrice(book.getPrice());
        bookDTO.setCover(book.getCover());
        bookDTO.setCategoryId(book.getCategory().getId());
        bookDTO.setPdfFilename(book.getPdfFilename());

        return bookDTO;
    }
}
