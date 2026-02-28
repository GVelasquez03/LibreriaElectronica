package com.ebook.ebookapi.orden.Controller;
import com.ebook.ebookapi.orden.dtos.OrdenDTO;
import com.ebook.ebookapi.orden.service.OrdenService;
import com.ebook.ebookapi.user.dtos.UserOrdenDTO;
import com.ebook.ebookapi.user.service.UserService;
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
    private final UserService userService;

    public OrdenController(OrdenService ordenService, UserService userService){
        this.ordenService = ordenService;
        this.userService = userService;
    }

    // Obtener todas las órdenes
    @GetMapping
    public ResponseEntity<List<OrdenDTO>> listarTodas() {
        return ResponseEntity.ok(ordenService.listarTodas());
    }

    // Listado de órdenes por usuarios
    @GetMapping("/compras")
    public ResponseEntity<List<OrdenDTO>> listarPorUsuario(@RequestParam String email) {
        return ResponseEntity.ok(ordenService.listarPorUsuario(email));
    }

    // Obtener una orden by id
    @GetMapping("/{id}")
    public ResponseEntity<OrdenDTO> obtenerOrdenById(@PathVariable Long id) {
        return ResponseEntity.ok(ordenService.obtenerPorId(id));
    }

    // Obtener un usuario por email
    @GetMapping("/buscar")
    public ResponseEntity<UserOrdenDTO> obtenerUserByEmail(@RequestParam String email) {
        return ResponseEntity.ok(userService.obtenerUsuarioByEmail(email));
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
