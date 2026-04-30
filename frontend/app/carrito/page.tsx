"use client";

import { useEffect, useState } from "react";
import { Trash2, ShoppingCart, ArrowLeft, Smartphone, Plus, Headphones, Minus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { productosApi } from "@/lib/api";
import { Producto } from "@/types";
import { useToast } from "@/context/ToastContext";
import Link from "next/link";

export default function CarritoPage() {
    const { items, total, eliminar, cambiarCantidad, agregar } = useCart();
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const { showToast } = useToast();
    const [sugeridos, setSugeridos] = useState<Producto[]>([]);

    useEffect(() => {
        if (items.length > 0) {
            productosApi.getAll().then(res => {
                const marcasEnCarrito = items.map(item => item.marca);
                const accesorios = res.data.filter((p: Producto) =>
                    p.activo &&
                    p.tipoProducto === "ACCESORIO" &&
                    !items.some(item => item.id === p.id) &&
                    (marcasEnCarrito.includes(p.marca) || p.marca === "Genérico")
                );
                setSugeridos(accesorios.sort(() => 0.5 - Math.random()).slice(0, 3));
            }).catch(err => console.error("Error cargando sugeridos:", err));
        } else {
            setSugeridos([]);
        }
    }, [items]);

    const irACheckout = () => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
        router.push("/checkout");
    };

    const agregarSugerido = (producto: Producto) => {
        agregar(producto);
        showToast(`${producto.nombre} agregado`, "success");
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16 overflow-x-hidden">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-card-bg border border-card-border flex items-center justify-center mx-auto mb-5 sm:mb-6">
                        <ShoppingCart className="text-foreground/30" size={40} />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-display font-black text-foreground mb-2">Tu carrito está vacío</h2>
                    <p className="text-foreground/50 text-sm sm:text-base mb-7 sm:mb-8">Agregá productos para empezar tu compra</p>
                    <Link
                        href="/productos"
                        className="inline-flex items-center gap-2 bg-primary text-white font-bold px-7 py-4 rounded-full hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30 transition-all min-h-[52px]"
                    >
                        Ver productos
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-6 sm:py-10 lg:py-12 px-4 sm:px-6 pb-32 lg:pb-12 overflow-x-hidden">
            <div className="max-w-6xl mx-auto">

                <Link href="/productos" className="inline-flex items-center gap-2 text-foreground/50 hover:text-primary mb-5 sm:mb-8 font-semibold text-sm transition-colors min-h-[40px]">
                    <ArrowLeft size={16} /> Seguir comprando
                </Link>

                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-foreground tracking-tight">Tu carrito</h1>
                    <span className="text-foreground/50 font-semibold bg-card-bg border border-card-border px-3 py-1 rounded-full text-xs sm:text-sm">
                        {items.length} {items.length === 1 ? "ítem" : "ítems"}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-8">

                    {/* Lista de items */}
                    <div className="lg:col-span-2 flex flex-col gap-3 sm:gap-4">
                        {items.map(item => (
                            <div key={item.id} className="bg-card-bg rounded-2xl border border-card-border p-4 sm:p-5 flex gap-3 sm:gap-5">

                                <div className="w-20 h-20 sm:w-28 sm:h-28 bg-background rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden relative border border-card-border">
                                    {item.tipoProducto === "ACCESORIO" && (
                                        <span className="absolute top-1.5 left-1.5 bg-primary text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md">ACC</span>
                                    )}
                                    {item.imagenes && item.imagenes.length > 0 ? (
                                        <img src={item.imagenes[0]} alt={item.nombre} className="w-16 h-16 sm:w-20 sm:h-20 object-contain mix-blend-multiply dark:mix-blend-normal" />
                                    ) : (
                                        item.tipoProducto === "CELULAR"
                                            ? <Smartphone className="text-card-border" size={32} />
                                            : <Headphones className="text-card-border" size={32} />
                                    )}
                                </div>

                                <div className="flex-1 flex flex-col justify-between min-w-0">
                                    <div>
                                        <p className="text-[9px] sm:text-[10px] font-black text-primary/60 uppercase tracking-[0.2em] mb-0.5 sm:mb-1">{item.marca}</p>
                                        <h3 className="font-bold text-foreground text-sm sm:text-base leading-tight mb-1 line-clamp-2">{item.nombre}</h3>
                                        <p className="text-[11px] sm:text-xs text-foreground/50 hidden sm:block">
                                            {item.tipoProducto === "CELULAR" ? (
                                                <>{item.ram && `${item.ram}GB RAM`}{item.almacenamiento && ` · ${item.almacenamiento}GB`}</>
                                            ) : (
                                                <>{item.categoria || "Accesorio"}</>
                                            )}
                                        </p>
                                    </div>

                                    <div className="flex items-end justify-between gap-2 mt-2 sm:mt-3">
                                        <p className="font-display font-black text-foreground text-base sm:text-xl tabular-nums">
                                            ${(item.precio * item.cantidad).toLocaleString("es-AR")}
                                        </p>
                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                            <div className="flex items-center bg-background border border-card-border rounded-full p-0.5 sm:p-1">
                                                <button
                                                    onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                                                    aria-label="Disminuir"
                                                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center hover:bg-card-bg text-foreground/70 active:scale-90 transition-all"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-7 sm:w-8 text-center font-bold text-foreground text-sm tabular-nums">{item.cantidad}</span>
                                                <button
                                                    onClick={() => cambiarCantidad(item.id, Math.min(item.stock, item.cantidad + 1))}
                                                    aria-label="Aumentar"
                                                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center hover:bg-card-bg text-foreground/70 active:scale-90 transition-all"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => eliminar(item.id)}
                                                aria-label={`Eliminar ${item.nombre}`}
                                                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-red-500 hover:text-white hover:bg-red-500 rounded-full transition-all active:scale-90"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Cross-selling */}
                        {sugeridos.length > 0 && (
                            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-card-border">
                                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                                    <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md">Tip</span>
                                    <h3 className="text-base sm:text-lg font-display font-black text-foreground">Complementá tu compra</h3>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                    {sugeridos.map(sugerido => (
                                        <div key={sugerido.id} className="bg-card-bg border border-card-border rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col hover:border-primary/40 hover:shadow-md transition-all group">
                                            <div className="aspect-square bg-background border border-card-border rounded-lg mb-2.5 flex items-center justify-center p-3 relative">
                                                {sugerido.imagenes && sugerido.imagenes.length > 0 ? (
                                                    <img src={sugerido.imagenes[0]} alt="" className="h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform" />
                                                ) : (
                                                    <Headphones className="text-card-border" size={28} />
                                                )}
                                                <button
                                                    onClick={() => agregarSugerido(sugerido)}
                                                    aria-label={`Agregar ${sugerido.nombre}`}
                                                    className="absolute -bottom-2.5 -right-2.5 w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30 hover:bg-primary-hover active:scale-90 transition-all"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                            <p className="text-[9px] font-black text-primary/60 uppercase tracking-wider mb-0.5">{sugerido.marca}</p>
                                            <h4 className="font-bold text-foreground text-xs sm:text-sm leading-tight mb-2 line-clamp-2">{sugerido.nombre}</h4>
                                            <p className="font-black text-foreground text-sm sm:text-base mt-auto tabular-nums">${sugerido.precio.toLocaleString("es-AR")}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Resumen — desktop sticky */}
                    <div className="hidden lg:block lg:col-span-1">
                        <div className="bg-card-bg rounded-3xl border border-card-border p-7 sticky top-24">
                            <h2 className="font-display font-black text-foreground text-xl mb-5">Resumen</h2>

                            <div className="flex flex-col gap-3 mb-5 max-h-72 overflow-y-auto pr-1">
                                {items.map(item => (
                                    <div key={item.id} className="flex justify-between gap-2 text-sm">
                                        <span className="text-foreground/70 flex-1 min-w-0">
                                            <span className="text-foreground font-semibold">{item.cantidad}×</span> {item.nombre}
                                        </span>
                                        <span className="font-bold text-foreground tabular-nums flex-shrink-0">${(item.precio * item.cantidad).toLocaleString("es-AR")}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-dashed border-card-border pt-5 mb-6">
                                <div className="flex justify-between items-end">
                                    <span className="text-foreground/50 font-medium text-sm">Total</span>
                                    <span className="font-display text-3xl font-black text-foreground tabular-nums tracking-tight">${total.toLocaleString("es-AR")}</span>
                                </div>
                                <p className="text-xs text-foreground/40 text-right mt-1.5">Envío calculado en el siguiente paso</p>
                            </div>

                            <button
                                onClick={irACheckout}
                                className="w-full bg-primary text-white font-bold py-4 rounded-full hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] min-h-[56px]"
                            >
                                Continuar compra
                            </button>

                            <p className="text-center text-xs text-foreground/40 mt-4">Pago 100% seguro con Mercado Pago</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile sticky bottom bar */}
            <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card-bg border-t border-card-border px-4 py-3 backdrop-blur-md bg-card-bg/95">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex-shrink-0">
                        <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider">Total</p>
                        <p className="font-display text-xl font-black text-foreground tabular-nums leading-none">${total.toLocaleString("es-AR")}</p>
                    </div>
                    <button
                        onClick={irACheckout}
                        className="flex-1 bg-primary text-white font-bold py-3 px-5 rounded-full active:scale-[0.97] transition-transform min-h-[48px]"
                    >
                        Continuar compra
                    </button>
                </div>
            </div>
        </div>
    );
}
