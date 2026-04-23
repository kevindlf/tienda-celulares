package com.tiendacelulares.backend.controller;

import com.tiendacelulares.backend.dto.MapperDTO;
import com.tiendacelulares.backend.dto.OrdenDTO;
import com.tiendacelulares.backend.service.VentaFisicaService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ventas-fisicas")
@RequiredArgsConstructor
public class VentaFisicaController {

    private final VentaFisicaService ventaFisicaService;
    private final MapperDTO mapper;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VentaFisicaRequest {
        @NotEmpty(message = "Debe incluir al menos un producto")
        @Valid
        private List<ItemVenta> items;

        private String nombreCliente;
        private String observaciones;

        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class ItemVenta {
            @NotNull(message = "El ID del producto es obligatorio")
            private Long productoId;

            @NotNull(message = "La cantidad es obligatoria")
            @Min(value = 1, message = "La cantidad mínima es 1")
            private Integer cantidad;
        }
    }

    @PostMapping
    public ResponseEntity<OrdenDTO> registrarVenta(@Valid @RequestBody VentaFisicaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(mapper.toOrdenDTO(ventaFisicaService.registrarVenta(request)));
    }
}
