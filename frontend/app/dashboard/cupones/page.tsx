"use client";

import { useEffect, useState } from "react";
import { cuponesApi } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { Tag, Plus, Trash2, CheckCircle, XCircle } from "lucide-react";

interface Cupon {
    id: number;
    codigo: string;
    tipo: "PORCENTAJE" | "MONTO_FIJO";
    valor: number;
    activo: boolean;
    usosMaximos: number | null;
    usosActuales: number;
    fechaVencimiento: string | null;
    fechaCreacion: string;
}

const EMPTY_FORM = {
    codigo: "",
    tipo: "PORCENTAJE" as "PORCENTAJE" | "MONTO_FIJO",
    valor: "",
    usosMaximos: "",
    fechaVencimiento: "",
};

export default function CuponesPage() {
    const [cupones, setCupones] = useState<Cupon[]>([]);
    const [cargando, setCargando] = useState(true);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [guardando, setGuardando] = useState(false);
    const { showToast } = useToast();

    const cargar = async () => {
        try {
            const res = await cuponesApi.listar();
            setCupones(res.data);
        } catch {
            showToast("Error al cargar cupones", "error");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => { cargar(); }, []);

    const handleCrear = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.codigo.trim() || !form.valor) return;
        setGuardando(true);
        try {
            await cuponesApi.crear({
                codigo: form.codigo.toUpperCase().trim(),
                tipo: form.tipo,
                valor: parseFloat(form.valor),
                usosMaximos: form.usosMaximos ? parseInt(form.usosMaximos) : null,
                fechaVencimiento: form.fechaVencimiento || null,
            });
            showToast("Cupón creado correctamente", "success");
            setForm(EMPTY_FORM);
            setMostrarForm(false);
            cargar();
        } catch {
            showToast("Error al crear el cupón. Verificá que el código no exista.", "error");
        } finally {
            setGuardando(false);
        }
    };

    const desactivar = async (id: number, codigo: string) => {
        if (!confirm(`¿Desactivar el cupón "${codigo}"?`)) return;
        try {
            await cuponesApi.desactivar(id);
            showToast("Cupón desactivado", "success");
            cargar();
        } catch {
            showToast("Error al desactivar", "error");
        }
    };

    return (
        <div className="min-h-screen bg-background px-4 sm:px-6 py-6 sm:py-10">
            <div className="max-w-4xl mx-auto">

                <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <div>
                        <p className="text-xs font-black text-primary/60 uppercase tracking-widest mb-1">Dashboard</p>
                        <h1 className="font-display text-2xl sm:text-3xl font-black text-foreground flex items-center gap-2">
                            <Tag size={24} className="text-primary" /> Cupones de descuento
                        </h1>
                    </div>
                    <button
                        onClick={() => setMostrarForm(!mostrarForm)}
                        className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-hover transition-colors"
                    >
                        <Plus size={16} /> Nuevo cupón
                    </button>
                </div>

                {/* Formulario de creación */}
                {mostrarForm && (
                    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md mb-6">
                        <h2 className="font-bold text-gray-900 text-lg mb-4">Crear cupón</h2>
                        <form onSubmit={handleCrear} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Código</label>
                                <input
                                    type="text"
                                    value={form.codigo}
                                    onChange={e => setForm({ ...form, codigo: e.target.value.toUpperCase() })}
                                    placeholder="DESCUENTO10"
                                    required
                                    className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-primary uppercase tracking-widest"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Tipo</label>
                                <select
                                    value={form.tipo}
                                    onChange={e => setForm({ ...form, tipo: e.target.value as "PORCENTAJE" | "MONTO_FIJO" })}
                                    className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-primary"
                                >
                                    <option value="PORCENTAJE">Porcentaje (%)</option>
                                    <option value="MONTO_FIJO">Monto fijo ($)</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">
                                    Valor {form.tipo === "PORCENTAJE" ? "(%)" : "($)"}
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max={form.tipo === "PORCENTAJE" ? "100" : undefined}
                                    value={form.valor}
                                    onChange={e => setForm({ ...form, valor: e.target.value })}
                                    placeholder={form.tipo === "PORCENTAJE" ? "10" : "5000"}
                                    required
                                    className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Usos máximos (opcional)</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={form.usosMaximos}
                                    onChange={e => setForm({ ...form, usosMaximos: e.target.value })}
                                    placeholder="Sin límite"
                                    className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5 sm:col-span-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Vencimiento (opcional)</label>
                                <input
                                    type="datetime-local"
                                    value={form.fechaVencimiento}
                                    onChange={e => setForm({ ...form, fechaVencimiento: e.target.value })}
                                    className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div className="sm:col-span-2 flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => { setMostrarForm(false); setForm(EMPTY_FORM); }}
                                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={guardando}
                                    className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-hover transition-colors disabled:opacity-50"
                                >
                                    {guardando ? "Creando..." : "Crear cupón"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Lista de cupones */}
                {cargando ? (
                    <div className="text-center py-16 text-foreground/40">Cargando cupones…</div>
                ) : cupones.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                        <Tag className="mx-auto text-gray-300 mb-3" size={40} />
                        <p className="text-gray-500 font-medium">No hay cupones todavía</p>
                        <p className="text-gray-400 text-sm mt-1">Creá el primero con el botón de arriba</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {cupones.map(c => (
                            <div key={c.id} className={`bg-white rounded-2xl shadow-md p-4 sm:p-5 flex items-center gap-4 ${!c.activo ? "opacity-50" : ""}`}>
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Tag size={20} className="text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-black text-gray-900 tracking-widest text-sm">{c.codigo}</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                            {c.activo ? "Activo" : "Inactivo"}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-0.5">
                                        {c.tipo === "PORCENTAJE" ? `${c.valor}% de descuento` : `$${Number(c.valor).toLocaleString("es-AR")} de descuento`}
                                        {c.usosMaximos && ` · ${c.usosActuales}/${c.usosMaximos} usos`}
                                        {!c.usosMaximos && ` · ${c.usosActuales} usos`}
                                        {c.fechaVencimiento && ` · Vence ${new Date(c.fechaVencimiento).toLocaleDateString("es-AR")}`}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {c.activo ? (
                                        <CheckCircle size={18} className="text-green-500" />
                                    ) : (
                                        <XCircle size={18} className="text-gray-400" />
                                    )}
                                    {c.activo && (
                                        <button
                                            onClick={() => desactivar(c.id, c.codigo)}
                                            className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                                            title="Desactivar cupón"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
