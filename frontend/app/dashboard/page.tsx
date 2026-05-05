"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ordenesApi, productosApi } from "@/lib/api";
import { Orden, Producto } from "@/types";
import { Package, ShoppingBag, DollarSign, TrendingUp, AlertTriangle, Users, Settings, BarChart2, Download, Store, Plus, ArrowRight, Tag } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function DashboardPage() {
    const [ordenes, setOrdenes] = useState<Orden[]>([]);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [cargando, setCargando] = useState(true);
    const router = useRouter();
    const { isAdmin } = useAuth();
    const { showToast } = useToast();

    const [mostrarMasOrdenes, setMostrarMasOrdenes] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (!isAdmin) {
            router.push("/");
            return;
        }
        Promise.all([ordenesApi.todas(), productosApi.getAll()])
            .then(([ordenesRes, productosRes]) => {
                const ordenesOrdenadas = (ordenesRes.data || []).sort((a: Orden, b: Orden) => {
                    const dateA = a.fechaCreacion ? new Date(a.fechaCreacion).getTime() : 0;
                    const dateB = b.fechaCreacion ? new Date(b.fechaCreacion).getTime() : 0;
                    return dateB - dateA;
                });
                setOrdenes(ordenesOrdenadas);
                setProductos(productosRes.data || []);
            })
            .finally(() => setCargando(false));
    }, [router, isAdmin]);

    const totalVentas = ordenes.filter(o => o.estado !== "CANCELADO").reduce((acc, o) => acc + (o.total || 0), 0);

    const gananciaNeta = useMemo(() => {
        let ganancia = 0;
        const ordenesCobradas = ordenes.filter(o => o.estado !== "CANCELADO" && o.estado !== "PENDIENTE");
        ordenesCobradas.forEach(o => {
            if (o.items && Array.isArray(o.items)) {
                o.items.forEach(item => {
                    const productoOriginal = productos.find(p => p.id === item.productoId);
                    const costo = productoOriginal?.costoProducto || 0;
                    ganancia += (item.precioUnitario - costo) * item.cantidad;
                });
            }
        });
        return ganancia;
    }, [ordenes, productos]);

    const ordenesHoy = ordenes.filter(o => {
        if (!o.fechaCreacion) return false;
        return new Date(o.fechaCreacion).toDateString() === new Date().toDateString();
    }).length;

    const cambiarEstado = async (id: number, estado: string) => {
        try {
            await ordenesApi.actualizarEstado(id, estado);
            setOrdenes(ordenes.map(o => o.id === id ? { ...o, estado } : o));
        } catch {
            showToast("Error al actualizar el estado", "error");
        }
    };

    const coloresEstado: Record<string, string> = {
        PENDIENTE: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-500 border-yellow-500/30",
        PAGADO: "bg-blue-500/10 text-blue-700 dark:text-blue-500 border-blue-500/30",
        PREPARANDO: "bg-purple-500/10 text-purple-700 dark:text-purple-500 border-purple-500/30",
        ENVIADO: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-500 border-indigo-500/30",
        ENTREGADO: "bg-primary/10 text-primary border-primary/30",
        CANCELADO: "bg-red-500/10 text-red-700 dark:text-red-500 border-red-500/30",
    };

    const ordenesAMostrar = mostrarMasOrdenes ? ordenes : ordenes.slice(0, 5);
    const ordenesSaldadas = ordenes.filter(o => o.estado !== "CANCELADO" && o.estado !== "PENDIENTE");

    const ventasMesActual = useMemo(() => {
        const hoy = new Date();
        const diasDelMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();
        const datos = Array.from({ length: diasDelMes }, (_, i) => ({ dia: i + 1, total: 0 }));
        ordenesSaldadas.forEach(o => {
            if (!o.fechaCreacion) return;
            const fecha = new Date(o.fechaCreacion);
            if (fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear()) {
                const diaIndex = fecha.getDate() - 1;
                if (diaIndex >= 0 && diaIndex < diasDelMes) datos[diaIndex].total += (o.total || 0);
            }
        });
        return datos;
    }, [ordenesSaldadas]);

    const ventasPorMes = useMemo(() => {
        const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        const datos = meses.map(mes => ({ mes, total: 0 }));
        ordenesSaldadas.forEach(o => {
            if (!o.fechaCreacion) return;
            const fecha = new Date(o.fechaCreacion);
            if (fecha.getFullYear() === new Date().getFullYear()) {
                const mesIndex = fecha.getMonth();
                if (mesIndex >= 0 && mesIndex < 12) datos[mesIndex].total += (o.total || 0);
            }
        });
        return datos;
    }, [ordenesSaldadas]);

    const topProductos = useMemo(() => {
        const contador: Record<string, number> = {};
        ordenesSaldadas.forEach(o => {
            if (o.items && Array.isArray(o.items)) {
                o.items.forEach(item => {
                    if (item.productoNombre) {
                        contador[item.productoNombre] = (contador[item.productoNombre] || 0) + (item.cantidad || 1);
                    }
                });
            }
        });
        return Object.entries(contador).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([nombre, cantidad]) => ({ nombre, cantidad }));
    }, [ordenesSaldadas]);

    const productosStockBajo = productos.filter(p => p.stock > 0 && p.stock < 3 && p.activo);
    const productosSinStock = productos.filter(p => p.stock === 0 && p.activo);

    const exportarOrdenesCSV = () => {
        const headers = ["ID", "Cliente", "Total", "Estado", "Fecha", "Artículos"];
        const rows = ordenes.map(o => [
            o.id,
            o.usuario?.nombre || "Venta Física",
            o.total,
            o.estado,
            new Date(o.fechaCreacion).toLocaleDateString("es-AR"),
            o.items?.map(i => `${i.cantidad}x ${i.productoNombre}`).join(" | ") || ""
        ]);
        const csvContent = [headers.join(","), ...rows.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `ordenes_${new Date().toISOString().split("T")[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!isMounted || cargando) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center animate-pulse">
                    <BarChart2 className="mx-auto text-primary mb-3" size={40} />
                    <p className="text-foreground/50 font-medium text-sm">Cargando dashboard…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-6 sm:py-8 lg:py-10 px-4 sm:px-6 overflow-x-hidden">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="mb-4 sm:mb-5">
                        <p className="text-xs font-black text-primary/60 uppercase tracking-[0.25em] mb-1.5">Panel de administración</p>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-foreground leading-tight">Dashboard</h1>
                    </div>
                    <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2 sm:gap-3">
                        <Link href="/dashboard/clientes" className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-card-bg border border-card-border text-foreground px-3 sm:px-4 py-2.5 rounded-xl font-semibold hover:border-primary/40 hover:text-primary transition-colors text-xs sm:text-sm min-h-[44px]">
                            <Users size={14} /> Clientes
                        </Link>
                        <Link href="/dashboard/configuracion" className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-card-bg border border-card-border text-foreground px-3 sm:px-4 py-2.5 rounded-xl font-semibold hover:border-primary/40 hover:text-primary transition-colors text-xs sm:text-sm min-h-[44px]">
                            <Settings size={14} /> Configuración
                        </Link>
                        <Link href="/dashboard/ventas" className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-card-bg border border-card-border text-foreground px-3 sm:px-4 py-2.5 rounded-xl font-semibold hover:border-primary/40 hover:text-primary transition-colors text-xs sm:text-sm min-h-[44px]">
                            <Store size={14} /> Venta física
                        </Link>
                        <Link href="/dashboard/cupones" className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-card-bg border border-card-border text-foreground px-3 sm:px-4 py-2.5 rounded-xl font-semibold hover:border-primary/40 hover:text-primary transition-colors text-xs sm:text-sm min-h-[44px]">
                            <Tag size={14} /> Cupones
                        </Link>
                        <Link href="/dashboard/reportes" className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-primary text-white px-3 sm:px-4 py-2.5 rounded-xl font-semibold hover:bg-primary-hover transition-colors text-xs sm:text-sm min-h-[44px]">
                            <BarChart2 size={14} /> Reportes
                        </Link>
                    </div>
                </div>

                {/* Stats — primero las 2 más importantes en grid 1/2, después las 3 secundarias */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3 lg:gap-4 mb-6 sm:mb-8">
                    <div className="col-span-2 lg:col-span-1 bg-card-bg rounded-2xl border border-card-border p-4 sm:p-5">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] sm:text-xs font-black text-foreground/40 uppercase tracking-wider">Facturación</p>
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                <DollarSign className="text-primary" size={15} />
                            </div>
                        </div>
                        <p className="font-display text-xl sm:text-2xl font-black text-foreground tabular-nums leading-tight">
                            ${totalVentas.toLocaleString("es-AR")}
                        </p>
                    </div>
                    <div className="col-span-2 lg:col-span-1 bg-primary/5 rounded-2xl border border-primary/30 p-4 sm:p-5">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] sm:text-xs font-black text-primary uppercase tracking-wider">Ganancia neta</p>
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center">
                                <TrendingUp className="text-white" size={15} />
                            </div>
                        </div>
                        <p className="font-display text-xl sm:text-2xl font-black text-primary tabular-nums leading-tight">
                            ${gananciaNeta.toLocaleString("es-AR")}
                        </p>
                    </div>
                    <div className="bg-card-bg rounded-2xl border border-card-border p-4 sm:p-5">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] sm:text-xs font-black text-foreground/40 uppercase tracking-wider">Órdenes</p>
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                <ShoppingBag className="text-blue-600 dark:text-blue-500" size={15} />
                            </div>
                        </div>
                        <p className="font-display text-xl sm:text-2xl font-black text-foreground tabular-nums leading-tight">{ordenes.length}</p>
                    </div>
                    <div className="bg-card-bg rounded-2xl border border-card-border p-4 sm:p-5">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] sm:text-xs font-black text-foreground/40 uppercase tracking-wider">Hoy</p>
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                                <TrendingUp className="text-purple-600 dark:text-purple-500" size={15} />
                            </div>
                        </div>
                        <p className="font-display text-xl sm:text-2xl font-black text-foreground tabular-nums leading-tight">{ordenesHoy}</p>
                    </div>
                    <div className="bg-card-bg rounded-2xl border border-card-border p-4 sm:p-5">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] sm:text-xs font-black text-foreground/40 uppercase tracking-wider">Productos</p>
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
                                <Package className="text-orange-600 dark:text-orange-500" size={15} />
                            </div>
                        </div>
                        <p className="font-display text-xl sm:text-2xl font-black text-foreground tabular-nums leading-tight">
                            {productos.filter(p => p.activo).length}
                        </p>
                    </div>
                </div>

                {/* Alertas Stock */}
                {(productosStockBajo.length > 0 || productosSinStock.length > 0) && (
                    <div className="bg-red-500/5 border border-red-500/30 rounded-2xl p-5 sm:p-6 mb-6 sm:mb-8 flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 bg-red-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="text-red-500" size={22} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-display font-black text-red-600 dark:text-red-500 text-base sm:text-lg mb-1">¡Atención! Stock crítico</h3>
                            <p className="text-sm text-foreground/60 mb-3">Tenés productos sin stock o por agotarse</p>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                {productosSinStock.map(p => (
                                    <span key={p.id} className="bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-md">
                                        Agotado: {p.nombre}
                                    </span>
                                ))}
                                {productosStockBajo.map(p => (
                                    <span key={p.id} className="bg-orange-500 text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-md">
                                        {p.stock} restantes: {p.nombre}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <div className="bg-card-bg rounded-2xl border border-card-border p-4 sm:p-6">
                        <h3 className="font-display font-black text-foreground text-base sm:text-lg mb-4 sm:mb-6">Ventas de este mes</h3>
                        <div className="h-52 sm:h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={ventasMesActual} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#00704A" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#00704A" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--card-border)" />
                                    <XAxis dataKey="dia" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--foreground)", fillOpacity: 0.5 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--foreground)", fillOpacity: 0.5 }} tickFormatter={(value) => `$${value / 1000}k`} />
                                    <RechartsTooltip
                                        formatter={(value: any) => [`$${Number(value).toLocaleString("es-AR")}`, "Ventas"]}
                                        labelFormatter={(label) => `Día ${label}`}
                                        contentStyle={{ borderRadius: "12px", border: "1px solid var(--card-border)", backgroundColor: "var(--card-bg)", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                                    />
                                    <Area type="monotone" dataKey="total" stroke="#00704A" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-card-bg rounded-2xl border border-card-border p-4 sm:p-6">
                        <h3 className="font-display font-black text-foreground text-base sm:text-lg mb-4 sm:mb-6">
                            Histórico {new Date().getFullYear()}
                        </h3>
                        <div className="h-52 sm:h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={ventasPorMes} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--card-border)" />
                                    <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--foreground)", fillOpacity: 0.5 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--foreground)", fillOpacity: 0.5 }} tickFormatter={(value) => `$${value / 1000}k`} />
                                    <RechartsTooltip
                                        cursor={{ fill: "var(--accent)" }}
                                        formatter={(value: any) => [`$${Number(value).toLocaleString("es-AR")}`, "Ventas"]}
                                        contentStyle={{ borderRadius: "12px", border: "1px solid var(--card-border)", backgroundColor: "var(--card-bg)", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                                    />
                                    <Bar dataKey="total" fill="#00704A" radius={[4, 4, 0, 0]} barSize={28} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Top productos */}
                {topProductos.length > 0 && (
                    <div className="bg-card-bg rounded-2xl border border-card-border p-4 sm:p-6 mb-6 sm:mb-8">
                        <h3 className="font-display font-black text-foreground text-base sm:text-lg mb-4">Top 5 productos más vendidos</h3>
                        <div className="flex flex-col gap-2">
                            {topProductos.map((p, index) => (
                                <div key={p.nombre} className="flex items-center justify-between p-3 rounded-xl hover:bg-background border border-transparent hover:border-card-border transition-colors gap-3">
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0 ${index === 0 ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-500" : index === 1 ? "bg-foreground/10 text-foreground/70" : index === 2 ? "bg-orange-500/20 text-orange-700 dark:text-orange-500" : "bg-primary/10 text-primary"}`}>
                                            #{index + 1}
                                        </div>
                                        <span className="font-semibold text-foreground text-sm sm:text-base truncate">{p.nombre}</span>
                                    </div>
                                    <span className="font-bold text-foreground/60 text-xs sm:text-sm flex-shrink-0 tabular-nums">{p.cantidad} vendidos</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Productos */}
                <div className="bg-card-bg rounded-2xl border border-card-border p-4 sm:p-6 mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">
                        <h2 className="font-display font-black text-foreground text-lg sm:text-xl">Productos</h2>
                        <div className="grid grid-cols-2 sm:flex gap-2">
                            <Link href="/dashboard/productos/nuevo-celular"
                                className="inline-flex items-center justify-center gap-1.5 bg-primary text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-2.5 rounded-xl hover:bg-primary-hover transition-colors min-h-[44px]">
                                <Plus size={14} /> Celular
                            </Link>
                            <Link href="/dashboard/productos/nuevo-accesorio"
                                className="inline-flex items-center justify-center gap-1.5 bg-primary/10 text-primary text-xs sm:text-sm font-bold px-3 sm:px-4 py-2.5 rounded-xl hover:bg-primary/20 transition-colors min-h-[44px]">
                                <Plus size={14} /> Accesorio
                            </Link>
                        </div>
                    </div>

                    {/* Mobile: cards */}
                    <div className="md:hidden flex flex-col gap-2.5">
                        {productos.length === 0 ? (
                            <p className="text-center text-foreground/40 py-8 text-sm">No hay productos cargados</p>
                        ) : (
                            productos.map(producto => (
                                <Link href={`/dashboard/productos/${producto.id}`} key={producto.id}
                                    className="block bg-background border border-card-border rounded-xl p-4 hover:border-primary/40 transition-colors">
                                    <div className="flex items-start justify-between gap-3 mb-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-foreground text-sm leading-tight line-clamp-1">{producto.nombre}</p>
                                            <p className="text-[11px] text-foreground/50 mt-0.5">{producto.marca} · {producto.almacenamiento ? `${producto.almacenamiento}GB` : producto.categoria}</p>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${producto.activo ? "bg-primary/10 text-primary" : "bg-red-500/10 text-red-500"}`}>
                                            {producto.activo ? "Activo" : "Inactivo"}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-card-border">
                                        <div>
                                            <p className="text-[9px] font-bold text-foreground/40 uppercase tracking-wider">Precio</p>
                                            <p className="text-sm font-black text-foreground tabular-nums leading-tight">${producto.precio.toLocaleString("es-AR")}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-foreground/40 uppercase tracking-wider">Margen</p>
                                            {producto.costoProducto && producto.precio > producto.costoProducto ? (
                                                <p className="text-sm font-black text-primary tabular-nums leading-tight">
                                                    {(((producto.precio - producto.costoProducto) / producto.costoProducto) * 100).toFixed(0)}%
                                                </p>
                                            ) : (
                                                <p className="text-sm text-foreground/40">—</p>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-foreground/40 uppercase tracking-wider">Stock</p>
                                            <p className={`text-sm font-black tabular-nums leading-tight ${producto.stock < 5 ? "text-red-500" : "text-foreground"}`}>
                                                {producto.stock}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>

                    {/* Desktop: tabla */}
                    <div className="hidden md:block overflow-x-auto max-h-[500px] overflow-y-auto">
                        <table className="w-full">
                            <thead className="sticky top-0 bg-card-bg z-10">
                                <tr className="border-b border-card-border">
                                    <th className="text-left text-xs font-black text-foreground/40 uppercase tracking-wider pb-3">Producto</th>
                                    <th className="text-left text-xs font-black text-foreground/40 uppercase tracking-wider pb-3">Precio</th>
                                    <th className="text-left text-xs font-black text-foreground/40 uppercase tracking-wider pb-3">Costo</th>
                                    <th className="text-left text-xs font-black text-foreground/40 uppercase tracking-wider pb-3">Margen</th>
                                    <th className="text-left text-xs font-black text-foreground/40 uppercase tracking-wider pb-3">Stock</th>
                                    <th className="text-left text-xs font-black text-foreground/40 uppercase tracking-wider pb-3">Estado</th>
                                    <th className="text-left text-xs font-black text-foreground/40 uppercase tracking-wider pb-3">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.map(producto => (
                                    <tr key={producto.id} className="border-b border-card-border hover:bg-background transition-colors">
                                        <td className="py-4 pr-3">
                                            <p className="text-sm font-semibold text-foreground">{producto.nombre}</p>
                                            <p className="text-xs text-foreground/50">{producto.marca} · {producto.almacenamiento ? `${producto.almacenamiento}GB` : producto.categoria}</p>
                                        </td>
                                        <td className="py-4 pr-3 text-sm font-bold text-foreground tabular-nums">${producto.precio.toLocaleString("es-AR")}</td>
                                        <td className="py-4 pr-3 text-sm text-foreground/60 tabular-nums">{producto.costoProducto ? `$${producto.costoProducto.toLocaleString("es-AR")}` : "—"}</td>
                                        <td className="py-4 pr-3">
                                            {producto.costoProducto && producto.precio > producto.costoProducto ? (
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-primary tabular-nums">
                                                        +${(producto.precio - producto.costoProducto).toLocaleString("es-AR")}
                                                    </span>
                                                    <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded w-max mt-0.5 tabular-nums">
                                                        {(((producto.precio - producto.costoProducto) / producto.costoProducto) * 100).toFixed(1)}%
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-foreground/40">N/A</span>
                                            )}
                                        </td>
                                        <td className="py-4 pr-3">
                                            <span className={`text-sm font-bold tabular-nums ${producto.stock < 5 ? "text-red-500" : "text-foreground"}`}>{producto.stock}</span>
                                        </td>
                                        <td className="py-4 pr-3">
                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${producto.activo ? "bg-primary/10 text-primary" : "bg-red-500/10 text-red-500"}`}>
                                                {producto.activo ? "Activo" : "Inactivo"}
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            <Link href={`/dashboard/productos/${producto.id}`} className="text-sm text-primary hover:underline font-bold">Editar</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Órdenes recientes */}
                <div className="bg-card-bg rounded-2xl border border-card-border p-4 sm:p-6 mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">
                        <h2 className="font-display font-black text-foreground text-lg sm:text-xl">Órdenes recientes</h2>
                        <button onClick={exportarOrdenesCSV}
                            className="inline-flex items-center justify-center gap-1.5 bg-background border border-card-border text-foreground text-xs sm:text-sm font-bold px-3 sm:px-4 py-2.5 rounded-xl hover:border-primary/40 hover:text-primary transition-colors min-h-[44px]">
                            <Download size={14} /> Exportar CSV
                        </button>
                    </div>

                    {/* Mobile: cards */}
                    <div className="md:hidden flex flex-col gap-2.5">
                        {ordenesAMostrar.length === 0 ? (
                            <p className="text-center text-foreground/40 py-8 text-sm">No hay órdenes todavía</p>
                        ) : (
                            ordenesAMostrar.map(orden => (
                                <div key={orden.id} className="bg-background border border-card-border rounded-xl p-4">
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-display font-black text-foreground text-base">#{orden.id}</p>
                                            <p className="text-xs text-foreground/60 mt-0.5">{orden.usuario?.nombre || "Venta en tienda"}</p>
                                            <p className="text-[11px] text-foreground/40 mt-0.5">{new Date(orden.fechaCreacion).toLocaleDateString("es-AR")}</p>
                                        </div>
                                        <span className="font-display font-black text-foreground text-base tabular-nums flex-shrink-0">${orden.total.toLocaleString("es-AR")}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${coloresEstado[orden.estado]}`}>
                                            {orden.estado}
                                        </span>
                                        <select
                                            value={orden.estado}
                                            onChange={(e) => cambiarEstado(orden.id, e.target.value)}
                                            className="ml-auto text-xs font-semibold border border-card-border bg-background rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-primary min-h-[36px] text-foreground"
                                            aria-label={`Cambiar estado de orden ${orden.id}`}
                                        >
                                            <option value="PENDIENTE">PENDIENTE</option>
                                            <option value="PAGADO">PAGADO</option>
                                            <option value="PREPARANDO">PREPARANDO</option>
                                            <option value="ENVIADO">ENVIADO</option>
                                            <option value="ENTREGADO">ENTREGADO</option>
                                            <option value="CANCELADO">CANCELADO</option>
                                        </select>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Desktop: tabla */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-card-border">
                                    <th className="text-left text-xs font-black text-foreground/40 uppercase tracking-wider pb-3">#</th>
                                    <th className="text-left text-xs font-black text-foreground/40 uppercase tracking-wider pb-3">Cliente</th>
                                    <th className="text-left text-xs font-black text-foreground/40 uppercase tracking-wider pb-3">Total</th>
                                    <th className="text-left text-xs font-black text-foreground/40 uppercase tracking-wider pb-3">Estado</th>
                                    <th className="text-left text-xs font-black text-foreground/40 uppercase tracking-wider pb-3">Fecha</th>
                                    <th className="text-left text-xs font-black text-foreground/40 uppercase tracking-wider pb-3">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ordenesAMostrar.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center text-foreground/40 py-8">No hay órdenes todavía</td>
                                    </tr>
                                ) : (
                                    ordenesAMostrar.map(orden => (
                                        <tr key={orden.id} className="border-b border-card-border hover:bg-background transition-colors">
                                            <td className="py-4 pr-3 text-sm font-bold text-foreground tabular-nums">#{orden.id}</td>
                                            <td className="py-4 pr-3 text-sm text-foreground/70">{orden.usuario?.nombre || "Venta en tienda"}</td>
                                            <td className="py-4 pr-3 text-sm font-bold text-foreground tabular-nums">${orden.total.toLocaleString("es-AR")}</td>
                                            <td className="py-4 pr-3">
                                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${coloresEstado[orden.estado]}`}>
                                                    {orden.estado}
                                                </span>
                                            </td>
                                            <td className="py-4 pr-3 text-sm text-foreground/50">{new Date(orden.fechaCreacion).toLocaleDateString("es-AR")}</td>
                                            <td className="py-4">
                                                <select
                                                    value={orden.estado}
                                                    onChange={(e) => cambiarEstado(orden.id, e.target.value)}
                                                    className="text-sm font-semibold border border-card-border bg-background rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary text-foreground"
                                                >
                                                    <option value="PENDIENTE">PENDIENTE</option>
                                                    <option value="PAGADO">PAGADO</option>
                                                    <option value="PREPARANDO">PREPARANDO</option>
                                                    <option value="ENVIADO">ENVIADO</option>
                                                    <option value="ENTREGADO">ENTREGADO</option>
                                                    <option value="CANCELADO">CANCELADO</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {ordenes.length > 5 && (
                        <div className="mt-5 text-center">
                            <button
                                onClick={() => setMostrarMasOrdenes(!mostrarMasOrdenes)}
                                className="inline-flex items-center gap-1.5 text-primary font-bold text-sm hover:underline px-4 py-2 rounded-lg hover:bg-primary/5 transition-colors min-h-[40px]"
                            >
                                {mostrarMasOrdenes ? "Ver menos" : `Ver todas (${ordenes.length})`}
                                <ArrowRight size={14} className={`transition-transform ${mostrarMasOrdenes ? "rotate-180" : ""}`} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
