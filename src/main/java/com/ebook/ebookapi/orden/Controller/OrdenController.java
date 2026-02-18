package com.ebook.ebookapi.orden.Controller;

import com.ebook.ebookapi.orden.dtos.OrdenDTO;
import com.ebook.ebookapi.orden.service.OrdenService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ebook.ebookapi.orden.dtos.OrdenRequest;
import org.springframework.http.HttpStatus;
import java.util.List;

@RestController
@RequestMapping("/api/ordenes")
@CrossOrigin(origins = "http://localhost:5173")
public class OrdenController {
    private final OrdenService ordenService;

    public OrdenController(OrdenService ordenService){
        this.ordenService = ordenService;
    }

    // Obtener todas las órdenes
    @GetMapping
    public ResponseEntity<List<OrdenDTO>> listarTodas() {
        return ResponseEntity.ok(ordenService.listarTodas());
    }

    // Obtener órdenes por Id
    @GetMapping("/{id}")
    public ResponseEntity<OrdenDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(ordenService.obtenerPorId(id));
    }

    // Listado de órdenes por usuarios
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<OrdenDTO>> listarPorUsuario(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(ordenService.listarPorUsuario(idUsuario));
    }

    // Crear una orden
    @PostMapping
    public ResponseEntity<OrdenDTO> crearOrden(@RequestBody OrdenRequest request) {
        return new ResponseEntity<>(ordenService.crearOrden(request), HttpStatus.CREATED);
    }

    // Actualizar estado de una orden
    @PatchMapping("/{id}/estado")
    public ResponseEntity<OrdenDTO> actualizarEstado(@PathVariable Long id, @RequestParam String estado) {
        return ResponseEntity.ok(ordenService.actualizarEstado(id, estado));
    }
}
