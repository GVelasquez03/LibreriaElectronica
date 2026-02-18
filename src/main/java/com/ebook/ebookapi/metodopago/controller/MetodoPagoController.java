package com.ebook.ebookapi.metodopago.controller;

import com.ebook.ebookapi.metodopago.dtos.MetodoPagoDTO;
import com.ebook.ebookapi.metodopago.service.MetodoPagoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/metodos-pago")
@CrossOrigin(origins = "http://localhost:5173")
public class MetodoPagoController {

    private final MetodoPagoService metodoPagoService;

    // Inyeccion de dependencia
    public MetodoPagoController(MetodoPagoService metodoPagoService){
        this.metodoPagoService = metodoPagoService;
    }

    // Obtener metodos de pagos
    @GetMapping
    public ResponseEntity<List<MetodoPagoDTO>> listarTodos() {
        return ResponseEntity.ok(metodoPagoService.listarTodos());
    }

    // Obtener metodo de pago por Id
    @GetMapping("/{id}")
    public ResponseEntity<MetodoPagoDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(metodoPagoService.obtenerPorId(id));
    }

    // Agregar un nuevo metodo de pago
    @PostMapping
    public ResponseEntity<MetodoPagoDTO> crear(@RequestBody MetodoPagoDTO metodoPagoDTO) {
        return new ResponseEntity<>(metodoPagoService.crear(metodoPagoDTO), HttpStatus.CREATED);
    }

    // Actualizar metodo de pago
    @PutMapping("/{id}")
    public ResponseEntity<MetodoPagoDTO> actualizar(@PathVariable Long id, @RequestBody MetodoPagoDTO metodoPagoDTO) {
        return ResponseEntity.ok(metodoPagoService.actualizar(id, metodoPagoDTO));
    }

    // Eliminar metodo de pago
    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Long id) {

        return ResponseEntity.ok(metodoPagoService.eliminar(id));
    }
}
