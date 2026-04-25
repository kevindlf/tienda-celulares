"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Smartphone, Shield, Truck, CreditCard, ChevronRight, Zap, Headphones, ShieldCheck, ArrowRight, Star } from "lucide-react";
import { productosApi } from "@/lib/api";
import { Producto } from "@/types";
import Footer from "@/components/layout/Footer";

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
        <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary selection:text-white transition-colors duration-300">

            {/* Hero Premium 2026 - Starbucks Vibe */}
            <section className="relative min-h-[90vh] flex items-center pt-20 pb-20 overflow-hidden">
                {/* Abstract Background Elements */}
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-70 animate-pulse-slow pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-accent/30 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-50 animate-float pointer-events-none"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Texto Hero */}
                    <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card-bg border border-card-border shadow-sm mb-8 animate-fade-in-up">
                            <span className="flex h-2 w-2 rounded-full bg-primary animate-ping"></span>
                            <span className="text-sm font-semibold tracking-wide text-foreground">Nueva Colección 2026</span>
                        </div>
                        
                        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-[1.1] animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                            Conectate <br/> con <span className="text-primary">estilo.</span>
                        </h1>
                        
                        <p className="text-lg sm:text-xl text-foreground/70 mb-10 max-w-lg font-medium leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                            Descubrí la próxima generación de dispositivos. Diseño elegante, rendimiento superior y la garantía que merecés.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                            <Link
                                href="/productos"
                                className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-8 py-4 rounded-full hover:bg-primary-hover hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 text-lg"
                            >
                                Explorar Colección
                                <ArrowRight size={20} />
                            </Link>
                            <Link
                                href="/productos?tipo=ACCESORIO"
                                className="inline-flex items-center justify-center gap-2 bg-card-bg text-foreground border border-card-border font-bold px-8 py-4 rounded-full hover:bg-accent/50 transition-all text-lg"
                            >
                                Ver Accesorios
                            </Link>
                        </div>
                    </div>

                    {/* Elemento Gráfico Hero (No imágenes default) */}
                    <div className="relative h-[600px] w-full hidden lg:flex justify-center items-center animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                        {/* Celular Abstracto Principal */}
                        <div className="relative w-80 h-[650px] bg-card-bg rounded-[3rem] shadow-2xl border-[12px] border-foreground/5 overflow-hidden z-20 hover:scale-105 transition-transform duration-700 group">
                            {/* Pantalla */}
                            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent"></div>
                            {/* Isla dinámica */}
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-7 bg-foreground rounded-full"></div>
                            
                            {/* Contenido Abstracto UI */}
                            <div className="absolute inset-x-6 top-20 bottom-6 flex flex-col gap-4">
                                <div className="w-full h-40 rounded-3xl bg-primary/20 backdrop-blur-md overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent opacity-50"></div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-1/2 h-24 rounded-3xl bg-card-border/50"></div>
                                    <div className="w-1/2 h-24 rounded-3xl bg-card-border/50"></div>
                                </div>
                                <div className="flex-1 rounded-3xl bg-card-border/30"></div>
                            </div>
                        </div>

                        {/* Tarjeta Flotante Atrás */}
                        <div className="absolute right-0 bottom-20 w-64 h-72 bg-primary/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/10 z-30 translate-x-12 translate-y-12 rotate-6 animate-float flex flex-col p-6 text-white">
                            <div className="w-12 h-12 rounded-full bg-white/20 mb-auto flex items-center justify-center">
                                <Star className="text-yellow-300" fill="currentColor" size={24} />
                            </div>
                            <div>
                                <p className="font-medium text-white/80 text-sm">Calidad Premium</p>
                                <p className="font-bold text-2xl">Reacondicionados Grado A+</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Logo Strip / Confianza */}
            <section className="border-y border-card-border bg-card-bg py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <p className="text-center text-sm font-bold text-foreground/50 uppercase tracking-[0.2em] mb-8">Distribuidores Autorizados</p>
                    <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-700">
                        {/* Apple Logo SVG */}
                        <svg className="h-10 w-auto fill-foreground transition-colors hover:fill-primary" viewBox="0 0 384 512"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                        <span className="text-3xl font-black tracking-tighter text-foreground hover:text-primary transition-colors">SAMSUNG</span>
                        <span className="text-3xl font-bold tracking-widest text-foreground hover:text-primary transition-colors">MOTOROLA</span>
                        <span className="text-3xl font-bold text-foreground hover:text-primary transition-colors">XIAOMI</span>
                    </div>
                </div>
            </section>

            {/* Categorías Principales - Bento Grid Style */}
            <section className="py-32 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl lg:text-5xl font-black text-foreground mb-6">El ecosistema <br/>perfecto.</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Celulares */}
                        <Link href="/productos?tipo=CELULAR" className="group relative bg-card-bg rounded-[3rem] p-10 lg:p-14 border border-card-border shadow-sm overflow-hidden flex flex-col justify-between min-h-[450px] transition-all duration-500 hover:shadow-2xl hover:border-primary/30">
                            <div className="relative z-10">
                                <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-bold tracking-wide rounded-full mb-6">Lanzamientos</span>
                                <h3 className="text-4xl font-black text-foreground mb-4 group-hover:text-primary transition-colors">Smartphones</h3>
                                <p className="text-foreground/60 max-w-sm mb-10 text-lg">Descubrí la última tecnología. Equipos nuevos sellados y usados premium garantizados.</p>
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white group-hover:scale-110 transition-transform">
                                    <ArrowRight size={24} />
                                </div>
                            </div>
                            <div className="absolute right-0 bottom-0 w-[120%] h-[120%] bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <Smartphone className="absolute -right-4 -bottom-4 text-primary/5 w-64 h-64 rotate-12 transition-transform duration-700 group-hover:rotate-0 group-hover:scale-110" />
                        </Link>

                        {/* Accesorios */}
                        <Link href="/productos?tipo=ACCESORIO" className="group relative bg-primary rounded-[3rem] p-10 lg:p-14 border border-primary-hover shadow-sm overflow-hidden flex flex-col justify-between min-h-[450px] transition-all duration-500 hover:shadow-2xl">
                            <div className="relative z-10 text-white">
                                <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-bold tracking-wide rounded-full mb-6">Complementos</span>
                                <h3 className="text-4xl font-black mb-4">Accesorios</h3>
                                <p className="text-white/80 max-w-sm mb-10 text-lg">Fundas de diseño, cargadores rápidos, auriculares y todo para elevar tu experiencia.</p>
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white text-primary group-hover:scale-110 transition-transform">
                                    <ArrowRight size={24} />
                                </div>
                            </div>
                            <div className="absolute right-0 bottom-0 w-[120%] h-[120%] bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <Headphones className="absolute -right-4 -bottom-4 text-white/10 w-64 h-64 -rotate-12 transition-transform duration-700 group-hover:rotate-0 group-hover:scale-110" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Últimos Ingresos */}
            <section className="py-24 px-4 bg-card-bg border-y border-card-border">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <h2 className="text-4xl font-black text-foreground mb-4">Recién Llegados</h2>
                            <p className="text-foreground/60 text-lg">La mejor selección, curada para vos.</p>
                        </div>
                        <Link href="/productos" className="inline-flex items-center gap-2 font-bold text-primary hover:text-primary-hover transition-colors group">
                            Ver todo el catálogo 
                            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {destacados.length > 0 ? (
                            destacados.map((producto) => (
                                <Link href={`/productos/${producto.id}`} key={producto.id} className="group flex flex-col bg-background rounded-3xl p-5 border border-card-border hover:shadow-2xl hover:border-primary/30 transition-all duration-300 hover:-translate-y-2">
                                    <div className="relative aspect-[4/5] w-full rounded-2xl bg-card-bg mb-6 overflow-hidden flex items-center justify-center p-8">
                                        {producto.condicion === 'USADO' && (
                                            <span className="absolute top-4 left-4 bg-foreground text-background text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-sm">
                                                Reacondicionado
                                            </span>
                                        )}
                                        {producto.imagenes && producto.imagenes.length > 0 ? (
                                            <img 
                                                src={producto.imagenes[0]} 
                                                alt={producto.nombre} 
                                                className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-700" 
                                            />
                                        ) : (
                                            <Smartphone className="w-20 h-20 text-card-border group-hover:scale-110 transition-transform duration-700" />
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col px-2">
                                        <p className="text-xs font-bold text-foreground/50 uppercase tracking-[0.15em] mb-2">{producto.marca}</p>
                                        <h3 className="font-bold text-xl text-foreground leading-snug mb-4 group-hover:text-primary transition-colors line-clamp-2">{producto.nombre}</h3>
                                        <div className="mt-auto flex items-center justify-between border-t border-card-border pt-4">
                                            <span className="font-black text-2xl text-foreground">
                                                ${producto.precio.toLocaleString("es-AR")}
                                            </span>
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                <ChevronRight size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            // Skeletons
                            [1,2,3,4].map(i => (
                                <div key={i} className="bg-background border border-card-border rounded-3xl p-5 animate-pulse">
                                    <div className="aspect-[4/5] w-full bg-card-bg rounded-2xl mb-6"></div>
                                    <div className="h-3 w-16 bg-card-bg rounded mb-3"></div>
                                    <div className="h-6 w-full bg-card-bg rounded mb-6"></div>
                                    <div className="border-t border-card-border pt-4">
                                        <div className="h-8 w-24 bg-card-bg rounded"></div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Características (Trust) */}
            <section className="py-24 px-4 bg-foreground text-background">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-[2rem] bg-background/10 flex items-center justify-center mb-8 text-primary shadow-inner">
                            <Truck size={36} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Envíos Asegurados</h3>
                        <p className="text-background/70 text-lg leading-relaxed">Despachamos a todo el país. Tu equipo viaja protegido de principio a fin.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-[2rem] bg-background/10 flex items-center justify-center mb-8 text-primary shadow-inner">
                            <ShieldCheck size={36} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Garantía Oficial</h3>
                        <p className="text-background/70 text-lg leading-relaxed">Respaldo directo con el fabricante en equipos nuevos y nuestra garantía premium en usados.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-[2rem] bg-background/10 flex items-center justify-center mb-8 text-primary shadow-inner">
                            <CreditCard size={36} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Pagos Flexibles</h3>
                        <p className="text-background/70 text-lg leading-relaxed">Integración total con Mercado Pago. Todas las tarjetas, transferencias y efectivo.</p>
                    </div>
                </div>
            </section>
            
            <Footer />
        </div>
    );
}