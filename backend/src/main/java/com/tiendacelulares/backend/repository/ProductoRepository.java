package com.tiendacelulares.backend.repository;

import com.tiendacelulares.backend.model.Producto;
import com.tiendacelulares.backend.model.TipoProducto;
import com.tiendacelulares.backend.model.CondicionProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long>, JpaSpecificationExecutor<Producto> {

    List<Producto> findByActivoTrue();
    List<Producto> findByMarcaIgnoreCase(String marca);
    List<Producto> findByNombreContainingIgnoreCase(String nombre);
    List<Producto> findByTipoProductoAndActivoTrue(TipoProducto tipoProducto);
    List<Producto> findByCondicionAndActivoTrue(CondicionProducto condicion);
}