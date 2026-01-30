package com.ebook.ebookapi.ControlerAdmin;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class ControllerTest {
    @GetMapping("/test")
    public String testAdmin() {
        return "Acceso ADMIN correcto";
    }
}
