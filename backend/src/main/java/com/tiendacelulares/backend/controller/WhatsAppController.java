package com.tiendacelulares.backend.controller;

import com.tiendacelulares.backend.service.WhatsAppService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/webhook/whatsapp")
@CrossOrigin(origins = "*")
public class WhatsAppController {

    @Autowired
    private WhatsAppService whatsAppService;

    @PostMapping(consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<String> recibirMensaje(@RequestParam Map<String, String> body) {
        // Twilio envía 'From' y 'Body'
        String from = body.get("From");
        String mensajeTexto = body.get("Body");
        
        if (from != null && mensajeTexto != null) {
            // El servicio procesa el mensaje de manera asíncrona para no bloquear a Twilio
            new Thread(() -> whatsAppService.procesarMensajeEntrante(from, mensajeTexto)).start();
        }
        
        // Twilio espera una respuesta en formato TwiML o un status 200 OK
        return ResponseEntity.ok("<Response></Response>");
    }
}
