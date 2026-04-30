"use client";

import Link from "next/link";
import { MapPin, Phone, Clock, Smartphone, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { configuracionApi } from "@/lib/api";

export default function Footer() {
    const [config, setConfig] = useState({
        nombreTienda: "TechPhone",
        telefonoWhatsApp: "+54 9 261 123-4567",
        direccionFisica: "Av. San Martín 1234, Ciudad de Mendoza, Mendoza",
        linkInstagram: ""
    });

    useEffect(() => {
        configuracionApi.get().then(res => {
            if (res.data) {
                setConfig(prev => ({
                    ...prev,
                    nombreTienda: res.data.nombreTienda || prev.nombreTienda,
                    telefonoWhatsApp: res.data.telefonoWhatsApp || prev.telefonoWhatsApp,
                    direccionFisica: res.data.direccionFisica || prev.direccionFisica,
                    linkInstagram: res.data.linkInstagram || prev.linkInstagram
                }));
            }
        }).catch(err => console.error("Error al cargar config de Footer", err));
    }, []);

    // Crear link de WhatsApp directo
    const whatsappLink = `https://wa.me/${config.telefonoWhatsApp.replace(/[^0-9]/g, '')}?text=Hola,%20tengo%20una%20consulta.`;

    return (
        <footer className="bg-card-bg border-t border-card-border pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    
                    {/* Marca y descripción */}
                    <div className="flex flex-col">
                        <Link href="/" className="flex items-center gap-2 mb-6 group w-fit">
                            <div className="bg-primary text-white p-2 rounded-xl group-hover:scale-105 transition-transform shadow-md">
                                <Smartphone size={24} />
                            </div>
                            <span className="font-extrabold text-2xl tracking-tight text-foreground">{config.nombreTienda}</span>
                        </Link>
                        <p className="text-foreground/70 text-sm leading-relaxed mb-8 max-w-xs font-medium">
                            Conectando tu mundo con la mejor tecnología. Equipos premium, reacondicionados garantizados y accesorios exclusivos.
                        </p>
                    </div>

                    {/* Enlaces rápidos */}
                    <div>
                        <h3 className="font-black text-foreground mb-6 text-lg uppercase tracking-wider">Explorar</h3>
                        <ul className="flex flex-col gap-4">
                            <li><Link href="/productos" className="text-foreground/70 hover:text-primary font-medium transition-colors">Catálogo Completo</Link></li>
                            <li><Link href="/productos?tipo=CELULAR" className="text-foreground/70 hover:text-primary font-medium transition-colors">Smartphones</Link></li>
                            <li><Link href="/productos?tipo=ACCESORIO" className="text-foreground/70 hover:text-primary font-medium transition-colors">Accesorios</Link></li>
                            <li><Link href="/mis-pedidos" className="text-foreground/70 hover:text-primary font-medium transition-colors">Seguir mi pedido</Link></li>
                            <li className="pt-2 border-t border-card-border">
                                <p className="text-xs font-black text-foreground/40 uppercase tracking-widest mb-3">Legal</p>
                                <ul className="flex flex-col gap-3">
                                    <li><Link href="/politicas/terminos" className="text-foreground/70 hover:text-primary font-medium transition-colors text-sm">Términos y Condiciones</Link></li>
                                    <li><Link href="/politicas/devoluciones" className="text-foreground/70 hover:text-primary font-medium transition-colors text-sm">Política de Devoluciones</Link></li>
                                    <li><Link href="/politicas/privacidad" className="text-foreground/70 hover:text-primary font-medium transition-colors text-sm">Política de Privacidad</Link></li>
                                </ul>
                            </li>
                            {config.linkInstagram && (
                                <li className="pt-2">
                                    <a href={config.linkInstagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 dark:bg-pink-900/20 text-pink-600 rounded-full hover:bg-pink-100 dark:hover:bg-pink-900/40 text-sm font-bold transition-colors">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                        </svg> 
                                        Instagram
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Contacto (Solo WhatsApp y Dirección) */}
                    <div>
                        <h3 className="font-black text-foreground mb-6 text-lg uppercase tracking-wider">Contacto</h3>
                        <ul className="flex flex-col gap-6">
                            <li className="flex items-start gap-4">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary flex-shrink-0 mt-1">
                                    <MapPin size={20} />
                                </div>
                                <span className="text-foreground/70 text-sm font-medium leading-relaxed">{config.direccionFisica}</span>
                            </li>
                            <li className="flex flex-col items-start gap-3">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary flex-shrink-0">
                                        <Phone size={20} />
                                    </div>
                                    <span className="text-foreground/70 text-sm font-medium">{config.telefonoWhatsApp}</span>
                                </div>
                                {/* Botón de WhatsApp destacado */}
                                <a 
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-12 mt-1 inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-hover hover:underline transition-all"
                                >
                                    <MessageCircle size={16} />
                                    Enviar WhatsApp
                                </a>
                                <p className="ml-12 text-xs text-foreground/50 mt-1">*Atención por mensaje o a través de nuestro bot.</p>
                            </li>
                        </ul>
                    </div>

                    {/* Horarios */}
                    <div>
                        <h3 className="font-black text-foreground mb-6 text-lg uppercase tracking-wider">Horarios</h3>
                        <ul className="flex flex-col gap-5">
                            <li className="flex items-start gap-4">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary flex-shrink-0 mt-1">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <p className="text-foreground font-bold text-sm mb-1">Lunes a Viernes</p>
                                    <p className="text-foreground/60 text-sm font-medium">09:00 - 13:00 / 17:00 - 21:00</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="p-2 bg-foreground/5 rounded-lg text-foreground/40 flex-shrink-0 mt-1">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <p className="text-foreground font-bold text-sm mb-1">Sábados</p>
                                    <p className="text-foreground/60 text-sm font-medium">09:30 - 13:30</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-card-border flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-foreground/50 text-sm font-medium">
                        © {new Date().getFullYear()} {config.nombreTienda}. Todos los derechos reservados.
                    </p>
                    <div className="flex gap-4 items-center opacity-40 hover:opacity-100 transition-opacity duration-300">
                        {/* Mercado Pago Badge Text instead of unstyled image to fit design better */}
                        <span className="text-sm font-black tracking-tighter flex items-center gap-1 text-foreground">
                            <span className="text-[#009EE3]">mercado</span>
                            <span className="text-[#002B49] dark:text-[#E8F6FF]">pago</span>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
