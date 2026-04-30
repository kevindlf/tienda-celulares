package com.tiendacelulares.backend.service;

import com.tiendacelulares.backend.model.ConfiguracionTienda;
import com.tiendacelulares.backend.model.Producto;
import com.tiendacelulares.backend.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private ConfiguracionTiendaService configuracionService;

    private final RestTemplate restTemplate = new RestTemplate();

    public String procesarMensaje(String mensajeUsuario, List<Map<String, String>> historial) {
        if (geminiApiKey == null || geminiApiKey.isEmpty()) {
            return "El chat de inteligencia artificial está desactivado momentáneamente. Por favor, contáctanos por WhatsApp.";
        }

        ConfiguracionTienda config = configuracionService.obtenerConfiguracion();
        List<Producto> productos = productoRepository.findAll();

        String inventario = productos.stream()
            .filter(p -> p.getStock() > 0)
            .map(p -> String.format("- %s (Tipo: %s, Condición: %s, Precio: $%s, Stock: %d)",
                p.getNombre(), p.getTipoProducto(), p.getCondicion(), p.getPrecio(), p.getStock()))
            .collect(Collectors.joining("\n"));

        String systemPrompt = String.format(
            "Eres el asistente virtual oficial de '%s'. Tu objetivo es ayudar a los clientes a comprar productos, responder sus dudas y guiarlos. " +
            "Sé amable, persuasivo y muy breve. Habla en español de Argentina (usa 'vos', 'che', etc. pero mantén profesionalismo). " +
            "Aquí tienes la información actual de la tienda:\n" +
            "Dirección: %s\n" +
            "WhatsApp de contacto: %s\n" +
            "Envío gratis a partir de: $%s\n\n" +
            "INVENTARIO DISPONIBLE (sólo recomienda lo que hay aquí):\n%s\n\n" +
            "REGLAS:\n" +
            "1. NO inventes productos o precios.\n" +
            "2. Si el cliente quiere comprar, indícale que añada el producto al carrito en la web.\n" +
            "3. Mantén tus respuestas en menos de 4 párrafos.\n" +
            "4. PLAN CANJE: Ofrecemos Plan Canje. Aclara SIEMPRE que solo es válido para Mendoza (principalmente Zona Este). " +
            "Funciona así: el cliente entrega su celular usado en parte de pago. Para concretarlo, dile que debe ir presencialmente " +
            "a la tienda (sin costo extra) o que el dueño puede ir a domicilio (en cuyo caso se cobra el envío). " +
            "Deja al cliente interesado e invítalo a hablar con el dueño al WhatsApp para coordinar la tasación de su equipo viejo.",
            config.getNombreTienda(),
            config.getDireccionFisica(),
            config.getTelefonoWhatsApp(),
            config.getMontoEnvioGratis(),
            inventario
        );

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiApiKey;

        Map<String, Object> requestBody = new HashMap<>();
        java.util.List<Map<String, Object>> contents = new java.util.ArrayList<>();

        Map<String, Object> systemPart = new HashMap<>();
        systemPart.put("text", systemPrompt);
        Map<String, Object> systemMessage = new HashMap<>();
        systemMessage.put("role", "user");
        systemMessage.put("parts", java.util.List.of(systemPart));
        contents.add(systemMessage);

        Map<String, Object> systemAckPart = new HashMap<>();
        systemAckPart.put("text", "Entendido, soy el asistente virtual. Seguiré estas reglas.");
        Map<String, Object> systemAckMessage = new HashMap<>();
        systemAckMessage.put("role", "model");
        systemAckMessage.put("parts", java.util.List.of(systemAckPart));
        contents.add(systemAckMessage);

        for (Map<String, String> msg : historial) {
            Map<String, Object> part = new HashMap<>();
            part.put("text", msg.get("text"));
            Map<String, Object> message = new HashMap<>();
            message.put("role", msg.get("role").equals("user") ? "user" : "model");
            message.put("parts", java.util.List.of(part));
            contents.add(message);
        }

        Map<String, Object> currentPart = new HashMap<>();
        currentPart.put("text", mensajeUsuario);
        Map<String, Object> currentMessage = new HashMap<>();
        currentMessage.put("role", "user");
        currentMessage.put("parts", java.util.List.of(currentPart));
        contents.add(currentMessage);

        requestBody.put("contents", contents);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            Map<String, Object> body = response.getBody();
            if (body != null && body.containsKey("candidates")) {
                java.util.List<Map<String, Object>> candidates = (java.util.List<Map<String, Object>>) body.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    java.util.List<Map<String, Object>> parts = (java.util.List<Map<String, Object>>) content.get("parts");
                    return (String) parts.get(0).get("text");
                }
            }
            return "Lo siento, no pude procesar tu mensaje.";
        } catch (Exception e) {
            System.err.println("Error al llamar a Gemini: " + e.getMessage());
            return "Lo siento, hubo un problema al comunicarme. Por favor intenta más tarde.";
        }
    }
}
