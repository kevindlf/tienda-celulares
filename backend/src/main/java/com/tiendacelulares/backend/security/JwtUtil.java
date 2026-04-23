package com.tiendacelulares.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration:86400000}")
    private long expiration; // 24 horas en ms por defecto

    private Key key;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generarToken(String email, String rol) {
        return Jwts.builder()
                .subject(email)
                .claim("rol", rol)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
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