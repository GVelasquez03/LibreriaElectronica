package com.ebook.ebookapi.auth.config;

import com.ebook.ebookapi.auth.jwtFilter.JwtFilter;
import com.ebook.ebookapi.auth.jwtservicio.JwtService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtService jwtService;

    public SecurityConfig(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    // Metodo que define quien puede entrar en la app y qué requisitos debe cumplir
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        JwtFilter jwtFilter = new JwtFilter(jwtService);

        http
                // Desactivar CSRF (necesario para APIS REST)
                .csrf(AbstractHttpConfigurer::disable)
                // Configuración CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // Sesión sin estado (stateless)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                // Configurar permisos
                .authorizeHttpRequests(auth -> auth
                        // RUTAS PUBLICAS
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/books/**",
                                "/auth/**",
                                "/api/categories/**",
                                "/user/register",
                                "/api/metodos-pago/**",
                                "/api/ordenes/**"
                        ).permitAll()

                        // SOLO ADMIN
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // CUALQUIER OTRO
                        .anyRequest().authenticated()
                )
                // Filtro para verificar si el usuario trae un Token JWT válido
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                // Desactivar login por formulario y basic auth
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                // Configurar headers
                .headers(headers -> headers
                        .frameOptions(HeadersConfigurer.FrameOptionsConfig::disable)
                );

        return http.build();
    }

    // Bean para configuración CORS
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Orígenes permitidos
        configuration.setAllowedOrigins(Arrays.asList(
                "https://libreria-electronica-4jko.vercel.app",
                "http://localhost:5173"
        ));

        // Métodos HTTP permitidos
        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));

        // Headers permitidos
        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "X-Requested-With",
                "Accept",
                "Origin"
        ));

        // Permitir credenciales (cookies, headers de autenticación)
        configuration.setAllowCredentials(true);

        // Tiempo máximo de vida de la configuración CORS (en segundos)
        configuration.setMaxAge(3600L);

        // Aplicar configuración a todas las rutas
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    // Responsable de encriptar contraseñas al registrar usuarios
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}