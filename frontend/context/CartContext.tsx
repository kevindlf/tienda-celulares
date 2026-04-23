"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Producto } from "@/types";

interface ItemCarrito extends Producto {
    cantidad: number;
}

interface CartContextType {
    items: ItemCarrito[];
    cantidadTotal: number;
    total: number;
    agregar: (producto: Producto) => void;
    eliminar: (id: number) => void;
    cambiarCantidad: (id: number, cantidad: number) => void;
    vaciar: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<ItemCarrito[]>([]);

    useEffect(() => {
        const carrito = localStorage.getItem("carrito");
        if (carrito) {
            try {
                setItems(JSON.parse(carrito));
            } catch {
                localStorage.removeItem("carrito");
            }
        }
    }, []);

    const guardarEnStorage = useCallback((newItems: ItemCarrito[]) => {
        localStorage.setItem("carrito", JSON.stringify(newItems));
    }, []);

    const agregar = (producto: Producto) => {
        setItems(prev => {
            const existente = prev.find(item => item.id === producto.id);
            let nuevo;
            if (existente) {
                if (existente.cantidad >= producto.stock) {
                    return prev; // No agregar más que el stock disponible
                }
                nuevo = prev.map(item =>
                    item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
                );
            } else {
                nuevo = [...prev, { ...producto, cantidad: 1 }];
            }
            guardarEnStorage(nuevo);
            return nuevo;
        });
    };

    const eliminar = (id: number) => {
        setItems(prev => {
            const nuevo = prev.filter(item => item.id !== id);
            guardarEnStorage(nuevo);
            return nuevo;
        });
    };

    const cambiarCantidad = (id: number, cantidad: number) => {
        if (cantidad < 1) return;
        setItems(prev => {
            const nuevo = prev.map(item =>
                item.id === id ? { ...item, cantidad } : item
            );
            guardarEnStorage(nuevo);
            return nuevo;
        });
    };

    const vaciar = () => {
        setItems([]);
        localStorage.removeItem("carrito");
    };

    const cantidadTotal = items.reduce((acc, item) => acc + item.cantidad, 0);
    const total = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    return (
        <CartContext.Provider
            value={{ items, cantidadTotal, total, agregar, eliminar, cambiarCantidad, vaciar }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart debe usarse dentro de un CartProvider");
    }
    return context;
}
