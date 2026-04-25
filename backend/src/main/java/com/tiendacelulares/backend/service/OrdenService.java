package com.tiendacelulares.backend.service;

import com.tiendacelulares.backend.dto.CrearOrdenRequest;
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
    private final EmailService emailService;

    @Transactional
    public Orden crearOrden(String emailUsuario, CrearOrdenRequest request) {

        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

        // Primero creamos la orden SIN items
        Orden orden = Orden.builder()
                .usuario(usuario)
                .estado(EstadoOrden.PENDIENTE)
                .total(BigDecimal.ZERO)
                .items(new ArrayList<>())
                .direccionEnvio(request.getDireccionEnvio())
                .ciudadEnvio(request.getCiudadEnvio())
                .provinciaEnvio(request.getProvinciaEnvio())
                .telefonoContacto(request.getTelefonoContacto())
                .build();

        // Guardamos la orden para obtener el ID
        Orden ordenGuardada = ordenRepository.save(orden);

        // Procesamos los items con la orden ya guardada
        List<OrdenItem> items = request.getItems().stream().map(itemReq -> {
            Producto producto = productoRepository.findById(itemReq.getProductoId())
                    .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con id: " + itemReq.getProductoId()));

            if (producto.getStock() < itemReq.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para: " + producto.getNombre());
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

        Orden ordenFinal = ordenRepository.save(ordenGuardada);
        
        // Enviar email de confirmación (de forma asíncrona)
        try {
            emailService.enviarConfirmacionOrden(ordenFinal, usuario);
        } catch (Exception e) {
            System.err.println("Error al enviar email de confirmación: " + e.getMessage());
        }
        
        return ordenFinal;
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
        
        boolean cambioEstado = orden.getEstado() != nuevoEstado;
        orden.setEstado(nuevoEstado);
        Orden ordenActualizada = ordenRepository.save(orden);
        
        // Enviar email si cambió el estado y no es PENDIENTE o PAGADO (pues ya se envía al crearla/pagarla)
        if (cambioEstado && nuevoEstado != EstadoOrden.PENDIENTE) {
            try {
                emailService.enviarActualizacionEstado(ordenActualizada, ordenActualizada.getUsuario());
            } catch (Exception e) {
                System.err.println("Error al enviar email de actualización: " + e.getMessage());
            }
        }
        
        return ordenActualizada;
    }
    public Orden guardarPreferenceId(Long id, String preferenceId) {
        Orden orden = obtenerOrdenPorId(id);
        orden.setMpPreferenceId(preferenceId);
        return ordenRepository.save(orden);
    }
}