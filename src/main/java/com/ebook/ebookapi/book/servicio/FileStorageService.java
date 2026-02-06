package com.ebook.ebookapi.book.servicio;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    public FileStorageService(@Value("${file.upload-dir}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("No se pudo crear el directorio para almacenar archivos.", ex);
        }
    }

    public String storeFile(MultipartFile file) {
        // Validar que el archivo sea PDF
        String contentType = file.getContentType();
        if (!"application/pdf".equals(contentType)) {
            throw new RuntimeException("Solo se permiten archivos PDF");
        }

        // Normalizar nombre del archivo
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String filename = UUID.randomUUID().toString() + "_" + originalFilename;

        try {
            // Validar nombre del archivo
            if (filename.contains("..")) {
                throw new RuntimeException("Nombre de archivo inválido: " + filename);
            }

            // Copiar archivo a la ubicación de destino
            Path targetLocation = this.fileStorageLocation.resolve(filename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return filename;

        } catch (IOException ex) {
            throw new RuntimeException("No se pudo almacenar el archivo: " + filename, ex);
        }
    }

    // Metodo para carga el archivo como recurso
    public Resource loadFileAsResource(String filename) {
        try {
            Path filePath = this.fileStorageLocation.resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("Archivo no encontrado: " + filename);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("Archivo no encontrado: " + filename, ex);
        }
    }

    // Metodo para eliminar el archivo
    public void deleteFile(String filename) {
        try {
            Path filePath = this.fileStorageLocation.resolve(filename).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            throw new RuntimeException("No se pudo eliminar el archivo: " + filename, ex);
        }
    }
}