package com.tiendacelulares.backend.controller;

import com.tiendacelulares.backend.dto.CrearOrdenRequest;
import com.tiendacelulares.backend.dto.MapperDTO;
import com.tiendacelulares.backend.dto.OrdenDTO;
import com.tiendacelulares.backend.model.EstadoOrden;
import com.tiendacelulares.backend.model.Orden;
import com.tiendacelulares.backend.service.MercadoPagoService;
import com.tiendacelulares.backend.service.OrdenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ordenes")
@RequiredArgsConstructor
public class OrdenController {

    private final MercadoPagoService mercadoPagoService;

    @Value("${mercadopago.public-key}")
    private String publicKey;
    private final OrdenService ordenService;
    private final MapperDTO mapper;

    @PostMapping
    public ResponseEntity<OrdenDTO> crearOrden(@Valid @RequestBody CrearOrdenRequest request,
                                               Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(mapper.toOrdenDTO(ordenService.crearOrden(auth.getName(), request)));
    }

    @GetMapping("/mis-ordenes")
    public ResponseEntity<List<OrdenDTO>> misOrdenes(Authentication auth) {
        return ResponseEntity.ok(ordenService.obtenerOrdenesDelUsuario(auth.getName())
                .stream().map(mapper::toOrdenDTO).collect(Collectors.toList()));
    }

    @GetMapping
    public ResponseEntity<List<OrdenDTO>> todasLasOrdenes() {
        return ResponseEntity.ok(ordenService.obtenerTodasLasOrdenes()
                .stream().map(mapper::toOrdenDTO).collect(Collectors.toList()));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<OrdenDTO> actualizarEstado(@PathVariable Long id,
                                                     @RequestBody Map<String, String> body) {
        EstadoOrden nuevoEstado = EstadoOrden.valueOf(body.get("estado"));
        return ResponseEntity.ok(mapper.toOrdenDTO(ordenService.actualizarEstado(id, nuevoEstado)));
    }

    @PostMapping("/{id}/pagar")
    public ResponseEntity<?> generarPago(@PathVariable Long id, Authentication auth) {
        try {
            Orden orden = ordenService.obtenerOrdenPorId(id);

            // Validar que el usuario que paga es el dueño de la orden
            if (!orden.getUsuario().getEmail().equals(auth.getName())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("mensaje", "No tenés permiso para pagar esta orden"));
            }

            String preferenceId = mercadoPagoService.crearPreferencia(orden);
            ordenService.guardarPreferenceId(id, preferenceId);
            return ResponseEntity.ok(Map.of(
                    "preferenceId", preferenceId,
                    "publicKey", publicKey
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("mensaje", "Error al generar el pago: " + e.getMessage()));
        }
    }
}