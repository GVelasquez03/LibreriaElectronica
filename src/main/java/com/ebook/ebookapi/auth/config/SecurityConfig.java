package com.ebook.ebookapi.auth.config;

import com.ebook.ebookapi.auth.jwtFilter.JwtFilter;
import com.ebook.ebookapi.auth.jwtservicio.JwtService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtService jwtService;

    //Inyeccion del Servicio JWT
    SecurityConfig(JwtService jwtService){
        this.jwtService = jwtService;
    }

    // Metodo que define quien puede entrar en la app y qué requisitos debe cumplir
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        JwtFilter jwtFilter = new JwtFilter(jwtService);
        http
                // Desactivar CSRF (necesario para APIS REST)
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                // Configurar permisos
                .authorizeHttpRequests(auth -> auth
                        // RUTAS PUBLICAS
                        .requestMatchers("/api/auth/**", "/api/books/**", "/auth/**", "/api/categories/**").permitAll()

                        // SOLO ADMIN
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // CUALQUIER OTRO
                        .anyRequest().authenticated()
                )
                // Filtro para verificar si el usuario trae un Token JWT válido
                .addFilterBefore(jwtFilter,UsernamePasswordAuthenticationFilter.class)
                .formLogin(AbstractHttpConfigurer::disable) // Desactivar login por formulario
                .httpBasic(AbstractHttpConfigurer::disable); // Desactivar basic auth

        return http.build();
    }
    // Responsable de encriptar contraseñas al registrar usuarios
    @Bean
    public PasswordEncoder passwordEncoder() {
         return new BCryptPasswordEncoder();
    }
}
