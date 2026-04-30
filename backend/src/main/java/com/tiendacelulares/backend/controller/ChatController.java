package com.tiendacelulares.backend.controller;

import com.tiendacelulares.backend.service.ChatService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatResponse> enviarMensaje(@RequestBody ChatRequest request) {
        String respuesta = chatService.procesarMensaje(
                request.getMensaje(),
                request.getHistorial() != null ? request.getHistorial() : new ArrayList<>()
        );
        return ResponseEntity.ok(new ChatResponse(respuesta));
    }

    @Data
    public static class ChatRequest {
        private String mensaje;
        private List<Map<String, String>> historial;
    }

    @Data
    public static class ChatResponse {
        private String respuesta;

        public ChatResponse(String respuesta) {
            this.respuesta = respuesta;
        }
    }
}
