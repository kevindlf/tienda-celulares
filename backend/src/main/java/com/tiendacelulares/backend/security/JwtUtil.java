package com.tiendacelulares.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private static final String SECRET = "tienda-celulares-secret-key-super-segura-2024";
    private static final long EXPIRATION = 86400000; // 24 horas en ms

    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    public String generarToken(String email, String rol) {
        return Jwts.builder()
                .subject(email)
                .claim("rol", rol)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(key)
                .compact();
    }

    public String obtenerEmail(String token) {
        return Jwts.parser().verifyWith((javax.crypto.SecretKey) key)
                .build().parseSignedClaims(token).getPayload().getSubject();
    }

    public String obtenerRol(String token) {
        return Jwts.parser().verifyWith((javax.crypto.SecretKey) key)
                .build().parseSignedClaims(token).getPayload().get("rol", String.class);
    }

    public boolean validarToken(String token) {
        try {
            Jwts.parser().verifyWith((javax.crypto.SecretKey) key).build().parseSignedClaims(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
}