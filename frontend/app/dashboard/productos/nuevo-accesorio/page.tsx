"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { productosApi, catalogoApi } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import ImageUploader from "@/components/ui/ImageUploader";

export default function NuevoAccesorioPage() {
    const [form, setForm] = useState({
        nombre: "",
        categoria: "",
        marca: "",
        descripcion: "",
        precio: "",
        costoProducto: "",
        stock: "",
        imagenes: [] as string[],
    });

    const [categorias, setCategorias] = useState<string[]>([]);
    const [guardando, setGuardando] = useState(false);
    const router = useRouter();
    const { showToast } = useToast();

    useEffect(() => {
        catalogoApi.categoriasAccesorio().then(res => setCategorias(res.data));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleGuardar = async (e: React.FormEvent) => {
        e.preventDefault();
        setGuardando(true);
        try {
            await productosApi.crear({
                nombre: form.nombre,
                categoria: form.categoria,
                marca: form.marca || "Genérico",
                modelo: "N/A", // Requerido por el backend, pero no aplica a accesorios simples
                precio: Number(form.precio),
                costoProducto: form.costoProducto ? Number(form.costoProducto) : undefined,
                stock: Number(form.stock),
                descripcion: form.descripcion,
                imagenes: form.imagenes,
                tipoProducto: "ACCESORIO",
                condicion: "NUEVO", // Asumimos que los accesorios son nuevos
            });
            router.push("/dashboard");
            showToast("Accesorio creado correctamente", "success");
        } catch {
            showToast("Error al crear el accesorio", "error");
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard" className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Agregar nuevo accesorio</h1>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <form onSubmit={handleGuardar} className="flex flex-col gap-5">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">Categoría *</label>
                                <select name="categoria" value={form.categoria} onChange={handleChange} required
                                    className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 bg-white">
                                    <option value="">Seleccionar categoría</option>
                                    {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">Marca (Opcional)</label>
                                <input type="text" name="marca" value={form.marca} onChange={handleChange} placeholder="Ej: Spigen, Apple, Samsung..."
                                    className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Nombre del producto *</label>
                            <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Ej: Funda de Silicona para iPhone 15"
                                className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">Stock *</label>
                                <input type="number" name="stock" value={form.stock} onChange={handleChange} required min="0"
                                    className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">Costo (Opcional)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                    <input type="number" name="costoProducto" value={form.costoProducto} onChange={handleChange} min="0"
                                        className="w-full border border-gray-200 rounded-lg pl-7 pr-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">Precio *</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                    <input type="number" name="precio" value={form.precio} onChange={handleChange} required min="1"
                                        className="w-full border border-gray-200 rounded-lg pl-7 pr-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-blue-700" />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                            <label className="text-sm font-medium text-gray-700">Descripción (Opcional)</label>
                            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3} placeholder="Características del accesorio, compatibilidad, etc."
                                className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                        </div>

                        <ImageUploader
                            imagenes={form.imagenes}
                            onChange={(imgs) => setForm({ ...form, imagenes: imgs })}
                        />

                        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                            <Link href="/dashboard"
                                className="flex-1 text-center border border-gray-200 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors">
                                Cancelar
                            </Link>
                            <button type="submit" disabled={guardando}
                                className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50">
                                {guardando ? "Guardando..." : "Guardar accesorio"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
