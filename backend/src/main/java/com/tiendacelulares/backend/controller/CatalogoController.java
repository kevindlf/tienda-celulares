package com.tiendacelulares.backend.controller;

import com.tiendacelulares.backend.service.CatalogoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/catalogo")
@RequiredArgsConstructor
public class CatalogoController {

    private final CatalogoService catalogoService;

    @GetMapping("/marcas")
    public ResponseEntity<List<String>> obtenerMarcas() {
        return ResponseEntity.ok(catalogoService.obtenerMarcas());
    }

    @GetMapping("/modelos")
    public ResponseEntity<List<String>> obtenerModelos(@RequestParam String marca) {
        return ResponseEntity.ok(catalogoService.obtenerModelos(marca));
    }

    @GetMapping("/colores")
    public ResponseEntity<List<String>> obtenerColores(
            @RequestParam String marca,
            @RequestParam String modelo) {
        return ResponseEntity.ok(catalogoService.obtenerColores(marca, modelo));
    }

    @GetMapping("/ram-opciones")
    public ResponseEntity<List<Integer>> obtenerOpcionesRam() {
        return ResponseEntity.ok(catalogoService.obtenerOpcionesRam());
    }

    @GetMapping("/almacenamiento-opciones")
    public ResponseEntity<List<Integer>> obtenerOpcionesAlmacenamiento() {
        return ResponseEntity.ok(catalogoService.obtenerOpcionesAlmacenamiento());
    }

    @GetMapping("/categorias-accesorio")
    public ResponseEntity<List<String>> obtenerCategoriasAccesorio() {
        return ResponseEntity.ok(catalogoService.obtenerCategoriasAccesorio());
    }
}
