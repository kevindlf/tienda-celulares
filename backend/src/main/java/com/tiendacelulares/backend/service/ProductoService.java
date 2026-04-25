package com.tiendacelulares.backend.service;

import com.tiendacelulares.backend.dto.CrearProductoRequest;
import com.tiendacelulares.backend.model.CondicionProducto;
import com.tiendacelulares.backend.model.Producto;
import com.tiendacelulares.backend.model.TipoProducto;
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

    public Producto crear(CrearProductoRequest request) {
        Producto producto = Producto.builder()
                .nombre(request.getNombre())
                .marca(request.getMarca())
                .modelo(request.getModelo())
                .descripcion(request.getDescripcion())
                .precio(request.getPrecio())
                .stock(request.getStock())
                .almacenamiento(request.getAlmacenamiento())
                .ram(request.getRam())
                .color(request.getColor())
                .imagenes(request.getImagenes())
                .tipoProducto(parseTipo(request.getTipoProducto()))
                .condicion(parseCondicion(request.getCondicion()))
                .nivelBateria(request.getNivelBateria())
                .ciclosCarga(request.getCiclosCarga())
                .costoProducto(request.getCostoProducto())
                .categoria(request.getCategoria())
                .activo(true)
                .build();
        return productoRepository.save(producto);
    }

    public Producto actualizar(Long id, CrearProductoRequest request) {
        Producto existente = obtenerPorId(id);
        existente.setNombre(request.getNombre());
        existente.setMarca(request.getMarca());
        existente.setModelo(request.getModelo());
        existente.setDescripcion(request.getDescripcion());
        existente.setPrecio(request.getPrecio());
        existente.setStock(request.getStock());
        existente.setAlmacenamiento(request.getAlmacenamiento());
        existente.setRam(request.getRam());
        existente.setColor(request.getColor());
        existente.setImagenes(request.getImagenes());
        existente.setTipoProducto(parseTipo(request.getTipoProducto()));
        existente.setCondicion(parseCondicion(request.getCondicion()));
        existente.setNivelBateria(request.getNivelBateria());
        existente.setCiclosCarga(request.getCiclosCarga());
        existente.setCostoProducto(request.getCostoProducto());
        existente.setCategoria(request.getCategoria());
        return productoRepository.save(existente);
    }

    // Borrado lógico — no borra de la BD, solo lo desactiva
    public void eliminar(Long id) {
        Producto producto = obtenerPorId(id);
        producto.setActivo(false);
        productoRepository.save(producto);
    }

    private TipoProducto parseTipo(String tipo) {
        if (tipo == null || tipo.isBlank()) return TipoProducto.CELULAR;
        try { return TipoProducto.valueOf(tipo.toUpperCase()); }
        catch (IllegalArgumentException e) { return TipoProducto.CELULAR; }
    }

    private CondicionProducto parseCondicion(String condicion) {
        if (condicion == null || condicion.isBlank()) return CondicionProducto.NUEVO;
        try { return CondicionProducto.valueOf(condicion.toUpperCase()); }
        catch (IllegalArgumentException e) { return CondicionProducto.NUEVO; }
    }
}