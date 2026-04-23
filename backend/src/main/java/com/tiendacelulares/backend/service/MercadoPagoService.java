package com.tiendacelulares.backend.service;

import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.resources.preference.Preference;
import com.mercadopago.MercadoPagoConfig;
import com.tiendacelulares.backend.model.Orden;
import com.tiendacelulares.backend.model.OrdenItem;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MercadoPagoService {

    @Value("${mercadopago.access-token}")
    private String accessToken;

    @Value("${mercadopago.public-key}")
    private String publicKey;

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

        PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                .success("http://localhost:3000/compra/exitosa")
                .failure("http://localhost:3000/compra/fallida")
                .pending("http://localhost:3000/compra/pendiente")
                .build();

        PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                .items(items)
                .backUrls(backUrls)
                .externalReference(orden.getId().toString())
                .build();
        try {
            PreferenceClient client = new PreferenceClient();
            Preference preference = client.create(preferenceRequest);
            return preference.getId();
        } catch (com.mercadopago.exceptions.MPApiException e) {
            System.out.println("STATUS: " + e.getStatusCode());
            System.out.println("RESPUESTA MP: " + e.getApiResponse().getContent());
            throw new Exception("Error MP: " + e.getApiResponse().getContent());
        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception("Error general: " + e.getMessage());
        }
    }
}