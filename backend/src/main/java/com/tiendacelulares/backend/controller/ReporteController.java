package com.tiendacelulares.backend.controller;

import com.tiendacelulares.backend.repository.OrdenRepository;
import com.tiendacelulares.backend.repository.ProductoRepository;
import com.tiendacelulares.backend.model.Producto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
public class ReporteController {

    private final OrdenRepository ordenRepository;
    private final ProductoRepository productoRepository;

    @GetMapping("/resumen")
    public ResponseEntity<Map<String, Object>> resumen() {
        var ordenes = ordenRepository.findAll();

        long totalOrdenes = ordenes.size();
        long ordenesPagadas = ordenes.stream()
                .filter(o -> !o.getEstado().name().equals("CANCELADO"))
                .count();
        BigDecimal ingresoTotal = ordenes.stream()
                .filter(o -> !o.getEstado().name().equals("CANCELADO"))
                .map(o -> o.getTotal())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        long productosActivos = productoRepository.findByActivoTrue().size();
        long productosStockBajo = productoRepository.findByActivoTrue().stream()
                .filter(p -> p.getStock() <= 5)
                .count();

        Map<String, Object> resumen = new LinkedHashMap<>();
        resumen.put("totalOrdenes", totalOrdenes);
        resumen.put("ordenesPagadas", ordenesPagadas);
        resumen.put("ingresoTotal", ingresoTotal);
        resumen.put("productosActivos", productosActivos);
        resumen.put("productosStockBajo", productosStockBajo);

        return ResponseEntity.ok(resumen);
    }

    @GetMapping("/stock-bajo")
    public ResponseEntity<List<Map<String, Object>>> stockBajo() {
        List<Map<String, Object>> resultado = productoRepository.findByActivoTrue().stream()
                .filter(p -> p.getStock() <= 5)
                .sorted(Comparator.comparingInt(Producto::getStock))
                .map(p -> {
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("id", p.getId());
                    item.put("nombre", p.getNombre());
                    item.put("marca", p.getMarca());
                    item.put("stock", p.getStock());
                    item.put("precio", p.getPrecio());
                    return item;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/ventas-por-estado")
    public ResponseEntity<Map<String, Long>> ventasPorEstado() {
        var ordenes = ordenRepository.findAll();
        Map<String, Long> resultado = ordenes.stream()
                .collect(Collectors.groupingBy(o -> o.getEstado().name(), Collectors.counting()));
        return ResponseEntity.ok(resultado);
    }
}
