package com.tiendacelulares.backend.repository;

import com.tiendacelulares.backend.model.ConfiguracionTienda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConfiguracionTiendaRepository extends JpaRepository<ConfiguracionTienda, Long> {
}
