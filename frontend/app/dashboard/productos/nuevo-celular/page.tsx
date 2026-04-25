"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { productosApi, catalogoApi } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import ImageUploader from "@/components/ui/ImageUploader";

export default function NuevoCelularPage() {
    const [form, setForm] = useState({
        marca: "",
        modelo: "",
        color: "",
        ram: "",
        almacenamiento: "",
        condicion: "NUEVO",
        nivelBateria: "",
        ciclosCarga: "",
        precio: "",
        costoProducto: "",
        stock: "",
        descripcion: "",
        imagenes: [] as string[],
    });

    const [marcas, setMarcas] = useState<string[]>([]);
    const [modelos, setModelos] = useState<string[]>([]);
    const [colores, setColores] = useState<string[]>([]);
    const [rams, setRams] = useState<number[]>([]);
    const [almacenamientos, setAlmacenamientos] = useState<number[]>([]);

    const [guardando, setGuardando] = useState(false);
    const router = useRouter();
    const { showToast } = useToast();

    // Cargar datos iniciales
    useEffect(() => {
        catalogoApi.marcas().then(res => setMarcas(res.data));
        catalogoApi.ramOpciones().then(res => setRams(res.data));
        catalogoApi.almacenamientoOpciones().then(res => setAlmacenamientos(res.data));
    }, []);

    // Cargar modelos cuando cambia la marca
    useEffect(() => {
        if (form.marca) {
            catalogoApi.modelos(form.marca).then(res => setModelos(res.data));
            setForm(f => ({ ...f, modelo: "", color: "" }));
            setColores([]);
        }
    }, [form.marca]);

    // Cargar colores cuando cambia el modelo
    useEffect(() => {
        if (form.marca && form.modelo) {
            catalogoApi.colores(form.marca, form.modelo).then(res => setColores(res.data));
            setForm(f => ({ ...f, color: "" }));
        }
    }, [form.modelo, form.marca]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleGuardar = async (e: React.FormEvent) => {
        e.preventDefault();
        setGuardando(true);

        // Nombre auto-generado
        const nombreGenerado = `${form.marca} ${form.modelo} ${form.almacenamiento}GB ${form.color}`.trim();

        try {
            await productosApi.crear({
                nombre: nombreGenerado,
                marca: form.marca,
                modelo: form.modelo,
                color: form.color,
                ram: Number(form.ram),
                almacenamiento: Number(form.almacenamiento),
                precio: Number(form.precio),
                costoProducto: form.costoProducto ? Number(form.costoProducto) : undefined,
                stock: Number(form.stock),
                descripcion: form.descripcion,
                imagenes: form.imagenes,
                tipoProducto: "CELULAR",
                condicion: form.condicion,
                nivelBateria: form.condicion === "USADO" && form.nivelBateria ? Number(form.nivelBateria) : undefined,
                ciclosCarga: form.condicion === "USADO" && form.ciclosCarga ? Number(form.ciclosCarga) : undefined,
            });
            router.push("/dashboard");
            showToast("Celular creado correctamente", "success");
        } catch {
            showToast("Error al crear el celular", "error");
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard" className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Agregar nuevo celular</h1>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <form onSubmit={handleGuardar} className="flex flex-col gap-6">

                        {/* Especificaciones principales */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Especificaciones</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700">Marca *</label>
                                    <select name="marca" value={form.marca} onChange={handleChange} required
                                        className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 bg-white">
                                        <option value="">Seleccionar marca</option>
                                        {marcas.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700">Modelo *</label>
                                    <select name="modelo" value={form.modelo} onChange={handleChange} required disabled={!form.marca}
                                        className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-50">
                                        <option value="">Seleccionar modelo</option>
                                        {modelos.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700">Color *</label>
                                    <select name="color" value={form.color} onChange={handleChange} required disabled={!form.modelo}
                                        className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-50">
                                        <option value="">Seleccionar color</option>
                                        {colores.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700">RAM (GB) *</label>
                                    <select name="ram" value={form.ram} onChange={handleChange} required
                                        className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 bg-white">
                                        <option value="">Seleccionar RAM</option>
                                        {rams.map(r => <option key={r} value={r}>{r} GB</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700">Almacenamiento (GB) *</label>
                                    <select name="almacenamiento" value={form.almacenamiento} onChange={handleChange} required
                                        className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 bg-white">
                                        <option value="">Seleccionar Almacenamiento</option>
                                        {almacenamientos.map(a => <option key={a} value={a}>{a} GB</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Estado y stock */}
                        <div className="pt-6 border-t border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado y Stock</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700">Condición *</label>
                                    <select name="condicion" value={form.condicion} onChange={handleChange} required
                                        className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 bg-white">
                                        <option value="NUEVO">Nuevo en caja sellada</option>
                                        <option value="USADO">Usado / Reacondicionado</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700">Stock inicial *</label>
                                    <input type="number" name="stock" value={form.stock} onChange={handleChange} required min="0"
                                        className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>

                            {form.condicion === "USADO" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-orange-50 p-4 rounded-xl mb-4 border border-orange-100">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-orange-800">Salud de batería (%)</label>
                                        <input type="number" name="nivelBateria" value={form.nivelBateria} onChange={handleChange} min="0" max="100"
                                            placeholder="Ej: 85"
                                            className="border border-orange-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 bg-white" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-orange-800">Ciclos de carga</label>
                                        <input type="number" name="ciclosCarga" value={form.ciclosCarga} onChange={handleChange} min="0"
                                            placeholder="Ej: 340"
                                            className="border border-orange-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 bg-white" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Precios */}
                        <div className="pt-6 border-t border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Precios</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700">Costo (Tu precio de compra)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                        <input type="number" name="costoProducto" value={form.costoProducto} onChange={handleChange} min="0"
                                            className="w-full border border-gray-200 rounded-lg pl-8 pr-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <p className="text-xs text-gray-400">Opcional. Se usa para calcular tu ganancia real.</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700">Precio de venta al público *</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                        <input type="number" name="precio" value={form.precio} onChange={handleChange} required min="1"
                                            className="w-full border border-gray-200 rounded-lg pl-8 pr-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 font-bold text-blue-700" />
                                    </div>
                                    {form.costoProducto && form.precio && Number(form.precio) > Number(form.costoProducto) && (
                                        <p className="text-xs text-green-600 font-medium">Ganancia estimada: ${(Number(form.precio) - Number(form.costoProducto)).toLocaleString("es-AR")}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Detalles */}
                        <div className="pt-6 border-t border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalles e imágenes</h3>
                            <div className="flex flex-col gap-2 mb-4">
                                <label className="text-sm font-medium text-gray-700">Descripción (Opcional)</label>
                                <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3}
                                    placeholder="Detalles extra, detalles estéticos si es usado, etc."
                                    className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 resize-none" />
                            </div>

                            <ImageUploader
                                imagenes={form.imagenes}
                                onChange={(imgs) => setForm({ ...form, imagenes: imgs })}
                            />
                        </div>

                        <div className="flex gap-3 mt-4 pt-6 border-t border-gray-100">
                            <Link href="/dashboard"
                                className="flex-1 text-center border border-gray-200 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors">
                                Cancelar
                            </Link>
                            <button type="submit" disabled={guardando}
                                className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50">
                                {guardando ? "Guardando..." : "Guardar celular"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
