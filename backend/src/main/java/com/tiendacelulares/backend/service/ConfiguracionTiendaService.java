package com.tiendacelulares.backend.service;

import com.tiendacelulares.backend.model.ConfiguracionTienda;
import com.tiendacelulares.backend.repository.ConfiguracionTiendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ConfiguracionTiendaService {

    @Autowired
    private ConfiguracionTiendaRepository repository;

    public ConfiguracionTienda obtenerConfiguracion() {
        List<ConfiguracionTienda> configuraciones = repository.findAll();
        if (configuraciones.isEmpty()) {
            // Si no existe, crear la configuración por defecto
            ConfiguracionTienda defaultConfig = ConfiguracionTienda.builder()
                    .nombreTienda("Tienda Celulares")
                    .telefonoWhatsApp("5492634383534")
                    .direccionFisica("Av. Principal 123, Mendoza")
                    .linkInstagram("https://instagram.com")
                    .montoEnvioGratis(BigDecimal.valueOf(100000))
                    .mensajeCabecera("¡Aprovechá 3 cuotas sin interés en todos los celulares!")
                    .build();
            return repository.save(defaultConfig);
        }
        return configuraciones.get(0);
    }

    public ConfiguracionTienda actualizarConfiguracion(ConfiguracionTienda nuevaConfig) {
        ConfiguracionTienda configActual = obtenerConfiguracion();
        
        configActual.setNombreTienda(nuevaConfig.getNombreTienda());
        configActual.setTelefonoWhatsApp(nuevaConfig.getTelefonoWhatsApp());
        configActual.setDireccionFisica(nuevaConfig.getDireccionFisica());
        configActual.setLinkInstagram(nuevaConfig.getLinkInstagram());
        configActual.setMontoEnvioGratis(nuevaConfig.getMontoEnvioGratis());
        configActual.setMensajeCabecera(nuevaConfig.getMensajeCabecera());
        
        return repository.save(configActual);
    }
}
