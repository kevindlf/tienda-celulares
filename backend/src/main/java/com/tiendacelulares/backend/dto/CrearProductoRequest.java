package com.tiendacelulares.backend.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CrearProductoRequest {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "La marca es obligatoria")
    private String marca;

    @NotBlank(message = "El modelo es obligatorio")
    private String modelo;

    private String descripcion;

    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio debe ser mayor a 0")
    private BigDecimal precio;

    @NotNull(message = "El stock es obligatorio")
    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stock;

    private Integer almacenamiento;
    private Integer ram;
    private String color;
    private List<String> imagenes;

    // Nuevos campos
    private String tipoProducto;  // "CELULAR" o "ACCESORIO"
    private String condicion;     // "NUEVO" o "USADO"
    private Integer nivelBateria; // Solo para usados (0-100%)
    private Integer ciclosCarga;  // Solo para usados
    private BigDecimal costoProducto; // Costo de compra
    private String categoria;    // Solo para accesorios
}
