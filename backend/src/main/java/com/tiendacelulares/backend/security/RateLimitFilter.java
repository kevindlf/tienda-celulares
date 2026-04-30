package com.tiendacelulares.backend.security;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private final Map<String, Bucket> loginBuckets = new ConcurrentHashMap<>();
    private final Map<String, Bucket> registroBuckets = new ConcurrentHashMap<>();
    private final Map<String, Bucket> chatBuckets = new ConcurrentHashMap<>();

    private Bucket crearBucket(int tokens) {
        return Bucket.builder()
                .addLimit(Bandwidth.builder()
                        .capacity(tokens)
                        .refillGreedy(tokens, Duration.ofMinutes(1))
                        .build())
                .build();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();
        String ip = obtenerIp(request);

        Bucket bucket = null;

        if ("POST".equals(method)) {
            if ("/api/auth/login".equals(path)) {
                bucket = loginBuckets.computeIfAbsent(ip, k -> crearBucket(5));
            } else if ("/api/auth/registro".equals(path)) {
                bucket = registroBuckets.computeIfAbsent(ip, k -> crearBucket(3));
            } else if ("/api/chat".equals(path)) {
                bucket = chatBuckets.computeIfAbsent(ip, k -> crearBucket(10));
            }
        }

        if (bucket != null && !bucket.tryConsume(1)) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"mensaje\": \"Demasiadas solicitudes, intentá más tarde\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String obtenerIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
