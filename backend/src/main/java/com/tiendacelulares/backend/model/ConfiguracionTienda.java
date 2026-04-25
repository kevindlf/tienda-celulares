package com.tiendacelulares.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "configuracion_tienda")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConfiguracionTienda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombreTienda;
    
    private String telefonoWhatsApp;
    
    private String direccionFisica;
    
    private String linkInstagram;
    
    private BigDecimal montoEnvioGratis;
    
    private String mensajeCabecera; // Ej: "¡Envío gratis a todo el país!"
    
    // Podemos agregar configuraciones extra si lo necesitamos
}
