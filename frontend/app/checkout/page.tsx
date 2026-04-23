"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ordenesApi } from "@/lib/api";
import { Smartphone } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function CheckoutPage() {
    const { items, total, vaciar } = useCart();
    const { isAuthenticated } = useAuth();
    const { showToast } = useToast();
    const [cargando, setCargando] = useState(false);
    const [form, setForm] = useState({
        direccionEnvio: "",
        ciudadEnvio: "",
        provinciaEnvio: "",
        telefonoContacto: "",
    });
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
        if (items.length === 0) {
            router.push("/carrito");
        }
    }, [isAuthenticated, items.length, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleComprar = async (e: React.FormEvent) => {
        e.preventDefault();
        setCargando(true);

        try {
            const ordenData = {
                ...form,
                items: items.map(item => ({
                    productoId: item.id,
                    cantidad: item.cantidad,
                })),
            };

            const ordenRes = await ordenesApi.crear(ordenData);
            const orden = ordenRes.data;

            // Generamos el pago con MP
            const pagoRes = await ordenesApi.pagar(orden.id);
            const { preferenceId } = pagoRes.data;

            // Limpiamos el carrito
            vaciar();

            // Redirigimos a MP
            window.location.href = `https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`;

        } catch {
            showToast("Error al procesar la compra. Intentá de nuevo.", "error");
        } finally {
            setCargando(false);
        }
    };

    if (items.length === 0) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Finalizar compra</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Formulario */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl border border-gray-100 p-6">
                            <h2 className="font-semibold text-gray-900 mb-5">Datos de envío</h2>
                            <form onSubmit={handleComprar} className="flex flex-col gap-4">

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700">Dirección</label>
                                    <input
                                        type="text"
                                        name="direccionEnvio"
                                        value={form.direccionEnvio}
                                        onChange={handleChange}
                                        placeholder="Av. Corrientes 1234"
                                        required
                                        className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-gray-700">Ciudad</label>
                                        <input
                                            type="text"
                                            name="ciudadEnvio"
                                            value={form.ciudadEnvio}
                                            onChange={handleChange}
                                            placeholder="Buenos Aires"
                                            required
                                            className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-gray-700">Provincia</label>
                                        <input
                                            type="text"
                                            name="provinciaEnvio"
                                            value={form.provinciaEnvio}
                                            onChange={handleChange}
                                            placeholder="CABA"
                                            required
                                            className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700">Teléfono</label>
                                    <input
                                        type="text"
                                        name="telefonoContacto"
                                        value={form.telefonoContacto}
                                        onChange={handleChange}
                                        placeholder="1123456789"
                                        required
                                        className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={cargando}
                                    className="mt-2 bg-blue-600 text-white font-semibold py-4 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 text-lg"
                                >
                                    {cargando ? "Procesando..." : "Pagar con Mercado Pago"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Resumen */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl border border-gray-100 p-6">
                            <h2 className="font-semibold text-gray-900 mb-4">Tu pedido</h2>
                            <div className="flex flex-col gap-3 mb-4">
                                {items.map(item => (
                                    <div key={item.id} className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                            {item.imagenes && item.imagenes.length > 0 ? (
                                                <img src={item.imagenes[0]} alt="" className="w-8 h-8 object-contain" />
                                            ) : (
                                                <Smartphone className="text-blue-300" size={16} />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{item.nombre}</p>
                                            <p className="text-xs text-gray-400">x{item.cantidad}</p>
                                        </div>
                                        <p className="text-sm font-semibold">
                                            ${(item.precio * item.cantidad).toLocaleString("es-AR")}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-100 pt-4">
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>${total.toLocaleString("es-AR")}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}