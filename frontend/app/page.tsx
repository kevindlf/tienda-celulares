"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Smartphone, Headphones, ArrowRight, ChevronRight, Truck, ShieldCheck, CreditCard } from "lucide-react";
import { productosApi } from "@/lib/api";
import { Producto } from "@/types";
import Footer from "@/components/layout/Footer";

const BRANDS = ["Apple", "Samsung", "Motorola", "Xiaomi", "Google Pixel", "Realme", "Nothing Phone", "Honor", "POCO"];

export default function Home() {
    const [destacados, setDestacados] = useState<Producto[]>([]);

    useEffect(() => {
        productosApi.getAll()
            .then(res => {
                const activos = res.data.filter((p: Producto) => p.activo);
                const recientes = activos.sort((a: Producto, b: Producto) => b.id - a.id).slice(0, 4);
                setDestacados(recientes);
            })
            .catch(err => console.error("Error cargando destacados:", err));
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white transition-colors duration-300 overflow-x-hidden">

            {/* HERO — Responsive Split */}
            <section className="relative grid lg:grid-cols-[55%_45%] lg:min-h-[92vh] pt-14 sm:pt-16">

                {/* Left — Green panel */}
                <div className="relative bg-primary flex flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-24 py-14 sm:py-20 lg:py-0 min-h-[78vh] lg:min-h-0 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.08)_0%,_transparent_60%)] pointer-events-none"></div>
                    <div className="absolute -top-12 -right-12 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-white/[0.04] blur-3xl pointer-events-none lg:hidden"></div>
                    <span className="absolute top-1/2 right-0 -translate-y-1/2 text-[140px] sm:text-[200px] xl:text-[260px] font-display font-black text-white/[0.04] leading-none select-none pointer-events-none tracking-tighter">TP</span>

                    <div className="relative z-10 max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 rounded-full mb-5 sm:mb-8">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                            <span className="text-white/90 text-[10px] sm:text-xs font-semibold tracking-[0.15em] uppercase">Colección 2026</span>
                        </div>

                        <h1 className="font-display font-black leading-[0.9] tracking-tight mb-5 sm:mb-8">
                            <span className="block text-[3rem] xs:text-5xl sm:text-6xl lg:text-[clamp(3.5rem,7vw,5.5rem)] text-white">Conectate</span>
                            <span className="block text-[3rem] xs:text-5xl sm:text-6xl lg:text-[clamp(3.5rem,7vw,5.5rem)] text-white">con</span>
                            <span className="block text-[4rem] xs:text-7xl sm:text-8xl lg:text-[clamp(4.5rem,9vw,7.5rem)] text-white/20 leading-[0.85]">estilo.</span>
                        </h1>

                        <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-7 sm:mb-10 max-w-md">
                            Smartphones nuevos y reacondicionados premium. Garantía real, precios honestos y envíos a todo el país.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <Link href="/productos"
                                className="inline-flex items-center justify-center gap-2.5 bg-white text-primary font-bold px-7 py-4 rounded-full hover:bg-white/90 active:scale-[0.97] transition-all shadow-xl shadow-black/20 text-base min-h-[52px]">
                                Ver Catálogo
                                <ArrowRight size={18} />
                            </Link>
                            <Link href="/productos?condicion=USADO"
                                className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-7 py-4 rounded-full hover:bg-white/20 active:scale-[0.97] transition-all text-base min-h-[52px]">
                                Reacondicionados
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right — Light panel with phone mockup (desktop only) */}
                <div className="relative hidden lg:flex bg-card-bg items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--card-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--card-border)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-primary/10 pointer-events-none"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[330px] h-[330px] rounded-full border border-primary/15 pointer-events-none"></div>

                    <div className="relative z-10 w-64 h-[540px] rounded-[2.75rem] bg-foreground shadow-2xl border-[8px] border-foreground overflow-hidden animate-float">
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/25 to-transparent"></div>
                        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black/80 rounded-full z-20"></div>
                        <div className="absolute inset-x-3 top-12 bottom-3 flex flex-col gap-2.5 z-10">
                            <div className="w-full h-44 rounded-xl bg-white/5 border border-white/10 relative overflow-hidden flex items-end p-3">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/5"></div>
                                <Smartphone className="absolute right-2 top-2 text-white/20" size={40} />
                                <div className="relative z-10">
                                    <p className="text-white/40 text-[9px] font-bold tracking-wider uppercase mb-0.5">En oferta</p>
                                    <p className="text-white font-bold text-sm leading-tight">iPhone 15 Pro Max</p>
                                </div>
                            </div>
                            <div className="flex gap-2.5">
                                <div className="flex-1 rounded-xl bg-white/5 border border-white/10 p-2.5 flex flex-col justify-end min-h-[72px]">
                                    <p className="text-white/30 text-[8px] font-bold tracking-wider uppercase">Samsung</p>
                                    <p className="text-white/60 text-xs font-semibold">S25</p>
                                </div>
                                <div className="flex-1 rounded-xl bg-primary/20 border border-primary/30 p-2.5 flex flex-col justify-end min-h-[72px]">
                                    <p className="text-white/40 text-[8px] font-bold tracking-wider uppercase">Motorola</p>
                                    <p className="text-white/60 text-xs font-semibold">G85</p>
                                </div>
                            </div>
                            <div className="flex-1 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <span className="text-white/15 text-[9px] font-black tracking-[0.3em] uppercase">TechPhone</span>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-12 right-6 bg-background/95 border border-card-border rounded-2xl p-4 shadow-xl backdrop-blur-sm z-20 max-w-[165px]">
                        <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider mb-1">Última venta</p>
                        <p className="text-sm font-black text-foreground leading-tight">iPhone 16 Pro</p>
                        <p className="text-primary font-bold text-sm mt-0.5">$1.899.999</p>
                    </div>
                </div>
            </section>

            {/* MARQUEE STRIP */}
            <div className="border-y border-card-border bg-foreground overflow-hidden py-3 sm:py-3.5">
                <div className="flex animate-marquee whitespace-nowrap">
                    {[...BRANDS, ...BRANDS].map((brand, i) => (
                        <span key={i} className="inline-flex items-center gap-2 sm:gap-3 font-display font-bold text-[10px] sm:text-xs tracking-[0.2em] uppercase px-4 sm:px-6 flex-shrink-0 text-background/35">
                            {brand}
                            <span className="text-primary text-sm sm:text-base leading-none">·</span>
                        </span>
                    ))}
                </div>
            </div>

            {/* STATS ROW */}
            <section className="border-b border-card-border py-8 sm:py-10 px-4 sm:px-6">
                <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-y-6 lg:gap-0 lg:divide-x-2 divide-card-border">
                    {[
                        { num: "500+", label: "Productos en stock" },
                        { num: "100%", label: "Garantía incluida" },
                        { num: "48hs", label: "Envío a domicilio" },
                        { num: "3×", label: "Cuotas sin interés" },
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col items-center text-center px-2 lg:px-8">
                            <span className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-primary mb-1 leading-none">{stat.num}</span>
                            <span className="text-foreground/50 text-xs sm:text-sm font-medium">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* CATEGORIES BENTO */}
            <section className="py-14 sm:py-20 lg:py-24 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8 sm:mb-12">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-foreground leading-[1.05]">
                            El ecosistema<br />
                            <span className="text-primary">perfecto.</span>
                        </h2>
                        <Link href="/productos" className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground/40 hover:text-primary transition-colors group self-start sm:self-end">
                            Ver todo
                            <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:h-[440px]">
                        <Link href="/productos?tipo=CELULAR"
                            className="group md:col-span-3 relative bg-foreground rounded-2xl sm:rounded-3xl p-7 sm:p-9 lg:p-10 flex flex-col justify-between min-h-[260px] md:min-h-0 overflow-hidden hover:shadow-2xl transition-shadow duration-500">
                            <div className="relative z-10 text-background">
                                <span className="inline-block px-3 py-1 bg-primary text-white text-[11px] sm:text-xs font-bold tracking-wide rounded-full mb-4 sm:mb-6">Más vendidos</span>
                                <h3 className="text-3xl sm:text-4xl font-display font-black mb-2 sm:mb-3 group-hover:text-primary transition-colors duration-300">Smartphones</h3>
                                <p className="text-background/55 max-w-xs text-sm leading-relaxed">Nuevos sellados y usados premium garantizados. Apple, Samsung, Motorola y más.</p>
                            </div>
                            <div className="flex items-center gap-2 text-primary transition-[gap] duration-300 group-hover:gap-4 mt-4">
                                <span className="text-sm font-bold">Explorar colección</span>
                                <ArrowRight size={16} />
                            </div>
                            <Smartphone className="absolute -right-6 -bottom-6 sm:-right-8 sm:-bottom-8 text-white/[0.04] w-44 h-44 sm:w-56 sm:h-56 lg:w-60 lg:h-60 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6" />
                        </Link>

                        <Link href="/productos?tipo=ACCESORIO"
                            className="group md:col-span-2 relative bg-primary rounded-2xl sm:rounded-3xl p-7 sm:p-9 lg:p-10 flex flex-col justify-between min-h-[220px] md:min-h-0 overflow-hidden hover:shadow-2xl transition-shadow duration-500">
                            <div className="relative z-10 text-white">
                                <span className="inline-block px-3 py-1 bg-white/20 text-white text-[11px] sm:text-xs font-bold tracking-wide rounded-full mb-4 sm:mb-6">Complementos</span>
                                <h3 className="text-2xl sm:text-3xl font-display font-black mb-2 sm:mb-3">Accesorios</h3>
                                <p className="text-white/65 text-sm leading-relaxed">Fundas, cargadores, auriculares y todo lo que necesitás.</p>
                            </div>
                            <div className="flex items-center gap-2 text-white/70 group-hover:text-white transition-[gap,color] duration-300 group-hover:gap-4 mt-4">
                                <span className="text-sm font-bold">Ver todo</span>
                                <ArrowRight size={16} />
                            </div>
                            <Headphones className="absolute -right-4 -bottom-4 sm:-right-6 sm:-bottom-6 text-white/[0.07] w-36 h-36 sm:w-48 sm:h-48 lg:w-52 lg:h-52 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* PRODUCTS — Recién Llegados */}
            <section className="py-14 sm:py-20 px-4 sm:px-6 bg-card-bg border-y border-card-border">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 sm:mb-12 gap-3">
                        <div>
                            <p className="text-[10px] sm:text-xs font-black text-primary/60 uppercase tracking-[0.25em] mb-1.5 sm:mb-2">Nuevo stock</p>
                            <h2 className="text-3xl sm:text-4xl font-display font-black text-foreground">Recién Llegados</h2>
                        </div>
                        <Link href="/productos" className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground/40 hover:text-primary transition-colors group">
                            Ver catálogo completo
                            <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {destacados.length > 0 ? (
                            destacados.map((producto) => (
                                <Link href={`/productos/${producto.id}`} key={producto.id}
                                    className="group flex flex-col bg-background border border-card-border rounded-xl sm:rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                                    <div className="relative aspect-square bg-card-bg flex items-center justify-center p-4 sm:p-6 overflow-hidden">
                                        {producto.condicion === 'USADO' && (
                                            <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-foreground text-background text-[9px] sm:text-[10px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full z-10">
                                                Reacond.
                                            </span>
                                        )}
                                        {producto.imagenes && producto.imagenes.length > 0 ? (
                                            <img src={producto.imagenes[0]} alt={producto.nombre}
                                                className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <Smartphone className="w-12 h-12 sm:w-14 sm:h-14 text-card-border" />
                                        )}
                                    </div>
                                    <div className="p-3 sm:p-5 flex flex-col flex-1">
                                        <p className="text-[9px] sm:text-[10px] font-black text-primary/60 uppercase tracking-[0.2em] mb-1">{producto.marca}</p>
                                        <h3 className="font-bold text-sm sm:text-base text-foreground leading-snug mb-2 sm:mb-3 line-clamp-2 group-hover:text-primary transition-colors">{producto.nombre}</h3>
                                        <div className="mt-auto flex items-center justify-between gap-2 pt-2 sm:pt-3 border-t border-card-border">
                                            <span className="font-black text-base sm:text-xl text-foreground">${producto.precio.toLocaleString("es-AR")}</span>
                                            <div className="w-8 h-8 rounded-full border border-card-border flex items-center justify-center text-foreground/30 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all flex-shrink-0">
                                                <ArrowRight size={14} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            [1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-background border border-card-border rounded-xl sm:rounded-2xl overflow-hidden animate-pulse">
                                    <div className="aspect-square bg-card-bg"></div>
                                    <div className="p-3 sm:p-5">
                                        <div className="h-2 sm:h-2.5 w-12 bg-card-bg rounded mb-2 sm:mb-3"></div>
                                        <div className="h-4 sm:h-5 w-full bg-card-bg rounded mb-1.5"></div>
                                        <div className="h-4 sm:h-5 w-3/4 bg-card-bg rounded mb-3 sm:mb-4"></div>
                                        <div className="border-t border-card-border pt-2 sm:pt-3">
                                            <div className="h-5 sm:h-6 w-20 bg-card-bg rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* TRUST — Feature Cards */}
            <section className="py-14 sm:py-20 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                    {[
                        { Icon: Truck, title: "Envíos Asegurados", text: "Despachamos a todo el país. Tu equipo viaja protegido de principio a fin." },
                        { Icon: ShieldCheck, title: "Garantía Oficial", text: "Respaldo del fabricante en nuevos. Garantía premium propia en reacondicionados." },
                        { Icon: CreditCard, title: "Pagos Flexibles", text: "Mercado Pago integrado. Tarjetas, transferencias y cuotas sin interés." },
                    ].map(({ Icon, title, text }, i) => (
                        <div key={i} className="relative bg-card-bg border border-card-border rounded-2xl sm:rounded-3xl p-7 sm:p-9 lg:p-10 overflow-hidden group hover:border-primary/40 hover:shadow-lg transition-all duration-300">
                            <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-t-2xl sm:rounded-t-3xl"></div>
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center mb-5 sm:mb-7 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                <Icon size={24} className="sm:w-7 sm:h-7" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-display font-black text-foreground mb-2 sm:mb-3">{title}</h3>
                            <p className="text-foreground/60 leading-relaxed text-sm">{text}</p>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
}
