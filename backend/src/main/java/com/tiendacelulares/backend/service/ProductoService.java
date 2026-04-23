package com.tiendacelulares.backend.service;

import com.tiendacelulares.backend.model.Producto;
import com.tiendacelulares.backend.repository.ProductoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;

    public List<Producto> obtenerTodos() {
        return productoRepository.findByActivoTrue();
    }

    public Producto obtenerPorId(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con id: " + id));
    }

    public Producto crear(Producto producto) {
        producto.setActivo(true);  // agregá esta línea
        return productoRepository.save(producto);
    }

    public Producto actualizar(Long id, Producto productoActualizado) {
        Producto existente = obtenerPorId(id);
        existente.setNombre(productoActualizado.getNombre());
        existente.setMarca(productoActualizado.getMarca());
        existente.setModelo(productoActualizado.getModelo());
        existente.setDescripcion(productoActualizado.getDescripcion());
        existente.setPrecio(productoActualizado.getPrecio());
        existente.setStock(productoActualizado.getStock());
        existente.setAlmacenamiento(productoActualizado.getAlmacenamiento());
        existente.setRam(productoActualizado.getRam());
        existente.setColor(productoActualizado.getColor());
        existente.setImagenes(productoActualizado.getImagenes());
        return productoRepository.save(existente);
    }

    // Borrado lógico — no borra de la BD, solo lo desactiva
    public void eliminar(Long id) {
        Producto producto = obtenerPorId(id);
        producto.setActivo(false);
        productoRepository.save(producto);
    }
}