"use client";

import { Trash2, ShoppingCart, ArrowLeft, Smartphone } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CarritoPage() {
    const { items, total, eliminar, cambiarCantidad } = useCart();
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    const irACheckout = () => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
        router.push("/checkout");
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <ShoppingCart className="mx-auto text-gray-300 mb-4" size={64} />
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">Tu carrito está vacío</h2>
                    <p className="text-gray-400 mb-8">Agregá productos para continuar</p>
                    <Link
                        href="/productos"
                        className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors"
                    >
                        Ver productos
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/productos" className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Tu carrito</h1>
                    <span className="text-gray-400">({items.length} productos)</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Lista de items */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        {items.map(item => (
                            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-4">
                                <div className="w-20 h-20 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                                    {item.imagenes && item.imagenes.length > 0 ? (
                                        <img src={item.imagenes[0]} alt={item.nombre} className="w-16 h-16 object-contain" />
                                    ) : (
                                        <Smartphone className="text-blue-300" size={28} />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <p className="text-xs text-blue-600 font-medium">{item.marca}</p>
                                    <h3 className="font-semibold text-gray-900">{item.nombre}</h3>
                                    <p className="text-sm text-gray-500">
                                        {item.ram && `${item.ram}GB RAM`}
                                        {item.almacenamiento && ` · ${item.almacenamiento}GB`}
                                    </p>

                                    <div className="flex items-center justify-between mt-3">
                                        <p className="font-bold text-gray-900">
                                            ${(item.precio * item.cantidad).toLocaleString("es-AR")}
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                                                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 font-bold"
                                            >
                                                -
                                            </button>
                                            <span className="w-6 text-center font-medium">{item.cantidad}</span>
                                            <button
                                                onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
                                                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 font-bold"
                                            >
                                                +
                                            </button>
                                            <button
                                                onClick={() => eliminar(item.id)}
                                                className="ml-2 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Resumen */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
                            <h2 className="font-bold text-gray-900 text-lg mb-4">Resumen</h2>

                            <div className="flex flex-col gap-3 mb-6">
                                {items.map(item => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span className="text-gray-500">{item.nombre} x{item.cantidad}</span>
                                        <span className="font-medium">${(item.precio * item.cantidad).toLocaleString("es-AR")}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 pt-4 mb-6">
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>${total.toLocaleString("es-AR")}</span>
                                </div>
                            </div>

                            <button
                                onClick={irACheckout}
                                className="w-full bg-blue-600 text-white font-semibold py-4 rounded-xl hover:bg-blue-700 transition-colors"
                            >
                                Finalizar compra
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}