"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { productosApi, ventasFisicasApi } from "@/lib/api";
import { Producto } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Search, Plus, Minus, Trash2, ShoppingBag, ArrowLeft, Smartphone, CheckCircle } from "lucide-react";
import Link from "next/link";

interface ItemVenta {
    producto: Producto;
    cantidad: number;
}

export default function VentasFisicasPage() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [filtrados, setFiltrados] = useState<Producto[]>([]);
    const [busqueda, setBusqueda] = useState("");
    const [items, setItems] = useState<ItemVenta[]>([]);
    const [procesando, setProcesando] = useState(false);
    const [ventaExitosa, setVentaExitosa] = useState(false);
    const [nombreCliente, setNombreCliente] = useState("");
    const { isAdmin } = useAuth();
    const { showToast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (!isAdmin) {
            router.push("/");
            return;
        }
        productosApi.getAll().then(res => setProductos(res.data));
    }, [isAdmin, router]);

    useEffect(() => {
        if (busqueda.length > 0) {
            setFiltrados(productos.filter(p =>
                p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                p.marca.toLowerCase().includes(busqueda.toLowerCase()) ||
                p.modelo.toLowerCase().includes(busqueda.toLowerCase())
            ));
        } else {
            setFiltrados([]);
        }
    }, [busqueda, productos]);

    const agregarItem = (producto: Producto) => {
        const existente = items.find(i => i.producto.id === producto.id);
        if (existente) {
            if (existente.cantidad >= producto.stock) {
                showToast("Stock insuficiente", "warning");
                return;
            }
            setItems(items.map(i =>
                i.producto.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i
            ));
        } else {
            setItems([...items, { producto, cantidad: 1 }]);
        }
        setBusqueda("");
        setFiltrados([]);
    };

    const cambiarCantidad = (id: number, cantidad: number) => {
        if (cantidad < 1) return;
        setItems(items.map(i =>
            i.producto.id === id ? { ...i, cantidad } : i
        ));
    };

    const eliminarItem = (id: number) => {
        setItems(items.filter(i => i.producto.id !== id));
    };

    const total = items.reduce((acc, i) => acc + i.producto.precio * i.cantidad, 0);

    const registrarVenta = async () => {
        if (items.length === 0) return;
        setProcesando(true);
        try {
            await ventasFisicasApi.registrar({
                items: items.map(i => ({
                    productoId: i.producto.id,
                    cantidad: i.cantidad,
                })),
                nombreCliente: nombreCliente || undefined,
            });
            setVentaExitosa(true);
            setItems([]);
            setNombreCliente("");
            showToast("Venta registrada exitosamente", "success");

            const res = await productosApi.getAll();
            setProductos(res.data);

            setTimeout(() => setVentaExitosa(false), 3000);
        } catch {
            showToast("Error al registrar la venta", "error");
        } finally {
            setProcesando(false);
        }
    };

    return (
        <div className="min-h-screen bg-background py-10 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard" className="p-2 text-foreground hover:bg-card-bg rounded-lg transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Venta en tienda</h1>
                        <p className="text-sm text-foreground/40">Registrar venta física — descuenta stock automáticamente</p>
                    </div>
                </div>

                {ventaExitosa && (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6 flex items-center gap-4">
                        <CheckCircle className="text-green-500" size={32} />
                        <div>
                            <h3 className="font-semibold text-green-700">¡Venta registrada!</h3>
                            <p className="text-sm text-green-600">El stock se actualizó correctamente.</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Buscador + Productos */}
                    <div className="lg:col-span-2">
                        <div className="bg-card-bg rounded-2xl border border-card-border p-6">
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
                                <input
                                    type="text"
                                    placeholder="Buscar producto por nombre, marca o modelo..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-background border border-card-border rounded-xl text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>

                            {/* Resultados de búsqueda */}
                            {filtrados.length > 0 && (
                                <div className="border border-card-border rounded-xl overflow-hidden mb-4">
                                    {filtrados.slice(0, 6).map(p => (
                                        <button
                                            key={p.id}
                                            onClick={() => agregarItem(p)}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors text-left border-b border-card-border last:border-0"
                                        >
                                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                {p.imagenes && p.imagenes.length > 0 ? (
                                                    <img src={p.imagenes[0]} alt="" className="w-8 h-8 object-contain" />
                                                ) : (
                                                    <Smartphone className="text-primary/40" size={16} />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate">{p.nombre}</p>
                                                <p className="text-xs text-foreground/40">{p.marca} · Stock: {p.stock}</p>
                                            </div>
                                            <p className="font-semibold text-foreground flex-shrink-0">${p.precio.toLocaleString("es-AR")}</p>
                                            <Plus size={16} className="text-primary flex-shrink-0" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Items de la venta */}
                            {items.length > 0 ? (
                                <div className="flex flex-col gap-3">
                                    {items.map(item => (
                                        <div key={item.producto.id} className="flex items-center gap-3 bg-background rounded-xl p-4 border border-card-border">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-foreground truncate">{item.producto.nombre}</p>
                                                <p className="text-xs text-foreground/40">{item.producto.marca} · ${item.producto.precio.toLocaleString("es-AR")} c/u</p>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <button onClick={() => cambiarCantidad(item.producto.id, item.cantidad - 1)}
                                                    className="w-8 h-8 rounded-lg border border-card-border bg-card-bg flex items-center justify-center hover:bg-background hover:border-foreground/40 text-foreground transition-colors">
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-8 text-center font-bold text-foreground text-base">{item.cantidad}</span>
                                                <button onClick={() => cambiarCantidad(item.producto.id, item.cantidad + 1)}
                                                    className="w-8 h-8 rounded-lg border border-card-border bg-card-bg flex items-center justify-center hover:bg-background hover:border-foreground/40 text-foreground transition-colors">
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <p className="font-bold text-foreground w-24 text-right flex-shrink-0">
                                                ${(item.producto.precio * item.cantidad).toLocaleString("es-AR")}
                                            </p>
                                            <button onClick={() => eliminarItem(item.producto.id)}
                                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-500/10 rounded-lg transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-foreground/40">
                                    <ShoppingBag className="mx-auto mb-3" size={40} />
                                    <p>Buscá productos para agregar a la venta</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Resumen */}
                    <div>
                        <div className="bg-card-bg rounded-2xl border border-card-border p-6 sticky top-24">
                            <h2 className="font-bold text-foreground text-lg mb-4">Resumen de venta</h2>

                            <div className="flex flex-col gap-2 mb-4">
                                <label className="text-sm font-medium text-foreground/70">Nombre del cliente (opcional)</label>
                                <input
                                    type="text"
                                    value={nombreCliente}
                                    onChange={(e) => setNombreCliente(e.target.value)}
                                    placeholder="Cliente mostrador"
                                    className="bg-background border border-card-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>

                            <div className="flex flex-col gap-2 mb-4">
                                {items.map(i => (
                                    <div key={i.producto.id} className="flex justify-between text-sm gap-2">
                                        <span className="text-foreground/50 truncate">{i.producto.nombre} x{i.cantidad}</span>
                                        <span className="font-medium text-foreground flex-shrink-0">${(i.producto.precio * i.cantidad).toLocaleString("es-AR")}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-card-border pt-4 mb-6">
                                <div className="flex justify-between font-bold text-xl text-foreground">
                                    <span>Total</span>
                                    <span>${total.toLocaleString("es-AR")}</span>
                                </div>
                            </div>

                            <button
                                onClick={registrarVenta}
                                disabled={items.length === 0 || procesando}
                                className="w-full bg-green-600 text-white font-semibold py-4 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-lg"
                            >
                                {procesando ? "Registrando..." : "Registrar venta"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
