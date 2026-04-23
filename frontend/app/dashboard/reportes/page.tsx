"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { reportesApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Package, AlertTriangle, DollarSign, TrendingUp, BarChart3, ShoppingBag } from "lucide-react";
import Link from "next/link";

interface Resumen {
    totalOrdenes: number;
    ordenesPagadas: number;
    ingresoTotal: number;
    productosActivos: number;
    productosStockBajo: number;
}

interface StockBajo {
    id: number;
    nombre: string;
    marca: string;
    stock: number;
    precio: number;
}

export default function ReportesPage() {
    const [resumen, setResumen] = useState<Resumen | null>(null);
    const [stockBajo, setStockBajo] = useState<StockBajo[]>([]);
    const [ventasPorEstado, setVentasPorEstado] = useState<Record<string, number>>({});
    const [cargando, setCargando] = useState(true);
    const { isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAdmin) {
            router.push("/");
            return;
        }

        Promise.all([
            reportesApi.resumen(),
            reportesApi.stockBajo(),
            reportesApi.ventasPorEstado(),
        ]).then(([resumenRes, stockRes, ventasRes]) => {
            setResumen(resumenRes.data);
            setStockBajo(stockRes.data);
            setVentasPorEstado(ventasRes.data);
        }).finally(() => setCargando(false));
    }, [isAdmin, router]);

    if (cargando) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-400">Cargando reportes...</p>
            </div>
        );
    }

    const coloresEstado: Record<string, string> = {
        PENDIENTE: "bg-yellow-100 text-yellow-700",
        PAGADO: "bg-blue-100 text-blue-700",
        PREPARANDO: "bg-purple-100 text-purple-700",
        ENVIADO: "bg-indigo-100 text-indigo-700",
        ENTREGADO: "bg-green-100 text-green-700",
        CANCELADO: "bg-red-100 text-red-700",
    };

    const totalVentas = Object.values(ventasPorEstado).reduce((a, b) => a + b, 0);

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard" className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
                        <p className="text-sm text-gray-400">Resumen de tu negocio</p>
                    </div>
                </div>

                {/* KPIs */}
                {resumen && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-2xl border border-gray-100 p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                    <DollarSign className="text-blue-600" size={20} />
                                </div>
                                <span className="text-sm text-gray-500">Ingresos</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">${resumen.ingresoTotal.toLocaleString("es-AR")}</p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                                    <ShoppingBag className="text-green-600" size={20} />
                                </div>
                                <span className="text-sm text-gray-500">Órdenes</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{resumen.totalOrdenes}</p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                                    <Package className="text-purple-600" size={20} />
                                </div>
                                <span className="text-sm text-gray-500">Productos</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{resumen.productosActivos}</p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                                    <AlertTriangle className="text-red-600" size={20} />
                                </div>
                                <span className="text-sm text-gray-500">Stock bajo</span>
                            </div>
                            <p className="text-2xl font-bold text-red-600">{resumen.productosStockBajo}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Ventas por estado */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <BarChart3 className="text-blue-600" size={20} />
                            <h2 className="font-bold text-gray-900">Ventas por estado</h2>
                        </div>
                        {Object.entries(ventasPorEstado).length > 0 ? (
                            <div className="flex flex-col gap-3">
                                {Object.entries(ventasPorEstado).map(([estado, cantidad]) => (
                                    <div key={estado} className="flex items-center gap-3">
                                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${coloresEstado[estado] || "bg-gray-100 text-gray-700"}`}>
                                            {estado}
                                        </span>
                                        <div className="flex-1 bg-gray-100 rounded-full h-3">
                                            <div
                                                className="bg-blue-600 h-3 rounded-full transition-all"
                                                style={{ width: `${(cantidad / totalVentas) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-bold text-gray-900 w-8 text-right">{cantidad}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm">No hay datos de ventas</p>
                        )}
                    </div>

                    {/* Stock bajo */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <AlertTriangle className="text-red-500" size={20} />
                            <h2 className="font-bold text-gray-900">Productos con stock bajo</h2>
                        </div>
                        {stockBajo.length > 0 ? (
                            <div className="flex flex-col gap-3">
                                {stockBajo.map(p => (
                                    <Link
                                        key={p.id}
                                        href={`/dashboard/productos/${p.id}`}
                                        className="flex items-center justify-between bg-red-50 rounded-xl px-4 py-3 hover:bg-red-100 transition-colors"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900">{p.nombre}</p>
                                            <p className="text-xs text-gray-500">{p.marca}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-bold ${p.stock === 0 ? "text-red-600" : "text-orange-600"}`}>
                                                {p.stock === 0 ? "SIN STOCK" : `${p.stock} unid.`}
                                            </p>
                                            <p className="text-xs text-gray-400">${p.precio.toLocaleString("es-AR")}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <TrendingUp className="mx-auto text-green-300 mb-3" size={40} />
                                <p className="text-gray-400 text-sm">Todo el stock está bien 👍</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
