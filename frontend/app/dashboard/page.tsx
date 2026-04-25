"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ordenesApi, productosApi } from "@/lib/api";
import { Orden, Producto } from "@/types";
import { Package, ShoppingBag, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
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

        Promise.all([
            ordenesApi.todas(),
            productosApi.getAll()
        ]).then(([ordenesRes, productosRes]) => {
            // Ordenar órdenes por fecha (las más nuevas primero)
            const ordenesOrdenadas = (ordenesRes.data || []).sort((a: Orden, b: Orden) => {
                const dateA = a.fechaCreacion ? new Date(a.fechaCreacion).getTime() : 0;
                const dateB = b.fechaCreacion ? new Date(b.fechaCreacion).getTime() : 0;
                return dateB - dateA;
            });
            setOrdenes(ordenesOrdenadas);
            setProductos(productosRes.data || []);
        }).finally(() => setCargando(false));
    }, [router, isAdmin]);

    const totalVentas = ordenes
        .filter(o => o.estado !== "CANCELADO")
        .reduce((acc, o) => acc + (o.total || 0), 0);

    const gananciaNeta = useMemo(() => {
        let ganancia = 0;
        // Solo sumamos ganancia de lo que ya se cobró/entregó
        const ordenesCobradas = ordenes.filter(o => o.estado !== "CANCELADO" && o.estado !== "PENDIENTE");
        
        ordenesCobradas.forEach(o => {
            if (o.items && Array.isArray(o.items)) {
                o.items.forEach(item => {
                    const productoOriginal = productos.find(p => p.id === item.productoId);
                    // Si el producto fue borrado o no tiene costo, asumimos costo 0 o no lo sumamos.
                    // Para ser conservadores, si no hay costo, sumamos la venta completa (o podrías decidir sumar 0).
                    const costo = productoOriginal?.costoProducto || 0; 
                    ganancia += (item.precioUnitario - costo) * item.cantidad;
                });
            }
        });
        return ganancia;
    }, [ordenes, productos]);

    const ordenesHoy = ordenes.filter(o => {
        if (!o.fechaCreacion) return false;
        const hoy = new Date().toDateString();
        return new Date(o.fechaCreacion).toDateString() === hoy;
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
        PENDIENTE: "bg-yellow-100 text-yellow-700",
        PAGADO: "bg-blue-100 text-blue-700",
        PREPARANDO: "bg-purple-100 text-purple-700",
        ENVIADO: "bg-indigo-100 text-indigo-700",
        ENTREGADO: "bg-green-100 text-green-700",
        CANCELADO: "bg-red-100 text-red-700",
    };

    const ordenesAMostrar = mostrarMasOrdenes ? ordenes : ordenes.slice(0, 5);

    // --- ANALÍTICAS (Fase 3) ---
    const ordenesSaldadas = ordenes.filter(o => o.estado !== "CANCELADO" && o.estado !== "PENDIENTE");

    // 1. Ventas del mes actual (día por día)
    const ventasMesActual = useMemo(() => {
        const hoy = new Date();
        const diasDelMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();
        const datos = Array.from({ length: diasDelMes }, (_, i) => ({ dia: i + 1, total: 0 }));

        ordenesSaldadas.forEach(o => {
            if (!o.fechaCreacion) return;
            const fecha = new Date(o.fechaCreacion);
            if (fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear()) {
                const diaIndex = fecha.getDate() - 1;
                if (diaIndex >= 0 && diaIndex < diasDelMes) {
                    datos[diaIndex].total += (o.total || 0);
                }
            }
        });
        return datos;
    }, [ordenesSaldadas]);

    // 2. Ventas históricas (mes a mes del año actual)
    const ventasPorMes = useMemo(() => {
        const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        const datos = meses.map(mes => ({ mes, total: 0 }));

        ordenesSaldadas.forEach(o => {
            if (!o.fechaCreacion) return;
            const fecha = new Date(o.fechaCreacion);
            if (fecha.getFullYear() === new Date().getFullYear()) {
                const mesIndex = fecha.getMonth();
                if (mesIndex >= 0 && mesIndex < 12) {
                    datos[mesIndex].total += (o.total || 0);
                }
            }
        });
        return datos;
    }, [ordenesSaldadas]);

    // 3. Productos más vendidos
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
        return Object.entries(contador)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([nombre, cantidad]) => ({ nombre, cantidad }));
    }, [ordenesSaldadas]);

    // Alertas de Stock
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
        
        const csvContent = [
            headers.join(","),
            ...rows.map(r => r.map(c => `"${c}"`).join(","))
        ].join("\n");
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `ordenes_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!isMounted || cargando) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-400">Cargando dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-500 mt-1">Panel de administración</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/dashboard/configuracion"
                            className="bg-gray-800 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-900 transition-colors text-sm flex items-center gap-2">
                            ⚙️ Configuración
                        </Link>
                        <Link href="/dashboard/ventas"
                            className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-green-700 transition-colors text-sm flex items-center gap-2">
                            + Venta física
                        </Link>
                        <Link href="/dashboard/reportes"
                            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors text-sm flex items-center gap-2">
                            📊 Reportes
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-gray-500">Facturación Total</p>
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <DollarSign className="text-green-600" size={16} />
                            </div>
                        </div>
                        <p className="text-xl font-bold text-gray-900">
                            ${totalVentas.toLocaleString("es-AR")}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-blue-200 bg-blue-50/50 p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-semibold text-blue-700">Ganancia Neta</p>
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                                <TrendingUp className="text-white" size={16} />
                            </div>
                        </div>
                        <p className="text-xl font-bold text-blue-900">
                            ${gananciaNeta.toLocaleString("es-AR")}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-gray-500">Total órdenes</p>
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <ShoppingBag className="text-blue-600" size={16} />
                            </div>
                        </div>
                        <p className="text-xl font-bold text-gray-900">{ordenes.length}</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-gray-500">Órdenes hoy</p>
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="text-purple-600" size={16} />
                            </div>
                        </div>
                        <p className="text-xl font-bold text-gray-900">{ordenesHoy}</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-gray-500">Productos activos</p>
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Package className="text-orange-600" size={16} />
                            </div>
                        </div>
                        <p className="text-xl font-bold text-gray-900">
                            {productos.filter(p => p.activo).length}
                        </p>
                    </div>
                </div>

                {/* Alertas de Stock Crítico */}
                {(productosStockBajo.length > 0 || productosSinStock.length > 0) && (
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-10 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="text-red-600" size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-red-900 font-bold text-lg mb-1">¡Atención! Tienes productos sin stock o por agotarse</h3>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {productosSinStock.map(p => (
                                    <span key={p.id} className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                                        AGOTADO: {p.nombre}
                                    </span>
                                ))}
                                {productosStockBajo.map(p => (
                                    <span key={p.id} className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                                        Quedan {p.stock}: {p.nombre}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Gráficos y Analíticas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                    
                    {/* Ventas del mes actual */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-6 text-lg">Ventas de este mes</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={ventasMesActual} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="dia" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} tickFormatter={(value) => `$${value/1000}k`} />
                                    <RechartsTooltip 
                                        formatter={(value: any) => [`$${Number(value).toLocaleString("es-AR")}`, "Ventas"]}
                                        labelFormatter={(label) => `Día ${label}`}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Ventas históricas */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-6 text-lg">Histórico Mensual ({new Date().getFullYear()})</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={ventasPorMes} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} tickFormatter={(value) => `$${value/1000}k`} />
                                    <RechartsTooltip 
                                        cursor={{fill: '#f3f4f6'}}
                                        formatter={(value: any) => [`$${Number(value).toLocaleString("es-AR")}`, "Ventas"]}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="total" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Top Productos (Mini ranking) */}
                {topProductos.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-10 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 text-lg">Top 5 Productos Más Vendidos</h3>
                        <div className="flex flex-col gap-3">
                            {topProductos.map((p, index) => (
                                <div key={p.nombre} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-yellow-100 text-yellow-700' : index === 1 ? 'bg-gray-200 text-gray-700' : index === 2 ? 'bg-orange-100 text-orange-800' : 'bg-blue-50 text-blue-600'}`}>
                                            #{index + 1}
                                        </div>
                                        <span className="font-medium text-gray-900">{p.nombre}</span>
                                    </div>
                                    <span className="font-bold text-gray-600">{p.cantidad} vendidos</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Productos */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-bold text-gray-900 text-xl">Productos</h2>

                        <div className="flex gap-2">
                            <Link
                                href="/dashboard/productos/nuevo-celular"
                                className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
                            >
                                + Agregar celular
                            </Link>
                            <Link
                                href="/dashboard/productos/nuevo-accesorio"
                                className="bg-blue-100 text-blue-700 text-sm font-medium px-4 py-2 rounded-xl hover:bg-blue-200 transition-colors"
                            >
                                + Agregar accesorio
                            </Link>
                        </div>
                    </div>
                    <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                        <table className="w-full">
                            <thead className="sticky top-0 bg-white z-10">
                                <tr className="border-b border-gray-100 bg-white">
                                    <th className="text-left text-sm font-medium text-gray-500 pb-3">Producto</th>
                                    <th className="text-left text-sm font-medium text-gray-500 pb-3">Precio</th>
                                    <th className="text-left text-sm font-medium text-gray-500 pb-3">Costo</th>
                                    <th className="text-left text-sm font-medium text-gray-500 pb-3">Margen</th>
                                    <th className="text-left text-sm font-medium text-gray-500 pb-3">Stock</th>
                                    <th className="text-left text-sm font-medium text-gray-500 pb-3">Estado</th>
                                    <th className="text-left text-sm font-medium text-gray-500 pb-3">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.map(producto => (
                                    <tr key={producto.id} className="border-b border-gray-50 hover:bg-gray-50">
                                        <td className="py-4">
                                            <p className="text-sm font-medium text-gray-900">{producto.nombre}</p>
                                            <p className="text-xs text-gray-400">{producto.marca} · {producto.almacenamiento ? `${producto.almacenamiento}GB` : producto.categoria}</p>
                                        </td>
                                        <td className="py-4 text-sm font-semibold text-gray-900">
                                            ${producto.precio.toLocaleString("es-AR")}
                                        </td>
                                        <td className="py-4 text-sm text-gray-500">
                                            {producto.costoProducto ? `$${producto.costoProducto.toLocaleString("es-AR")}` : "—"}
                                        </td>
                                        <td className="py-4">
                                            {producto.costoProducto && producto.precio > producto.costoProducto ? (
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-green-600">
                                                        +${(producto.precio - producto.costoProducto).toLocaleString("es-AR")}
                                                    </span>
                                                    <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded w-max mt-1">
                                                        {(((producto.precio - producto.costoProducto) / producto.costoProducto) * 100).toFixed(1)}%
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400">N/A</span>
                                            )}
                                        </td>
                                        <td className="py-4">
                                            <span className={`text-sm font-medium ${producto.stock < 5 ? "text-red-500" : "text-gray-900"}`}>
                                                {producto.stock} unidades
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            <span className={`text-xs font-medium px-3 py-1 rounded-full ${producto.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                {producto.activo ? "Activo" : "Inactivo"}
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            <Link
                                                href={`/dashboard/productos/${producto.id}`}
                                                className="text-sm text-blue-600 hover:underline font-medium"
                                            >
                                                Editar
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Órdenes recientes */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-bold text-gray-900 text-xl">Órdenes recientes</h2>
                        <button 
                            onClick={exportarOrdenesCSV} 
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                        >
                            ⬇ Exportar CSV
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left text-sm font-medium text-gray-500 pb-3">#</th>
                                    <th className="text-left text-sm font-medium text-gray-500 pb-3">Cliente</th>
                                    <th className="text-left text-sm font-medium text-gray-500 pb-3">Total</th>
                                    <th className="text-left text-sm font-medium text-gray-500 pb-3">Estado</th>
                                    <th className="text-left text-sm font-medium text-gray-500 pb-3">Fecha</th>
                                    <th className="text-left text-sm font-medium text-gray-500 pb-3">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ordenesAMostrar.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center text-gray-400 py-8">
                                            No hay órdenes todavía
                                        </td>
                                    </tr>
                                ) : (
                                    ordenesAMostrar.map(orden => (
                                        <tr key={orden.id} className="border-b border-gray-50 hover:bg-gray-50">
                                            <td className="py-4 text-sm font-medium text-gray-900">#{orden.id}</td>
                                            <td className="py-4 text-sm text-gray-600">{orden.usuario?.nombre || "Venta en tienda"}</td>
                                            <td className="py-4 text-sm font-semibold text-gray-900">
                                                ${orden.total.toLocaleString("es-AR")}
                                            </td>
                                            <td className="py-4">
                                                <span className={`text-xs font-medium px-3 py-1 rounded-full ${coloresEstado[orden.estado]}`}>
                                                    {orden.estado}
                                                </span>
                                            </td>
                                            <td className="py-4 text-sm text-gray-500">
                                                {new Date(orden.fechaCreacion).toLocaleDateString("es-AR")}
                                            </td>
                                            <td className="py-4">
                                                <select
                                                    value={orden.estado}
                                                    onChange={(e) => cambiarEstado(orden.id, e.target.value)}
                                                    className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        
                        {ordenes.length > 5 && (
                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => setMostrarMasOrdenes(!mostrarMasOrdenes)}
                                    className="text-blue-600 font-medium text-sm hover:underline px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                                >
                                    {mostrarMasOrdenes ? "Ver menos órdenes" : `Ver todas las órdenes (${ordenes.length})`}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}