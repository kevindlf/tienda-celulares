package com.tiendacelulares.backend.controller;

import com.tiendacelulares.backend.service.MercadoPagoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/webhook")
@RequiredArgsConstructor
public class WebhookController {

    private final MercadoPagoService mercadoPagoService;

    @PostMapping("/mercadopago")
    public ResponseEntity<String> recibirNotificacion(@RequestBody Map<String, Object> payload) {
        try {
            String type = (String) payload.get("type");

            if ("payment".equals(type)) {
                Map<String, Object> data = (Map<String, Object>) payload.get("data");
                if (data != null && data.get("id") != null) {
                    String paymentId = String.valueOf(data.get("id"));
                    mercadoPagoService.procesarNotificacionPago(paymentId);
                }
            }

            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            // Siempre retornar 200 para que MP no reintente
            return ResponseEntity.ok("OK");
        }
    }
}
