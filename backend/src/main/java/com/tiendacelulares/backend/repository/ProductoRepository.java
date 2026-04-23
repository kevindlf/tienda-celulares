package com.tiendacelulares.backend.repository;

import com.tiendacelulares.backend.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    List<Producto> findByActivoTrue();
    List<Producto> findByMarcaIgnoreCase(String marca);
    List<Producto> findByNombreContainingIgnoreCase(String nombre);
}