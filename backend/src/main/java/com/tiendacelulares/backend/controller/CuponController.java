package com.tiendacelulares.backend.controller;

import com.tiendacelulares.backend.model.Cupon;
import com.tiendacelulares.backend.service.CuponService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/cupones")
@RequiredArgsConstructor
public class CuponController {

    private final CuponService cuponService;

    // Público — cualquier usuario autenticado puede validar un cupón en el checkout
    @GetMapping("/validar")
    public ResponseEntity<?> validar(
            @RequestParam String codigo,
            @RequestParam BigDecimal total) {
        return ResponseEntity.ok(cuponService.validar(codigo, total));
    }

    // ADMIN — crear cupón
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Cupon cupon) {
        return ResponseEntity.ok(cuponService.crear(cupon));
    }

    // ADMIN — listar todos
    @GetMapping
    public ResponseEntity<?> listar() {
        return ResponseEntity.ok(cuponService.listar());
    }

    // ADMIN — desactivar
    @DeleteMapping("/{id}")
    public ResponseEntity<?> desactivar(@PathVariable Long id) {
        cuponService.desactivar(id);
        return ResponseEntity.ok(Map.of("mensaje", "Cupón desactivado"));
    }
}
