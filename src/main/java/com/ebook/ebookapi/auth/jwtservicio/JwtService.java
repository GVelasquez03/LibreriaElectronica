package com.ebook.ebookapi.auth.jwtservicio;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
@Service
public class JwtService {

    // Clave secreta (mínimo 256 bits)
    private static final String SECRET_KEY =
            "SUPER_SECRET_KEY_EBOOK_STORE_2025_123456";

    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 6; // 6 horas

    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    //Metodo Encargado de generar el token
    public String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return extractClaims(token).get("role", String.class);
    }
}
