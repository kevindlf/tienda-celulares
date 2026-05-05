"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ordenesApi, cuponesApi } from "@/lib/api";
import { Smartphone, ArrowLeft, ShieldCheck, MapPin, Phone, Tag, X, CheckCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import Link from "next/link";

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

    const [codigoCupon, setCodigoCupon] = useState("");
    const [cuponAplicado, setCuponAplicado] = useState<{
        codigo: string; descuento: number; totalFinal: number;
    } | null>(null);
    const [cargandoCupon, setCargandoCupon] = useState(false);

    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) { router.push("/login"); return; }
        if (items.length === 0) router.push("/carrito");
    }, [isAuthenticated, items.length, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const aplicarCupon = async () => {
        if (!codigoCupon.trim()) return;
        setCargandoCupon(true);
        try {
            const res = await cuponesApi.validar(codigoCupon.trim(), total);
            const data = res.data;
            setCuponAplicado({
                codigo: data.codigo,
                descuento: data.descuento,
                totalFinal: data.totalFinal,
            });
            showToast(`¡Cupón aplicado! Ahorrás $${Number(data.descuento).toLocaleString("es-AR")}`, "success");
        } catch {
            showToast("Cupón no válido o vencido", "error");
            setCuponAplicado(null);
        } finally {
            setCargandoCupon(false);
        }
    };

    const quitarCupon = () => {
        setCuponAplicado(null);
        setCodigoCupon("");
    };

    const totalFinal = cuponAplicado ? cuponAplicado.totalFinal : total;

    const handleComprar = async (e: React.FormEvent) => {
        e.preventDefault();
        setCargando(true);
        try {
            const ordenData = {
                ...form,
                items: items.map(item => ({ productoId: item.id, cantidad: item.cantidad })),
                codigoCupon: cuponAplicado?.codigo || null,
            };
            const ordenRes = await ordenesApi.crear(ordenData);
            const orden = ordenRes.data;
            const pagoRes = await ordenesApi.pagar(orden.id);
            const { preferenceId } = pagoRes.data;
            vaciar();
            window.location.href = `https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`;
        } catch {
            showToast("Error al procesar la compra. Intentá de nuevo.", "error");
            setCargando(false);
        }
    };

    if (items.length === 0) return null;

    return (
        <div className="min-h-screen bg-background py-6 sm:py-10 lg:py-12 px-4 sm:px-6 overflow-x-hidden">
            <div className="max-w-5xl mx-auto">

                <Link href="/carrito" className="inline-flex items-center gap-2 text-foreground/50 hover:text-primary mb-5 sm:mb-8 font-semibold text-sm transition-colors min-h-[40px]">
                    <ArrowLeft size={16} /> Volver al carrito
                </Link>

                <div className="mb-6 sm:mb-10">
                    <p className="text-xs font-black text-primary/60 uppercase tracking-[0.25em] mb-1.5">Paso 2 de 2</p>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-foreground leading-tight">Finalizar compra</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-8">

                    {/* Formulario */}
                    <div className="lg:col-span-2">
                        <div className="bg-card-bg rounded-2xl sm:rounded-3xl border border-card-border p-5 sm:p-7 lg:p-8">
                            <h2 className="font-display font-black text-lg sm:text-xl text-foreground mb-5 sm:mb-6 flex items-center gap-2">
                                <MapPin size={20} className="text-primary" /> Datos de envío
                            </h2>
                            <form onSubmit={handleComprar} className="flex flex-col gap-4 sm:gap-5">

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="direccionEnvio" className="text-xs font-black text-foreground/60 uppercase tracking-wider">Dirección</label>
                                    <input
                                        id="direccionEnvio" type="text" name="direccionEnvio"
                                        autoComplete="street-address" value={form.direccionEnvio}
                                        onChange={handleChange} placeholder="Av. Corrientes 1234, Piso 3 Depto B"
                                        required
                                        className="border border-card-border rounded-xl px-4 py-3.5 text-base text-foreground bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all min-h-[52px]"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="ciudadEnvio" className="text-xs font-black text-foreground/60 uppercase tracking-wider">Ciudad</label>
                                        <input
                                            id="ciudadEnvio" type="text" name="ciudadEnvio"
                                            autoComplete="address-level2" value={form.ciudadEnvio}
                                            onChange={handleChange} placeholder="Mendoza" required
                                            className="border border-card-border rounded-xl px-4 py-3.5 text-base text-foreground bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all min-h-[52px]"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="provinciaEnvio" className="text-xs font-black text-foreground/60 uppercase tracking-wider">Provincia</label>
                                        <input
                                            id="provinciaEnvio" type="text" name="provinciaEnvio"
                                            autoComplete="address-level1" value={form.provinciaEnvio}
                                            onChange={handleChange} placeholder="Mendoza" required
                                            className="border border-card-border rounded-xl px-4 py-3.5 text-base text-foreground bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all min-h-[52px]"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="telefonoContacto" className="text-xs font-black text-foreground/60 uppercase tracking-wider flex items-center gap-1.5">
                                        <Phone size={12} /> Teléfono de contacto
                                    </label>
                                    <input
                                        id="telefonoContacto" type="tel" name="telefonoContacto"
                                        inputMode="tel" autoComplete="tel" value={form.telefonoContacto}
                                        onChange={handleChange} placeholder="2615551234" required
                                        className="border border-card-border rounded-xl px-4 py-3.5 text-base text-foreground bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all min-h-[52px]"
                                    />
                                </div>

                                {/* Cupón de descuento */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-black text-foreground/60 uppercase tracking-wider flex items-center gap-1.5">
                                        <Tag size={12} /> Cupón de descuento
                                    </label>
                                    {cuponAplicado ? (
                                        <div className="flex items-center justify-between bg-primary/10 border border-primary/30 rounded-xl px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle size={16} className="text-primary" />
                                                <span className="text-sm font-bold text-primary">{cuponAplicado.codigo}</span>
                                                <span className="text-xs text-foreground/60">
                                                    — Ahorrás ${Number(cuponAplicado.descuento).toLocaleString("es-AR")}
                                                </span>
                                            </div>
                                            <button type="button" onClick={quitarCupon} className="text-foreground/40 hover:text-red-500 transition-colors">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={codigoCupon}
                                                onChange={e => setCodigoCupon(e.target.value.toUpperCase())}
                                                placeholder="DESCUENTO10"
                                                className="flex-1 border border-card-border rounded-xl px-4 py-3 text-sm text-foreground bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all uppercase tracking-widest"
                                            />
                                            <button
                                                type="button"
                                                onClick={aplicarCupon}
                                                disabled={cargandoCupon || !codigoCupon.trim()}
                                                className="px-4 py-3 rounded-xl bg-foreground text-background text-sm font-bold hover:bg-foreground/80 transition-colors disabled:opacity-40 whitespace-nowrap"
                                            >
                                                {cargandoCupon ? "..." : "Aplicar"}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={cargando}
                                    className="mt-3 sm:mt-4 bg-primary text-white font-bold py-4 rounded-full hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-50 text-base sm:text-lg min-h-[56px] flex items-center justify-center gap-2"
                                >
                                    {cargando ? "Procesando..." : (
                                        <><ShieldCheck size={20} /> Pagar con Mercado Pago</>
                                    )}
                                </button>

                                <p className="text-xs text-center text-foreground/50">
                                    Pago 100% seguro · Te redirigimos a Mercado Pago para completar
                                </p>
                            </form>
                        </div>
                    </div>

                    {/* Resumen */}
                    <div className="lg:col-span-1">
                        <div className="bg-card-bg rounded-2xl sm:rounded-3xl border border-card-border p-5 sm:p-7 lg:sticky lg:top-24">
                            <h2 className="font-display font-black text-lg sm:text-xl text-foreground mb-4 sm:mb-5">Tu pedido</h2>
                            <div className="flex flex-col gap-3 mb-5 max-h-72 lg:max-h-96 overflow-y-auto pr-1">
                                {items.map(item => (
                                    <div key={item.id} className="flex items-center gap-3">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-background border border-card-border rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                                            {item.imagenes && item.imagenes.length > 0 ? (
                                                <img src={item.imagenes[0]} alt="" className="w-10 h-10 object-contain" />
                                            ) : (
                                                <Smartphone className="text-card-border" size={20} />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-foreground line-clamp-1">{item.nombre}</p>
                                            <p className="text-xs text-foreground/40">×{item.cantidad}</p>
                                        </div>
                                        <p className="text-sm font-bold text-foreground tabular-nums">
                                            ${(item.precio * item.cantidad).toLocaleString("es-AR")}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-dashed border-card-border pt-4 flex flex-col gap-2">
                                {cuponAplicado && (
                                    <>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-foreground/50">Subtotal</span>
                                            <span className="text-foreground tabular-nums">${total.toLocaleString("es-AR")}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-primary font-semibold">Descuento ({cuponAplicado.codigo})</span>
                                            <span className="text-primary font-bold tabular-nums">-${Number(cuponAplicado.descuento).toLocaleString("es-AR")}</span>
                                        </div>
                                        <div className="border-t border-card-border pt-2 mt-1" />
                                    </>
                                )}
                                <div className="flex justify-between items-end">
                                    <span className="text-foreground/50 font-medium text-sm">Total</span>
                                    <span className="font-display text-2xl sm:text-3xl font-black text-foreground tracking-tight tabular-nums">
                                        ${totalFinal.toLocaleString("es-AR")}
                                    </span>
                                </div>
                                <p className="text-xs text-foreground/40 text-right">Envío gratis a todo el país</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
