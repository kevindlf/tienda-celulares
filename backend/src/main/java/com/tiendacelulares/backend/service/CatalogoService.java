package com.tiendacelulares.backend.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class CatalogoService {

    // Marcas y sus modelos con colores disponibles
    private static final Map<String, Map<String, List<String>>> CATALOGO = new LinkedHashMap<>();

    static {
        // Apple
        Map<String, List<String>> apple = new LinkedHashMap<>();
        apple.put("iPhone 16 Pro Max", List.of("Titanio natural", "Titanio negro", "Titanio blanco", "Titanio desierto"));
        apple.put("iPhone 16 Pro", List.of("Titanio natural", "Titanio negro", "Titanio blanco", "Titanio desierto"));
        apple.put("iPhone 16 Plus", List.of("Negro", "Blanco", "Rosa", "Celeste", "Verde"));
        apple.put("iPhone 16", List.of("Negro", "Blanco", "Rosa", "Celeste", "Verde"));
        apple.put("iPhone 15 Pro Max", List.of("Titanio natural", "Titanio azul", "Titanio blanco", "Titanio negro"));
        apple.put("iPhone 15 Pro", List.of("Titanio natural", "Titanio azul", "Titanio blanco", "Titanio negro"));
        apple.put("iPhone 15 Plus", List.of("Negro", "Azul", "Verde", "Amarillo", "Rosa"));
        apple.put("iPhone 15", List.of("Negro", "Azul", "Verde", "Amarillo", "Rosa"));
        apple.put("iPhone 14 Pro Max", List.of("Negro espacial", "Plata", "Oro", "Morado oscuro"));
        apple.put("iPhone 14 Pro", List.of("Negro espacial", "Plata", "Oro", "Morado oscuro"));
        apple.put("iPhone 14 Plus", List.of("Medianoche", "Blanco estelar", "Azul", "Morado", "Rojo"));
        apple.put("iPhone 14", List.of("Medianoche", "Blanco estelar", "Azul", "Morado", "Rojo"));
        apple.put("iPhone 13 Pro Max", List.of("Grafito", "Oro", "Plata", "Azul sierra"));
        apple.put("iPhone 13 Pro", List.of("Grafito", "Oro", "Plata", "Azul sierra"));
        apple.put("iPhone 13", List.of("Medianoche", "Blanco estelar", "Azul", "Rosa", "Rojo", "Verde"));
        apple.put("iPhone 12", List.of("Negro", "Blanco", "Azul", "Verde", "Rojo", "Morado"));
        apple.put("iPhone SE (3ra gen)", List.of("Medianoche", "Blanco estelar", "Rojo"));
        CATALOGO.put("Apple", apple);

        // Samsung
        Map<String, List<String>> samsung = new LinkedHashMap<>();
        samsung.put("Galaxy S25 Ultra", List.of("Titanio negro", "Titanio gris", "Titanio plateado", "Titanio azul"));
        samsung.put("Galaxy S25+", List.of("Azul marino", "Plateado", "Mint", "Azul hielo"));
        samsung.put("Galaxy S25", List.of("Azul marino", "Plateado", "Mint", "Azul hielo"));
        samsung.put("Galaxy S24 Ultra", List.of("Titanio gris", "Titanio negro", "Titanio violeta", "Titanio amarillo"));
        samsung.put("Galaxy S24+", List.of("Negro", "Gris", "Violeta", "Amarillo", "Azul", "Verde"));
        samsung.put("Galaxy S24", List.of("Negro", "Gris", "Violeta", "Amarillo", "Azul", "Verde"));
        samsung.put("Galaxy S23 Ultra", List.of("Negro fantasma", "Crema", "Verde", "Lavanda"));
        samsung.put("Galaxy S23+", List.of("Negro fantasma", "Crema", "Verde", "Lavanda"));
        samsung.put("Galaxy S23", List.of("Negro fantasma", "Crema", "Verde", "Lavanda"));
        samsung.put("Galaxy A55", List.of("Azul", "Lila", "Azul marino", "Celeste"));
        samsung.put("Galaxy A35", List.of("Azul oscuro", "Lila", "Amarillo", "Azul hielo"));
        samsung.put("Galaxy A25", List.of("Azul", "Azul claro", "Amarillo", "Negro"));
        samsung.put("Galaxy A15", List.of("Azul", "Azul claro", "Amarillo", "Negro"));
        samsung.put("Galaxy Z Fold 6", List.of("Azul marino", "Rosa", "Plateado"));
        samsung.put("Galaxy Z Flip 6", List.of("Azul", "Menta", "Amarillo", "Plateado"));
        CATALOGO.put("Samsung", samsung);

        // Motorola
        Map<String, List<String>> motorola = new LinkedHashMap<>();
        motorola.put("Edge 50 Ultra", List.of("Negro", "Madera"));
        motorola.put("Edge 50 Pro", List.of("Negro", "Lux", "Vanilla"));
        motorola.put("Edge 50 Fusion", List.of("Azul", "Negro"));
        motorola.put("Edge 40 Pro", List.of("Negro", "Azul lunar"));
        motorola.put("Moto G85", List.of("Azul", "Gris"));
        motorola.put("Moto G75", List.of("Gris", "Azul"));
        motorola.put("Moto G55", List.of("Verde", "Gris"));
        motorola.put("Moto G35", List.of("Verde", "Lila", "Negro"));
        motorola.put("Moto G24", List.of("Azul", "Gris", "Negro"));
        motorola.put("Moto G04", List.of("Negro", "Azul"));
        CATALOGO.put("Motorola", motorola);

        // Xiaomi
        Map<String, List<String>> xiaomi = new LinkedHashMap<>();
        xiaomi.put("14 Ultra", List.of("Negro", "Blanco"));
        xiaomi.put("14 Pro", List.of("Negro", "Blanco", "Verde"));
        xiaomi.put("14", List.of("Negro", "Blanco", "Verde"));
        xiaomi.put("Redmi Note 13 Pro+", List.of("Negro", "Morado", "Blanco"));
        xiaomi.put("Redmi Note 13 Pro", List.of("Negro", "Morado", "Azul", "Verde"));
        xiaomi.put("Redmi Note 13", List.of("Negro", "Azul", "Verde"));
        xiaomi.put("Redmi 13C", List.of("Negro", "Verde", "Azul"));
        xiaomi.put("POCO X6 Pro", List.of("Negro", "Gris", "Amarillo"));
        xiaomi.put("POCO X6", List.of("Negro", "Azul"));
        xiaomi.put("POCO M6 Pro", List.of("Negro", "Morado"));
        CATALOGO.put("Xiaomi", xiaomi);

        // Realme
        Map<String, List<String>> realme = new LinkedHashMap<>();
        realme.put("GT 5 Pro", List.of("Azul", "Negro"));
        realme.put("12 Pro+", List.of("Azul", "Beige"));
        realme.put("12 Pro", List.of("Azul", "Beige"));
        realme.put("C55", List.of("Negro", "Verde"));
        CATALOGO.put("Realme", realme);

        // Honor
        Map<String, List<String>> honor = new LinkedHashMap<>();
        honor.put("Magic 6 Pro", List.of("Negro", "Verde", "Morado"));
        honor.put("200 Lite", List.of("Azul", "Negro"));
        honor.put("X8b", List.of("Azul", "Negro"));
        CATALOGO.put("Honor", honor);

        // Google
        Map<String, List<String>> google = new LinkedHashMap<>();
        google.put("Pixel 9 Pro XL", List.of("Obsidiana", "Porcelana", "Rosa", "Verde"));
        google.put("Pixel 9 Pro", List.of("Obsidiana", "Porcelana", "Rosa", "Verde"));
        google.put("Pixel 9", List.of("Obsidiana", "Porcelana", "Rosa", "Verde"));
        google.put("Pixel 8a", List.of("Obsidiana", "Porcelana", "Bahía", "Aloe"));
        CATALOGO.put("Google", google);

        // Nothing
        Map<String, List<String>> nothing = new LinkedHashMap<>();
        nothing.put("Phone (2a) Plus", List.of("Gris", "Negro"));
        nothing.put("Phone (2a)", List.of("Negro", "Blanco", "Azul"));
        nothing.put("Phone (2)", List.of("Blanco", "Gris oscuro"));
        CATALOGO.put("Nothing", nothing);

        // TCL
        Map<String, List<String>> tcl = new LinkedHashMap<>();
        tcl.put("50 SE", List.of("Gris", "Azul"));
        tcl.put("40 NxtPaper", List.of("Blanco"));
        CATALOGO.put("TCL", tcl);
    }

    // RAM disponibles en el mercado actual
    private static final List<Integer> OPCIONES_RAM = List.of(2, 3, 4, 6, 8, 12, 16);

    // Almacenamiento disponible
    private static final List<Integer> OPCIONES_ALMACENAMIENTO = List.of(32, 64, 128, 256, 512, 1024);

    // Categorías de accesorios
    private static final List<String> CATEGORIAS_ACCESORIO = List.of(
            "Funda / Case",
            "Mica de vidrio templado",
            "Cargador",
            "Cable USB",
            "Auriculares / Earbuds",
            "Auriculares Bluetooth",
            "Power Bank",
            "Soporte vehicular",
            "Smartwatch",
            "Parlante Bluetooth",
            "Memoria microSD",
            "Adaptador OTG",
            "Stylus / Lápiz",
            "Otro"
    );

    public List<String> obtenerMarcas() {
        return new ArrayList<>(CATALOGO.keySet());
    }

    public List<String> obtenerModelos(String marca) {
        Map<String, List<String>> modelos = CATALOGO.get(marca);
        if (modelos == null) return List.of();
        return new ArrayList<>(modelos.keySet());
    }

    public List<String> obtenerColores(String marca, String modelo) {
        Map<String, List<String>> modelos = CATALOGO.get(marca);
        if (modelos == null) return List.of();
        List<String> colores = modelos.get(modelo);
        return colores != null ? colores : List.of();
    }

    public List<Integer> obtenerOpcionesRam() {
        return OPCIONES_RAM;
    }

    public List<Integer> obtenerOpcionesAlmacenamiento() {
        return OPCIONES_ALMACENAMIENTO;
    }

    public List<String> obtenerCategoriasAccesorio() {
        return CATEGORIAS_ACCESORIO;
    }
}
