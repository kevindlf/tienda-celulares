package com.tiendacelulares.backend.controller;

import com.tiendacelulares.backend.model.EstadoOrden;
import com.tiendacelulares.backend.model.Orden;
import com.tiendacelulares.backend.model.Usuario;
import com.tiendacelulares.backend.repository.OrdenRepository;
import com.tiendacelulares.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UsuarioRepository usuarioRepository;
    private final OrdenRepository ordenRepository;

    @GetMapping("/clientes")
    public ResponseEntity<List<Map<String, Object>>> getClientes() {
        List<Usuario> clientes = usuarioRepository.findByRol(Usuario.Rol.CLIENTE);
        List<Orden> todasOrdenes = ordenRepository.findAll();

        List<Map<String, Object>> resultado = clientes.stream().map(cliente -> {
            List<Orden> ordenesCliente = todasOrdenes.stream()
                    .filter(o -> o.getUsuario() != null && o.getUsuario().getId().equals(cliente.getId()))
                    .toList();

            BigDecimal totalGastado = ordenesCliente.stream()
                    .filter(o -> o.getEstado() == EstadoOrden.PAGADO || o.getEstado() == EstadoOrden.ENTREGADO)
                    .map(Orden::getTotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            Map<String, Object> entry = new HashMap<>();
            entry.put("id", cliente.getId());
            entry.put("nombre", cliente.getNombre());
            entry.put("email", cliente.getEmail());
            entry.put("fechaCreacion", cliente.getFechaCreacion());
            entry.put("totalOrdenes", ordenesCliente.size());
            entry.put("totalGastado", totalGastado);
            return entry;
        }).toList();

        return ResponseEntity.ok(resultado);
    }
}
