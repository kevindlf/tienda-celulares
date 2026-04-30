"use client";

import { useEffect, useState } from "react";
import { productosApi } from "@/lib/api";
import { Producto } from "@/types";
import { ShoppingCart, Smartphone, ArrowLeft, Minus, Plus, Headphones, ShieldCheck, Truck, CreditCard } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import Link from "next/link";

export default function ProductoDetalleClient({ id }: { id: number }) {
    const [producto, setProducto] = useState<Producto | null>(null);
    const [relacionados, setRelacionados] = useState<Producto[]>([]);
    const [cargando, setCargando] = useState(true);
    const [cantidad, setCantidad] = useState(1);
    const [imagenActiva, setImagenActiva] = useState(0);
    const { agregar } = useCart();
    const { showToast } = useToast();

    useEffect(() => {
        productosApi.getById(id)
            .then(res => {
                const prod = res.data;
                setProducto(prod);

                productosApi.getAll().then(allRes => {
                    const todos = allRes.data.filter((p: Producto) => p.activo && p.id !== prod.id);
                    let filtrados: Producto[] = [];
                    if (prod.tipoProducto === "CELULAR") {
                        filtrados = todos.filter((p: Producto) =>
                            (p.tipoProducto === "ACCESORIO" && (p.marca === prod.marca || p.marca === "Genérico")) ||
                            (p.tipoProducto === "CELULAR" && p.marca === prod.marca)
                        );
                    } else {
                        filtrados = todos.filter((p: Producto) => p.marca === prod.marca || p.categoria === prod.categoria);
                    }
                    setRelacionados(filtrados.sort(() => 0.5 - Math.random()).slice(0, 4));
                });
            })
            .catch(() => showToast("Producto no encontrado", "error"))
            .finally(() => setCargando(false));
    }, [id, showToast]);

    const handleAgregar = () => {
        if (!producto) return;
        for (let i = 0; i < cantidad; i++) agregar(producto);
        showToast(`${cantidad}× ${producto.nombre} agregado`, "success");
        setCantidad(1);
    };

    if (cargando) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Smartphone className="text-primary animate-pulse" size={48} />
            </div>
        );
    }

    if (!producto) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <div className="text-center">
                    <p className="text-foreground/40 text-lg mb-4">Producto no encontrado</p>
                    <Link href="/productos" className="inline-flex items-center gap-2 text-primary font-bold hover:underline min-h-[44px]">
                        <ArrowLeft size={18} /> Volver al catálogo
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-32 lg:pb-12 overflow-x-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12">

                <Link href="/productos" className="inline-flex items-center gap-2 text-foreground/50 hover:text-primary mb-5 sm:mb-8 font-semibold text-sm transition-colors min-h-[40px]">
                    <ArrowLeft size={16} /> Volver al catálogo
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 sm:mb-16">

                    {/* Galería */}
                    <div>
                        <div className="bg-card-bg rounded-2xl sm:rounded-3xl border border-card-border overflow-hidden mb-3 sm:mb-4 relative aspect-square flex items-center justify-center">
                            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-col gap-2 z-10">
                                {producto.condicion === "USADO" && (
                                    <span className="bg-foreground text-background text-[10px] sm:text-xs font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full tracking-wide">
                                        Reacondicionado
                                    </span>
                                )}
                                {producto.tipoProducto === "ACCESORIO" && (
                                    <span className="bg-primary text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full tracking-wide">
                                        {producto.categoria || "Accesorio"}
                                    </span>
                                )}
                            </div>

                            {producto.imagenes && producto.imagenes.length > 0 ? (
                                <img
                                    src={producto.imagenes[imagenActiva]}
                                    alt={producto.nombre}
                                    className="h-[80%] w-[80%] object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-500"
                                />
                            ) : (
                                producto.tipoProducto === "CELULAR"
                                    ? <Smartphone className="text-card-border" size={120} />
                                    : <Headphones className="text-card-border" size={120} />
                            )}
                        </div>

                        {producto.imagenes && producto.imagenes.length > 1 && (
                            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
                                {producto.imagenes.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setImagenActiva(i)}
                                        aria-label={`Ver imagen ${i + 1}`}
                                        className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-xl border-2 overflow-hidden transition-all ${imagenActiva === i ? "border-primary shadow-md" : "border-card-border opacity-60 hover:opacity-100"}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-contain bg-card-bg p-1.5 sm:p-2 mix-blend-multiply dark:mix-blend-normal" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-col">
                        <p className="text-xs font-black text-primary/60 uppercase tracking-[0.25em] mb-2">{producto.marca}</p>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-foreground mb-2 leading-[1.1]">{producto.nombre}</h1>
                        {producto.modelo && producto.modelo !== "N/A" && (
                            <p className="text-foreground/50 text-sm sm:text-base mb-6 sm:mb-8">{producto.modelo}</p>
                        )}

                        <div className="mb-6 sm:mb-8">
                            <p className="font-display text-4xl sm:text-5xl font-black text-foreground tracking-tight leading-none">
                                ${producto.precio.toLocaleString("es-AR")}
                            </p>
                            <p className="text-xs sm:text-sm text-foreground/50 mt-2">3 cuotas sin interés con Mercado Pago</p>
                        </div>

                        {/* Specs grid */}
                        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-6 sm:mb-8">
                            {producto.almacenamiento && (
                                <div className="bg-card-bg rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-card-border">
                                    <p className="text-[10px] font-black text-foreground/40 uppercase tracking-wider mb-1">Almacenamiento</p>
                                    <p className="font-bold text-foreground text-base sm:text-lg">{producto.almacenamiento} GB</p>
                                </div>
                            )}
                            {producto.ram && (
                                <div className="bg-card-bg rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-card-border">
                                    <p className="text-[10px] font-black text-foreground/40 uppercase tracking-wider mb-1">Memoria RAM</p>
                                    <p className="font-bold text-foreground text-base sm:text-lg">{producto.ram} GB</p>
                                </div>
                            )}
                            {producto.color && (
                                <div className="bg-card-bg rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-card-border">
                                    <p className="text-[10px] font-black text-foreground/40 uppercase tracking-wider mb-1">Color</p>
                                    <p className="font-bold text-foreground text-base sm:text-lg capitalize">{producto.color}</p>
                                </div>
                            )}
                            <div className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 border ${producto.stock === 0 ? "bg-red-500/5 border-red-500/30" : producto.stock < 5 ? "bg-orange-500/5 border-orange-500/30" : "bg-card-bg border-card-border"}`}>
                                <p className={`text-[10px] font-black uppercase tracking-wider mb-1 ${producto.stock === 0 ? "text-red-500" : producto.stock < 5 ? "text-orange-500" : "text-foreground/40"}`}>Stock</p>
                                <p className={`font-bold text-base sm:text-lg ${producto.stock === 0 ? "text-red-600" : producto.stock < 5 ? "text-orange-600" : "text-foreground"}`}>
                                    {producto.stock === 0 ? "Sin stock" : `${producto.stock} disponibles`}
                                </p>
                            </div>
                        </div>

                        {producto.condicion === "USADO" && (
                            <div className="bg-card-bg rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-card-border mb-6 sm:mb-8 flex items-center justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-foreground mb-1 text-sm sm:text-base">Estado de batería</h4>
                                    <p className="text-xs sm:text-sm text-foreground/60">Equipo testeado y garantizado</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <div className="text-2xl sm:text-3xl font-display font-black text-primary leading-none">{producto.nivelBateria}%</div>
                                    {producto.ciclosCarga != null && (
                                        <div className="text-[10px] sm:text-xs font-semibold text-foreground/50 mt-1">{producto.ciclosCarga} ciclos</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {producto.descripcion && (
                            <div className="mb-8 sm:mb-10">
                                <h3 className="font-display font-black text-foreground mb-2 sm:mb-3 text-base sm:text-lg">Descripción</h3>
                                <p className="text-foreground/70 leading-relaxed whitespace-pre-line text-sm sm:text-base">{producto.descripcion}</p>
                            </div>
                        )}

                        {/* Trust signals */}
                        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6 sm:mb-8">
                            {[
                                { Icon: Truck, label: "Envío 48hs" },
                                { Icon: ShieldCheck, label: "Garantía oficial" },
                                { Icon: CreditCard, label: "3 cuotas s/i" },
                            ].map(({ Icon, label }, i) => (
                                <div key={i} className="bg-card-bg border border-card-border rounded-xl p-3 flex flex-col items-center gap-1.5 text-center">
                                    <Icon size={18} className="text-primary" />
                                    <span className="text-[10px] sm:text-xs font-bold text-foreground/70 leading-tight">{label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Desktop CTA */}
                        <div className="hidden lg:flex items-center gap-3">
                            <div className="flex items-center bg-card-bg border border-card-border rounded-2xl p-1.5">
                                <button
                                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                                    aria-label="Disminuir cantidad"
                                    className="w-11 h-11 rounded-xl hover:bg-background text-foreground/70 hover:text-foreground flex items-center justify-center transition-colors active:scale-90"
                                >
                                    <Minus size={18} />
                                </button>
                                <span className="w-12 text-center font-bold text-lg text-foreground tabular-nums">{cantidad}</span>
                                <button
                                    onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
                                    aria-label="Aumentar cantidad"
                                    className="w-11 h-11 rounded-xl hover:bg-background text-foreground/70 hover:text-foreground flex items-center justify-center transition-colors active:scale-90"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                            <button
                                onClick={handleAgregar}
                                disabled={producto.stock === 0}
                                className="flex-1 flex items-center justify-center gap-2 bg-primary text-white font-bold py-4 rounded-full hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none min-h-[56px]"
                            >
                                <ShoppingCart size={20} />
                                Agregar al carrito
                            </button>
                        </div>
                    </div>
                </div>

                {/* Relacionados */}
                {relacionados.length > 0 && (
                    <div className="mb-10">
                        <h2 className="text-2xl sm:text-3xl font-display font-black text-foreground mb-6 sm:mb-8">También te puede interesar</h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                            {relacionados.map((rel) => (
                                <Link
                                    href={`/productos/${rel.id}`}
                                    key={rel.id}
                                    className="group flex flex-col bg-card-bg border border-card-border rounded-xl sm:rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="relative aspect-square bg-background flex items-center justify-center p-4 sm:p-6 overflow-hidden">
                                        {rel.condicion === "USADO" && (
                                            <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-foreground text-background text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                                                Reacond.
                                            </span>
                                        )}
                                        {rel.imagenes && rel.imagenes.length > 0 ? (
                                            <img
                                                src={rel.imagenes[0]}
                                                alt={rel.nombre}
                                                className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            rel.tipoProducto === "CELULAR"
                                                ? <Smartphone className="w-12 h-12 text-card-border" />
                                                : <Headphones className="w-12 h-12 text-card-border" />
                                        )}
                                    </div>
                                    <div className="p-3 sm:p-4 flex flex-col flex-1">
                                        <p className="text-[9px] sm:text-[10px] font-black text-primary/60 uppercase tracking-[0.2em] mb-1">{rel.marca}</p>
                                        <h3 className="font-bold text-sm text-foreground leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">{rel.nombre}</h3>
                                        <div className="mt-auto pt-2 sm:pt-3 border-t border-card-border">
                                            <span className="font-black text-base sm:text-lg text-foreground">
                                                ${rel.precio.toLocaleString("es-AR")}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile sticky CTA */}
            <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card-bg border-t border-card-border px-4 py-3 flex items-center gap-3 backdrop-blur-md bg-card-bg/95 safe-area-pb">
                <div className="flex items-center bg-background border border-card-border rounded-full p-1 flex-shrink-0">
                    <button
                        onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                        aria-label="Disminuir cantidad"
                        className="w-9 h-9 rounded-full hover:bg-card-bg text-foreground/70 flex items-center justify-center active:scale-90 transition-all"
                    >
                        <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-bold text-foreground tabular-nums">{cantidad}</span>
                    <button
                        onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
                        aria-label="Aumentar cantidad"
                        className="w-9 h-9 rounded-full hover:bg-card-bg text-foreground/70 flex items-center justify-center active:scale-90 transition-all"
                    >
                        <Plus size={16} />
                    </button>
                </div>
                <button
                    onClick={handleAgregar}
                    disabled={producto.stock === 0}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 rounded-full active:scale-[0.97] transition-transform disabled:opacity-40 disabled:pointer-events-none min-h-[48px]"
                >
                    <ShoppingCart size={18} />
                    <span className="text-sm">Agregar — ${(producto.precio * cantidad).toLocaleString("es-AR")}</span>
                </button>
            </div>
        </div>
    );
}
