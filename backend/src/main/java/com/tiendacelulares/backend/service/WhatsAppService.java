package com.tiendacelulares.backend.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class WhatsAppService {

    @Value("${twilio.account-sid:}")
    private String accountSid;

    @Value("${twilio.auth-token:}")
    private String authToken;

    @Value("${twilio.phone-number:}")
    private String twilioPhoneNumber;

    @Autowired
    private ChatService chatService;

    @PostConstruct
    public void init() {
        if (accountSid != null && !accountSid.isEmpty() && authToken != null && !authToken.isEmpty()) {
            Twilio.init(accountSid, authToken);
        }
    }

    public void procesarMensajeEntrante(String fromNumber, String body) {
        // Enviar al servicio de Chat (Gemini) para procesar
        // Por ahora no mantenemos estado de sesión complejo por WhatsApp en este MVP,
        // simplemente pasamos el mensaje. Se podría mejorar guardando el historial por número telefónico.
        String respuestaIA = chatService.procesarMensaje(body, new ArrayList<>());
        
        enviarMensaje(fromNumber, respuestaIA);
    }

    public void enviarMensaje(String toPhoneNumber, String body) {
        if (accountSid == null || accountSid.isEmpty()) {
            System.err.println("Twilio no está configurado. Mensaje no enviado a " + toPhoneNumber + ": " + body);
            return;
        }

        try {
            Message message = Message.creator(
                    new PhoneNumber(toPhoneNumber),
                    new PhoneNumber(twilioPhoneNumber),
                    body
            ).create();
            
            System.out.println("Mensaje enviado exitosamente. SID: " + message.getSid());
        } catch (Exception e) {
            System.err.println("Error al enviar mensaje de WhatsApp: " + e.getMessage());
        }
    }
}
