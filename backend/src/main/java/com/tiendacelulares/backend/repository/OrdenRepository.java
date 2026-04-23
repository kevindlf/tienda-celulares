package com.tiendacelulares.backend.repository;

import com.tiendacelulares.backend.model.Orden;
import com.tiendacelulares.backend.model.EstadoOrden;
import com.tiendacelulares.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrdenRepository extends JpaRepository<Orden, Long> {
    List<Orden> findByUsuario(Usuario usuario);
    List<Orden> findByEstado(EstadoOrden estado);
    List<Orden> findAllByOrderByFechaCreacionDesc();
}