"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ordenesApi, productosApi } from "../../lib/api";
import { Orden, Producto } from "../../types";
import { Package, ShoppingBag, DollarSign, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    const [ordenes, setOrdenes] = useState<Orden[]>([]);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [cargando, setCargando] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
        if (usuario.rol !== "ADMIN") {
            router.push("/");
            return;
        }

        Promise.all([
            ordenesApi.todas(),
            productosApi.getAll()
        ]).then(([ordenesRes, productosRes]) => {
            setOrdenes(ordenesRes.data);
            setProductos(productosRes.data);
        }).finally(() => setCargando(false));
    }, [router]);

    const totalVentas = ordenes
        .filter(o => o.estado !== "CANCELADO")
        .reduce((acc, o) => acc + o.total, 0);

    const ordenesHoy = ordenes.filter(o => {
        const hoy = new Date().toDateString();
        return new Date(o.fechaCreacion).toDateString() === hoy;
    }).length;

    const cambiarEstado = async (id: number, estado: string) => {
        try {
            await ordenesApi.actualizarEstado(id, estado);
            setOrdenes(ordenes.map(o => o.id === id ? { ...o, estado } : o));
        } catch {
            alert("Error al actualizar el estado");
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

    if (cargando) {
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
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Panel de administración</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-gray-500">Total ventas</p>
                            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                <DollarSign className="text-green-600" size={20} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            ${totalVentas.toLocaleString("es-AR")}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-gray-500">Total órdenes</p>
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                <ShoppingBag className="text-blue-600" size={20} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{ordenes.length}</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-gray-500">Órdenes hoy</p>
                            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                <TrendingUp className="text-purple-600" size={20} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{ordenesHoy}</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-gray-500">Productos activos</p>
                            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                                <Package className="text-orange-600" size={20} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {productos.filter(p => p.activo).length}
                        </p>
                    </div>
                </div>

                {/* Órdenes recientes */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
                    <h2 className="font-bold text-gray-900 text-xl mb-6">Órdenes recientes</h2>
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
                                {ordenes.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center text-gray-400 py-8">
                                            No hay órdenes todavía
                                        </td>
                                    </tr>
                                ) : (
                                    ordenes.map(orden => (
                                        <tr key={orden.id} className="border-b border-gray-50 hover:bg-gray-50">
                                            <td className="py-4 text-sm font-medium text-gray-900">#{orden.id}</td>
                                            <td className="py-4 text-sm text-gray-600">{orden.usuario.nombre}</td>
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
                    </div>
                </div>

                {/* Productos */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-bold text-gray-900 text-xl">Productos</h2>

                        <Link
                            href="/dashboard/productos/nuevo"
                            className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            + Agregar producto
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left text-sm font-medium text-gray-500 pb-3">Producto</th>
                                    <th className="text-left text-sm font-medium text-gray-500 pb-3">Precio</th>
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
                                            <p className="text-xs text-gray-400">{producto.marca} · {producto.almacenamiento}GB</p>
                                        </td>
                                        <td className="py-4 text-sm font-semibold text-gray-900">
                                            ${producto.precio.toLocaleString("es-AR")}
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

            </div>
        </div>
    );
}