package com.tiendacelulares.backend.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductoDTO {
    private Long id;
    private String nombre;
    private String marca;
    private String modelo;
    private String descripcion;
    private BigDecimal precio;
    private Integer stock;
    private Integer almacenamiento;
    private Integer ram;
    private String color;
    private List<String> imagenes;
    private Boolean activo;
}