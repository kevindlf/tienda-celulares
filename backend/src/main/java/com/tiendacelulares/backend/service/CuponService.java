package com.tiendacelulares.backend.service;

import com.tiendacelulares.backend.model.Cupon;
import com.tiendacelulares.backend.repository.CuponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CuponService {

    private final CuponRepository cuponRepository;

    public Map<String, Object> validar(String codigo, BigDecimal total) {
        String codigoNorm = codigo.toUpperCase().trim();
        Cupon cupon = cuponRepository.findByCodigo(codigoNorm)
                .orElseThrow(() -> new IllegalArgumentException("Cupón no válido"));

        if (!cupon.getActivo())
            throw new IllegalArgumentException("El cupón está inactivo");

        if (cupon.getFechaVencimiento() != null && cupon.getFechaVencimiento().isBefore(LocalDateTime.now()))
            throw new IllegalArgumentException("El cupón está vencido");

        if (cupon.getUsosMaximos() != null && cupon.getUsosActuales() >= cupon.getUsosMaximos())
            throw new IllegalArgumentException("El cupón alcanzó el límite de usos");

        BigDecimal descuento = calcularDescuento(cupon, total);
        BigDecimal totalFinal = total.subtract(descuento).max(BigDecimal.ZERO);

        return Map.of(
                "codigo", cupon.getCodigo(),
                "tipo", cupon.getTipo().name(),
                "valor", cupon.getValor(),
                "descuento", descuento.setScale(2, RoundingMode.HALF_UP),
                "totalFinal", totalFinal.setScale(2, RoundingMode.HALF_UP)
        );
    }

    @Transactional
    public void aplicar(String codigo) {
        cuponRepository.findByCodigo(codigo.toUpperCase().trim()).ifPresent(c -> {
            c.setUsosActuales(c.getUsosActuales() + 1);
            if (c.getUsosMaximos() != null && c.getUsosActuales() >= c.getUsosMaximos()) {
                c.setActivo(false);
            }
            cuponRepository.save(c);
        });
    }

    public Cupon crear(Cupon cupon) {
        if (cuponRepository.findByCodigo(cupon.getCodigo().toUpperCase().trim()).isPresent())
            throw new IllegalArgumentException("Ya existe un cupón con ese código");
        return cuponRepository.save(cupon);
    }

    public List<Cupon> listar() {
        return cuponRepository.findAll();
    }

    @Transactional
    public void desactivar(Long id) {
        Cupon cupon = cuponRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cupón no encontrado"));
        cupon.setActivo(false);
        cuponRepository.save(cupon);
    }

    private BigDecimal calcularDescuento(Cupon cupon, BigDecimal total) {
        if (cupon.getTipo() == Cupon.TipoDescuento.PORCENTAJE) {
            return total.multiply(cupon.getValor()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        }
        return cupon.getValor().min(total);
    }
}
