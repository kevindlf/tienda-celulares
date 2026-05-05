package com.tiendacelulares.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cupones")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String codigo;

    public enum TipoDescuento { PORCENTAJE, MONTO_FIJO }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoDescuento tipo;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;

    private Integer usosMaximos;

    @Column(nullable = false)
    @Builder.Default
    private Integer usosActuales = 0;

    private LocalDateTime fechaVencimiento;

    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        if (codigo != null) codigo = codigo.toUpperCase().trim();
    }
}
