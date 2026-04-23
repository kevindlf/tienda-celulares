package com.tiendacelulares.backend.service;

import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.resources.payment.Payment;
import com.mercadopago.resources.preference.Preference;
import com.mercadopago.MercadoPagoConfig;
import com.tiendacelulares.backend.model.EstadoOrden;
import com.tiendacelulares.backend.model.Orden;
import com.tiendacelulares.backend.model.OrdenItem;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MercadoPagoService {

    @Value("${mercadopago.access-token}")
    private String accessToken;

    @Value("${mercadopago.public-key}")
    private String publicKey;

    @Value("${app.cors.allowed-origins}")
    private String frontendUrl;

    private final OrdenService ordenService;

    @PostConstruct
    public void init() {
        MercadoPagoConfig.setAccessToken(accessToken);
    }

    public String crearPreferencia(Orden orden) throws Exception {

        List<PreferenceItemRequest> items = new ArrayList<>();

        for (OrdenItem item : orden.getItems()) {
            PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                    .id(item.getProducto().getId().toString())
                    .title(item.getProducto().getNombre())
                    .description(item.getProducto().getMarca() + " " + item.getProducto().getModelo())
                    .quantity(item.getCantidad())
                    .unitPrice(item.getPrecioUnitario())
                    .currencyId("ARS")
                    .build();
            items.add(itemRequest);
        }

        // Usamos la primera URL configurada como base del frontend
        String baseUrl = frontendUrl.split(",")[0].trim();

        PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                .success(baseUrl + "/compra/exitosa")
                .failure(baseUrl + "/compra/fallida")
                .pending(baseUrl + "/compra/pendiente")
                .build();

        PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                .items(items)
                .backUrls(backUrls)
                .autoReturn("approved")
                .externalReference(orden.getId().toString())
                .build();
        try {
            PreferenceClient client = new PreferenceClient();
            Preference preference = client.create(preferenceRequest);
            return preference.getId();
        } catch (com.mercadopago.exceptions.MPApiException e) {
            log.error("Error MP - Status: {}, Response: {}", e.getStatusCode(), e.getApiResponse().getContent());
            throw new Exception("Error MP: " + e.getApiResponse().getContent());
        } catch (Exception e) {
            log.error("Error general al crear preferencia", e);
            throw new Exception("Error general: " + e.getMessage());
        }
    }

    /**
     * Procesa una notificación de pago recibida desde el webhook de MercadoPago.
     * Consulta el estado del pago y actualiza la orden correspondiente.
     */
    public void procesarNotificacionPago(String paymentId) {
        try {
            PaymentClient paymentClient = new PaymentClient();
            Payment payment = paymentClient.get(Long.parseLong(paymentId));

            String externalRef = payment.getExternalReference();
            String status = payment.getStatus();

            if (externalRef == null || externalRef.isBlank()) {
                log.warn("Pago {} sin external_reference", paymentId);
                return;
            }

            Long ordenId = Long.parseLong(externalRef);

            switch (status) {
                case "approved":
                    ordenService.actualizarEstado(ordenId, EstadoOrden.PAGADO);
                    log.info("Orden {} marcada como PAGADA (pago {})", ordenId, paymentId);
                    break;
                case "rejected":
                    ordenService.actualizarEstado(ordenId, EstadoOrden.CANCELADO);
                    log.info("Orden {} marcada como CANCELADA (pago {} rechazado)", ordenId, paymentId);
                    break;
                case "pending", "in_process":
                    log.info("Pago {} pendiente para orden {}", paymentId, ordenId);
                    break;
                default:
                    log.info("Estado de pago desconocido: {} para orden {}", status, ordenId);
            }
        } catch (Exception e) {
            log.error("Error al procesar notificación de pago {}", paymentId, e);
        }
    }
}