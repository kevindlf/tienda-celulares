"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { productosApi } from "@/lib/api";
import { Producto } from "@/types";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import ImageUploader from "@/components/ui/ImageUploader";

export default function EditarProductoPage() {
    const [form, setForm] = useState<Partial<Producto>>({});
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const router = useRouter();
    const params = useParams();
    const id = Number(Array.isArray(params.id) ? params.id[0] : params.id);
    const { isAdmin } = useAuth();
    const { showToast } = useToast();

    useEffect(() => {
        if (!isAdmin) {
            router.push("/");
            return;
        }
        productosApi.getById(id)
            .then(res => setForm(res.data))
            .finally(() => setCargando(false));
    }, [id, router, isAdmin]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: name === "precio" || name === "stock" || name === "ram" || name === "almacenamiento" ? Number(value) : value });
    };

    const handleGuardar = async (e: React.FormEvent) => {
        e.preventDefault();
        setGuardando(true);
        try {
            await productosApi.actualizar(id, form);
            router.push("/dashboard");
            showToast("Producto actualizado correctamente", "success");
        } catch {
            showToast("Error al guardar los cambios", "error");
        } finally {
            setGuardando(false);
        }
    };

    if (cargando) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-400">Cargando...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard" className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Editar producto</h1>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <form onSubmit={handleGuardar} className="flex flex-col gap-5">

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">Nombre</label>
                                <input type="text" name="nombre" value={form.nombre || ""} onChange={handleChange} required
                                    className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">Marca</label>
                                <input type="text" name="marca" value={form.marca || ""} onChange={handleChange} required
                                    className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">Modelo</label>
                                <input type="text" name="modelo" value={form.modelo || ""} onChange={handleChange} required
                                    className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">Color</label>
                                <input type="text" name="color" value={form.color || ""} onChange={handleChange}
                                    className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Descripción</label>
                            <textarea name="descripcion" value={form.descripcion || ""} onChange={handleChange} rows={3}
                                className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">Precio</label>
                                <input type="number" name="precio" value={form.precio || ""} onChange={handleChange} required
                                    className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Stock <span className="text-xs text-gray-400">(ajuste manual para ventas físicas)</span>
                                </label>
                                <div className="flex items-center gap-3">
                                    <button type="button"
                                        onClick={() => setForm({ ...form, stock: Math.max(0, (form.stock || 0) - 1) })}
                                        className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 font-bold text-lg">
                                        -
                                    </button>
                                    <input type="number" name="stock" value={form.stock || 0} onChange={handleChange}
                                        className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 text-center focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    <button type="button"
                                        onClick={() => setForm({ ...form, stock: (form.stock || 0) + 1 })}
                                        className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 font-bold text-lg">
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">RAM (GB)</label>
                                <input type="number" name="ram" value={form.ram || ""} onChange={handleChange}
                                    className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">Almacenamiento (GB)</label>
                                <input type="number" name="almacenamiento" value={form.almacenamiento || ""} onChange={handleChange}
                                    className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        <ImageUploader
                            imagenes={form.imagenes || []}
                            onChange={(imgs) => setForm({ ...form, imagenes: imgs })}
                        />

                        <div className="flex gap-3 mt-2">
                            <Link href="/dashboard"
                                className="flex-1 text-center border border-gray-200 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors">
                                Cancelar
                            </Link>
                            <button type="submit" disabled={guardando}
                                className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50">
                                {guardando ? "Guardando..." : "Guardar cambios"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}