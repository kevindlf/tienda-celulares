package com.tiendacelulares.backend.service;

import com.tiendacelulares.backend.controller.VentaFisicaController.VentaFisicaRequest;
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
public class VentaFisicaService {

    private final OrdenRepository ordenRepository;
    private final ProductoRepository productoRepository;

    @Transactional
    public Orden registrarVenta(VentaFisicaRequest request) {

        // Crear orden como venta física — estado ENTREGADO directamente
        Orden orden = Orden.builder()
                .estado(EstadoOrden.ENTREGADO)
                .total(BigDecimal.ZERO)
                .items(new ArrayList<>())
                .direccionEnvio("Venta en tienda física")
                .ciudadEnvio("-")
                .provinciaEnvio("-")
                .telefonoContacto("-")
                .build();

        Orden ordenGuardada = ordenRepository.save(orden);

        List<OrdenItem> items = request.getItems().stream().map(itemReq -> {
            Producto producto = productoRepository.findById(itemReq.getProductoId())
                    .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con id: " + itemReq.getProductoId()));

            if (producto.getStock() < itemReq.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para: " + producto.getNombre()
                        + " (disponible: " + producto.getStock() + ", pedido: " + itemReq.getCantidad() + ")");
            }

            producto.setStock(producto.getStock() - itemReq.getCantidad());
            productoRepository.save(producto);

            BigDecimal subtotal = producto.getPrecio()
                    .multiply(BigDecimal.valueOf(itemReq.getCantidad()));

            return OrdenItem.builder()
                    .orden(ordenGuardada)
                    .producto(producto)
                    .cantidad(itemReq.getCantidad())
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
}
