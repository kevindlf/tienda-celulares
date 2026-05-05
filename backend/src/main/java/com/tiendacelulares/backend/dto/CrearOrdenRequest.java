package com.tiendacelulares.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CrearOrdenRequest {

    @NotBlank(message = "La dirección de envío es obligatoria")
    private String direccionEnvio;

    @NotBlank(message = "La ciudad es obligatoria")
    private String ciudadEnvio;

    @NotBlank(message = "La provincia es obligatoria")
    private String provinciaEnvio;

    @NotBlank(message = "El teléfono de contacto es obligatorio")
    private String telefonoContacto;

    @NotEmpty(message = "Debe incluir al menos un producto")
    @Valid
    private List<ItemRequest> items;

    private String codigoCupon;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItemRequest {
        @NotNull(message = "El ID del producto es obligatorio")
        private Long productoId;

        @NotNull(message = "La cantidad es obligatoria")
        @Min(value = 1, message = "La cantidad mínima es 1")
        private Integer cantidad;
    }
}
