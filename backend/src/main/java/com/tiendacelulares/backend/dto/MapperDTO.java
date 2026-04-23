package com.tiendacelulares.backend.dto;

import com.tiendacelulares.backend.model.*;
import org.springframework.stereotype.Component;
import java.util.stream.Collectors;

@Component
public class MapperDTO {

    public ProductoDTO toProductoDTO(Producto producto) {
        return ProductoDTO.builder()
                .id(producto.getId())
                .nombre(producto.getNombre())
                .marca(producto.getMarca())
                .modelo(producto.getModelo())
                .descripcion(producto.getDescripcion())
                .precio(producto.getPrecio())
                .stock(producto.getStock())
                .almacenamiento(producto.getAlmacenamiento())
                .ram(producto.getRam())
                .color(producto.getColor())
                .imagenes(producto.getImagenes())
                .activo(producto.getActivo())
                .build();
    }

    public UsuarioDTO toUsuarioDTO(Usuario usuario) {
        return UsuarioDTO.builder()
                .id(usuario.getId())
                .nombre(usuario.getNombre())
                .email(usuario.getEmail())
                .telefono(usuario.getTelefono())
                .direccion(usuario.getDireccion())
                .ciudad(usuario.getCiudad())
                .provincia(usuario.getProvincia())
                .rol(usuario.getRol().name())
                .build();
    }

    public OrdenItemDTO toOrdenItemDTO(OrdenItem item) {
        return OrdenItemDTO.builder()
                .id(item.getId())
                .productoId(item.getProducto().getId())
                .productoNombre(item.getProducto().getNombre())
                .productoMarca(item.getProducto().getMarca())
                .cantidad(item.getCantidad())
                .precioUnitario(item.getPrecioUnitario())
                .subtotal(item.getSubtotal())
                .build();
    }

    public OrdenDTO toOrdenDTO(Orden orden) {
        return OrdenDTO.builder()
                .id(orden.getId())
                .usuario(toUsuarioDTO(orden.getUsuario()))
                .items(orden.getItems().stream()
                        .map(this::toOrdenItemDTO)
                        .collect(Collectors.toList()))
                .estado(orden.getEstado().name())
                .total(orden.getTotal())
                .direccionEnvio(orden.getDireccionEnvio())
                .ciudadEnvio(orden.getCiudadEnvio())
                .provinciaEnvio(orden.getProvinciaEnvio())
                .telefonoContacto(orden.getTelefonoContacto())
                .fechaCreacion(orden.getFechaCreacion())
                .build();
    }
}