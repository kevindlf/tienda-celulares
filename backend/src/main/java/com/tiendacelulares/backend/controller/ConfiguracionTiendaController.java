package com.tiendacelulares.backend.controller;

import com.tiendacelulares.backend.model.ConfiguracionTienda;
import com.tiendacelulares.backend.service.ConfiguracionTiendaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/configuracion")
@CrossOrigin(origins = "*")
public class ConfiguracionTiendaController {

    @Autowired
    private ConfiguracionTiendaService service;

    // Endpoint público para que el frontend cargue los datos (WhatsApp, Logo, etc)
    @GetMapping
    public ResponseEntity<ConfiguracionTienda> obtenerConfiguracion() {
        return ResponseEntity.ok(service.obtenerConfiguracion());
    }

    // Endpoint privado para el dashboard (modificar configuración)
    @PutMapping
    public ResponseEntity<ConfiguracionTienda> actualizarConfiguracion(@RequestBody ConfiguracionTienda configuracion) {
        return ResponseEntity.ok(service.actualizarConfiguracion(configuracion));
    }
}
