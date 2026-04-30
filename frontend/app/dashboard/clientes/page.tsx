"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { adminApi } from "@/lib/api";
import Link from "next/link";
import { Users, ArrowLeft, Search } from "lucide-react";

interface ClienteResumen {
    id: number;
    nombre: string;
    email: string;
    fechaCreacion: string | null;
    totalOrdenes: number;
    totalGastado: number;
}

export default function ClientesPage() {
    const [clientes, setClientes] = useState<ClienteResumen[]>([]);
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const { isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAdmin) {
            router.push("/");
            return;
        }
        adminApi.clientes()
            .then(res => setClientes(res.data || []))
            .finally(() => setCargando(false));
    }, [isAdmin, router]);

    const clientesFiltrados = clientes.filter(c =>
        c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.email.toLowerCase().includes(busqueda.toLowerCase())
    );

    const formatFecha = (fecha: string | null) => {
        if (!fecha) return "—";
        return new Date(fecha).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
                            <ArrowLeft size={20} className="text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <Users size={24} className="text-purple-600" />
                                Clientes
                            </h1>
                            <p className="text-gray-500 text-sm mt-0.5">{clientes.length} clientes registrados</p>
                        </div>
                    </div>
                </div>

                {/* Buscador */}
                <div className="relative mb-6">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o email..."
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    {cargando ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent" />
                        </div>
                    ) : clientesFiltrados.length === 0 ? (
                        <div className="text-center py-20 text-gray-400">
                            <Users size={40} className="mx-auto mb-3 opacity-30" />
                            <p>{busqueda ? "Sin resultados para tu búsqueda" : "No hay clientes registrados aún"}</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50">
                                        <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Cliente</th>
                                        <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Registrado</th>
                                        <th className="text-right py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Órdenes</th>
                                        <th className="text-right py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Total gastado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {clientesFiltrados.map(cliente => (
                                        <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                                        <span className="text-purple-700 font-bold text-sm">
                                                            {cliente.nombre.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <span className="font-medium text-gray-900">{cliente.nombre}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-500">{cliente.email}</td>
                                            <td className="py-4 px-6 text-sm text-gray-500">{formatFecha(cliente.fechaCreacion)}</td>
                                            <td className="py-4 px-6 text-right">
                                                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                                                    cliente.totalOrdenes > 0 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-400"
                                                }`}>
                                                    {cliente.totalOrdenes}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right font-bold text-gray-900">
                                                {cliente.totalGastado > 0
                                                    ? `$${Number(cliente.totalGastado).toLocaleString("es-AR")}`
                                                    : <span className="text-gray-300 font-normal">—</span>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
