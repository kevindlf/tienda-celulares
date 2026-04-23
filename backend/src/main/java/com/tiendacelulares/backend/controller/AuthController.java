package com.tiendacelulares.backend.controller;

import com.tiendacelulares.backend.dto.LoginRequest;
import com.tiendacelulares.backend.dto.RegistroRequest;
import com.tiendacelulares.backend.model.Usuario;
import com.tiendacelulares.backend.repository.UsuarioRepository;
import com.tiendacelulares.backend.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/registro")
    public ResponseEntity<?> registro(@Valid @RequestBody RegistroRequest request) {
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", "El email ya está registrado"));
        }

        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .rol(Usuario.Rol.CLIENTE)
                .activo(true)
                .build();

        usuarioRepository.save(usuario);
        return ResponseEntity.ok(Map.of("mensaje", "Usuario registrado correctamente"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        return usuarioRepository.findByEmail(request.getEmail())
                .filter(u -> passwordEncoder.matches(request.getPassword(), u.getPassword()))
                .map(u -> ResponseEntity.ok(Map.of(
                        "token", jwtUtil.generarToken(u.getEmail(), u.getRol().name()),
                        "rol", u.getRol().name(),
                        "nombre", u.getNombre()
                )))
                .orElse(ResponseEntity.status(401).build());
    }
}