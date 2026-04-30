"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ordenesApi } from "@/lib/api";
import { Orden } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Package, Clock, Truck, CheckCircle, XCircle, CreditCard, ChevronDown, Smartphone } from "lucide-react";
import Link from "next/link";

export default function MisPedidosPage() {
    const [ordenes, setOrdenes] = useState<Orden[]>([]);
    const [cargando, setCargando] = useState(true);
    const [expandida, setExpandida] = useState<number | null>(null);
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
        ordenesApi.misOrdenes()
            .then(res => setOrdenes(res.data))
            .finally(() => setCargando(false));
    }, [isAuthenticated, router]);

    const iconoEstado: Record<string, React.ReactNode> = {
        PENDIENTE: <Clock size={14} />,
        PAGADO: <CreditCard size={14} />,
        PREPARANDO: <Package size={14} />,
        ENVIADO: <Truck size={14} />,
        ENTREGADO: <CheckCircle size={14} />,
        CANCELADO: <XCircle size={14} />,
    };

    const coloresEstado: Record<string, string> = {
        PENDIENTE: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-500 border-yellow-500/30",
        PAGADO: "bg-blue-500/10 text-blue-700 dark:text-blue-500 border-blue-500/30",
        PREPARANDO: "bg-purple-500/10 text-purple-700 dark:text-purple-500 border-purple-500/30",
        ENVIADO: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-500 border-indigo-500/30",
        ENTREGADO: "bg-primary/10 text-primary border-primary/30",
        CANCELADO: "bg-red-500/10 text-red-700 dark:text-red-500 border-red-500/30",
    };

    if (cargando) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center animate-pulse">
                    <Package className="mx-auto text-primary mb-3" size={40} />
                    <p className="text-foreground/50 font-medium text-sm">Cargando pedidos…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-6 sm:py-10 lg:py-12 px-4 sm:px-6 overflow-x-hidden">
            <div className="max-w-4xl mx-auto">

                <div className="mb-6 sm:mb-10">
                    <p className="text-xs font-black text-primary/60 uppercase tracking-[0.25em] mb-1.5">Mi cuenta</p>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-foreground leading-tight">Mis pedidos</h1>
                </div>

                {ordenes.length === 0 ? (
                    <div className="bg-card-bg rounded-2xl sm:rounded-3xl border border-card-border p-8 sm:p-16 text-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-background border border-card-border rounded-full flex items-center justify-center mx-auto mb-5">
                            <Package className="text-foreground/40" size={32} />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-display font-black text-foreground mb-2">Todavía no tenés pedidos</h2>
                        <p className="text-foreground/50 text-sm sm:text-base mb-6 sm:mb-8 max-w-md mx-auto">Cuando hagas tu primera compra vas a poder seguirla acá.</p>
                        <Link href="/productos" className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 sm:px-8 sm:py-4 rounded-full hover:bg-primary-hover transition-colors min-h-[48px]">
                            Ver catálogo
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 sm:gap-4">
                        {ordenes.map(orden => {
                            const isOpen = expandida === orden.id;
                            return (
                                <div key={orden.id} className="bg-card-bg rounded-2xl border border-card-border overflow-hidden hover:border-primary/30 transition-colors">

                                    {/* Header — siempre visible */}
                                    <button
                                        onClick={() => setExpandida(isOpen ? null : orden.id)}
                                        className="w-full p-4 sm:p-6 flex items-start sm:items-center gap-3 sm:gap-4 text-left active:bg-background/50 transition-colors"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <span className="font-display font-black text-foreground text-base sm:text-lg">#{orden.id}</span>
                                                <span className={`flex items-center gap-1.5 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full border ${coloresEstado[orden.estado]}`}>
                                                    {iconoEstado[orden.estado]}
                                                    {orden.estado}
                                                </span>
                                            </div>
                                            <p className="text-xs sm:text-sm text-foreground/50">
                                                {new Date(orden.fechaCreacion).toLocaleDateString("es-AR", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                                <span className="mx-1.5 text-foreground/30">·</span>
                                                {orden.items.length} {orden.items.length === 1 ? "producto" : "productos"}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                                            <span className="font-display text-base sm:text-lg font-black text-foreground tabular-nums">
                                                ${orden.total.toLocaleString("es-AR")}
                                            </span>
                                            <ChevronDown size={16} className={`text-foreground/40 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                                        </div>
                                    </button>

                                    {/* Detalles — expandible */}
                                    {isOpen && (
                                        <div className="px-4 sm:px-6 pb-5 sm:pb-6 border-t border-card-border">
                                            <div className="flex flex-col gap-2.5 pt-4 sm:pt-5 mb-4">
                                                {orden.items.map(item => (
                                                    <div key={item.id} className="flex items-start justify-between gap-3 text-sm">
                                                        <span className="text-foreground/70 flex-1 min-w-0">
                                                            <span className="font-semibold text-foreground">{item.productoNombre}</span>
                                                            <span className="text-foreground/40"> × {item.cantidad}</span>
                                                        </span>
                                                        <span className="font-bold text-foreground tabular-nums flex-shrink-0">
                                                            ${item.subtotal.toLocaleString("es-AR")}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="bg-background border border-card-border rounded-xl p-3 sm:p-4 flex items-start gap-2.5">
                                                <Smartphone size={14} className="text-foreground/40 flex-shrink-0 mt-0.5" />
                                                <div className="text-xs text-foreground/60">
                                                    <p className="font-semibold text-foreground/80 mb-0.5">Dirección de envío</p>
                                                    <p>{orden.direccionEnvio}, {orden.ciudadEnvio}, {orden.provinciaEnvio}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
