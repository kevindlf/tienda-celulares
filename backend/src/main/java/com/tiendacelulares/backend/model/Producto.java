package com.tiendacelulares.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "productos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Column(nullable = false)
    private String nombre;

    @NotBlank(message = "La marca es obligatoria")
    @Column(nullable = false)
    private String marca;

    @NotBlank(message = "El modelo es obligatorio")
    @Column(nullable = false)
    private String modelo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @NotNull
    @Min(0)
    @Column(nullable = false)
    private Integer stock;

    // Almacenamiento interno en GB (64, 128, 256, 512)
    private Integer almacenamiento;

    // RAM en GB
    private Integer ram;

    // Color del teléfono
    private String color;

    // Tipo de producto: CELULAR o ACCESORIO
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "varchar(255) default 'CELULAR'")
    @Builder.Default
    private TipoProducto tipoProducto = TipoProducto.CELULAR;

    // Condición: NUEVO o USADO
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "varchar(255) default 'NUEVO'")
    @Builder.Default
    private CondicionProducto condicion = CondicionProducto.NUEVO;

    // Solo para celulares usados
    private Integer nivelBateria; // Porcentaje de salud de batería (0-100)
    private Integer ciclosCarga;  // Cantidad de ciclos de carga

    // Costo de compra del producto (para calcular ganancia)
    @Column(precision = 10, scale = 2)
    private BigDecimal costoProducto;

    // Categoría para accesorios (Funda, Auricular, Cargador, etc.)
    private String categoria;

    // Lista de URLs de imágenes
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "producto_imagenes",
            joinColumns = @JoinColumn(name = "producto_id"))
    @Column(name = "url")
    private List<String> imagenes;

    @Column(nullable = false, columnDefinition = "boolean default true")
    @Builder.Default
    private Boolean activo = true;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        fechaActualizacion = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }
}