package com.tiendacelulares.backend.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrdenDTO {
    private Long id;
    private UsuarioDTO usuario;
    private List<OrdenItemDTO> items;
    private String estado;
    private BigDecimal total;
    private String direccionEnvio;
    private String ciudadEnvio;
    private String provinciaEnvio;
    private String telefonoContacto;
    private LocalDateTime fechaCreacion;
}