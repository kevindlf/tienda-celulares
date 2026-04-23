package com.tiendacelulares.backend.service;

import com.tiendacelulares.backend.model.*;
import com.tiendacelulares.backend.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrdenService {

    private final OrdenRepository ordenRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;

    @Transactional
    public Orden crearOrden(String emailUsuario, Orden ordenRequest) {

        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

        // Primero creamos la orden SIN items
        Orden orden = Orden.builder()
                .usuario(usuario)
                .estado(EstadoOrden.PENDIENTE)
                .total(BigDecimal.ZERO)
                .items(new ArrayList<>())
                .direccionEnvio(ordenRequest.getDireccionEnvio())
                .ciudadEnvio(ordenRequest.getCiudadEnvio())
                .provinciaEnvio(ordenRequest.getProvinciaEnvio())
                .telefonoContacto(ordenRequest.getTelefonoContacto())
                .build();

        // Guardamos la orden para obtener el ID
        Orden ordenGuardada = ordenRepository.save(orden);

        // Procesamos los items con la orden ya guardada
        List<OrdenItem> items = ordenRequest.getItems().stream().map(item -> {
            Producto producto = productoRepository.findById(item.getProducto().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado"));

            if (producto.getStock() < item.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para: " + producto.getNombre());
            }

            producto.setStock(producto.getStock() - item.getCantidad());
            productoRepository.save(producto);

            BigDecimal subtotal = producto.getPrecio()
                    .multiply(BigDecimal.valueOf(item.getCantidad()));

            return OrdenItem.builder()
                    .orden(ordenGuardada)
                    .producto(producto)
                    .cantidad(item.getCantidad())
                    .precioUnitario(producto.getPrecio())
                    .subtotal(subtotal)
                    .build();
        }).collect(Collectors.toList());

        BigDecimal total = items.stream()
                .map(OrdenItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        ordenGuardada.getItems().addAll(items);
        ordenGuardada.setTotal(total);

        return ordenRepository.save(ordenGuardada);
    }

    public List<Orden> obtenerTodasLasOrdenes() {
        return ordenRepository.findAllByOrderByFechaCreacionDesc();
    }

    public List<Orden> obtenerOrdenesDelUsuario(String emailUsuario) {
        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
        return ordenRepository.findByUsuario(usuario);
    }

    public Orden obtenerOrdenPorId(Long id) {
        return ordenRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Orden no encontrada"));
    }

    public Orden actualizarEstado(Long id, EstadoOrden nuevoEstado) {
        Orden orden = obtenerOrdenPorId(id);
        orden.setEstado(nuevoEstado);
        return ordenRepository.save(orden);
    }
    public Orden guardarPreferenceId(Long id, String preferenceId) {
        Orden orden = obtenerOrdenPorId(id);
        orden.setMpPreferenceId(preferenceId);
        return ordenRepository.save(orden);
    }
}