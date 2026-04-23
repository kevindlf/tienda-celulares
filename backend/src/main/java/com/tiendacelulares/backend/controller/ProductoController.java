package com.tiendacelulares.backend.controller;

import com.tiendacelulares.backend.dto.MapperDTO;
import com.tiendacelulares.backend.dto.ProductoDTO;
import com.tiendacelulares.backend.model.Producto;
import com.tiendacelulares.backend.service.ProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ProductoController {

    private final ProductoService productoService;
    private final MapperDTO mapper;

    @GetMapping
    public ResponseEntity<List<ProductoDTO>> obtenerTodos() {
        return ResponseEntity.ok(productoService.obtenerTodos()
                .stream().map(mapper::toProductoDTO).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(mapper.toProductoDTO(productoService.obtenerPorId(id)));
    }

    @PostMapping
    public ResponseEntity<ProductoDTO> crear(@Valid @RequestBody Producto producto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(mapper.toProductoDTO(productoService.crear(producto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductoDTO> actualizar(@PathVariable Long id,
                                                  @Valid @RequestBody Producto producto) {
        return ResponseEntity.ok(mapper.toProductoDTO(productoService.actualizar(id, producto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        productoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}