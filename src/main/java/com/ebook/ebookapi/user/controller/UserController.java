package com.ebook.ebookapi.user.controller;

import com.ebook.ebookapi.user.dtos.RegisterRequest;
import com.ebook.ebookapi.user.modelo.Usuario;
import com.ebook.ebookapi.user.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("user/register")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Registrar un usuario
    @PostMapping()
    public ResponseEntity<Usuario> register(@RequestBody RegisterRequest request) {
        Usuario user = userService.register(request);
        return ResponseEntity.ok(user);
    }

}
