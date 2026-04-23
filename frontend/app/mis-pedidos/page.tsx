"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ordenesApi } from "@/lib/api";
import { Orden } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Package, Clock, Truck, CheckCircle, XCircle, CreditCard } from "lucide-react";

export default function MisPedidosPage() {
    const [ordenes, setOrdenes] = useState<Orden[]>([]);
    const [cargando, setCargando] = useState(true);
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
        PENDIENTE: <Clock size={16} className="text-yellow-500" />,
        PAGADO: <CreditCard size={16} className="text-blue-500" />,
        PREPARANDO: <Package size={16} className="text-purple-500" />,
        ENVIADO: <Truck size={16} className="text-indigo-500" />,
        ENTREGADO: <CheckCircle size={16} className="text-green-500" />,
        CANCELADO: <XCircle size={16} className="text-red-500" />,
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
                <p className="text-gray-400">Cargando pedidos...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Mis pedidos</h1>

                {ordenes.length === 0 ? (
                    <div className="text-center py-20">
                        <Package className="mx-auto text-gray-300 mb-4" size={64} />
                        <h2 className="text-xl font-bold text-gray-700 mb-2">No tenés pedidos</h2>
                        <p className="text-gray-400">Cuando hagas una compra, tus pedidos aparecerán acá.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {ordenes.map(orden => (
                            <div key={orden.id} className="bg-white rounded-2xl border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-gray-900">Pedido #{orden.id}</span>
                                        <span className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${coloresEstado[orden.estado]}`}>
                                            {iconoEstado[orden.estado]}
                                            {orden.estado}
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-400">
                                        {new Date(orden.fechaCreacion).toLocaleDateString("es-AR", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-2 mb-4">
                                    {orden.items.map(item => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span className="text-gray-600">
                                                {item.productoNombre} <span className="text-gray-400">x{item.cantidad}</span>
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                ${item.subtotal.toLocaleString("es-AR")}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                                    <span className="text-xs text-gray-400">
                                        Envío: {orden.direccionEnvio}, {orden.ciudadEnvio}, {orden.provinciaEnvio}
                                    </span>
                                    <span className="font-bold text-gray-900">
                                        Total: ${orden.total.toLocaleString("es-AR")}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
